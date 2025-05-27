import { Module } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService, TaskRepository],
  controllers: [TasksController],
})
export class TasksModule {}
