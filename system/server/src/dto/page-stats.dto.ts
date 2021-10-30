import { EDBEntity, TPageStats } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class PageStatsDto implements TPageStats {
    @ApiProperty()
    pageRoute?: string;

    @ApiProperty()
    views?: number;

    @ApiProperty()
    pageName?: string;

    @ApiProperty()
    slug?: string;

    @ApiProperty()
    entityType?: EDBEntity | string;
}



