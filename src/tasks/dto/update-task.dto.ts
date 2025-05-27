import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

class UpdateTaskDto {
  @ApiProperty({ name: 'status', enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export { UpdateTaskDto };
