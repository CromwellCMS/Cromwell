import { Field, Int, InputType } from 'type-graphql';

@InputType('PluginProductShowcase_PageData')
export class PluginProductShowcase_PageData {
  @Field(() => String, { nullable: true })
  pageSlug: string;

  @Field(() => String, { nullable: true })
  categorySlug: string;

  @Field(() => Int, { nullable: true })
  categoryId: number;

  @Field(() => String, { nullable: true })
  productSlug: string;
}
