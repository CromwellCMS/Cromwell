import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TCmsDashboardLayout, TCmsDashboardSettings, TUser } from '@cromwell/core';
import { User } from './user.entity';

@Entity('dashboard')
@ObjectType('Dashboard')
export class DashboardEntity extends BaseEntity implements TCmsDashboardSettings {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => String, { nullable: false, defaultValue: 'template' })
  @Column({ type: 'varchar', length: 255, nullable: true, default: 'template' })
  type?: 'user' | 'template' | undefined;

  @Field((type) => String, { nullable: false, defaultValue: 'system' })
  @Column({ type: 'varchar', length: 255, nullable: true, default: 'system' })
  for?: 'user' | 'role' | 'system' | undefined;

  @OneToOne(() => User, (user) => user.layout, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: TUser | undefined;

  @Field((type) => Int, { nullable: true })
  @Column('int', { nullable: true })
  @Index()
  userId?: number | undefined;

  public get layout(): TCmsDashboardLayout | undefined {
    return this._layout ? JSON.parse(this._layout) : undefined;
  }
  public set layout(data: TCmsDashboardLayout | undefined) {
    this._layout = data ? JSON.stringify(data) : undefined;
  }
  @Column({ type: 'text', nullable: true })
  private _layout?: string;
}
