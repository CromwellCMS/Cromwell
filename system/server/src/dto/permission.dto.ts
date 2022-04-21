import { TPermission, TPermissionName } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto implements TPermission {
    @ApiProperty()
    name: TPermissionName;

    @ApiProperty()
    title?: string;

    @ApiProperty()
    description?: string;
}