import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { NewsletterForm } from '../../types';

@Entity('PluginNewsletter_NewsletterForm')
@ObjectType('PluginNewsletter_NewsletterForm')
class PluginNewsletter_NewsletterForm implements NewsletterForm {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;
}

export default PluginNewsletter_NewsletterForm;