import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from './auth.service'

/**
 * Covers the email-verification and password-reset token logic. The ticket
 * refers to this as `email/tokens.ts`, but the token generation/validation
 * actually lives inline in `AuthService` (that file only holds email colours),
 * so the real behaviour is exercised here: tokens are random, stored only as a
 * SHA-256 hash, single-use, and rejected once expired.
 */

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex')

/**
 * Drizzle query-builder stub. `insert().values()` captures the inserted row so a
 * test can read back the stored token hash; awaiting any chain resolves to the
 * provided result.
 */
function buildChain(result: unknown[], captured?: { values?: unknown }) {
  const chain: Record<string, unknown> = {}
  chain.from = vi.fn(() => chain)
  chain.where = vi.fn(() => chain)
  chain.returning = vi.fn(() => Promise.resolve(result))
  chain.set = vi.fn(() => chain)
  chain.values = vi.fn((row: unknown) => {
    if (captured) captured.values = row
    return chain
  })
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve)
  return chain
}

const mockDb = { select: vi.fn(), insert: vi.fn(), update: vi.fn() }
const mockEmail = { sendEmailVerification: vi.fn(), sendPasswordReset: vi.fn() }
const mockJwt = { sign: vi.fn(() => 'mock-token') }

function createService() {
  return new AuthService(
    { db: mockDb } as never,
    mockJwt as unknown as JwtService,
    mockEmail as never,
  )
}

describe('AuthService email verification tokens', () => {
  let service: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    service = createService()
  })

  it('stores only a hash of the token and emails the raw token in the link', async () => {
    const inserted: { values?: unknown } = {}
    mockDb.select.mockReturnValue(buildChain([])) // register: no existing user
    mockDb.insert
      .mockReturnValueOnce(buildChain([{ id: 'user-1', email: 'new@test.com' }])) // user
      .mockReturnValueOnce(buildChain([{}], inserted)) // verification token

    await service.register({ email: 'new@test.com', name: 'New', password: 'password123' })

    const url = mockEmail.sendEmailVerification.mock.calls[0][1] as string
    const rawToken = new URL(url).searchParams.get('token')
    expect(rawToken).toMatch(/^[a-f0-9]{64}$/) // 32 random bytes, hex
    expect((inserted.values as { tokenHash: string }).tokenHash).toBe(sha256(rawToken!))
    // The plaintext token is never persisted.
    expect((inserted.values as { tokenHash: string }).tokenHash).not.toBe(rawToken)
  })

  it('verifies a valid token: marks the user verified and the token used', async () => {
    const record = {
      id: 'tok-1',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 60_000),
    }
    mockDb.select.mockReturnValue(buildChain([record]))
    mockDb.update.mockReturnValue(buildChain([{}]))

    await expect(service.verifyEmail('raw-token')).resolves.toBeUndefined()
    // One update for the user (emailVerifiedAt), one to mark the token used.
    expect(mockDb.update).toHaveBeenCalledTimes(2)
  })

  it('rejects an unknown token', async () => {
    mockDb.select.mockReturnValue(buildChain([]))

    await expect(service.verifyEmail('does-not-exist')).rejects.toThrow(BadRequestException)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('rejects an expired token', async () => {
    mockDb.select.mockReturnValue(
      buildChain([{ id: 'tok-1', userId: 'user-1', expiresAt: new Date(Date.now() - 1000) }]),
    )

    await expect(service.verifyEmail('expired')).rejects.toThrow(BadRequestException)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  describe('resendVerification', () => {
    it('throws when the user does not exist', async () => {
      mockDb.select.mockReturnValue(buildChain([]))

      await expect(service.resendVerification('ghost')).rejects.toThrow(UnauthorizedException)
      expect(mockEmail.sendEmailVerification).not.toHaveBeenCalled()
    })

    it('throws when the email is already verified', async () => {
      mockDb.select.mockReturnValue(
        buildChain([{ id: 'user-1', email: 'a@test.com', emailVerifiedAt: new Date() }]),
      )

      await expect(service.resendVerification('user-1')).rejects.toThrow(BadRequestException)
      expect(mockEmail.sendEmailVerification).not.toHaveBeenCalled()
    })

    it('sends a fresh verification email to an unverified user', async () => {
      mockDb.select.mockReturnValue(
        buildChain([{ id: 'user-1', email: 'a@test.com', emailVerifiedAt: null }]),
      )
      mockDb.insert.mockReturnValue(buildChain([{}]))

      await service.resendVerification('user-1')

      expect(mockEmail.sendEmailVerification).toHaveBeenCalledWith(
        'a@test.com',
        expect.stringContaining('/verify-email?token='),
      )
    })
  })
})

describe('AuthService password reset tokens', () => {
  let service: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    service = createService()
  })

  it('stores only a hash of the reset token and emails the raw token', async () => {
    const inserted: { values?: unknown } = {}
    mockDb.select.mockReturnValue(
      buildChain([{ id: 'user-1', email: 'user@test.com', passwordHash: 'hash' }]),
    )
    mockDb.insert.mockReturnValue(buildChain([{}], inserted))

    await service.forgotPassword({ email: 'user@test.com' })

    const url = mockEmail.sendPasswordReset.mock.calls[0][1] as string
    const rawToken = new URL(url).searchParams.get('token')
    expect(rawToken).toMatch(/^[a-f0-9]{64}$/)
    expect((inserted.values as { tokenHash: string }).tokenHash).toBe(sha256(rawToken!))
  })

  it('resets the password for a valid token and consumes it', async () => {
    mockDb.select.mockReturnValue(
      buildChain([{ id: 'tok-1', userId: 'user-1', expiresAt: new Date(Date.now() + 60_000) }]),
    )
    mockDb.update.mockReturnValue(buildChain([{}]))

    await expect(service.resetPassword('raw-token', 'newpassword123')).resolves.toBeUndefined()
    // One update to set the new passwordHash, one to mark the token used.
    expect(mockDb.update).toHaveBeenCalledTimes(2)
  })

  it('rejects an expired reset token', async () => {
    mockDb.select.mockReturnValue(
      buildChain([{ id: 'tok-1', userId: 'user-1', expiresAt: new Date(Date.now() - 1000) }]),
    )

    await expect(service.resetPassword('expired', 'newpassword123')).rejects.toThrow(
      BadRequestException,
    )
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('rejects an unknown reset token', async () => {
    mockDb.select.mockReturnValue(buildChain([]))

    await expect(service.resetPassword('nope', 'newpassword123')).rejects.toThrow(
      BadRequestException,
    )
  })
})
