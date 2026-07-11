import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { THROTTLE_LIMITS, THROTTLE_TTL } from '#/throttle.config'
import { AuthService } from '#/auth/auth.service'
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from '#/auth/dto/auth.dto'
import { JwtGuard } from '#/auth/guards/jwt.guard'
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from '#/auth/auth.constants'
import type { SessionTokens } from '#/auth/auth.service'
import { env } from '#/config/env'
import { UserDto } from '#/user/user.dto'

const COOKIE_DEFAULTS = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: env.isProduction,
} as const
const COOKIE_SECURE = env.isProduction ? '; Secure' : ''
const OAUTH_STATE_TTL = 60 * 5

/** Access token cookie — sent on every API request for the JwtGuard. */
const ACCESS_COOKIE = 'token'
/**
 * Refresh token cookie — scoped to /api/auth so it only travels to the refresh
 * and logout endpoints, never to ordinary API routes.
 */
const REFRESH_COOKIE = 'refresh_token'
const REFRESH_COOKIE_PATH = '/api/auth'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiExcludeEndpoint()
  googleAuth(@Res() reply: FastifyReply) {
    const { url, state, codeVerifier } = this.authService.createGoogleAuthUrl()
    this.sendRedirect(reply, url, [
      this.cookie('oauth_state', state, OAUTH_STATE_TTL),
      this.cookie('code_verifier', codeVerifier, OAUTH_STATE_TTL),
    ])
  }

  @Get('google/callback')
  @ApiExcludeEndpoint()
  async googleCallback(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const { code, state } = req.query as Record<string, string>
    const storedState = req.cookies?.['oauth_state']
    const codeVerifier = req.cookies?.['code_verifier']

    if (!code || !state || state !== storedState || !codeVerifier) {
      throw new UnauthorizedException('Invalid OAuth state')
    }

    const tokens = await this.authService.handleGoogleCallback(code, codeVerifier)

    this.sendRedirect(reply, `${env.APP_URL}/auth/success`, [
      this.clearCookie('oauth_state'),
      this.clearCookie('code_verifier'),
      ...this.sessionCookieStrings(tokens),
    ])
  }

  @Get('apple')
  @ApiExcludeEndpoint()
  appleAuth(@Res() reply: FastifyReply) {
    const { url, state } = this.authService.createAppleAuthUrl()
    this.sendRedirect(reply, url, [this.cookie('oauth_state', state, OAUTH_STATE_TTL)])
  }

  @Post('apple/callback')
  @ApiExcludeEndpoint()
  async appleCallback(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const body = req.body as { code: string; state: string; user?: string }
    const storedState = req.cookies?.['oauth_state']

    if (!body.code || !body.state || body.state !== storedState) {
      throw new UnauthorizedException('Invalid OAuth state')
    }

    const appleUser = body.user ? (JSON.parse(body.user) as { name?: { firstName?: string; lastName?: string } }) : null
    const tokens = await this.authService.handleAppleCallback(
      body.code,
      appleUser?.name?.firstName,
      appleUser?.name?.lastName,
    )

    this.sendRedirect(reply, `${env.APP_URL}/auth/success`, [
      this.clearCookie('oauth_state'),
      ...this.sessionCookieStrings(tokens),
    ])
  }

  private cookie(name: string, value: string, maxAge: number, path = '/'): string {
    return `${name}=${value}; Max-Age=${maxAge}; Path=${path}; HttpOnly; SameSite=Lax${COOKIE_SECURE}`
  }

  private clearCookie(name: string): string {
    return `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${COOKIE_SECURE}`
  }

  /** Raw Set-Cookie strings for the session pair (used by OAuth redirects). */
  private sessionCookieStrings({ accessToken, refreshToken }: SessionTokens): string[] {
    return [
      this.cookie(ACCESS_COOKIE, accessToken, ACCESS_TOKEN_TTL_SECONDS),
      this.cookie(REFRESH_COOKIE, refreshToken, REFRESH_TOKEN_TTL_SECONDS, REFRESH_COOKIE_PATH),
    ]
  }

  /** Sets the session pair on a JSON reply via the Fastify cookie API. */
  private setSessionCookies(reply: FastifyReply, { accessToken, refreshToken }: SessionTokens) {
    reply
      .cookie(ACCESS_COOKIE, accessToken, { ...COOKIE_DEFAULTS, maxAge: ACCESS_TOKEN_TTL_SECONDS })
      .cookie(REFRESH_COOKIE, refreshToken, {
        ...COOKIE_DEFAULTS,
        path: REFRESH_COOKIE_PATH,
        maxAge: REFRESH_TOKEN_TTL_SECONDS,
      })
  }

  private sendRedirect(reply: FastifyReply, url: string, cookies: string[]) {
    reply.hijack()
    reply.raw.writeHead(302, { Location: url, 'Set-Cookie': cookies })
    reply.raw.end()
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: UserDto })
  me(@Req() req: FastifyRequest) {
    const { sub } = (req as FastifyRequest & { user: { sub: string } }).user
    return this.authService.getUser(sub)
  }

  @Post('register')
  @Throttle({ default: { ttl: THROTTLE_TTL, limit: THROTTLE_LIMITS.register } })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ schema: { example: { success: true } } })
  async register(@Body() dto: RegisterDto, @Res() reply: FastifyReply) {
    const tokens = await this.authService.register(dto)
    this.setSessionCookies(reply, tokens)
    await reply.status(201).send({ success: true })
  }

  @Post('login')
  @Throttle({ default: { ttl: THROTTLE_TTL, limit: THROTTLE_LIMITS.login } })
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ schema: { example: { success: true } } })
  async login(@Body() dto: LoginDto, @Res() reply: FastifyReply) {
    const tokens = await this.authService.login(dto)
    this.setSessionCookies(reply, tokens)
    await reply.send({ success: true })
  }

  @Post('refresh')
  @Throttle({ default: { ttl: THROTTLE_TTL, limit: THROTTLE_LIMITS.refresh } })
  @HttpCode(200)
  @ApiOkResponse({ schema: { example: { success: true } } })
  async refresh(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const token = req.cookies?.[REFRESH_COOKIE]
    if (!token) throw new UnauthorizedException()
    const tokens = await this.authService.rotateRefreshToken(token)
    this.setSessionCookies(reply, tokens)
    await reply.send({ success: true })
  }

  @Post('logout')
  @ApiOkResponse({ schema: { example: { success: true } } })
  async logout(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    await this.authService.revokeSession(req.cookies?.[REFRESH_COOKIE])
    await reply
      .clearCookie(ACCESS_COOKIE, { path: '/' })
      .clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH })
      .send({ success: true })
  }

  @Post('forgot-password')
  @Throttle({ default: { ttl: THROTTLE_TTL, limit: THROTTLE_LIMITS.forgotPassword } })
  @HttpCode(200)
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ schema: { example: { success: true } } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto)
    return { success: true }
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ schema: { example: { success: true } } })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password)
    return { success: true }
  }

  @Post('verify-email')
  @HttpCode(200)
  @ApiBody({ type: VerifyEmailDto })
  @ApiOkResponse({ schema: { example: { success: true } } })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.authService.verifyEmail(dto.token)
    return { success: true }
  }

  @Post('resend-verification')
  @Throttle({ default: { ttl: THROTTLE_TTL, limit: THROTTLE_LIMITS.resendVerification } })
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ schema: { example: { success: true } } })
  async resendVerification(@Req() req: FastifyRequest) {
    const { sub } = (req as FastifyRequest & { user: { sub: string } }).user
    await this.authService.resendVerification(sub)
    return { success: true }
  }
}
