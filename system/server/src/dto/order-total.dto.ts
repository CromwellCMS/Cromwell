import { TStoreListItem } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class OrderTotalDto {
    @ApiProperty()
    orderTotalPrice?: number = 0;

    @ApiProperty()
    cartTotalPrice?: number = 0;

    @ApiProperty()
    cartOldTotalPrice?: number;

    @ApiProperty()
    shippingPrice?: number = 0;

    @ApiProperty()
    totalQnt: number = 0;

    @ApiProperty()
    shippingMethod?: string;

    @ApiProperty()
    paymentMethod?: string;

    @ApiProperty()
    cart?: TStoreListItem[];

    @ApiProperty()
    checkoutUrl?: string | null;

    @ApiProperty()
    currency?: string;
}
