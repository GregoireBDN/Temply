import { JwtService } from '@nestjs/jwt'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from './auth.service'

/**
 * The OAuth flow delegates state/PKCE generation and code exchange to the
 * `arctic` library (loaded in `onModuleInit`). These tests inject a fake arctic
 * module so we can assert the flow's own logic — state/verifier wiring, URL
 * construction, claim decoding and find-or-create — without real OAuth calls.
 */

const createAuthorizationURL = vi.fn(
  (state: string, _verifierOrScopes: string | string[], _scopes?: string[]) =>
    new URL(`https://provider.test/authorize?state=${state}`),
)
const validateAuthorizationCode = vi.fn(async () => ({ idToken: () => 'id-token' }))

const provider = { createAuthorizationURL, validateAuthorizationCode }

const decodeIdToken = vi.fn()
// Regular (non-arrow) functions so they are usable with `new`; returning an
// object from a constructor makes `new` yield that object.
const fakeArctic = {
  Google: vi.fn(function () {
    return provider
  }),
  Apple: vi.fn(function () {
    return provider
  }),
  generateState: vi.fn(() => 'state-abc'),
  generateCodeVerifier: vi.fn(() => 'verifier-xyz'),
  decodeIdToken,
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

const mockDb = { select: vi.fn(), insert: vi.fn(), update: vi.fn() }
const mockJwt = { sign: vi.fn(() => 'mock-token') }

describe('AuthService OAuth', () => {
  let service: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new AuthService(
      { db: mockDb } as never,
      mockJwt as unknown as JwtService,
      {} as never,
      { capture: vi.fn(), captureException: vi.fn() } as never,
    )
    // Inject the fake arctic module that onModuleInit would normally import.
    ;(service as unknown as { arctic: typeof fakeArctic }).arctic = fakeArctic
  })

  describe('createGoogleAuthUrl', () => {
    it('generates state + PKCE verifier and requests the openid scopes', () => {
      const { url, state, codeVerifier } = service.createGoogleAuthUrl()

      expect(state).toBe('state-abc')
      expect(codeVerifier).toBe('verifier-xyz')
      expect(url).toBe('https://provider.test/authorize?state=state-abc')
      expect(createAuthorizationURL).toHaveBeenCalledWith('state-abc', 'verifier-xyz', [
        'openid',
        'email',
        'profile',
      ])
    })
  })

  describe('createAppleAuthUrl', () => {
    it('generates state without a PKCE verifier (Apple uses no PKCE here)', () => {
      const result = service.createAppleAuthUrl()

      expect(result.state).toBe('state-abc')
      expect(result).not.toHaveProperty('codeVerifier')
      expect(fakeArctic.generateCodeVerifier).not.toHaveBeenCalled()
      expect(createAuthorizationURL).toHaveBeenCalledWith('state-abc', ['email', 'name'])
    })
  })

  describe('handleGoogleCallback', () => {
    it('exchanges the code with the PKCE verifier and issues a token for an existing account', async () => {
      decodeIdToken.mockReturnValue({ sub: 'g-1', email: 'g@test.com', name: 'Gina' })
      mockDb.select.mockReturnValue(buildChain([{ userId: 'user-1' }]))
      mockDb.insert.mockReturnValue(buildChain([{}])) // session refresh token

      const tokens = await service.handleGoogleCallback('auth-code', 'verifier-xyz')

      expect(validateAuthorizationCode).toHaveBeenCalledWith('auth-code', 'verifier-xyz')
      // No user/oauth-account row is created — only the session refresh token.
      expect(mockDb.insert).toHaveBeenCalledTimes(1)
      expect(mockJwt.sign).toHaveBeenCalledWith({ sub: 'user-1' }, expect.any(Object))
      expect(tokens.accessToken).toBe('mock-token')
    })

    it('creates a user + oauth account on first login', async () => {
      decodeIdToken.mockReturnValue({ sub: 'g-2', email: 'new@test.com', name: 'Newbie' })
      mockDb.select.mockReturnValue(buildChain([])) // no existing oauth account
      mockDb.insert
        .mockReturnValueOnce(buildChain([{ id: 'user-2' }])) // insert user
        .mockReturnValueOnce(buildChain([{}])) // insert oauth account
        .mockReturnValueOnce(buildChain([{}])) // insert session refresh token

      const tokens = await service.handleGoogleCallback('auth-code', 'verifier-xyz')

      expect(mockDb.insert).toHaveBeenCalledTimes(3)
      expect(mockJwt.sign).toHaveBeenCalledWith({ sub: 'user-2' }, expect.any(Object))
      expect(tokens.accessToken).toBe('mock-token')
    })
  })

  describe('handleAppleCallback', () => {
    it('exchanges the code without a verifier and derives a name from the form fields', async () => {
      decodeIdToken.mockReturnValue({ sub: 'a-1', email: 'a@test.com' })
      mockDb.select.mockReturnValue(buildChain([])) // first login
      mockDb.insert
        .mockReturnValueOnce(buildChain([{ id: 'user-a' }]))
        .mockReturnValueOnce(buildChain([{}]))
        .mockReturnValueOnce(buildChain([{}])) // session refresh token

      await service.handleAppleCallback('apple-code', 'Ada', 'Lovelace')

      expect(validateAuthorizationCode).toHaveBeenCalledWith('apple-code')
      const userInsert = mockDb.insert.mock.results[0].value as { values: ReturnType<typeof vi.fn> }
      expect(userInsert.values).toHaveBeenCalledWith({ email: 'a@test.com', name: 'Ada Lovelace' })
    })

    it('falls back to "Apple User" and empty email when claims/fields are absent', async () => {
      decodeIdToken.mockReturnValue({ sub: 'a-2' })
      mockDb.select.mockReturnValue(buildChain([]))
      mockDb.insert
        .mockReturnValueOnce(buildChain([{ id: 'user-a2' }]))
        .mockReturnValueOnce(buildChain([{}]))
        .mockReturnValueOnce(buildChain([{}])) // session refresh token

      await service.handleAppleCallback('apple-code')

      const userInsert = mockDb.insert.mock.results[0].value as { values: ReturnType<typeof vi.fn> }
      expect(userInsert.values).toHaveBeenCalledWith({ email: '', name: 'Apple User' })
    })
  })
})
