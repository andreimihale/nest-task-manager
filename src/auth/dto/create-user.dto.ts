import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateUserDto extends AuthCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
