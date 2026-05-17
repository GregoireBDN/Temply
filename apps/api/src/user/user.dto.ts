import { ApiProperty, PartialType } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id!: string

  @ApiProperty({ type: String })
  email!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ enum: ['light', 'dark', 'auto'] })
  theme!: 'light' | 'dark' | 'auto'

  @ApiProperty({ type: String, format: 'date-time', nullable: true, required: false })
  emailVerifiedAt!: string | null

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string
}

export class CreateUserDto {
  @ApiProperty({ type: String })
  email!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ enum: ['light', 'dark', 'auto'], required: false })
  theme?: 'light' | 'dark' | 'auto'
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
