import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { BaseRepository } from 'src/base.repository';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/task-filter-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './enitites/task.entity';

export class TaskResponse {
  @ApiProperty({ type: [Task] })
  tasks: Task[];

  @ApiProperty()
  total: number;
}

@Injectable()
export class TaskRepository extends BaseRepository {
  constructor(@Inject('DATABASE_CONNECTION') dataSource: DataSource) {
    super(dataSource);
  }

  private taskRepository(entityManager?: EntityManager): Repository<Task> {
    return this.getRepository(Task, entityManager);
  }

  async findTasksWithFilters(
    filterDto: TasksFilterDto,
    user: User,
  ): Promise<TaskResponse> {
    const { status, search } = filterDto;
    const taskRepository = this.taskRepository();

    const query = taskRepository.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const [tasks, total] = await query.getManyAndCount();

    if (!tasks.length) {
      throw new NotFoundException('Tasks not found');
    }

    return { tasks, total };
  }

  async findTaskById(id: string, user: User): Promise<Task> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid task id');
    }
    const taskRepository = this.taskRepository();
    const task = await taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = {
      title,
      description,
      userId: user.id,
    };

    const newTask = await this.taskRepository().save(task);

    return newTask;
  }

  async removeTask(id: string, user: User): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid task id');
    }
    const taskRepository = this.taskRepository();
    const { affected } = await taskRepository.delete({ id, userId: user.id });

    if (affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findTaskById(id, user);

    task.status = updateTaskDto.status;

    await this.taskRepository().save(task);
    return task;
  }

  async findTasksByUserId(userId: string): Promise<Task[]> {
    if (!uuidValidate(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    const taskRepository = this.taskRepository();
    const tasks = await taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return tasks;
  }
}
