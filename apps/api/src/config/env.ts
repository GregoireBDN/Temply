import { randomBytes } from 'node:crypto'
import { z } from 'zod'

/**
 * Validated environment configuration, parsed once at module load.
 *
 * A single Zod schema describes every variable the API reads. It is validated
 * against `process.env` at boot: any missing or invalid variable crashes the
 * process with an explicit message instead of failing obscurely later. Import
 * `env` from here instead of touching `process.env` directly.
 */

const isProduction = process.env['NODE_ENV'] === 'production'

/** Dev/test fallback matching the docker-compose Postgres service. */
const DEV_DATABASE_URL = 'postgres://user:password@localhost:5432/temply'

/**
 * Required in production (a missing value crashes the boot); outside production
 * it falls back to a sane local default so the app runs without a fully
 * populated `.env`.
 */
const requiredInProduction = (name: string, devDefault: string) =>
  isProduction
    ? z
        .string({ error: `${name} is required when NODE_ENV=production` })
        .min(1, `${name} is required when NODE_ENV=production`)
    : z.string().min(1).default(devDefault)

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.url().default('http://localhost:3000'),

  DATABASE_URL: requiredInProduction('DATABASE_URL', DEV_DATABASE_URL),

  /**
   * Secret used to sign auth JWTs. Required in production: booting without it
   * would otherwise sign tokens with a known value, making them forgeable.
   * Outside production we generate an ephemeral per-boot secret (below) so local
   * dev works without a configured secret while never exposing a fixed default.
   */
  JWT_SECRET: isProduction
    ? z
        .string({ error: 'JWT_SECRET is required when NODE_ENV=production' })
        .min(1, 'JWT_SECRET is required when NODE_ENV=production')
    : z.string().min(1).optional(),

  /**
   * OAuth credentials are optional — an instance may run without OAuth
   * configured. They default to empty strings so consumers receive a `string`
   * (no non-null assertions); hitting an OAuth route without credentials fails
   * at the provider, exactly as before.
   */
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  GOOGLE_REDIRECT_URI: z
    .string()
    .default('http://localhost:4000/api/auth/google/callback'),
  APPLE_CLIENT_ID: z.string().default(''),
  APPLE_TEAM_ID: z.string().default(''),
  APPLE_KEY_ID: z.string().default(''),
  APPLE_PRIVATE_KEY: z.string().default(''),
  APPLE_REDIRECT_URI: z
    .string()
    .default('http://localhost:4000/api/auth/apple/callback'),

  // SMTP — dev defaults target the Mailpit container.
  SMTP_HOST: z.string().min(1).default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  // Env values are strings; only the literal "true" enables TLS.
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@temply.app'),
})

function loadEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`Invalid environment configuration:\n${issues}`)
  }

  return {
    ...parsed.data,
    JWT_SECRET: parsed.data.JWT_SECRET ?? randomBytes(32).toString('hex'),
    isProduction,
  }
}

export const env = loadEnv()
export type Env = typeof env
