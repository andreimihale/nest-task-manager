import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class UserFilterDto {
  @ApiProperty({ name: 'username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ name: 'email', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ name: 'search', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ name: 'page', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiProperty({ name: 'limit', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;
}

export { UserFilterDto };
