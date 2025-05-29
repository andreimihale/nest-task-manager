import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/task-filter-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './enitites/task.entity';
import { TaskRepository, TaskResponse } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getTasksWithFilters(
    filterDto: TasksFilterDto,
    user: User,
  ): Promise<TaskResponse> {
    const tasks = await this.taskRepository.findTasksWithFilters(
      filterDto,
      user,
    );

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const newTask = await this.taskRepository.createTask(createTaskDto, user);

    return newTask;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findTaskById(id, user);

    return task;
  }

  async removeTask(id: string, user: User): Promise<{ success: boolean }> {
    await this.taskRepository.removeTask(id, user);

    return { success: true };
  }

  async updateTaskStatus(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.updateTaskStatus(
      id,
      updateTaskDto,
      user,
    );

    return task;
  }
}
