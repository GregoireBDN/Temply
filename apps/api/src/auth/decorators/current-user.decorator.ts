import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

// Extracts req.user set by JwtGuard — use with @UseGuards(JwtGuard) on the route.
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): { sub: string } => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest & { user: { sub: string } }>()
    return req.user
  },
)
