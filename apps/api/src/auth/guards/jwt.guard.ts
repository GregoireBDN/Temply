import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { FastifyRequest } from 'fastify'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const token = request.cookies?.['token']
    if (!token) throw new UnauthorizedException()
    try {
      const payload = this.jwt.verify<{ sub: string }>(token)
      ;(request as FastifyRequest & { user: { sub: string } }).user = payload
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
