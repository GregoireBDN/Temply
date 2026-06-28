import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { sql } from 'drizzle-orm'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '#/config/env'
import * as schema from './schema'

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private client: postgres.Sql | undefined
  private _db: PostgresJsDatabase<typeof schema> | undefined

  get db(): PostgresJsDatabase<typeof schema> {
    if (!this._db) {
      this.client = postgres(env.DATABASE_URL)
      this._db = drizzle(this.client, { schema })
    }
    return this._db
  }

  /** Lightweight round-trip used by the health check to confirm the DB answers. */
  async ping(): Promise<void> {
    await this.db.execute(sql`SELECT 1`)
  }

  /**
   * Drain the Postgres connection pool on shutdown. Wired up via
   * `app.enableShutdownHooks()` so SIGTERM/SIGINT close connections cleanly
   * instead of leaving them dangling.
   */
  async onModuleDestroy(): Promise<void> {
    await this.client?.end()
  }
}
