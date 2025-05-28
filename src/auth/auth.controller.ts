import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthResponse, AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtCookieAuthGuard } from './guards/jwt-cookie-auth.guard';
import { UserResponse } from './user.repository';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signup')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created.',
    type: AuthResponseDto,
  })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.signUp(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signin')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: AuthResponseDto,
  })
  async login(
    @Body() AuthCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const authResponse = await this.authService.login(AuthCredentialsDto);
    response.cookie('access_token', authResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 * 8,
    });
    return authResponse;
  }

  @Post('/logout')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged out.',
  })
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtCookieAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description:
      'Get all users (supports both JWT header and cookie authentication)',
    type: UserResponse,
  })
  async getUsers(@Query() filterDto: UserFilterDto): Promise<UserResponse> {
    return this.authService.getUsers(filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users/:id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get a user by id (JWT header authentication only)',
    type: User,
  })
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }
}
