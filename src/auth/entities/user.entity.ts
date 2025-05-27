import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { BaseEntity } from 'src/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Column({ type: 'varchar', length: 20 })
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @Column({ type: 'varchar', length: 64 })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Column({ type: 'varchar', length: 255 })
  email: string;
}
