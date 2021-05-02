import { TCmsStats } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { PageStatsDto } from './page-stats.dto';

export class SalePerDayDto {
    @ApiProperty()
    date: Date;

    @ApiProperty()
    orders: number;

    @ApiProperty()
    salesValue: number;
}

export class CmsStatsDto implements TCmsStats {
    @ApiProperty()
    reviews: number;

    @ApiProperty()
    averageRating: number;

    @ApiProperty()
    orders: number;

    @ApiProperty()
    salesValue: number;

    @ApiProperty({ type: [SalePerDayDto] })
    salesPerDay: SalePerDayDto[];

    @ApiProperty()
    pages: number;

    @ApiProperty()
    pageViews: number;

    @ApiProperty({ type: [PageStatsDto] })
    topPageViews: PageStatsDto[];

    @ApiProperty()
    customers: number;
}
