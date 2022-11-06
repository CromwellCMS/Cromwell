import { TAttributeInstance, TAttributeInstanceValue } from '@cromwell/core';
import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType('AttributeInstanceValue')
@InputType('AttributeInstanceValueInput')
export class AttributeInstanceValue implements TAttributeInstanceValue {
  @Field((type) => String, { nullable: false })
  value: string;
}

@ObjectType('AttributeInstance')
@InputType('AttributeInstanceInput')
export class AttributeInstance implements TAttributeInstance {
  @Field((type) => String, { nullable: false })
  key: string;

  @Field((type) => [AttributeInstanceValue], { nullable: false })
  values: AttributeInstanceValue[];
}
