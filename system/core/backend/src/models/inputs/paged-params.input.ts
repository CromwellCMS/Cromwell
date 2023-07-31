import { InputType, Field, ID, Int } from 'type-graphql';
import { TPagedParams } from '@cromwell/core';

@InputType({ description: 'Paged data' })
export class PagedParamsInput<T> implements TPagedParams<T> {
  @Field(() => Int, { nullable: true })
  pageNumber?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;

  @Field(() => String, { nullable: true })
  orderBy?: keyof T;

  @Field(() => String, { nullable: true })
  order?: 'ASC' | 'DESC';
}
