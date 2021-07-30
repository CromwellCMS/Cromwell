import { TOrderFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType("OrderFilterInput")
export class OrderFilterInput implements TOrderFilter {

    @Field(type => String, { nullable: true })
    status?: string;

    @Field(type => String, { nullable: true })
    customerName?: string;

    @Field(type => String, { nullable: true })
    customerPhone?: string;

    @Field(type => String, { nullable: true })
    customerEmail?: string;
    
    @Field(type => String, { nullable: true })
    orderId?: string;

    @Field(type => String, { nullable: true })
    dateFrom?: string;

    @Field(type => String, { nullable: true })
    dateTo?: string;
}
