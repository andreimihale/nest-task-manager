import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseEntity } from 'src/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Exclude()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Column({ type: 'varchar', length: 64, unique: true })
  email: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
