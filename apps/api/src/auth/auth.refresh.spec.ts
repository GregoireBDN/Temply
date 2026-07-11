import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from './auth.service'

/**
 * Covers the rotating-refresh-token session logic: a session issues an opaque
 * refresh token stored only as a SHA-256 hash; rotating it revokes the old
 * token and issues a new one in the same family; presenting an expired,
 * unknown, or already-revoked token is rejected — and reuse of a revoked token
 * burns the whole family (theft detection). Logout revokes the family.
 */

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex')

/**
 * Drizzle query-builder stub. `insert().values()` and `update().set().where()`
 * capture their arguments so a test can assert what was persisted; awaiting any
 * chain resolves to the provided result.
 */
function buildChain(
  result: unknown[],
  captured?: { values?: unknown; set?: unknown; where?: unknown },
) {
  const chain: Record<string, unknown> = {}
  chain.from = vi.fn(() => chain)
  chain.where = vi.fn((arg: unknown) => {
    if (captured) captured.where = arg
    return chain
  })
  chain.returning = vi.fn(() => Promise.resolve(result))
  chain.set = vi.fn((arg: unknown) => {
    if (captured) captured.set = arg
    return chain
  })
  chain.values = vi.fn((row: unknown) => {
    if (captured) captured.values = row
    return chain
  })
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve)
  return chain
}

const mockDb = { select: vi.fn(), insert: vi.fn(), update: vi.fn() }
const mockEmail = { sendEmailVerification: vi.fn(), sendPasswordReset: vi.fn() }
const mockJwt = { sign: vi.fn(() => 'access-token') }

function createService() {
  return new AuthService(
    { db: mockDb } as never,
    mockJwt as unknown as JwtService,
    mockEmail as never,
  )
}

describe('AuthService sessions', () => {
  let service: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    service = createService()
  })

  describe('createSession', () => {
    it('stores only a hash of a random refresh token and returns the raw pair', async () => {
      const inserted: { values?: unknown } = {}
      mockDb.insert.mockReturnValue(buildChain([{}], inserted))

      const tokens = await service.createSession('user-1')

      expect(tokens.accessToken).toBe('access-token')
      expect(tokens.refreshToken).toMatch(/^[a-f0-9]{64}$/) // 32 random bytes, hex
      const row = inserted.values as { userId: string; tokenHash: string; familyId: string }
      expect(row.userId).toBe('user-1')
      expect(row.tokenHash).toBe(sha256(tokens.refreshToken))
      // The plaintext token is never persisted.
      expect(row.tokenHash).not.toBe(tokens.refreshToken)
      expect(row.familyId).toMatch(/^[0-9a-f-]{36}$/) // uuid
    })
  })

  describe('rotateRefreshToken', () => {
    it('revokes the presented token and issues a new one in the same family', async () => {
      const revoke: { set?: unknown } = {}
      const inserted: { values?: unknown } = {}
      mockDb.select.mockReturnValue(
        buildChain([
          {
            id: 'rt-1',
            userId: 'user-1',
            familyId: 'fam-1',
            expiresAt: new Date(Date.now() + 60_000),
            revokedAt: null,
          },
        ]),
      )
      mockDb.update.mockReturnValue(buildChain([{}], revoke)) // revoke old token
      mockDb.insert.mockReturnValue(buildChain([{}], inserted)) // new token

      const tokens = await service.rotateRefreshToken('old-raw-token')

      // Old token was revoked...
      expect((revoke.set as { revokedAt: Date }).revokedAt).toBeInstanceOf(Date)
      // ...and a fresh token issued in the same family.
      const row = inserted.values as { familyId: string; userId: string }
      expect(row.familyId).toBe('fam-1')
      expect(row.userId).toBe('user-1')
      expect(tokens.refreshToken).toMatch(/^[a-f0-9]{64}$/)
    })

    it('rejects an unknown token', async () => {
      mockDb.select.mockReturnValue(buildChain([]))

      await expect(service.rotateRefreshToken('nope')).rejects.toThrow(UnauthorizedException)
      expect(mockDb.update).not.toHaveBeenCalled()
      expect(mockDb.insert).not.toHaveBeenCalled()
    })

    it('rejects an expired token without rotating', async () => {
      mockDb.select.mockReturnValue(
        buildChain([
          {
            id: 'rt-1',
            userId: 'user-1',
            familyId: 'fam-1',
            expiresAt: new Date(Date.now() - 1000),
            revokedAt: null,
          },
        ]),
      )

      await expect(service.rotateRefreshToken('expired')).rejects.toThrow(UnauthorizedException)
      expect(mockDb.update).not.toHaveBeenCalled()
      expect(mockDb.insert).not.toHaveBeenCalled()
    })

    it('detects reuse: an already-revoked token burns the whole family', async () => {
      const revoke: { where?: unknown } = {}
      mockDb.select.mockReturnValue(
        buildChain([
          {
            id: 'rt-1',
            userId: 'user-1',
            familyId: 'fam-1',
            expiresAt: new Date(Date.now() + 60_000),
            revokedAt: new Date(Date.now() - 5000),
          },
        ]),
      )
      mockDb.update.mockReturnValue(buildChain([{}], revoke))

      await expect(service.rotateRefreshToken('reused')).rejects.toThrow(UnauthorizedException)
      // The family was revoked (defence against a stolen token)...
      expect(mockDb.update).toHaveBeenCalledTimes(1)
      // ...and no new session was issued.
      expect(mockDb.insert).not.toHaveBeenCalled()
    })
  })

  describe('revokeSession', () => {
    it('revokes the family behind the presented token', async () => {
      mockDb.select.mockReturnValue(buildChain([{ familyId: 'fam-1' }]))
      mockDb.update.mockReturnValue(buildChain([{}]))

      await service.revokeSession('some-refresh-token')

      expect(mockDb.update).toHaveBeenCalledTimes(1)
    })

    it('is a no-op when no token is presented', async () => {
      await service.revokeSession(undefined)

      expect(mockDb.select).not.toHaveBeenCalled()
      expect(mockDb.update).not.toHaveBeenCalled()
    })

    it('is a no-op when the token is unknown', async () => {
      mockDb.select.mockReturnValue(buildChain([]))

      await service.revokeSession('ghost')

      expect(mockDb.update).not.toHaveBeenCalled()
    })
  })
})
