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

  /** Minimal set of variables required for a production boot to succeed. */
  const PROD_BASE = {
    NODE_ENV: 'production',
    JWT_SECRET: 'a-real-production-secret',
    DATABASE_URL: 'postgres://user:password@db:5432/temply',
  }

  it('throws when JWT_SECRET is missing in production', async () => {
    await expect(
      importEnv({ ...PROD_BASE, JWT_SECRET: undefined }),
    ).rejects.toThrow(/JWT_SECRET is required when NODE_ENV=production/)
  })

  it('throws when DATABASE_URL is missing in production', async () => {
    await expect(
      importEnv({ ...PROD_BASE, DATABASE_URL: undefined }),
    ).rejects.toThrow(/DATABASE_URL is required when NODE_ENV=production/)
  })

  it('throws when APP_URL is not a valid URL', async () => {
    await expect(
      importEnv({ ...PROD_BASE, APP_URL: 'not-a-url' }),
    ).rejects.toThrow(/Invalid environment configuration/)
  })

  it('uses the provided JWT_SECRET in production', async () => {
    const { env } = await importEnv(PROD_BASE)
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

  it('applies development defaults for unset variables', async () => {
    const { env } = await importEnv({
      NODE_ENV: 'development',
      PORT: undefined,
      APP_URL: undefined,
      DATABASE_URL: undefined,
      SMTP_HOST: undefined,
      SMTP_PORT: undefined,
      SMTP_SECURE: undefined,
      EMAIL_FROM: undefined,
    })
    expect(env.PORT).toBe(4000)
    expect(env.APP_URL).toBe('http://localhost:3000')
    expect(env.DATABASE_URL).toBe('postgres://user:password@localhost:5432/temply')
    expect(env.SMTP_HOST).toBe('localhost')
    expect(env.SMTP_PORT).toBe(1025)
    expect(env.SMTP_SECURE).toBe(false)
    expect(env.EMAIL_FROM).toBe('noreply@temply.app')
    expect(env.isProduction).toBe(false)
  })

  it('coerces numeric and boolean string variables', async () => {
    const { env } = await importEnv({
      NODE_ENV: 'development',
      PORT: '8080',
      SMTP_PORT: '587',
      SMTP_SECURE: 'true',
    })
    expect(env.PORT).toBe(8080)
    expect(env.SMTP_PORT).toBe(587)
    expect(env.SMTP_SECURE).toBe(true)
  })
})
