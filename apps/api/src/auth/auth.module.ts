import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from '#/auth/auth.controller'
import { AuthService } from '#/auth/auth.service'
import { JwtGuard } from '#/auth/guards/jwt.guard'
import { env } from '#/config/env'

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  exports: [AuthService, JwtGuard, JwtModule],
})
export class AuthModule {}
