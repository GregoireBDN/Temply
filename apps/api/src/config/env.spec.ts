import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `env` is parsed at module load, so each case resets the module registry and
 * re-imports with a freshly mutated `process.env`.
 */
async function importEnv(overrides: Record<string, string | undefined>) {
  vi.resetModules()
  const original = { ...process.env }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
  try {
    return await import('./env.js')
  } finally {
    process.env = original
  }
}

describe('env', () => {
  let savedEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    savedEnv = { ...process.env }
  })

  afterEach(() => {
    process.env = savedEnv
    vi.resetModules()
  })

  it('throws when JWT_SECRET is missing in production', async () => {
    await expect(
      importEnv({ NODE_ENV: 'production', JWT_SECRET: undefined }),
    ).rejects.toThrow(/JWT_SECRET is required when NODE_ENV=production/)
  })

  it('uses the provided JWT_SECRET in production', async () => {
    const { env } = await importEnv({
      NODE_ENV: 'production',
      JWT_SECRET: 'a-real-production-secret',
    })
    expect(env.JWT_SECRET).toBe('a-real-production-secret')
  })

  it('falls back to an ephemeral secret outside production', async () => {
    const { env } = await importEnv({
      NODE_ENV: 'development',
      JWT_SECRET: undefined,
    })
    expect(env.JWT_SECRET).toMatch(/^[0-9a-f]{64}$/)
    expect(env.JWT_SECRET).not.toBe('dev-secret-change-in-production')
  })
})
