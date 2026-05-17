import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DatabaseService } from '#/database/database.service'
import { type InsertUser, type SelectUser, usersTable } from '#/user/user.schema'

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<SelectUser[]> {
    return this.db.db.select().from(usersTable)
  }

  async findOne(id: string): Promise<SelectUser> {
    const [user] = await this.db.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))

    if (!user) throw new NotFoundException(`User ${id} not found`)
    return user
  }

  async create(data: InsertUser): Promise<SelectUser> {
    const [user] = await this.db.db.insert(usersTable).values(data).returning()
    return user
  }

  async update(id: string, data: Partial<InsertUser>): Promise<SelectUser> {
    const [user] = await this.db.db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning()

    if (!user) throw new NotFoundException(`User ${id} not found`)
    return user
  }

  async remove(id: string): Promise<void> {
    const [user] = await this.db.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning()

    if (!user) throw new NotFoundException(`User ${id} not found`)
  }
}
