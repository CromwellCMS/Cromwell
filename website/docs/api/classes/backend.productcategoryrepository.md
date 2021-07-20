[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / ProductCategoryRepository

# Class: ProductCategoryRepository

[backend](../modules/backend.md).ProductCategoryRepository

## Hierarchy

* *TreeRepository*<[*ProductCategory*](backend.productcategory.md)\>

  ↳ **ProductCategoryRepository**

## Table of contents

### Constructors

- [constructor](backend.productcategoryrepository.md#constructor)

### Methods

- [applyCategoryFilter](backend.productcategoryrepository.md#applycategoryfilter)
- [createProductCategory](backend.productcategoryrepository.md#createproductcategory)
- [deleteManyCategories](backend.productcategoryrepository.md#deletemanycategories)
- [deleteProductCategory](backend.productcategoryrepository.md#deleteproductcategory)
- [getCategoriesOfProduct](backend.productcategoryrepository.md#getcategoriesofproduct)
- [getChildCategories](backend.productcategoryrepository.md#getchildcategories)
- [getFilteredCategories](backend.productcategoryrepository.md#getfilteredcategories)
- [getParentCategory](backend.productcategoryrepository.md#getparentcategory)
- [getProductCategories](backend.productcategoryrepository.md#getproductcategories)
- [getProductCategoriesById](backend.productcategoryrepository.md#getproductcategoriesbyid)
- [getProductCategoryById](backend.productcategoryrepository.md#getproductcategorybyid)
- [getProductCategoryBySlug](backend.productcategoryrepository.md#getproductcategorybyslug)
- [getRootCategories](backend.productcategoryrepository.md#getrootcategories)
- [handleProductCategoryInput](backend.productcategoryrepository.md#handleproductcategoryinput)
- [updateProductCategory](backend.productcategoryrepository.md#updateproductcategory)

## Constructors

### constructor

\+ **new ProductCategoryRepository**(): *ProductCategoryRepository*

**Returns:** *ProductCategoryRepository*

## Methods

### applyCategoryFilter

▸ **applyCategoryFilter**(`qb`: *SelectQueryBuilder*<[*ProductCategory*](backend.productcategory.md)\> \| *DeleteQueryBuilder*<[*ProductCategory*](backend.productcategory.md)\>, `filterParams?`: [*ProductCategoryFilterInput*](backend.productcategoryfilterinput.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*ProductCategory*](backend.productcategory.md)\> \| *DeleteQueryBuilder*<[*ProductCategory*](backend.productcategory.md)\> |
`filterParams?` | [*ProductCategoryFilterInput*](backend.productcategoryfilterinput.md) |

**Returns:** *void*

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:269](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L269)

___

### createProductCategory

▸ **createProductCategory**(`createProductCategory`: *CreateProductCategory*, `id?`: *string*): *Promise*<[*ProductCategory*](backend.productcategory.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`createProductCategory` | *CreateProductCategory* |
`id?` | *string* |

**Returns:** *Promise*<[*ProductCategory*](backend.productcategory.md)\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:144](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L144)

___

### deleteManyCategories

▸ **deleteManyCategories**(`input`: TDeleteManyInput, `filterParams?`: [*ProductCategoryFilterInput*](backend.productcategoryfilterinput.md)): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | [*ProductCategoryFilterInput*](backend.productcategoryfilterinput.md) |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:210](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L210)

___

### deleteProductCategory

▸ **deleteProductCategory**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:169](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L169)

___

### getCategoriesOfProduct

▸ **getCategoriesOfProduct**(`productId`: *string*, `params?`: *TPagedParams*<TProductCategory\>): *Promise*<TProductCategory[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`productId` | *string* |
`params?` | *TPagedParams*<TProductCategory\> |

**Returns:** *Promise*<TProductCategory[]\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:232](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L232)

___

### getChildCategories

▸ **getChildCategories**(`category`: [*ProductCategory*](backend.productcategory.md)): *Promise*<[*ProductCategory*](backend.productcategory.md)[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`category` | [*ProductCategory*](backend.productcategory.md) |

**Returns:** *Promise*<[*ProductCategory*](backend.productcategory.md)[]\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:242](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L242)

___

### getFilteredCategories

▸ **getFilteredCategories**(`pagedParams?`: *PagedParamsInput*<[*ProductCategory*](backend.productcategory.md)\>, `filterParams?`: [*ProductCategoryFilterInput*](backend.productcategoryfilterinput.md)): *Promise*<TPagedList<TProductCategory\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *PagedParamsInput*<[*ProductCategory*](backend.productcategory.md)\> |
`filterParams?` | [*ProductCategoryFilterInput*](backend.productcategoryfilterinput.md) |

**Returns:** *Promise*<TPagedList<TProductCategory\>\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:278](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L278)

___

### getParentCategory

▸ **getParentCategory**(`category`: [*ProductCategory*](backend.productcategory.md)): *Promise*<undefined \| *null* \| [*ProductCategory*](backend.productcategory.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`category` | [*ProductCategory*](backend.productcategory.md) |

**Returns:** *Promise*<undefined \| *null* \| [*ProductCategory*](backend.productcategory.md)\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:247](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L247)

___

### getProductCategories

▸ **getProductCategories**(`params`: *TPagedParams*<TProductCategory\>): *Promise*<TPagedList<TProductCategory\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params` | *TPagedParams*<TProductCategory\> |

**Returns:** *Promise*<TPagedList<TProductCategory\>\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:26](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L26)

___

### getProductCategoriesById

▸ **getProductCategoriesById**(`ids`: *string*[]): *Promise*<[*ProductCategory*](backend.productcategory.md)[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`ids` | *string*[] |

**Returns:** *Promise*<[*ProductCategory*](backend.productcategory.md)[]\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:33](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L33)

___

### getProductCategoryById

▸ **getProductCategoryById**(`id`: *string*): *Promise*<[*ProductCategory*](backend.productcategory.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<[*ProductCategory*](backend.productcategory.md)\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L38)

___

### getProductCategoryBySlug

▸ **getProductCategoryBySlug**(`slug`: *string*): *Promise*<[*ProductCategory*](backend.productcategory.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |

**Returns:** *Promise*<[*ProductCategory*](backend.productcategory.md)\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:47](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L47)

___

### getRootCategories

▸ **getRootCategories**(): *Promise*<TPagedList<[*ProductCategory*](backend.productcategory.md)\>\>

**Returns:** *Promise*<TPagedList<[*ProductCategory*](backend.productcategory.md)\>\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:252](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L252)

___

### handleProductCategoryInput

▸ **handleProductCategoryInput**(`productCategory`: [*ProductCategory*](backend.productcategory.md), `input`: TProductCategoryInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`productCategory` | [*ProductCategory*](backend.productcategory.md) |
`input` | TProductCategoryInput |

**Returns:** *Promise*<void\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L56)

___

### updateProductCategory

▸ **updateProductCategory**(`id`: *string*, `updateProductCategory`: *UpdateProductCategory*): *Promise*<[*ProductCategory*](backend.productcategory.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`updateProductCategory` | *UpdateProductCategory* |

**Returns:** *Promise*<[*ProductCategory*](backend.productcategory.md)\>

Defined in: [system/core/backend/src/repositories/ProductCategoryRepository.ts:157](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/ProductCategoryRepository.ts#L157)
