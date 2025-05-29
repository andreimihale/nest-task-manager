import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { TaskRepository } from 'src/tasks/task.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import { UserRepository, UserResponse } from './user.repository';

export interface AuthResponse {
  user: User;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly taskRepository: TaskRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.createUser(createUserDto);

    return user;
  }

  async getUsers(filterDto: UserFilterDto): Promise<UserResponse> {
    return this.userRepository.getUsers(filterDto);
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findUserById(id);
  }

  async getProfile(user: User): Promise<ProfileResponseDto> {
    const tasks = await this.taskRepository.findTasksByUserId(user.id);

    const profileData = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      tasks,
    };

    return plainToInstance(ProfileResponseDto, profileData);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<AuthResponse> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findUserByUsernameOrEmail(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userRepository.verifyPassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateJwtToken(user);

    return {
      user,
      accessToken,
    };
  }

  private generateJwtToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }
}
