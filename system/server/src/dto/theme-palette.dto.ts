import { TPalette } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class ThemePaletteDto implements TPalette {
    @ApiProperty()
    primaryColor?: string

    @ApiProperty()
    secondaryColor?: string;

    @ApiProperty()
    mode?: 'light' | 'dark';
}