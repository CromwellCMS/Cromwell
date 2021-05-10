import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NewsletterForm } from '../../types';

@Entity()
@ObjectType('PluginNewsletter_NewsletterForm')
class PluginNewsletter_NewsletterForm implements NewsletterForm {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column()
    email: string;
}

export default PluginNewsletter_NewsletterForm;