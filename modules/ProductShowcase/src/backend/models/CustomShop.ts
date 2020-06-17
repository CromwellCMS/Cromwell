import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID, Int } from "type-graphql";

@Entity()
@ObjectType()
export class CustomShop {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column({ type: "varchar" })
    title: string;

    @Field()
    @Column()
    address: string;

    @Field()
    @Column()
    employyes: string;
}