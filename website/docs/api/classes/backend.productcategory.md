[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / ProductCategory

# Class: ProductCategory

[backend](../modules/backend.md).ProductCategory

## Hierarchy

- [`BasePageEntity`](backend.BasePageEntity.md)

  ↳ **`ProductCategory`**

## Implements

- `TProductCategory`

## Table of contents

### Constructors

- [constructor](backend.ProductCategory.md#constructor)

### Properties

- [children](backend.ProductCategory.md#children)
- [createDate](backend.ProductCategory.md#createdate)
- [description](backend.ProductCategory.md#description)
- [descriptionDelta](backend.ProductCategory.md#descriptiondelta)
- [id](backend.ProductCategory.md#id)
- [isEnabled](backend.ProductCategory.md#isenabled)
- [mainImage](backend.ProductCategory.md#mainimage)
- [name](backend.ProductCategory.md#name)
- [pageDescription](backend.ProductCategory.md#pagedescription)
- [pageTitle](backend.ProductCategory.md#pagetitle)
- [parent](backend.ProductCategory.md#parent)
- [products](backend.ProductCategory.md#products)
- [slug](backend.ProductCategory.md#slug)
- [updateDate](backend.ProductCategory.md#updatedate)

## Constructors

### constructor

• **new ProductCategory**()

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[constructor](backend.BasePageEntity.md#constructor)

## Properties

### children

• `Optional` **children**: [`ProductCategory`](backend.ProductCategory.md)[]

#### Implementation of

TProductCategory.children

#### Defined in

[system/core/backend/src/models/entities/product-category.entity.ts:29](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product-category.entity.ts#L29)

___

### createDate

• **createDate**: `Date`

#### Implementation of

TProductCategory.createDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[createDate](backend.BasePageEntity.md#createdate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L27)

___

### description

• `Optional` **description**: `string`

#### Implementation of

TProductCategory.description

#### Defined in

[system/core/backend/src/models/entities/product-category.entity.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product-category.entity.ts#L22)

___

### descriptionDelta

• `Optional` **descriptionDelta**: `string`

#### Implementation of

TProductCategory.descriptionDelta

#### Defined in

[system/core/backend/src/models/entities/product-category.entity.ts:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product-category.entity.ts#L26)

___

### id

• **id**: `string`

#### Implementation of

TProductCategory.id

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[id](backend.BasePageEntity.md#id)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L11)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TProductCategory.isEnabled

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[isEnabled](backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L35)

___

### mainImage

• `Optional` **mainImage**: `string`

#### Implementation of

TProductCategory.mainImage

#### Defined in

[system/core/backend/src/models/entities/product-category.entity.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product-category.entity.ts#L18)

___

### name

• **name**: `string`

#### Implementation of

TProductCategory.name

#### Defined in

[system/core/backend/src/models/entities/product-category.entity.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product-category.entity.ts#L14)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TProductCategory.pageDescription

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageDescription](backend.BasePageEntity.md#pagedescription)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L23)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TProductCategory.pageTitle

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageTitle](backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L19)

___

### parent

• `Optional` **parent**: ``null`` \| [`ProductCategory`](backend.ProductCategory.md)

#### Implementation of

TProductCategory.parent

#### Defined in

[system/core/backend/src/models/entities/product-category.entity.ts:32](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product-category.entity.ts#L32)

___

### products

• `Optional` **products**: `TPagedList`<`TProduct`\>

#### Implementation of

TProductCategory.products

#### Defined in

[system/core/backend/src/models/entities/product-category.entity.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product-category.entity.ts#L35)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TProductCategory.slug

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[slug](backend.BasePageEntity.md#slug)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L15)

___

### updateDate

• **updateDate**: `Date`

#### Implementation of

TProductCategory.updateDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[updateDate](backend.BasePageEntity.md#updatedate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L31)
