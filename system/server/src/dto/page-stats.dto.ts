
import { ApiProperty } from '@nestjs/swagger';
import { TPageStats } from '@cromwell/core';

export class PageStatsDto implements TPageStats {
    @ApiProperty()
    pageRoute?: string;

    @ApiProperty()
    views?: number;

    @ApiProperty()
    pageName?: string;
}



