import { TCustomEntityInput } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BasePageInput } from './base-page.input';

@InputType('CustomEntityInput')
export class CustomEntityInput extends BasePageInput implements TCustomEntityInput {
  @Field((type) => String)
  entityType: string;

  @Field((type) => String, { nullable: true })
  name?: string;
}
