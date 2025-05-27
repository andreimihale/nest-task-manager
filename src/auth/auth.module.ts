import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';

@Module({
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
