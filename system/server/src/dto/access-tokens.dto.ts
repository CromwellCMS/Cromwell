import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class AccessTokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: UserDto;
}

export class UpdateAccessTokenDto {
  @ApiProperty()
  refreshToken: string;
}

export class UpdateAccessTokenResponseDto {
  @ApiProperty()
  accessToken: string;
}
