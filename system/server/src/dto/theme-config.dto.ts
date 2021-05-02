import { TCromwellBlockData, TDefaultPageName, TThemeConfig } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { PageConfigDto } from './page-config.dto';

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

    @ApiProperty()
    defaultPages?: Record<TDefaultPageName, string>;

    parse(config?: TThemeConfig | null) {
        if (!config) return null;
        this.palette = config.palette;
        this.headHtml = config.headHtml;
        this.globalCss = config.globalCss;
        this.defaultPages = config.defaultPages;
        this.pages = config.pages;
        this.themeCustomConfig = config.themeCustomConfig;
        this.globalModifications = config.globalModifications;
        return this;
    }

}