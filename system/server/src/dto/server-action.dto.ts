import { ApiProperty } from '@nestjs/swagger';

export class ServerActionDto {
  @ApiProperty()
  secretKey: string;

  @ApiProperty()
  actionName: string;

  @ApiProperty()
  payload: any;
}
