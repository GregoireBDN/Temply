export const BCRYPT_SALT_ROUNDS = 10
export const JWT_EXPIRY_SECONDS = 60 * 60 * 24 * 7
export const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000
export const DEFAULT_APP_URL = 'http://localhost:3000'

export const AUTH_ERRORS = {
  EMAIL_IN_USE: 'Email already in use',
  INVALID_CREDENTIALS: 'Invalid credentials',
  OAUTH_ONLY: 'Please sign in with your OAuth provider',
  INVALID_VERIFICATION_LINK: 'Invalid or expired link',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  INVALID_RESET_TOKEN: 'Invalid or expired token',
} as const
