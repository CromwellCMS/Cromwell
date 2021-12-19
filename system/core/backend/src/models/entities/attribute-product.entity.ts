import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AttributeValue } from './attribute-value.entity';
import { Product } from './product.entity';

@Entity()
@ObjectType()
export class AttributeToProduct extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => Int, { nullable: true })
    @Column("int", { nullable: true })
    @Index()
    productId: number;

    @ManyToOne(() => Product, product => product.attributeValues, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "productId" })
    product?: Product;

    @Field(type => Int, { nullable: true })
    @Column("int", { nullable: true })
    @Index()
    attributeValueId: number;

    @ManyToOne(() => AttributeValue, attribute => attribute.attributeToProduct, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "attributeValueId" })
    attributeValue?: AttributeValue;

    @Field(type => String)
    @Column({ type: "varchar", length: 255 })
    @Index()
    key: string;

    @Field(type => String)
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index()
    value: string;
}