import { ApiProperty } from '@nestjs/swagger';
import { TCmsConfig } from '@cromwell/core';

export class CmsConfigDto implements TCmsConfig {
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

    @ApiProperty({ type: [String] })
    currencyOptions?: string[];

    @ApiProperty()
    currencySymbols?: Record<string, string>;

    @ApiProperty()
    currencyRatio?: Record<string, number>;
}