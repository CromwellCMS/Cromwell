import { TThemeMainConfig } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class ThemeMainConfigDto implements TThemeMainConfig {
    @ApiProperty()
    themeName: string;

    @ApiProperty()
    adminPanelDir?: string;

    @ApiProperty()
    palette?: { primaryColor?: string };

    @ApiProperty()
    headHtml?: string;

    @ApiProperty()
    globalCss?: string[];

    @ApiProperty()
    previewImage?: string;

    @ApiProperty()
    title?: string;
    
    @ApiProperty()
    description?: string;
}