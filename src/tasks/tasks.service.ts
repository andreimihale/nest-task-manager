import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/task-filter-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './enitites/task.entity';
import { TaskRepository, TaskResponse } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getTasksWithFilters(filterDto: TasksFilterDto): Promise<TaskResponse> {
    const tasks = await this.taskRepository.findTasksWithFilters(filterDto);

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = await this.taskRepository.createTask(createTaskDto);

    return newTask;
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findTaskById(id);

    return task;
  }

  async removeTask(id: string): Promise<{ success: boolean }> {
    await this.taskRepository.removeTask(id);

    return { success: true };
  }

  async updateTaskStatus(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepository.updateTaskStatus(id, updateTaskDto);

    return task;
  }
}
