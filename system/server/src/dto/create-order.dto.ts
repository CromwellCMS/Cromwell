import { TOrderStatus, TPaymentSession } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto implements TPaymentSession {
    @ApiProperty()
    status?: TOrderStatus;

    @ApiProperty()
    userId?: number;

    @ApiProperty()
    cart?: string;

    @ApiProperty()
    customerName?: string;

    @ApiProperty()
    customerPhone?: string;

    @ApiProperty()
    customerEmail?: string;

    @ApiProperty()
    customerAddress?: string;

    @ApiProperty()
    shippingMethod?: string;

    @ApiProperty()
    paymentMethod?: string;

    @ApiProperty()
    customerComment?: string;

    @ApiProperty()
    fromUrl?: string;

    @ApiProperty()
    currency?: string;

    @ApiProperty()
    successUrl?: string;

    @ApiProperty()
    cancelUrl?: string;

    @ApiProperty({ type: [String] })
    couponCodes?: string[] | null;
}
