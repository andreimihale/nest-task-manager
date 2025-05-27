import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseEntity } from 'src/base.entity';
import { Column, Entity } from 'typeorm';
import { TaskStatus } from '../task.model';

@Entity()
export class Task extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsUUID()
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  @Column({ type: 'varchar', length: 300 })
  description: string;

  @ApiProperty({ name: 'status', enum: TaskStatus })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;
}
