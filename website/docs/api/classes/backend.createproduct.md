[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / CreateProduct

# Class: CreateProduct

[backend](../modules/backend.md).CreateProduct

## Hierarchy

- [`BasePageInput`](backend.BasePageInput.md)

  ↳ **`CreateProduct`**

## Implements

- `TProductInput`

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [attributes](#attributes)
- [categoryIds](#categoryids)
- [description](#description)
- [descriptionDelta](#descriptiondelta)
- [images](#images)
- [isEnabled](#isenabled)
- [mainImage](#mainimage)
- [name](#name)
- [oldPrice](#oldprice)
- [pageDescription](#pagedescription)
- [pageTitle](#pagetitle)
- [price](#price)
- [sku](#sku)
- [slug](#slug)

## Constructors

### constructor

• **new CreateProduct**()

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[constructor](backend.BasePageInput.md#constructor)

## Properties

### attributes

• `Optional` **attributes**: [`AttributeInstance`](backend.AttributeInstance.md)[]

#### Implementation of

TProductInput.attributes

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L36)

___

### categoryIds

• **categoryIds**: `string`[]

#### Implementation of

TProductInput.categoryIds

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L12)

___

### description

• `Optional` **description**: `string`

#### Implementation of

TProductInput.description

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:30](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L30)

___

### descriptionDelta

• `Optional` **descriptionDelta**: `string`

#### Implementation of

TProductInput.descriptionDelta

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L33)

___

### images

• **images**: `string`[]

#### Implementation of

TProductInput.images

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L27)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TProductInput.isEnabled

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[isEnabled](backend.BasePageInput.md#isenabled)

#### Defined in

[system/core/backend/src/models/inputs/base-page.input.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/base-page.input.ts#L16)

___

### mainImage

• **mainImage**: `string`

#### Implementation of

TProductInput.mainImage

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L24)

___

### name

• **name**: `string`

#### Implementation of

TProductInput.name

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L9)

___

### oldPrice

• `Optional` **oldPrice**: `number`

#### Implementation of

TProductInput.oldPrice

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L18)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TProductInput.pageDescription

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[pageDescription](backend.BasePageInput.md#pagedescription)

#### Defined in

[system/core/backend/src/models/inputs/base-page.input.ts:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/base-page.input.ts#L13)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TProductInput.pageTitle

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[pageTitle](backend.BasePageInput.md#pagetitle)

#### Defined in

[system/core/backend/src/models/inputs/base-page.input.ts:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/base-page.input.ts#L10)

___

### price

• **price**: `number`

#### Implementation of

TProductInput.price

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L15)

___

### sku

• `Optional` **sku**: `string`

#### Implementation of

TProductInput.sku

#### Defined in

[system/core/backend/src/models/inputs/product.create.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/product.create.ts#L21)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TProductInput.slug

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[slug](backend.BasePageInput.md#slug)

#### Defined in

[system/core/backend/src/models/inputs/base-page.input.ts:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/base-page.input.ts#L7)
