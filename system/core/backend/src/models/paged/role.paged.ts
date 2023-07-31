import { Field, ObjectType } from 'type-graphql';
import { PagedMeta } from './meta.paged';
import { Role } from '../entities/role.entity';
import { TPagedList, TRole } from '@cromwell/core';

@ObjectType()
export class PagedRole implements TPagedList<TRole> {
  @Field(() => PagedMeta, { nullable: true })
  pagedMeta?: PagedMeta;

  @Field(() => [Role], { nullable: true })
  elements?: Role[];
}
