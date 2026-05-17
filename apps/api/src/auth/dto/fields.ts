import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export const EmailField = () => applyDecorators(IsEmail(), ApiProperty({ type: String }))

export const PasswordField = () => applyDecorators(IsString(), MinLength(8), ApiProperty({ type: String }))

export const TokenField = () => applyDecorators(IsString(), ApiProperty({ type: String }))
