import { TStoreListItem, TPaymentSession } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentOptionDto {
    @ApiProperty()
    name?: string;

    @ApiProperty()
    link?: string;
}

export class OrderTotalDto implements TPaymentSession {
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
    currency?: string;

    @ApiProperty()
    paymentOptions?: PaymentOptionDto[];

    @ApiProperty()
    fromUrl?: string;
    
    @ApiProperty()
    successUrl?: string;

    @ApiProperty()
    cancelUrl?: string;
}