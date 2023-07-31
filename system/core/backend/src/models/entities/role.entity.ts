import { TPermissionName, TRole } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { OneToMany, Column, Entity, ManyToMany } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { User } from './user.entity';
import { RoleMeta } from './meta/role-meta.entity';

@Entity()
@ObjectType()
export class Role extends BasePageEntity implements TRole {
  @Field((type) => String)
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string | null;

  @Field((type) => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string | null;

  @Field((type) => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  icon?: string | null;

  @Field((type) => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  permissions: TPermissionName[] | null;

  @ManyToMany(() => User, (user) => user.roles)
  users?: User[] | null;

  @OneToMany(() => RoleMeta, (meta) => meta.entity)
  metaRecords?: RoleMeta[];
}
