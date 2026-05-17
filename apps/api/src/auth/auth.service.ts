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
import { DatabaseService } from '#/database/database.service'
import {
  emailVerificationTokensTable,
  oauthAccountsTable,
  passwordResetTokensTable,
} from '#/auth/auth.schema'
import { EmailService } from '#/email/email.service'
import { usersTable } from '#/user/user.schema'
import {
  AUTH_ERRORS,
  BCRYPT_SALT_ROUNDS,
  DEFAULT_APP_URL,
  EMAIL_VERIFICATION_TTL_MS,
  PASSWORD_RESET_TTL_MS,
} from './auth.constants'
import type { ForgotPasswordDto, LoginDto, RegisterDto } from './dto/auth.dto'

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
  ) {}

  async onModuleInit() {
    this.arctic = (await import('arctic')) as unknown as ArcticModule
  }

  private get google(): OAuthProvider {
    return new this.arctic.Google(
      process.env['GOOGLE_CLIENT_ID']!,
      process.env['GOOGLE_CLIENT_SECRET']!,
      process.env['GOOGLE_REDIRECT_URI']!,
    )
  }

  private get apple(): OAuthProvider {
    return new this.arctic.Apple(
      process.env['APPLE_CLIENT_ID']!,
      process.env['APPLE_TEAM_ID']!,
      process.env['APPLE_KEY_ID']!,
      new TextEncoder().encode(process.env['APPLE_PRIVATE_KEY']!),
      process.env['APPLE_REDIRECT_URI']!,
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

    if (existing) return this.issueToken(existing.userId)

    const [user] = await this.db.db
      .insert(usersTable)
      .values({ email, name })
      .returning()
    await this.db.db
      .insert(oauthAccountsTable)
      .values({ userId: user.id, provider, providerId })

    return this.issueToken(user.id)
  }

  async register(dto: RegisterDto): Promise<string> {
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
    return this.issueToken(user.id)
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

    const appUrl = process.env['APP_URL'] ?? DEFAULT_APP_URL
    const verifyUrl = `${appUrl}/verify-email?token=${token}`
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

  async login(dto: LoginDto): Promise<string> {
    const [user] = await this.db.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
    if (!user) throw new UnauthorizedException('Invalid credentials')
    if (!user.passwordHash) throw new UnauthorizedException('Please sign in with Google')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    return this.issueToken(user.id)
  }

  issueToken(userId: string): string {
    return this.jwt.sign({ sub: userId }, { expiresIn: 60 * 60 * 24 * 7 })
  }

  verifyToken(token: string): { sub: string } {
    return this.jwt.verify<{ sub: string }>(token)
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

    const appUrl = process.env['APP_URL'] ?? DEFAULT_APP_URL
    const resetUrl = `${appUrl}/reset-password?token=${token}`
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
