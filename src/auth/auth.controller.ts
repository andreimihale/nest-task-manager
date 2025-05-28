import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { UserResponse } from './user.repository';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signup')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created.',
    type: User,
  })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signin')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: User,
  })
  async login(@Body() AuthCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.login(AuthCredentialsDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users')
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: UserResponse,
  })
  async getUsers(@Query() filterDto: UserFilterDto): Promise<UserResponse> {
    return this.authService.getUsers(filterDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users/:id')
  @ApiResponse({
    status: 200,
    description: 'Get a user by id',
    type: User,
  })
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }
}
