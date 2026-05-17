import { Injectable } from '@nestjs/common'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

@Injectable()
export class DatabaseService {
  private _db: PostgresJsDatabase<typeof schema> | undefined

  get db(): PostgresJsDatabase<typeof schema> {
    if (!this._db) {
      const client = postgres(process.env.DATABASE_URL!)
      this._db = drizzle(client, { schema })
    }
    return this._db
  }
}
