import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { loggerParams } from './config/logger'
import { THROTTLE_LIMITS, THROTTLE_TTL } from './throttle.config'
import { AllExceptionsFilter } from '#/common/filters/all-exceptions.filter'
import { AuthModule } from '#/auth/auth.module'
import { DatabaseModule } from '#/database/database.module'
import { EmailModule } from '#/email/email.module'
import { UserModule } from '#/user/user.module'

@Module({
  imports: [
    // Structured JSON logging with a per-request correlation id (see logger.ts).
    LoggerModule.forRoot(loggerParams),
    // Global rate limiting: 60 requests / minute per IP by default.
    // Sensitive auth routes tighten this with route-level @Throttle() overrides.
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'default', ttl: THROTTLE_TTL, limit: THROTTLE_LIMITS.global },
      ],
    }),
    DatabaseModule,
    EmailModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // Normalises every unhandled exception into a uniform error envelope.
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
