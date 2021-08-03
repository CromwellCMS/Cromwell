[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / ProductCategoryRepository

# Class: ProductCategoryRepository

[backend](../modules/backend.md).ProductCategoryRepository

## Hierarchy

- `TreeRepository`<[`ProductCategory`](backend.ProductCategory.md)\>

  ↳ **`ProductCategoryRepository`**

## Table of contents

### Constructors

- [constructor](backend.ProductCategoryRepository.md#constructor)

### Methods

- [applyCategoryFilter](backend.ProductCategoryRepository.md#applycategoryfilter)
- [createProductCategory](backend.ProductCategoryRepository.md#createproductcategory)
- [deleteManyCategories](backend.ProductCategoryRepository.md#deletemanycategories)
- [deleteProductCategory](backend.ProductCategoryRepository.md#deleteproductcategory)
- [getCategoriesOfProduct](backend.ProductCategoryRepository.md#getcategoriesofproduct)
- [getChildCategories](backend.ProductCategoryRepository.md#getchildcategories)
- [getFilteredCategories](backend.ProductCategoryRepository.md#getfilteredcategories)
- [getParentCategory](backend.ProductCategoryRepository.md#getparentcategory)
- [getProductCategories](backend.ProductCategoryRepository.md#getproductcategories)
- [getProductCategoriesById](backend.ProductCategoryRepository.md#getproductcategoriesbyid)
- [getProductCategoryById](backend.ProductCategoryRepository.md#getproductcategorybyid)
- [getProductCategoryBySlug](backend.ProductCategoryRepository.md#getproductcategorybyslug)
- [getRootCategories](backend.ProductCategoryRepository.md#getrootcategories)
- [handleProductCategoryInput](backend.ProductCategoryRepository.md#handleproductcategoryinput)
- [updateProductCategory](backend.ProductCategoryRepository.md#updateproductcategory)

## Constructors

### constructor

• **new ProductCategoryRepository**()

#### Inherited from

TreeRepository<ProductCategory\>.constructor

## Methods

### applyCategoryFilter

▸ **applyCategoryFilter**(`qb`, `filterParams?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`ProductCategory`](backend.ProductCategory.md)\> \| `DeleteQueryBuilder`<[`ProductCategory`](backend.ProductCategory.md)\> |
| `filterParams?` | [`ProductCategoryFilterInput`](backend.ProductCategoryFilterInput.md) |

#### Returns

`void`

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:269](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L269)

___

### createProductCategory

▸ **createProductCategory**(`createProductCategory`, `id?`): `Promise`<[`ProductCategory`](backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createProductCategory` | [`CreateProductCategory`](backend.CreateProductCategory.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`ProductCategory`](backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:144](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L144)

___

### deleteManyCategories

▸ **deleteManyCategories**(`input`, `filterParams?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | [`ProductCategoryFilterInput`](backend.ProductCategoryFilterInput.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:210](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L210)

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

[system/core/backend/src/repositories/product-category.repository.ts:169](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L169)

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

[system/core/backend/src/repositories/product-category.repository.ts:232](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L232)

___

### getChildCategories

▸ **getChildCategories**(`category`): `Promise`<[`ProductCategory`](backend.ProductCategory.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `category` | [`ProductCategory`](backend.ProductCategory.md) |

#### Returns

`Promise`<[`ProductCategory`](backend.ProductCategory.md)[]\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:242](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L242)

___

### getFilteredCategories

▸ **getFilteredCategories**(`pagedParams?`, `filterParams?`): `Promise`<`TPagedList`<`TProductCategory`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | [`PagedParamsInput`](backend.PagedParamsInput.md)<[`ProductCategory`](backend.ProductCategory.md)\> |
| `filterParams?` | [`ProductCategoryFilterInput`](backend.ProductCategoryFilterInput.md) |

#### Returns

`Promise`<`TPagedList`<`TProductCategory`\>\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:282](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L282)

___

### getParentCategory

▸ **getParentCategory**(`category`): `Promise`<`undefined` \| ``null`` \| [`ProductCategory`](backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `category` | [`ProductCategory`](backend.ProductCategory.md) |

#### Returns

`Promise`<`undefined` \| ``null`` \| [`ProductCategory`](backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:247](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L247)

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

[system/core/backend/src/repositories/product-category.repository.ts:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L26)

___

### getProductCategoriesById

▸ **getProductCategoriesById**(`ids`): `Promise`<[`ProductCategory`](backend.ProductCategory.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `string`[] |

#### Returns

`Promise`<[`ProductCategory`](backend.ProductCategory.md)[]\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L33)

___

### getProductCategoryById

▸ **getProductCategoryById**(`id`): `Promise`<[`ProductCategory`](backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<[`ProductCategory`](backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L38)

___

### getProductCategoryBySlug

▸ **getProductCategoryBySlug**(`slug`): `Promise`<[`ProductCategory`](backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<[`ProductCategory`](backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:47](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L47)

___

### getRootCategories

▸ **getRootCategories**(): `Promise`<`TPagedList`<[`ProductCategory`](backend.ProductCategory.md)\>\>

#### Returns

`Promise`<`TPagedList`<[`ProductCategory`](backend.ProductCategory.md)\>\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:252](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L252)

___

### handleProductCategoryInput

▸ **handleProductCategoryInput**(`productCategory`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategory` | [`ProductCategory`](backend.ProductCategory.md) |
| `input` | `TProductCategoryInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L56)

___

### updateProductCategory

▸ **updateProductCategory**(`id`, `updateProductCategory`): `Promise`<[`ProductCategory`](backend.ProductCategory.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updateProductCategory` | [`UpdateProductCategory`](backend.UpdateProductCategory.md) |

#### Returns

`Promise`<[`ProductCategory`](backend.ProductCategory.md)\>

#### Defined in

[system/core/backend/src/repositories/product-category.repository.ts:157](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/product-category.repository.ts#L157)
