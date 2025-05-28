import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as argon2 from 'argon2';
import { BaseRepository } from 'src/base.repository';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';

export class UserResponse {
  @ApiProperty({ type: [User] })
  users: User[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(@Inject('DATABASE_CONNECTION') dataSource: DataSource) {
    super(dataSource);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }

  private async hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const isPasswordValid = await argon2.verify(hash, password);
    return isPasswordValid;
  }

  async findUserByUsernameOrEmail(
    username?: string,
    email?: string,
  ): Promise<User | null> {
    const userRepository = this.userRepository();

    const query = userRepository.createQueryBuilder('user');

    if (username) {
      query.andWhere('LOWER(user.username) = LOWER(:username)', { username });
    }

    if (email) {
      query.andWhere('LOWER(user.email) = LOWER(:email)', { email });
    }

    const user = await query.getOne();

    return user;
  }

  async findUserById(id: string): Promise<User> {
    const userRepository = this.userRepository();

    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUsers(filterDto: UserFilterDto): Promise<UserResponse> {
    const { username, email, search, page, limit } = filterDto;
    const defaultPage = 1;
    const defaultLimit = 10;
    const userRepository = this.userRepository();

    const query = userRepository.createQueryBuilder('user');

    if (username) {
      query.andWhere('LOWER(user.username) = LOWER(:username)', { username });
    }

    if (email) {
      query.andWhere('LOWER(user.email) = LOWER(:email)', { email });
    }

    if (search) {
      query.andWhere(
        '(LOWER(user.username) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (page) {
      query.skip((page - 1) * (limit || defaultLimit));
    } else {
      query.skip((defaultPage - 1) * (limit || defaultLimit));
    }

    query.take(limit || defaultLimit);

    const [users, total] = await query.getManyAndCount();

    if (!users.length) {
      throw new NotFoundException('Users not found');
    }

    return {
      users,
      count: users.length,
      total,
      page: Number(page) || defaultPage,
      totalPages: Math.ceil(total / (limit || defaultLimit)),
      limit: Number(limit) || defaultLimit,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;
    const hashedPassword = await this.hashPassword(password);

    const user = this.userRepository().create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await this.userRepository().save(user);
      return user;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
