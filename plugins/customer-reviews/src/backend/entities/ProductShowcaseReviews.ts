import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID, Int } from "type-graphql";

@Entity()
@ObjectType()
class ProductShowcaseReviews {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column({ type: "varchar" })
    title: string;

    @Field()
    @Column()
    text: string;

    @Field()
    @Column()
    rating: number;
}

export default ProductShowcaseReviews;

export type ProductShowcaseReviewsType = ProductShowcaseReviews;