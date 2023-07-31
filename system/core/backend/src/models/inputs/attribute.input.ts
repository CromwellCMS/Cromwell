import { TAttributeInput, TAttributeValue } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';
import { BasePageInput } from './base-page.input';

@InputType('AttributeInput')
export class AttributeInput extends BasePageInput implements TAttributeInput {
  @Field((type) => String)
  key: string;

  @Field((type) => String, { nullable: true })
  title?: string | null;

  @Field((type) => [AttributeValueInput])
  values: AttributeValueInput[];

  @Field((type) => String)
  type: 'radio' | 'checkbox' | 'text_input';

  @Field((type) => String, { nullable: true })
  icon?: string;

  @Field((type) => Boolean, { nullable: true })
  required?: boolean;
}

@InputType('AttributeValueInput')
export class AttributeValueInput implements TAttributeValue {
  @Field((type) => String)
  value: string;

  @Field((type) => String, { nullable: true })
  icon?: string;
}
