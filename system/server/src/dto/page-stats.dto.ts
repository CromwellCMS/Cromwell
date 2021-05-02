
import { ApiProperty } from '@nestjs/swagger';
import { TPageStats } from '@cromwell/core';

export class PageStatsDto implements TPageStats {
    @ApiProperty()
    pageRoute?: string;

    @ApiProperty()
    views?: number;

    @ApiProperty()
    productSlug?: string;

    @ApiProperty()
    categorySlug?: string;

    @ApiProperty()
    postSlug?: string;

    @ApiProperty()
    tagSlug?: string;
}



