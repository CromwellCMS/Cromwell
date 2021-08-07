[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / ProductReviewRepository

# Class: ProductReviewRepository

[backend](../modules/backend.md).ProductReviewRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`ProductReview`](backend.ProductReview.md)\>

  ↳ **`ProductReviewRepository`**

## Table of contents

### Constructors

- [constructor](backend.ProductReviewRepository.md#constructor)

### Properties

- [dbType](backend.ProductReviewRepository.md#dbtype)

### Methods

- [applyDeleteMany](backend.ProductReviewRepository.md#applydeletemany)
- [applyProductReviewFilter](backend.ProductReviewRepository.md#applyproductreviewfilter)
- [createEntity](backend.ProductReviewRepository.md#createentity)
- [createProductReview](backend.ProductReviewRepository.md#createproductreview)
- [deleteEntity](backend.ProductReviewRepository.md#deleteentity)
- [deleteMany](backend.ProductReviewRepository.md#deletemany)
- [deleteManyFilteredProductReviews](backend.ProductReviewRepository.md#deletemanyfilteredproductreviews)
- [deleteProductReview](backend.ProductReviewRepository.md#deleteproductreview)
- [getAll](backend.ProductReviewRepository.md#getall)
- [getById](backend.ProductReviewRepository.md#getbyid)
- [getBySlug](backend.ProductReviewRepository.md#getbyslug)
- [getFilteredProductReviews](backend.ProductReviewRepository.md#getfilteredproductreviews)
- [getPaged](backend.ProductReviewRepository.md#getpaged)
- [getProductReview](backend.ProductReviewRepository.md#getproductreview)
- [getProductReviews](backend.ProductReviewRepository.md#getproductreviews)
- [getSqlBoolStr](backend.ProductReviewRepository.md#getsqlboolstr)
- [getSqlLike](backend.ProductReviewRepository.md#getsqllike)
- [handleProductReviewInput](backend.ProductReviewRepository.md#handleproductreviewinput)
- [quote](backend.ProductReviewRepository.md#quote)
- [updateEntity](backend.ProductReviewRepository.md#updateentity)
- [updateProductReview](backend.ProductReviewRepository.md#updateproductreview)

## Constructors

### constructor

• **new ProductReviewRepository**(`EntityClass`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `EntityClass` | (...`args`: `any`[]) => [`ProductReview`](backend.ProductReview.md) & { `id?`: `string`  } |

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L13)

## Properties

### dbType

• **dbType**: ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"``

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[dbType](backend.BaseRepository.md#dbtype)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L11)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`ProductReview`](backend.ProductReview.md)\> \| `DeleteQueryBuilder`<[`ProductReview`](backend.ProductReview.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[applyDeleteMany](backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L94)

___

### applyProductReviewFilter

▸ **applyProductReviewFilter**(`qb`, `filterParams?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`TProductReview`\> \| `DeleteQueryBuilder`<`TProductReview`\> |
| `filterParams?` | [`ProductReviewFilter`](backend.ProductReviewFilter.md) |

#### Returns

`void`

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:93](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L93)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`ProductReview`](backend.ProductReview.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ProductReview`](backend.ProductReview.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`ProductReview`](backend.ProductReview.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[createEntity](backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L56)

___

### createProductReview

▸ **createProductReview**(`createProductReview`, `id?`): `Promise`<`TProductReview`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createProductReview` | `TProductReviewInput` |
| `id?` | `string` |

#### Returns

`Promise`<`TProductReview`\>

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:54](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L54)

___

### deleteEntity

▸ **deleteEntity**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[deleteEntity](backend.BaseRepository.md#deleteentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:83](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L83)

___

### deleteMany

▸ **deleteMany**(`input`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[deleteMany](backend.BaseRepository.md#deletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:110](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L110)

___

### deleteManyFilteredProductReviews

▸ **deleteManyFilteredProductReviews**(`input`, `filterParams?`): `Promise`<`undefined` \| `boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | [`ProductReviewFilter`](backend.ProductReviewFilter.md) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:138](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L138)

___

### deleteProductReview

▸ **deleteProductReview**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:82](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L82)

___

### getAll

▸ **getAll**(): `Promise`<[`ProductReview`](backend.ProductReview.md)[]\>

#### Returns

`Promise`<[`ProductReview`](backend.ProductReview.md)[]\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getAll](backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L31)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`ProductReview`](backend.ProductReview.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`ProductReview`](backend.ProductReview.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getById](backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L36)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`ProductReview`](backend.ProductReview.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`ProductReview`](backend.ProductReview.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getBySlug](backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L46)

___

### getFilteredProductReviews

▸ **getFilteredProductReviews**(`pagedParams?`, `filterParams?`): `Promise`<`TPagedList`<`TProductReview`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | [`PagedParamsInput`](backend.PagedParamsInput.md)<`TProductReview`\> |
| `filterParams?` | [`ProductReviewFilter`](backend.ProductReviewFilter.md) |

#### Returns

`Promise`<`TPagedList`<`TProductReview`\>\>

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:130](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L130)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`ProductReview`](backend.ProductReview.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`ProductReview`](backend.ProductReview.md)\> |

#### Returns

`Promise`<`TPagedList`<[`ProductReview`](backend.ProductReview.md)\>\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getPaged](backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L25)

___

### getProductReview

▸ **getProductReview**(`id`): `Promise`<[`ProductReview`](backend.ProductReview.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<[`ProductReview`](backend.ProductReview.md)\>

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L23)

___

### getProductReviews

▸ **getProductReviews**(`params`): `Promise`<`TPagedList`<`TProductReview`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TPagedParams`<`TProductReview`\> |

#### Returns

`Promise`<`TPagedList`<`TProductReview`\>\>

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L19)

___

### getSqlBoolStr

▸ **getSqlBoolStr**(`b`): ``"true"`` \| ``"false"`` \| ``"1"`` \| ``"0"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `boolean` |

#### Returns

``"true"`` \| ``"false"`` \| ``"1"`` \| ``"0"``

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getSqlBoolStr](backend.BaseRepository.md#getsqlboolstr)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L21)

___

### getSqlLike

▸ **getSqlLike**(): ``"ILIKE"`` \| ``"LIKE"``

#### Returns

``"ILIKE"`` \| ``"LIKE"``

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getSqlLike](backend.BaseRepository.md#getsqllike)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L22)

___

### handleProductReviewInput

▸ **handleProductReviewInput**(`productReview`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productReview` | [`ProductReview`](backend.ProductReview.md) |
| `input` | `TProductReviewInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:32](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L32)

___

### quote

▸ **quote**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[quote](backend.BaseRepository.md#quote)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

___

### updateEntity

▸ **updateEntity**(`id`, `input`): `Promise`<[`ProductReview`](backend.ProductReview.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`ProductReview`](backend.ProductReview.md) |

#### Returns

`Promise`<[`ProductReview`](backend.ProductReview.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[updateEntity](backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:68](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L68)

___

### updateProductReview

▸ **updateProductReview**(`id`, `updateProductReview`): `Promise`<[`ProductReview`](backend.ProductReview.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updateProductReview` | `TProductReviewInput` |

#### Returns

`Promise`<[`ProductReview`](backend.ProductReview.md)\>

#### Defined in

[system/core/backend/src/repositories/product-review.repository.ts:67](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-review.repository.ts#L67)
