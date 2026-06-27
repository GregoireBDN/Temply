import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { THROTTLE_LIMITS, THROTTLE_TTL } from './throttle.config'
import { AuthModule } from '#/auth/auth.module'
import { DatabaseModule } from '#/database/database.module'
import { EmailModule } from '#/email/email.module'
import { UserModule } from '#/user/user.module'

@Module({
  imports: [
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
  ],
})
export class AppModule {}
