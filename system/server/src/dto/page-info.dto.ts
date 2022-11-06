import { ApiProperty } from '@nestjs/swagger';
import { TPageInfo } from '@cromwell/core';

export class PageInfoDto implements TPageInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  route: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  isVirtual?: boolean;
}
