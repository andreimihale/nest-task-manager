import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty()
  accessToken: string;
}
