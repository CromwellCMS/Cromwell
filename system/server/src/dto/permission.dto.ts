import { TPermission, TPermissionName } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto implements TPermission {
  @ApiProperty()
  name: TPermissionName;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  source?: 'cms' | 'plugin';

  @ApiProperty()
  categoryName?: string | undefined;

  @ApiProperty()
  categoryDescription?: string | undefined;

  @ApiProperty()
  categoryTitle?: string | undefined;

  @ApiProperty()
  moduleName?: string;

  @ApiProperty()
  moduleTitle?: string;
}
