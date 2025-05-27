import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/base.repository';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(@Inject('DATABASE_CONNECTION') dataSource: DataSource) {
    super(dataSource);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }
}
