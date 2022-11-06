import { Field, ObjectType } from 'type-graphql';
import { PagedMeta } from './meta.paged';
import { Tag } from '../entities/tag.entity';
import { TPagedList, TTag } from '@cromwell/core';

@ObjectType()
export class PagedTag implements TPagedList<TTag> {
  @Field(() => PagedMeta, { nullable: true })
  pagedMeta?: PagedMeta;

  @Field(() => [Tag], { nullable: true })
  elements?: Tag[];
}
