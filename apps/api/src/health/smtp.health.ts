import { Injectable } from '@nestjs/common'
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus'
import { EmailService } from '#/email/email.service'

/**
 * Verifies the SMTP connection/credentials so a broken mail pipeline surfaces
 * on `/health` instead of failing silently the next time an email is sent.
 */
@Injectable()
export class SmtpHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly emailService: EmailService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key)
    try {
      await this.emailService.verifyConnection()
      return indicator.up()
    } catch (error) {
      return indicator.down({ message: (error as Error).message })
    }
  }
}
