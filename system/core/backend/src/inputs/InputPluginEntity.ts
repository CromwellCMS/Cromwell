import { InputType, Field, Int } from "type-graphql";
import { TPluginEntityInput } from '@cromwell/core';
import { BasePageInput } from './BasePageInput';

@InputType('PluginInput')
export class InputPluginEntity extends BasePageInput implements TPluginEntityInput {
    @Field(() => String)
    name: string;

    @Field(type => String, { nullable: true })
    title?: string;

    @Field(() => Boolean)
    isInstalled: boolean;

    @Field(type => Boolean, { nullable: true })
    hasAdminBundle?: boolean;

    @Field(type => String, { nullable: true })
    settings?: string;

    @Field(type => String, { nullable: true })
    defaultSettings?: string;

    @Field(type => String, { nullable: true })
    moduleInfo?: string;
}