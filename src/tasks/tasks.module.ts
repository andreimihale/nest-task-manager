import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [AuthModule],
  providers: [TasksService, TaskRepository],
  controllers: [TasksController],
})
export class TasksModule {}
