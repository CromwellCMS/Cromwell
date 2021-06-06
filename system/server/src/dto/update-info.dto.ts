import { TUpdateInfo, TCCSVersion } from '@cromwell/core';
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
    onlyManualUpdate?: boolean;
    
    @ApiProperty()
    description?: string;

    @ApiProperty()
    changelog?: string;

    @ApiProperty()
    image?: string;

    @ApiProperty()
    createdAt: Date;

    parseVersion?: ((ver: TCCSVersion) => UpdateInfoDto) = (ver: TCCSVersion) => {
        this.name = ver.name;
        this.version = ver.version;
        this.packageVersion = ver.packageVersion;
        this.beta = ver.beta;
        this.description = ver.description;
        this.changelog = ver.changelog;
        this.image = ver.image;
        this.createdAt = ver.createdAt;
        this.onlyManualUpdate = ver.onlyManualUpdate;
        return this;
    }
}
