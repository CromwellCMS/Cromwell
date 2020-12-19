import { InputType, Field, Int } from "type-graphql";
import { TThemeEntityInput } from '@cromwell/core';
import { BasePageInput } from './BasePageInput';

@InputType('ThemeInput')
export class InputThemeEntity extends BasePageInput implements TThemeEntityInput {
    @Field(() => String)
    name: string;

    @Field(() => Boolean)
    isInstalled: boolean;

    @Field(type => String, { nullable: true })
    settings?: string;

    @Field(type => String, { nullable: true })
    defaultSettings?: string;
}
