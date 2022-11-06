import { ApiProperty } from '@nestjs/swagger';
import { TPageConfig, TCromwellBlockData } from '@cromwell/core';

export class PageConfigDto implements TPageConfig {
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

  @ApiProperty()
  modifications: TCromwellBlockData[];

  @ApiProperty()
  pageCustomConfig?: Record<string, any>;
}
