[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / Product

# Class: Product

[backend](../modules/backend.md).Product

## Hierarchy

- [`BasePageEntity`](./backend.BasePageEntity.md)

  ↳ **`Product`**

## Implements

- `TProduct`

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [averageRating](#averagerating)
- [categories](#categories)
- [createDate](#createdate)
- [description](#description)
- [descriptionDelta](#descriptiondelta)
- [id](#id)
- [images](#images)
- [isEnabled](#isenabled)
- [mainImage](#mainimage)
- [name](#name)
- [oldPrice](#oldprice)
- [pageDescription](#pagedescription)
- [pageTitle](#pagetitle)
- [price](#price)
- [reviews](#reviews)
- [reviewsCount](#reviewscount)
- [sku](#sku)
- [slug](#slug)
- [updateDate](#updatedate)
- [views](#views)

### Accessors

- [attributes](#attributes)

## Constructors

### constructor

• **new Product**()

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[constructor](./backend.BasePageEntity.md#constructor)

## Properties

### averageRating

• `Optional` **averageRating**: `number`

! Not real columns, workaround to make SELECT count reviews:
https://github.com/CromwellCMS/Cromwell/blob/9eb541b1be060f792abbf4f7133071099a8633f2/system/core/backend/src/repositories/ProductRepository.ts#L39-L45

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:79](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L79)

___

### categories

• `Optional` **categories**: `TProductCategory`[]

#### Implementation of

TProduct.categories

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L21)

___

### createDate

• **createDate**: `Date`

#### Implementation of

TProduct.createDate

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[createDate](./backend.BasePageEntity.md#createdate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:29](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L29)

___

### description

• `Optional` **description**: `string`

#### Implementation of

TProduct.description

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:47](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L47)

___

### descriptionDelta

• `Optional` **descriptionDelta**: `string`

#### Implementation of

TProduct.descriptionDelta

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:51](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L51)

___

### id

• **id**: `string`

#### Implementation of

TProduct.id

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[id](./backend.BasePageEntity.md#id)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L12)

___

### images

• `Optional` **images**: `string`[]

#### Implementation of

TProduct.images

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:43](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L43)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TProduct.isEnabled

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[isEnabled](./backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L38)

___

### mainImage

• `Optional` **mainImage**: `string`

#### Implementation of

TProduct.mainImage

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:39](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L39)

___

### name

• `Optional` **name**: `string`

#### Implementation of

TProduct.name

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L17)

___

### oldPrice

• `Optional` **oldPrice**: `number`

#### Implementation of

TProduct.oldPrice

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:30](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L30)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TProduct.pageDescription

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[pageDescription](./backend.BasePageEntity.md#pagedescription)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L24)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TProduct.pageTitle

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[pageTitle](./backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L20)

___

### price

• `Optional` **price**: `number`

#### Implementation of

TProduct.price

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L26)

___

### reviews

• `Optional` **reviews**: `TProductReview`[]

#### Implementation of

TProduct.reviews

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L56)

___

### reviewsCount

• `Optional` **reviewsCount**: `number`

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:82](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L82)

___

### sku

• `Optional` **sku**: `string`

#### Implementation of

TProduct.sku

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L35)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TProduct.slug

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[slug](./backend.BasePageEntity.md#slug)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L16)

___

### updateDate

• **updateDate**: `Date`

#### Implementation of

TProduct.updateDate

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[updateDate](./backend.BasePageEntity.md#updatedate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L34)

___

### views

• `Optional` **views**: `number`

#### Implementation of

TProduct.views

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:72](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L72)

## Accessors

### attributes

• `get` **attributes**(): `undefined` \| [`AttributeInstance`](./backend.AttributeInstance.md)[]

#### Returns

`undefined` \| [`AttributeInstance`](./backend.AttributeInstance.md)[]

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:59](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L59)

• `set` **attributes**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `undefined` \| [`AttributeInstance`](./backend.AttributeInstance.md)[] |

#### Returns

`void`

#### Defined in

[system/core/backend/src/models/entities/product.entity.ts:63](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/product.entity.ts#L63)
