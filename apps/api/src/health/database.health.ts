import { Injectable } from '@nestjs/common'
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus'
import { DatabaseService } from '#/database/database.service'

/**
 * Reports the database as up only after a real `SELECT 1` round-trip succeeds,
 * so `/health` reflects actual connectivity rather than a hard-coded `ok`.
 */
@Injectable()
export class DatabaseHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly databaseService: DatabaseService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key)
    try {
      await this.databaseService.ping()
      return indicator.up()
    } catch (error) {
      return indicator.down({ message: (error as Error).message })
    }
  }
}
