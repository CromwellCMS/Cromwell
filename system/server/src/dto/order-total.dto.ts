import { TStoreListItem, TOrderPaymentSession, TPaymentOption, TShippingOption } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentOptionDto implements TPaymentOption {
  @ApiProperty()
  key?: string | undefined;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  link?: string;
}

export class ShippingOptionDto implements TShippingOption {
  @ApiProperty()
  key: string;
  @ApiProperty()
  name?: string | undefined;
  @ApiProperty()
  price?: number | undefined;
  @ApiProperty()
  label?: string | undefined;
}

export class OrderTotalDto implements TOrderPaymentSession {
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
  shippingOptions?: ShippingOptionDto[];

  @ApiProperty()
  fromUrl?: string;

  @ApiProperty()
  successUrl?: string;

  @ApiProperty()
  cancelUrl?: string;

  @ApiProperty()
  appliedCoupons?: string[];

  @ApiProperty()
  paymentSessionId?: string;
}
