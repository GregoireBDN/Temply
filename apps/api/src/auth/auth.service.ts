import {
  BadRequestException,
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'node:crypto'
import { and, eq, isNull } from 'drizzle-orm'
import { AnalyticsService } from '#/analytics/analytics.service'
import { DatabaseService } from '#/database/database.service'
import {
  emailVerificationTokensTable,
  oauthAccountsTable,
  passwordResetTokensTable,
  refreshTokensTable,
} from '#/auth/auth.schema'
import { EmailService } from '#/email/email.service'
import { env } from '#/config/env'
import { usersTable } from '#/user/user.schema'
import {
  ACCESS_TOKEN_TTL_SECONDS,
  AUTH_ERRORS,
  BCRYPT_SALT_ROUNDS,
  EMAIL_VERIFICATION_TTL_MS,
  PASSWORD_RESET_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from './auth.constants'
import type { ForgotPasswordDto, LoginDto, RegisterDto } from './dto/auth.dto'

/** A freshly minted access token + refresh token pair for one session. */
export interface SessionTokens {
  accessToken: string
  refreshToken: string
}

interface OAuthTokens {
  idToken(): string
}

interface OAuthProvider {
  createAuthorizationURL(state: string, codeVerifierOrScopes: string | string[], scopes?: string[]): URL
  validateAuthorizationCode(code: string, codeVerifier?: string): Promise<OAuthTokens>
}

interface ArcticModule {
  Google: new (clientId: string, clientSecret: string, redirectURI: string) => OAuthProvider
  Apple: new (clientId: string, teamId: string, keyId: string, key: Uint8Array, redirectURI: string) => OAuthProvider
  generateState(): string
  generateCodeVerifier(): string
  decodeIdToken(token: string): unknown
}

@Injectable()
export class AuthService implements OnModuleInit {
  private arctic!: ArcticModule

  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
    private readonly analytics: AnalyticsService,
  ) {}

  async onModuleInit() {
    this.arctic = (await import('arctic')) as unknown as ArcticModule
  }

  private get google(): OAuthProvider {
    return new this.arctic.Google(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI,
    )
  }

  private get apple(): OAuthProvider {
    return new this.arctic.Apple(
      env.APPLE_CLIENT_ID,
      env.APPLE_TEAM_ID,
      env.APPLE_KEY_ID,
      new TextEncoder().encode(env.APPLE_PRIVATE_KEY),
      env.APPLE_REDIRECT_URI,
    )
  }

  createGoogleAuthUrl() {
    const state = this.arctic.generateState()
    const codeVerifier = this.arctic.generateCodeVerifier()
    const url = this.google.createAuthorizationURL(state, codeVerifier, [
      'openid',
      'email',
      'profile',
    ])
    return { url: url.toString(), state, codeVerifier }
  }

  async handleGoogleCallback(code: string, codeVerifier: string) {
    const tokens = await this.google.validateAuthorizationCode(code, codeVerifier)
    const claims = this.arctic.decodeIdToken(tokens.idToken()) as {
      sub: string
      email: string
      name: string
    }
    return this.findOrCreateUser('google', claims.sub, claims.email, claims.name)
  }

  createAppleAuthUrl() {
    const state = this.arctic.generateState()
    const url = this.apple.createAuthorizationURL(state, ['email', 'name'])
    return { url: url.toString(), state }
  }

  async handleAppleCallback(code: string, firstName?: string, lastName?: string) {
    const tokens = await this.apple.validateAuthorizationCode(code)
    const claims = this.arctic.decodeIdToken(tokens.idToken()) as {
      sub: string
      email?: string
    }
    const name = [firstName, lastName].filter(Boolean).join(' ') || 'Apple User'
    return this.findOrCreateUser('apple', claims.sub, claims.email ?? '', name)
  }

  private async findOrCreateUser(
    provider: string,
    providerId: string,
    email: string,
    name: string,
  ) {
    const [existing] = await this.db.db
      .select()
      .from(oauthAccountsTable)
      .where(
        and(
          eq(oauthAccountsTable.provider, provider),
          eq(oauthAccountsTable.providerId, providerId),
        ),
      )

    if (existing) {
      this.analytics.capture(existing.userId, 'user_logged_in', {
        method: provider,
      })
      return this.createSession(existing.userId)
    }

    const [user] = await this.db.db
      .insert(usersTable)
      .values({ email, name })
      .returning()
    await this.db.db
      .insert(oauthAccountsTable)
      .values({ userId: user.id, provider, providerId })

    this.analytics.capture(user.id, 'user_signed_up', { method: provider })
    return this.createSession(user.id)
  }

  async register(dto: RegisterDto): Promise<SessionTokens> {
    const [existing] = await this.db.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
    if (existing) throw new ConflictException(AUTH_ERRORS.EMAIL_IN_USE)

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS)
    const [user] = await this.db.db
      .insert(usersTable)
      .values({ email: dto.email, name: dto.name, passwordHash })
      .returning()

    await this.sendVerificationEmail(user.id, user.email)
    this.analytics.capture(user.id, 'user_signed_up', { method: 'password' })
    return this.createSession(user.id)
  }

  private async sendVerificationEmail(userId: string, email: string): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS)

    await this.db.db.insert(emailVerificationTokensTable).values({
      userId,
      tokenHash,
      expiresAt,
    })

    const verifyUrl = `${env.APP_URL}/verify-email?token=${token}`
    await this.email.sendEmailVerification(email, verifyUrl)
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const [record] = await this.db.db
      .select()
      .from(emailVerificationTokensTable)
      .where(
        and(
          eq(emailVerificationTokensTable.tokenHash, tokenHash),
          isNull(emailVerificationTokensTable.usedAt),
        ),
      )

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException(AUTH_ERRORS.INVALID_VERIFICATION_LINK)
    }

    const now = new Date()
    await this.db.db
      .update(usersTable)
      .set({ emailVerifiedAt: now })
      .where(eq(usersTable.id, record.userId))
    await this.db.db
      .update(emailVerificationTokensTable)
      .set({ usedAt: now })
      .where(eq(emailVerificationTokensTable.id, record.id))
  }

  async resendVerification(userId: string): Promise<void> {
    const [user] = await this.db.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))

    if (!user) throw new UnauthorizedException(AUTH_ERRORS.USER_NOT_FOUND)
    if (user.emailVerifiedAt) {
      throw new BadRequestException(AUTH_ERRORS.EMAIL_ALREADY_VERIFIED)
    }

    await this.sendVerificationEmail(user.id, user.email)
  }

  async login(dto: LoginDto): Promise<SessionTokens> {
    const [user] = await this.db.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
    if (!user) throw new UnauthorizedException('Invalid credentials')
    if (!user.passwordHash) throw new UnauthorizedException('Please sign in with Google')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    this.analytics.capture(user.id, 'user_logged_in', { method: 'password' })
    return this.createSession(user.id)
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  private signAccessToken(userId: string): string {
    return this.jwt.sign({ sub: userId }, { expiresIn: ACCESS_TOKEN_TTL_SECONDS })
  }

  /**
   * Persists a new refresh token in the given family and returns the token pair.
   * The token itself is random and returned to the caller; only its hash is
   * stored, so a database leak cannot be replayed.
   */
  private async issueRefreshToken(userId: string, familyId: string): Promise<SessionTokens> {
    const refreshToken = crypto.randomBytes(32).toString('hex')
    await this.db.db.insert(refreshTokensTable).values({
      userId,
      familyId,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    })
    return { accessToken: this.signAccessToken(userId), refreshToken }
  }

  /** Starts a brand-new session (fresh family) after a successful auth. */
  createSession(userId: string): Promise<SessionTokens> {
    return this.issueRefreshToken(userId, crypto.randomUUID())
  }

  /**
   * Rotates a refresh token: validates it, revokes it, and issues a new token in
   * the same family. Presenting an already-revoked (or unknown/expired) token is
   * treated as reuse — the entire family is revoked so a stolen token cannot be
   * traded for a fresh session.
   */
  async rotateRefreshToken(token: string): Promise<SessionTokens> {
    const tokenHash = this.hashToken(token)
    const [record] = await this.db.db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash))

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_REFRESH_TOKEN)
    }

    // Reuse of an already-rotated/revoked token ⇒ likely theft: burn the family.
    if (record.revokedAt) {
      await this.revokeFamily(record.familyId)
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_REFRESH_TOKEN)
    }

    await this.db.db
      .update(refreshTokensTable)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokensTable.id, record.id))

    return this.issueRefreshToken(record.userId, record.familyId)
  }

  private async revokeFamily(familyId: string): Promise<void> {
    await this.db.db
      .update(refreshTokensTable)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(refreshTokensTable.familyId, familyId),
          isNull(refreshTokensTable.revokedAt),
        ),
      )
  }

  /** Logout: revoke the session behind the presented refresh token, if any. */
  async revokeSession(token: string | undefined): Promise<void> {
    if (!token) return
    const [record] = await this.db.db
      .select({ familyId: refreshTokensTable.familyId })
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, this.hashToken(token)))
    if (record) await this.revokeFamily(record.familyId)
  }

  async getUser(userId: string) {
    const [user] = await this.db.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
    return user
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const [user] = await this.db.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))

    if (!user || !user.passwordHash) return

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS)

    await this.db.db.insert(passwordResetTokensTable).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    })

    const resetUrl = `${env.APP_URL}/reset-password?token=${token}`
    await this.email.sendPasswordReset(user.email, resetUrl)
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const [record] = await this.db.db
      .select()
      .from(passwordResetTokensTable)
      .where(
        and(
          eq(passwordResetTokensTable.tokenHash, tokenHash),
          isNull(passwordResetTokensTable.usedAt),
        ),
      )

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException(AUTH_ERRORS.INVALID_RESET_TOKEN)
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const now = new Date()
    await this.db.db
      .update(usersTable)
      .set({ passwordHash })
      .where(eq(usersTable.id, record.userId))
    await this.db.db
      .update(passwordResetTokensTable)
      .set({ usedAt: now })
      .where(eq(passwordResetTokensTable.id, record.id))
  }
}
