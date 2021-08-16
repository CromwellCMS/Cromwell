[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / ProductCategoryRepository

# Class: ProductCategoryRepository

[backend](../modules/backend.md).ProductCategoryRepository

## Hierarchy

- `TreeRepository`<[`ProductCategory`](./backend.ProductCategory.md)\>

  ↳ **`ProductCategoryRepository`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [dbType](#dbtype)

### Methods

- [applyCategoryFilter](#applycategoryfilter)
- [createProductCategory](#createproductcategory)
- [deleteManyCategories](#deletemanycategories)
- [deleteProductCategory](#deleteproductcategory)
- [getCategoriesOfProduct](#getcategoriesofproduct)
- [getChildCategories](#getchildcategories)
- [getFilteredCategories](#getfilteredcategories)
- [getParentCategory](#getparentcategory)
- [getProductCategories](#getproductcategories)
- [getProductCategoriesById](#getproductcategoriesbyid)
- [getProductCategoryById](#getproductcategorybyid)
- [getProductCategoryBySlug](#getproductcategorybyslug)
- [getRootCategories](#getrootcategories)
- [getSqlBoolStr](#getsqlboolstr)
- [getSqlLike](#getsqllike)
- [handleProductCategoryInput](#handleproductcategoryinput)
- [quote](#quote)
- [updateProductCategory](#updateproductcategory)

## Constructors

### constructor

• **new ProductCategoryRepository**()

#### Overrides

TreeRepository&lt;ProductCategory\&gt;.constructor

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:45](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L45)

## Properties

### dbType

• **dbType**: ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"``

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:43](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L43)

## Methods

### applyCategoryFilter

▸ **applyCategoryFilter**(`qb`, `filterParams?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`ProductCategory`](./backend.ProductCategory.md)\> \| `DeleteQueryBuilder`<[`ProductCategory`](./backend.ProductCategory.md)\> |
| `filterParams?` | [`ProductCategoryFilterInput`](./backend.ProductCategoryFilterInput.md) |

#### Returns

`void`

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:304](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L304)

___

### createProductCategory

▸ **createProductCategory**(`createProductCategory`, `id?`): `Promise`<[`ProductCategory`](./backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createProductCategory` | [`CreateProductCategory`](./backend.CreateProductCategory.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`ProductCategory`](./backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:172](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L172)

___

### deleteManyCategories

▸ **deleteManyCategories**(`input`, `filterParams?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | [`ProductCategoryFilterInput`](./backend.ProductCategoryFilterInput.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:238](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L238)

___

### deleteProductCategory

▸ **deleteProductCategory**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:197](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L197)

___

### getCategoriesOfProduct

▸ **getCategoriesOfProduct**(`productId`, `params?`): `Promise`<`TProductCategory`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `params?` | `TPagedParams`<`TProductCategory`\> |

#### Returns

`Promise`<`TProductCategory`[]\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:264](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L264)

___

### getChildCategories

▸ **getChildCategories**(`category`): `Promise`<[`ProductCategory`](./backend.ProductCategory.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `category` | [`ProductCategory`](./backend.ProductCategory.md) |

#### Returns

`Promise`<[`ProductCategory`](./backend.ProductCategory.md)[]\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:274](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L274)

___

### getFilteredCategories

▸ **getFilteredCategories**(`pagedParams?`, `filterParams?`): `Promise`<`TPagedList`<`TProductCategory`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | [`PagedParamsInput`](./backend.PagedParamsInput.md)<[`ProductCategory`](./backend.ProductCategory.md)\> |
| `filterParams?` | [`ProductCategoryFilterInput`](./backend.ProductCategoryFilterInput.md) |

#### Returns

`Promise`<`TPagedList`<`TProductCategory`\>\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:321](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L321)

___

### getParentCategory

▸ **getParentCategory**(`category`): `Promise`<`undefined` \| ``null`` \| [`ProductCategory`](./backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `category` | [`ProductCategory`](./backend.ProductCategory.md) |

#### Returns

`Promise`<`undefined` \| ``null`` \| [`ProductCategory`](./backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:279](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L279)

___

### getProductCategories

▸ **getProductCategories**(`params`): `Promise`<`TPagedList`<`TProductCategory`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TPagedParams`<`TProductCategory`\> |

#### Returns

`Promise`<`TPagedList`<`TProductCategory`\>\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:55](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L55)

___

### getProductCategoriesById

▸ **getProductCategoriesById**(`ids`): `Promise`<[`ProductCategory`](./backend.ProductCategory.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `string`[] |

#### Returns

`Promise`<[`ProductCategory`](./backend.ProductCategory.md)[]\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:62](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L62)

___

### getProductCategoryById

▸ **getProductCategoryById**(`id`): `Promise`<[`ProductCategory`](./backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<[`ProductCategory`](./backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:67](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L67)

___

### getProductCategoryBySlug

▸ **getProductCategoryBySlug**(`slug`): `Promise`<[`ProductCategory`](./backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<[`ProductCategory`](./backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L76)

___

### getRootCategories

▸ **getRootCategories**(): `Promise`<`TPagedList`<[`ProductCategory`](./backend.ProductCategory.md)\>\>

#### Returns

`Promise`<`TPagedList`<[`ProductCategory`](./backend.ProductCategory.md)\>\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:284](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L284)

___

### getSqlBoolStr

▸ **getSqlBoolStr**(`b`): ``"true"`` \| ``"false"`` \| ``"1"`` \| ``"0"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `boolean` |

#### Returns

``"true"`` \| ``"false"`` \| ``"1"`` \| ``"0"``

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:51](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L51)

___

### getSqlLike

▸ **getSqlLike**(): ``"ILIKE"`` \| ``"LIKE"``

#### Returns

``"ILIKE"`` \| ``"LIKE"``

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:52](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L52)

___

### handleProductCategoryInput

▸ **handleProductCategoryInput**(`productCategory`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategory` | [`ProductCategory`](./backend.ProductCategory.md) |
| `input` | `TProductCategoryInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:85](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L85)

___

### quote

▸ **quote**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:53](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L53)

___

### updateProductCategory

▸ **updateProductCategory**(`id`, `updateProductCategory`): `Promise`<[`ProductCategory`](./backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updateProductCategory` | [`UpdateProductCategory`](./backend.UpdateProductCategory.md) |

#### Returns

`Promise`<[`ProductCategory`](./backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:185](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L185)
