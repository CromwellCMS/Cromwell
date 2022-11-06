import { TPagedMeta } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class PagedMeta implements TPagedMeta {
  @Field(() => Int, { nullable: true })
  pageNumber?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalElements?: number;
}
