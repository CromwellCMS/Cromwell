import { ApiProperty } from '@nestjs/swagger';

export class PluginInfoDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  icon?: string;

  @ApiProperty()
  info?: string;
}
