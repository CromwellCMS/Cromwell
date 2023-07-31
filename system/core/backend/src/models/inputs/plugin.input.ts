import { TPluginEntityInput } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BasePageInput } from './base-page.input';

@InputType({ description: 'PluginInput' })
export class PluginInput extends BasePageInput implements TPluginEntityInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Boolean)
  isInstalled: boolean;

  @Field(() => Boolean, { nullable: true })
  hasAdminBundle?: boolean;

  @Field(() => String, { nullable: true })
  settings?: string;

  @Field(() => String, { nullable: true })
  defaultSettings?: string;

  @Field(() => String, { nullable: true })
  moduleInfo?: string;
}
