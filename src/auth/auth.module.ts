import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TaskRepository } from 'src/tasks/task.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtCookieStrategy } from './strategies/jwt-cookie.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined');
        }
        if (!process.env.JWT_EXPIRES_IN) {
          throw new Error('JWT_EXPIRES_IN is not defined');
        }

        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    UserRepository,
    TaskRepository,
    JwtStrategy,
    JwtCookieStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtCookieStrategy, PassportModule],
})
export class AuthModule {}
