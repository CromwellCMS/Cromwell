import { ApiProperty } from '@nestjs/swagger';
import { TCmsSettings, TCurrency } from '@cromwell/core';
import { CurrencyDto } from './currency.dto';

export class CmsConfigDto implements TCmsSettings {
    @ApiProperty()
    domain?: string;

    @ApiProperty()
    protocol?: 'http' | 'https';

    @ApiProperty()
    apiPort?: number;

    @ApiProperty()
    adminPanelPort?: number;

    @ApiProperty()
    frontendPort?: number;

    @ApiProperty()
    managerPort?: number;

    @ApiProperty()
    themeName?: string;

    @ApiProperty()
    defaultPageSize?: number;

    @ApiProperty({ type: [CurrencyDto] })
    currencies?: TCurrency[];

    @ApiProperty()
    timezone?: number;

    @ApiProperty()
    language?: string;

    @ApiProperty()
    favicon?: string;

    @ApiProperty()
    logo?: string;

    @ApiProperty()
    headerHtml?: string;

    @ApiProperty()
    footerHtml?: string;
}

