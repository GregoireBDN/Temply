import { randomBytes } from 'node:crypto'
import { z } from 'zod'

/**
 * Validated environment configuration, parsed once at module load.
 *
 * This is intentionally minimal for now — it owns the security-sensitive
 * variables that must never fall back to a known public default. The broader
 * env-validation story extends this schema with the remaining variables.
 */

const isProduction = process.env['NODE_ENV'] === 'production'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  /**
   * Secret used to sign auth JWTs. Required in production: booting without it
   * would otherwise sign tokens with a known value, making them forgeable.
   * Outside production we generate an ephemeral per-boot secret so local dev
   * works without a configured secret while never exposing a fixed default.
   */
  JWT_SECRET: isProduction
    ? z
        .string({ error: 'JWT_SECRET is required when NODE_ENV=production' })
        .min(1, 'JWT_SECRET is required when NODE_ENV=production')
    : z.string().min(1).optional(),
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
    isProduction: parsed.data.NODE_ENV === 'production',
  }
}

export const env = loadEnv()
