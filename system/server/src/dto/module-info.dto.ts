import { TPackageCromwellConfig } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class ModuleInfoDto implements TPackageCromwellConfig {
    @ApiProperty()
    name: string;

    @ApiProperty({ type: String })
    type?: "plugin" | "theme";

    @ApiProperty()
    title?: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    icon?: string;

    @ApiProperty()
    previewImage?: string;

    @ApiProperty()
    themes?: string[];

    @ApiProperty()
    plugins?: string[];
}