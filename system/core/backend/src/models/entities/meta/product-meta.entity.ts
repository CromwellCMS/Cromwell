import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Product } from '../product.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class ProductMeta extends BaseEntityMeta {

    @Field(() => Int)
    @Column({ type: "int" })
    entityId: number;

    @ManyToOne(() => Product, entity => entity.metaRecords, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "entityId" })
    entity?: Product;
}