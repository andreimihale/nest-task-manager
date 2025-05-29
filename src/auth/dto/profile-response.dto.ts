import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Task } from 'src/tasks/enitites/task.entity';

export class ProfileResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty({ type: [Task] })
  @Expose()
  tasks: Task[];
}
