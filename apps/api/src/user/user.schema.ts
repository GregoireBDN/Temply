import { pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { coreColumns } from '#/database/schema/core.schema'

export const themeEnum = pgEnum('theme', ['light', 'dark', 'auto'])

export const usersTable = pgTable('users', {
  ...coreColumns,
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  theme: themeEnum('theme').notNull().default('auto'),
  emailVerifiedAt: timestamp('email_verified_at'),
})

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: true,
})

export const selectUserSchema = createSelectSchema(usersTable).omit({
  passwordHash: true,
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect
