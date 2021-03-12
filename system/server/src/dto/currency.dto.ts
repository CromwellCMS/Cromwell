import { TCurrency } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

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
