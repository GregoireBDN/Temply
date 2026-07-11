/**
 * Rate limiting configuration shared by the global ThrottlerModule
 * (app.module.ts) and the per-route @Throttle() overrides (auth.controller.ts).
 */

/** Sliding window applied to every throttler, in milliseconds (1 minute). */
export const THROTTLE_TTL = 60_000

/** Max requests per THROTTLE_TTL window, per IP. */
export const THROTTLE_LIMITS = {
  /** Default applied to all routes unless overridden. */
  global: 60,
  /** Sensitive auth routes (bruteforce / credential stuffing / email spam). */
  login: 5,
  register: 5,
  forgotPassword: 3,
  resendVerification: 3,
  /** Token renewal — generous enough for legitimate access-token expiry. */
  refresh: 30,
} as const
