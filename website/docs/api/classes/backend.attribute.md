[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / Attribute

# Class: Attribute

[backend](../modules/backend.md).Attribute

## Hierarchy

* [*BasePageEntity*](backend.basepageentity.md)

  ↳ **Attribute**

## Implements

* *TAttribute*

## Table of contents

### Constructors

- [constructor](backend.attribute.md#constructor)

### Properties

- [createDate](backend.attribute.md#createdate)
- [icon](backend.attribute.md#icon)
- [id](backend.attribute.md#id)
- [isEnabled](backend.attribute.md#isenabled)
- [key](backend.attribute.md#key)
- [pageDescription](backend.attribute.md#pagedescription)
- [pageTitle](backend.attribute.md#pagetitle)
- [required](backend.attribute.md#required)
- [slug](backend.attribute.md#slug)
- [type](backend.attribute.md#type)
- [updateDate](backend.attribute.md#updatedate)

### Accessors

- [values](backend.attribute.md#values)

## Constructors

### constructor

\+ **new Attribute**(): [*Attribute*](backend.attribute.md)

**Returns:** [*Attribute*](backend.attribute.md)

Inherited from: [BasePageEntity](backend.basepageentity.md)

## Properties

### createDate

• **createDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[createDate](backend.basepageentity.md#createdate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:28](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/BasePageEntity.ts#L28)

___

### icon

• `Optional` **icon**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Attribute.ts:43](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/Attribute.ts#L43)

___

### id

• **id**: *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[id](backend.basepageentity.md#id)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/BasePageEntity.ts#L12)

___

### isEnabled

• `Optional` **isEnabled**: *undefined* \| *boolean*

Inherited from: [BasePageEntity](backend.basepageentity.md).[isEnabled](backend.basepageentity.md#isenabled)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:36](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/BasePageEntity.ts#L36)

___

### key

• **key**: *string*

Defined in: [system/core/backend/src/entities/Attribute.ts:23](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/Attribute.ts#L23)

___

### pageDescription

• `Optional` **pageDescription**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[pageDescription](backend.basepageentity.md#pagedescription)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:24](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/BasePageEntity.ts#L24)

___

### pageTitle

• `Optional` **pageTitle**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[pageTitle](backend.basepageentity.md#pagetitle)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:20](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/BasePageEntity.ts#L20)

___

### required

• `Optional` **required**: *undefined* \| *boolean*

Defined in: [system/core/backend/src/entities/Attribute.ts:47](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/Attribute.ts#L47)

___

### slug

• `Optional` **slug**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[slug](backend.basepageentity.md#slug)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/BasePageEntity.ts#L16)

___

### type

• **type**: *radio* \| *checkbox*

Defined in: [system/core/backend/src/entities/Attribute.ts:39](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/Attribute.ts#L39)

___

### updateDate

• **updateDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[updateDate](backend.basepageentity.md#updatedate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:32](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/BasePageEntity.ts#L32)

## Accessors

### values

• get **values**(): [*AttributeValue*](backend.attributevalue.md)[]

**Returns:** [*AttributeValue*](backend.attributevalue.md)[]

Defined in: [system/core/backend/src/entities/Attribute.ts:26](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/Attribute.ts#L26)

• set **values**(`data`: [*AttributeValue*](backend.attributevalue.md)[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*AttributeValue*](backend.attributevalue.md)[] |

**Returns:** *void*

Defined in: [system/core/backend/src/entities/Attribute.ts:30](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/entities/Attribute.ts#L30)
