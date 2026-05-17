import { ApiProperty } from '@nestjs/swagger'
import { EmailField, PasswordField, TokenField } from './fields'

export class RegisterDto {
  @ApiProperty({ type: String })
  email!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ type: String })
  password!: string
}

export class LoginDto {
  @ApiProperty({ type: String })
  email!: string

  @ApiProperty({ type: String })
  password!: string
}

export class ForgotPasswordDto {
  @EmailField()
  email!: string
}

export class VerifyEmailDto {
  @TokenField()
  token!: string
}

export class ResetPasswordDto {
  @TokenField()
  token!: string

  @PasswordField()
  password!: string
}
