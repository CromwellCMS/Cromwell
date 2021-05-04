import { TOrderInput } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto implements TOrderInput {
    @ApiProperty()
    status?: string;

    @ApiProperty()
    userId?: string;

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
    customerComment?: string;

    @ApiProperty()
    fromUrl?: string;
}
