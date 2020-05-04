import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
export class Product extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => String)
    @Column()
    pageTitle: string;

    @Field(() => String)
    @Column()
    name: string;

    @Field(() => String)
    @Column()
    price: string;

    @Field(() => String)
    @Column()
    mainImage: string;

    @Field(() => Boolean)
    @Column({ default: false })
    isPublished: boolean;
}