import { Field, ObjectType } from 'type-graphql';
import { PagedMeta } from './meta.paged';
import { CustomEntity } from '../entities/custom-entity.entity';
import { TPagedList, TCustomEntity } from '@cromwell/core';

@ObjectType()
export class PagedCustomEntity implements TPagedList<TCustomEntity> {
  @Field(() => PagedMeta, { nullable: true })
  pagedMeta?: PagedMeta;

  @Field(() => [CustomEntity], { nullable: true })
  elements?: CustomEntity[];
}
