import { pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { coreColumns } from '#/database/schema/core.schema'
import { usersTable } from '#/user/user.schema'

export const oauthAccountsTable = pgTable(
  'oauth_accounts',
  {
    ...coreColumns,
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    provider: varchar('provider', { length: 32 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).notNull(),
  },
  (t) => [unique().on(t.provider, t.providerId)],
)

export const passwordResetTokensTable = pgTable('password_reset_tokens', {
  ...coreColumns,
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
})

export const emailVerificationTokensTable = pgTable('email_verification_tokens', {
  ...coreColumns,
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
})

/**
 * Rotating refresh tokens. Each row is one refresh token in a session:
 * - only the SHA-256 `tokenHash` is stored, never the token itself
 * - `familyId` groups every token descending from a single login. Each refresh
 *   rotates the token (old one revoked, new one issued in the same family).
 * - presenting an already-revoked token is treated as theft: the whole family
 *   is revoked (reuse detection).
 * - `revokedAt` supports both rotation and explicit logout revocation.
 */
export const refreshTokensTable = pgTable('refresh_tokens', {
  ...coreColumns,
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  familyId: uuid('family_id').notNull(),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
})

export type OAuthAccount = typeof oauthAccountsTable.$inferSelect
export type InsertOAuthAccount = typeof oauthAccountsTable.$inferInsert
export type PasswordResetToken = typeof passwordResetTokensTable.$inferSelect
export type EmailVerificationToken = typeof emailVerificationTokensTable.$inferSelect
export type RefreshToken = typeof refreshTokensTable.$inferSelect
