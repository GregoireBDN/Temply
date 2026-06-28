import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { DatabaseHealthIndicator } from './database.health'
import { HealthController } from './health.controller'
import { SmtpHealthIndicator } from './smtp.health'

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator, SmtpHealthIndicator],
})
export class HealthModule {}
