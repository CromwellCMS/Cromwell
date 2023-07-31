import { TTagInput } from '@cromwell/core';
import { InputType, Field, Int } from 'type-graphql';
import { BasePageInput } from './base-page.input';

@InputType('TagInput')
export class TagInput extends BasePageInput implements TTagInput {
  @Field((type) => String)
  name: string;

  @Field((type) => String, { nullable: true })
  color?: string;

  @Field((type) => String, { nullable: true })
  image?: string;

  @Field((type) => String, { nullable: true })
  description?: string;

  @Field((type) => String, { nullable: true })
  descriptionDelta?: string | null;
}
