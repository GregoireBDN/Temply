import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { DatabaseHealthIndicator } from './database.health'
import { SmtpHealthIndicator } from './smtp.health'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: DatabaseHealthIndicator,
    private readonly smtp: SmtpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        info: { database: { status: 'up' }, smtp: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' }, smtp: { status: 'up' } },
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'One or more dependencies are unavailable.',
  })
  check() {
    return this.health.check([
      () => this.database.isHealthy('database'),
      () => this.smtp.isHealthy('smtp'),
    ])
  }
}
