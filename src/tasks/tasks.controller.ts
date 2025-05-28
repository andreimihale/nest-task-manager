import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtCombinedAuthGuard } from 'src/auth/guards/jwt-combined-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/task-filter-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './enitites/task.entity';
import { TaskStatus } from './task.model';
import { TaskResponse } from './task.repository';
import { TasksService } from './tasks.service';

@UseGuards(JwtCombinedAuthGuard)
@Controller('/')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Get all tasks',
    type: TaskResponse,
  })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  async getTasks(@Query() filterDto: TasksFilterDto): Promise<TaskResponse> {
    return this.tasksService.getTasksWithFilters(filterDto);
  }

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:taskId')
  @ApiResponse({
    status: 200,
    description: 'Get a task by id',
    type: Task,
  })
  getTaskById(@Param('taskId') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Delete('/:taskId')
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  })
  removeTask(@Param('taskId') taskId: string): Promise<{ success: boolean }> {
    return this.tasksService.removeTask(taskId);
  }

  @Patch('/:taskId/status')
  @ApiResponse({
    status: 200,
    description: 'The task status has been successfully updated.',
    type: Task,
  })
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, updateTaskDto);
  }
}
