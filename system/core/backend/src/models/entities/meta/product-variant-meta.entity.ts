import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ProductVariant } from '../product-variant.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class ProductVariantMeta extends BaseEntityMeta {

    @Field(() => Int)
    @Column({ type: "int" })
    entityId: number;

    @ManyToOne(() => ProductVariant, entity => entity.metaRecords, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "entityId" })
    entity?: ProductVariant;
}