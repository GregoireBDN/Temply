import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { JwtGuard } from './jwt.guard'

/** Builds a minimal ExecutionContext exposing the given cookies on the request. */
function createContext(cookies?: Record<string, string>) {
  const request: { cookies?: Record<string, string>; user?: unknown } = { cookies }
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext
  return { context, request }
}

describe('JwtGuard', () => {
  const verify = vi.fn()
  const jwt = { verify } as unknown as JwtService
  let guard: JwtGuard

  beforeEach(() => {
    vi.clearAllMocks()
    guard = new JwtGuard(jwt)
  })

  it('rejects requests without a token cookie', () => {
    const { context } = createContext(undefined)

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
    expect(verify).not.toHaveBeenCalled()
  })

  it('rejects an empty token cookie', () => {
    const { context } = createContext({ token: '' })

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
    expect(verify).not.toHaveBeenCalled()
  })

  it('rejects when the token fails verification', () => {
    verify.mockImplementation(() => {
      throw new Error('invalid signature')
    })
    const { context } = createContext({ token: 'tampered' })

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
    expect(verify).toHaveBeenCalledWith('tampered')
  })

  it('accepts a valid token and attaches the payload to the request', () => {
    verify.mockReturnValue({ sub: 'user-123' })
    const { context, request } = createContext({ token: 'good-token' })

    expect(guard.canActivate(context)).toBe(true)
    expect(request.user).toEqual({ sub: 'user-123' })
  })
})
