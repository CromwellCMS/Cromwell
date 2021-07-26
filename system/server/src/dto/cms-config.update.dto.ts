import { TCmsEntityInput, TCurrency } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { CmsAdminSettingsDto } from './cms-admin-settings.dto';
import { CurrencyDto } from './currency.dto';

export class CmsConfigUpdateDto implements TCmsEntityInput {
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
    headHtml?: string;

    @ApiProperty()
    footerHtml?: string;

    @ApiProperty()
    defaultShippingPrice?: number;

    @ApiProperty()
    adminSettings?: CmsAdminSettingsDto;
}

