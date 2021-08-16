[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / ProductRepository

# Class: ProductRepository

[backend](../modules/backend.md).ProductRepository

## Hierarchy

- [`BaseRepository`](./backend.BaseRepository.md)<[`Product`](./backend.Product.md)\>

  ↳ **`ProductRepository`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [dbType](#dbtype)

### Methods

- [applyAndGetPagedProducts](#applyandgetpagedproducts)
- [applyDeleteMany](#applydeletemany)
- [applyGetProductRating](#applygetproductrating)
- [applyGetProductViews](#applygetproductviews)
- [applyProductFilter](#applyproductfilter)
- [createEntity](#createentity)
- [createProduct](#createproduct)
- [deleteEntity](#deleteentity)
- [deleteMany](#deletemany)
- [deleteManyFilteredProducts](#deletemanyfilteredproducts)
- [deleteProduct](#deleteproduct)
- [getAll](#getall)
- [getById](#getbyid)
- [getBySlug](#getbyslug)
- [getFilteredProducts](#getfilteredproducts)
- [getPaged](#getpaged)
- [getProductById](#getproductbyid)
- [getProductBySlug](#getproductbyslug)
- [getProductRating](#getproductrating)
- [getProducts](#getproducts)
- [getProductsFromCategory](#getproductsfromcategory)
- [getReviewsOfProduct](#getreviewsofproduct)
- [getSqlBoolStr](#getsqlboolstr)
- [getSqlLike](#getsqllike)
- [handleProductInput](#handleproductinput)
- [quote](#quote)
- [updateEntity](#updateentity)
- [updateProduct](#updateproduct)

## Constructors

### constructor

• **new ProductRepository**()

#### Overrides

[BaseRepository](./backend.BaseRepository.md).[constructor](./backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L35)

## Properties

### dbType

• **dbType**: ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"``

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[dbType](./backend.BaseRepository.md#dbtype)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L11)

## Methods

### applyAndGetPagedProducts

▸ **applyAndGetPagedProducts**(`qb`, `params?`): `Promise`<`TPagedList`<`TProduct`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`TProduct`\> |
| `params?` | `TPagedParams`<`TProduct`\> |

#### Returns

`Promise`<`TPagedList`<`TProduct`\>\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:55](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L55)

___

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`Product`](./backend.Product.md)\> \| `DeleteQueryBuilder`<[`Product`](./backend.Product.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[applyDeleteMany](./backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L94)

___

### applyGetProductRating

▸ **applyGetProductRating**(`qb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`TProduct`\> |

#### Returns

`void`

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L39)

___

### applyGetProductViews

▸ **applyGetProductViews**(`qb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`TProduct`\> |

#### Returns

`void`

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L48)

___

### applyProductFilter

▸ **applyProductFilter**(`qb`, `filterParams?`, `categoryId?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`Product`](./backend.Product.md)\> \| `DeleteQueryBuilder`<[`Product`](./backend.Product.md)\> |
| `filterParams?` | [`ProductFilterInput`](./backend.ProductFilterInput.md) |
| `categoryId?` | `string` |

#### Returns

`void`

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:201](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L201)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`Product`](./backend.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`Product`](./backend.Product.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`Product`](./backend.Product.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[createEntity](./backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L56)

___

### createProduct

▸ **createProduct**(`createProduct`, `id?`): `Promise`<[`Product`](./backend.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createProduct` | `TProductInput` |
| `id?` | `string` |

#### Returns

`Promise`<[`Product`](./backend.Product.md)\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:122](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L122)

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

[BaseRepository](./backend.BaseRepository.md).[deleteEntity](./backend.BaseRepository.md#deleteentity)

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

[BaseRepository](./backend.BaseRepository.md).[deleteMany](./backend.BaseRepository.md#deletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:110](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L110)

___

### deleteManyFilteredProducts

▸ **deleteManyFilteredProducts**(`input`, `filterParams?`): `Promise`<`undefined` \| `boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | [`ProductFilterInput`](./backend.ProductFilterInput.md) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:308](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L308)

___

### deleteProduct

▸ **deleteProduct**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:155](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L155)

___

### getAll

▸ **getAll**(): `Promise`<[`Product`](./backend.Product.md)[]\>

#### Returns

`Promise`<[`Product`](./backend.Product.md)[]\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getAll](./backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L31)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`Product`](./backend.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Product`](./backend.Product.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getById](./backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L36)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`Product`](./backend.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Product`](./backend.Product.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getBySlug](./backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L46)

___

### getFilteredProducts

▸ **getFilteredProducts**(`pagedParams?`, `filterParams?`, `categoryId?`): `Promise`<`TFilteredProductList`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | [`PagedParamsInput`](./backend.PagedParamsInput.md)<`TProduct`\> |
| `filterParams?` | [`ProductFilterInput`](./backend.ProductFilterInput.md) |
| `categoryId?` | `string` |

#### Returns

`Promise`<`TFilteredProductList`\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:261](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L261)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`Product`](./backend.Product.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`Product`](./backend.Product.md)\> |

#### Returns

`Promise`<`TPagedList`<[`Product`](./backend.Product.md)\>\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getPaged](./backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L25)

___

### getProductById

▸ **getProductById**(`id`): `Promise`<`undefined` \| [`Product`](./backend.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| [`Product`](./backend.Product.md)\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L76)

___

### getProductBySlug

▸ **getProductBySlug**(`slug`): `Promise`<`undefined` \| [`Product`](./backend.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<`undefined` \| [`Product`](./backend.Product.md)\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:83](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L83)

___

### getProductRating

▸ **getProductRating**(`productId`): `Promise`<`TProductRating`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

#### Returns

`Promise`<`TProductRating`\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:185](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L185)

___

### getProducts

▸ **getProducts**(`params?`): `Promise`<`TPagedList`<`TProduct`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<`TProduct`\> |

#### Returns

`Promise`<`TPagedList`<`TProduct`\>\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:70](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L70)

___

### getProductsFromCategory

▸ **getProductsFromCategory**(`categoryId`, `params?`): `Promise`<`TPagedList`<`TProduct`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `categoryId` | `string` |
| `params?` | `TPagedParams`<`TProduct`\> |

#### Returns

`Promise`<`TPagedList`<`TProduct`\>\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:168](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L168)

___

### getReviewsOfProduct

▸ **getReviewsOfProduct**(`productId`, `params?`): `Promise`<`TPagedList`<`TProductReview`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `params?` | `TPagedParams`<`TProductReview`\> |

#### Returns

`Promise`<`TPagedList`<`TProductReview`\>\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:176](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L176)

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

[BaseRepository](./backend.BaseRepository.md).[getSqlBoolStr](./backend.BaseRepository.md#getsqlboolstr)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L21)

___

### getSqlLike

▸ **getSqlLike**(): ``"ILIKE"`` \| ``"LIKE"``

#### Returns

``"ILIKE"`` \| ``"LIKE"``

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getSqlLike](./backend.BaseRepository.md#getsqllike)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L22)

___

### handleProductInput

▸ **handleProductInput**(`product`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | [`Product`](./backend.Product.md) |
| `input` | `TProductInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:90](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L90)

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

[BaseRepository](./backend.BaseRepository.md).[quote](./backend.BaseRepository.md#quote)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

___

### updateEntity

▸ **updateEntity**(`id`, `input`): `Promise`<[`Product`](./backend.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`Product`](./backend.Product.md) |

#### Returns

`Promise`<[`Product`](./backend.Product.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[updateEntity](./backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:68](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L68)

___

### updateProduct

▸ **updateProduct**(`id`, `updateProduct`): `Promise`<[`Product`](./backend.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updateProduct` | `TProductInput` |

#### Returns

`Promise`<[`Product`](./backend.Product.md)\>

#### Defined in

[system/core/backend/src/repositories/product.repository.ts:137](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product.repository.ts#L137)
