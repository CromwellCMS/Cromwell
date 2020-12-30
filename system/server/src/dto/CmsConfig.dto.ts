import { ApiProperty } from '@nestjs/swagger';
import { TCmsSettings, TCurrency } from '@cromwell/core';

export class CurrencyDto implements TCurrency {
    @ApiProperty()
    tag: string;

    @ApiProperty()
    title?: string;

    @ApiProperty()
    symbol?: string;

    @ApiProperty()
    ratio?: number;
}

export class CmsConfigDto implements TCmsSettings {
    @ApiProperty()
    domain?: string;

    @ApiProperty()
    protocol?: 'http' | 'https';

    @ApiProperty()
    apiPort: number;

    @ApiProperty()
    adminPanelPort: number;

    @ApiProperty()
    frontendPort: number;

    @ApiProperty()
    managerPort: number;

    @ApiProperty()
    themeName: string;

    @ApiProperty()
    defaultPageSize?: number;

    @ApiProperty({ type: [CurrencyDto] })
    currencies?: TCurrency[];
}

