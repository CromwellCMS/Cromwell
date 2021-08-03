[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / Attribute

# Class: Attribute

[backend](../modules/backend.md).Attribute

## Hierarchy

- [`BasePageEntity`](backend.BasePageEntity.md)

  ↳ **`Attribute`**

## Implements

- `TAttribute`

## Table of contents

### Constructors

- [constructor](backend.Attribute.md#constructor)

### Properties

- [createDate](backend.Attribute.md#createdate)
- [icon](backend.Attribute.md#icon)
- [id](backend.Attribute.md#id)
- [isEnabled](backend.Attribute.md#isenabled)
- [key](backend.Attribute.md#key)
- [pageDescription](backend.Attribute.md#pagedescription)
- [pageTitle](backend.Attribute.md#pagetitle)
- [required](backend.Attribute.md#required)
- [slug](backend.Attribute.md#slug)
- [type](backend.Attribute.md#type)
- [updateDate](backend.Attribute.md#updatedate)

### Accessors

- [values](backend.Attribute.md#values)

## Constructors

### constructor

• **new Attribute**()

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[constructor](backend.BasePageEntity.md#constructor)

## Properties

### createDate

• **createDate**: `Date`

#### Implementation of

TAttribute.createDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[createDate](backend.BasePageEntity.md#createdate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L27)

___

### icon

• `Optional` **icon**: `string`

#### Implementation of

TAttribute.icon

#### Defined in

[system/core/backend/src/models/entities/attribute.entity.ts:43](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/attribute.entity.ts#L43)

___

### id

• **id**: `string`

#### Implementation of

TAttribute.id

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[id](backend.BasePageEntity.md#id)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L11)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TAttribute.isEnabled

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[isEnabled](backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L35)

___

### key

• **key**: `string`

#### Implementation of

TAttribute.key

#### Defined in

[system/core/backend/src/models/entities/attribute.entity.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/attribute.entity.ts#L23)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TAttribute.pageDescription

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageDescription](backend.BasePageEntity.md#pagedescription)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L23)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TAttribute.pageTitle

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageTitle](backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L19)

___

### required

• `Optional` **required**: `boolean`

#### Implementation of

TAttribute.required

#### Defined in

[system/core/backend/src/models/entities/attribute.entity.ts:47](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/attribute.entity.ts#L47)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TAttribute.slug

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[slug](backend.BasePageEntity.md#slug)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L15)

___

### type

• **type**: ``"radio"`` \| ``"checkbox"``

#### Implementation of

TAttribute.type

#### Defined in

[system/core/backend/src/models/entities/attribute.entity.ts:39](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/attribute.entity.ts#L39)

___

### updateDate

• **updateDate**: `Date`

#### Implementation of

TAttribute.updateDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[updateDate](backend.BasePageEntity.md#updatedate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L31)

## Accessors

### values

• `get` **values**(): [`AttributeValue`](backend.AttributeValue.md)[]

#### Returns

[`AttributeValue`](backend.AttributeValue.md)[]

#### Defined in

[system/core/backend/src/models/entities/attribute.entity.ts:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/attribute.entity.ts#L26)

• `set` **values**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`AttributeValue`](backend.AttributeValue.md)[] |

#### Returns

`void`

#### Defined in

[system/core/backend/src/models/entities/attribute.entity.ts:30](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/attribute.entity.ts#L30)
