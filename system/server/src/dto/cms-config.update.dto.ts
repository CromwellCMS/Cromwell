import { TCmsEntityInput, TCurrency } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

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

    @ApiProperty()
    defaultShippingPrice?: number;

    @ApiProperty()
    smtpConnectionString?: string;

    @ApiProperty()
    sendFromEmail?: string;
}

