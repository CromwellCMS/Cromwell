import { TThemeConfig, TCromwellBlockData } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';
import { PageConfigDto } from './page-config.dto';
import { PageInfoDto } from './page-info.dto';

export class ThemeConfigDto implements TThemeConfig {
    @ApiProperty()
    palette?: { primaryColor?: string };

    @ApiProperty()
    headHtml?: string;

    @ApiProperty()
    globalCss?: string[];

    @ApiProperty()
    pages?: PageConfigDto[];

    @ApiProperty()
    themeCustomConfig?: Record<string, any>;

    @ApiProperty()
    globalModifications?: TCromwellBlockData[];

}