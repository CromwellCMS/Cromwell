import { ApiProperty } from '@nestjs/swagger';
import { TCmsStats } from '@cromwell/core';

export class SalePerDayDto {
    @ApiProperty()
    date: Date;

    @ApiProperty()
    orders: number;

    @ApiProperty()
    salesValue: number;
}

export class PageViewDto {
    @ApiProperty()
    pageRoute: string;

    @ApiProperty()
    views: number;
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

    @ApiProperty({ type: [PageViewDto] })
    topPageViews: PageViewDto[];

    @ApiProperty()
    customers: number;
}
