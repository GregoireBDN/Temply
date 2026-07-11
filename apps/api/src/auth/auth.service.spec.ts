import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from './auth.service'

const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
}

const mockEmail = {
  sendPasswordReset: vi.fn(),
  sendEmailVerification: vi.fn(),
}

const mockJwt = {
  sign: vi.fn(() => 'mock-token'),
  verify: vi.fn(() => ({ sub: 'user-id' })),
}

function buildChain(result: unknown[]) {
  const chain: Record<string, unknown> = {}
  chain.from = vi.fn(() => chain)
  chain.where = vi.fn(() => chain)
  chain.returning = vi.fn(() => Promise.resolve(result))
  chain.values = vi.fn(() => chain)
  chain.set = vi.fn(() => chain)
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve)
  return chain
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new AuthService(
      { db: mockDb } as never,
      mockJwt as unknown as JwtService,
      mockEmail as never,
      { capture: vi.fn(), captureException: vi.fn() } as never,
    )
  })

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      mockDb.select.mockReturnValue(buildChain([{ id: 'existing-id' }]))

      await expect(
        service.register({ email: 'test@test.com', name: 'Test', password: 'password123' }),
      ).rejects.toThrow(ConflictException)
    })

    it('returns an access + refresh token pair on success', async () => {
      mockDb.select.mockReturnValue(buildChain([]))
      mockDb.insert.mockReturnValue(buildChain([{ id: 'new-id' }]))

      const tokens = await service.register({
        email: 'new@test.com',
        name: 'New User',
        password: 'password123',
      })

      expect(tokens.accessToken).toBe('mock-token')
      expect(tokens.refreshToken).toMatch(/^[a-f0-9]{64}$/) // 32 random bytes, hex
      expect(mockJwt.sign).toHaveBeenCalledWith({ sub: 'new-id' }, expect.any(Object))
    })
  })

  describe('login', () => {
    it('throws UnauthorizedException when user not found', async () => {
      mockDb.select.mockReturnValue(buildChain([]))

      await expect(
        service.login({ email: 'nobody@test.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException for OAuth-only accounts', async () => {
      mockDb.select.mockReturnValue(buildChain([{ id: 'id', passwordHash: null }]))

      await expect(
        service.login({ email: 'google@test.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('forgotPassword', () => {
    it('does nothing silently when user not found', async () => {
      mockDb.select.mockReturnValue(buildChain([]))

      await expect(
        service.forgotPassword({ email: 'nobody@test.com' }),
      ).resolves.toBeUndefined()

      expect(mockEmail.sendPasswordReset).not.toHaveBeenCalled()
    })

    it('does nothing silently for OAuth-only accounts', async () => {
      mockDb.select.mockReturnValue(buildChain([{ id: 'id', email: 'oauth@test.com', passwordHash: null }]))

      await service.forgotPassword({ email: 'oauth@test.com' })

      expect(mockEmail.sendPasswordReset).not.toHaveBeenCalled()
    })

    it('sends a reset email for password accounts', async () => {
      mockDb.select.mockReturnValue(
        buildChain([{ id: 'user-id', email: 'user@test.com', passwordHash: 'hash' }]),
      )
      mockDb.insert.mockReturnValue(buildChain([{}]))

      await service.forgotPassword({ email: 'user@test.com' })

      expect(mockEmail.sendPasswordReset).toHaveBeenCalledWith(
        'user@test.com',
        expect.stringContaining('/reset-password?token='),
      )
    })
  })
})
