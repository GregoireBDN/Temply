import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { type InsertUser } from '#/user/user.schema'
import { UserService } from '#/user/user.service'
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: UserDto })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserDto })
  create(@Body() body: InsertUser) {
    return this.userService.create(body)
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserDto })
  update(@Param('id') id: string, @Body() body: Partial<InsertUser>) {
    return this.userService.update(id, body)
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
