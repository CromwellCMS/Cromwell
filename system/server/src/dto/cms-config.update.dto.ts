import { ApiProperty } from '@nestjs/swagger';
import { TCmsSettings, TCurrency, TCmsEntityInput } from '@cromwell/core';
import { CurrencyDto } from './currency.dto';

export class CmsConfigUpdateDto implements TCmsEntityInput {
    @ApiProperty()
    protocol?: 'http' | 'https';

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

