import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    DatabaseModule,
    TasksModule,
    AuthModule,
    RouterModule.register([
      {
        path: 'api/tasks',
        module: TasksModule,
      },
      {
        path: 'api/auth',
        module: AuthModule,
      },
    ]),
  ],
})
export class AppModule {}
