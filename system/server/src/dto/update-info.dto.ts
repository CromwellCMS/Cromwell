import { TUpdateInfo } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInfoDto implements TUpdateInfo {

    @ApiProperty()
    name: string;

    @ApiProperty()
    version: string;

    @ApiProperty()
    packageVersion: string;

    @ApiProperty()
    beta: boolean;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    changelog?: string;

    @ApiProperty()
    image?: string;

    @ApiProperty()
    createdAt: Date;
}