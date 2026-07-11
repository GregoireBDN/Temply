export const BCRYPT_SALT_ROUNDS = 10
/** Short-lived access token (JWT) — 15 minutes. */
export const ACCESS_TOKEN_TTL_SECONDS = 60 * 15
/** Long-lived rotating refresh token — 30 days. */
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30
export const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_TTL_SECONDS * 1000
export const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000

export const AUTH_ERRORS = {
  EMAIL_IN_USE: 'Email already in use',
  INVALID_CREDENTIALS: 'Invalid credentials',
  OAUTH_ONLY: 'Please sign in with your OAuth provider',
  INVALID_VERIFICATION_LINK: 'Invalid or expired link',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  INVALID_RESET_TOKEN: 'Invalid or expired token',
  INVALID_REFRESH_TOKEN: 'Invalid or expired session',
} as const
