import { Field, ObjectType } from 'type-graphql';
import { PagedMeta } from './meta.paged';
import { Product } from '../entities/product.entity';
import { TPagedList, TProduct } from '@cromwell/core';

@ObjectType()
export class PagedProduct implements TPagedList<TProduct> {
  @Field(() => PagedMeta, { nullable: true })
  pagedMeta?: PagedMeta;

  @Field(() => [Product], { nullable: true })
  elements?: Product[];
}
