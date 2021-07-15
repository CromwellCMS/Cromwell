[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / Product

# Class: Product

[backend](../modules/backend.md).Product

## Hierarchy

* [*BasePageEntity*](backend.basepageentity.md)

  ↳ **Product**

## Implements

* *TProduct*

## Table of contents

### Constructors

- [constructor](backend.product.md#constructor)

### Properties

- [averageRating](backend.product.md#averagerating)
- [categories](backend.product.md#categories)
- [createDate](backend.product.md#createdate)
- [description](backend.product.md#description)
- [descriptionDelta](backend.product.md#descriptiondelta)
- [id](backend.product.md#id)
- [images](backend.product.md#images)
- [isEnabled](backend.product.md#isenabled)
- [mainImage](backend.product.md#mainimage)
- [name](backend.product.md#name)
- [oldPrice](backend.product.md#oldprice)
- [pageDescription](backend.product.md#pagedescription)
- [pageTitle](backend.product.md#pagetitle)
- [price](backend.product.md#price)
- [reviews](backend.product.md#reviews)
- [reviewsCount](backend.product.md#reviewscount)
- [sku](backend.product.md#sku)
- [slug](backend.product.md#slug)
- [updateDate](backend.product.md#updatedate)
- [views](backend.product.md#views)

### Accessors

- [attributes](backend.product.md#attributes)

## Constructors

### constructor

\+ **new Product**(): [*Product*](backend.product.md)

**Returns:** [*Product*](backend.product.md)

Inherited from: [BasePageEntity](backend.basepageentity.md)

## Properties

### averageRating

• `Optional` **averageRating**: *undefined* \| *number*

! Not real columns, workaround to make SELECT count reviews:
https://github.com/CromwellCMS/Cromwell/blob/9eb541b1be060f792abbf4f7133071099a8633f2/system/core/backend/src/repositories/ProductRepository.ts#L39-L45

Defined in: [system/core/backend/src/entities/Product.ts:80](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L80)

___

### categories

• `Optional` **categories**: *undefined* \| TProductCategory[]

Defined in: [system/core/backend/src/entities/Product.ts:22](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L22)

___

### createDate

• **createDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[createDate](backend.basepageentity.md#createdate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:28](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/BasePageEntity.ts#L28)

___

### description

• `Optional` **description**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Product.ts:48](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L48)

___

### descriptionDelta

• `Optional` **descriptionDelta**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Product.ts:52](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L52)

___

### id

• **id**: *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[id](backend.basepageentity.md#id)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/BasePageEntity.ts#L12)

___

### images

• `Optional` **images**: *undefined* \| *string*[]

Defined in: [system/core/backend/src/entities/Product.ts:44](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L44)

___

### isEnabled

• `Optional` **isEnabled**: *undefined* \| *boolean*

Inherited from: [BasePageEntity](backend.basepageentity.md).[isEnabled](backend.basepageentity.md#isenabled)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:36](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/BasePageEntity.ts#L36)

___

### mainImage

• `Optional` **mainImage**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Product.ts:40](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L40)

___

### name

• `Optional` **name**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Product.ts:18](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L18)

___

### oldPrice

• `Optional` **oldPrice**: *undefined* \| *number*

Defined in: [system/core/backend/src/entities/Product.ts:31](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L31)

___

### pageDescription

• `Optional` **pageDescription**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[pageDescription](backend.basepageentity.md#pagedescription)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:24](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/BasePageEntity.ts#L24)

___

### pageTitle

• `Optional` **pageTitle**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[pageTitle](backend.basepageentity.md#pagetitle)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:20](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/BasePageEntity.ts#L20)

___

### price

• `Optional` **price**: *undefined* \| *number*

Defined in: [system/core/backend/src/entities/Product.ts:27](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L27)

___

### reviews

• `Optional` **reviews**: *undefined* \| TProductReview[]

Defined in: [system/core/backend/src/entities/Product.ts:57](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L57)

___

### reviewsCount

• `Optional` **reviewsCount**: *undefined* \| *number*

Defined in: [system/core/backend/src/entities/Product.ts:83](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L83)

___

### sku

• `Optional` **sku**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Product.ts:36](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L36)

___

### slug

• `Optional` **slug**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[slug](backend.basepageentity.md#slug)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/BasePageEntity.ts#L16)

___

### updateDate

• **updateDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[updateDate](backend.basepageentity.md#updatedate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:32](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/BasePageEntity.ts#L32)

___

### views

• `Optional` **views**: *undefined* \| *number*

Defined in: [system/core/backend/src/entities/Product.ts:73](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L73)

## Accessors

### attributes

• get **attributes**(): *undefined* \| [*AttributeInstance*](backend.attributeinstance.md)[]

**Returns:** *undefined* \| [*AttributeInstance*](backend.attributeinstance.md)[]

Defined in: [system/core/backend/src/entities/Product.ts:60](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L60)

• set **attributes**(`data`: *undefined* \| [*AttributeInstance*](backend.attributeinstance.md)[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *undefined* \| [*AttributeInstance*](backend.attributeinstance.md)[] |

**Returns:** *void*

Defined in: [system/core/backend/src/entities/Product.ts:64](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/entities/Product.ts#L64)
