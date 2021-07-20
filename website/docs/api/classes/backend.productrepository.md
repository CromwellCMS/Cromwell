[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / ProductRepository

# Class: ProductRepository

[backend](../modules/backend.md).ProductRepository

## Hierarchy

* *BaseRepository*<[*Product*](backend.product.md)\>

  ↳ **ProductRepository**

## Table of contents

### Constructors

- [constructor](backend.productrepository.md#constructor)

### Methods

- [applyAndGetPagedProducts](backend.productrepository.md#applyandgetpagedproducts)
- [applyDeleteMany](backend.productrepository.md#applydeletemany)
- [applyGetProductRating](backend.productrepository.md#applygetproductrating)
- [applyGetProductViews](backend.productrepository.md#applygetproductviews)
- [applyProductFilter](backend.productrepository.md#applyproductfilter)
- [createEntity](backend.productrepository.md#createentity)
- [createProduct](backend.productrepository.md#createproduct)
- [deleteEntity](backend.productrepository.md#deleteentity)
- [deleteMany](backend.productrepository.md#deletemany)
- [deleteManyFilteredProducts](backend.productrepository.md#deletemanyfilteredproducts)
- [deleteProduct](backend.productrepository.md#deleteproduct)
- [getAll](backend.productrepository.md#getall)
- [getById](backend.productrepository.md#getbyid)
- [getBySlug](backend.productrepository.md#getbyslug)
- [getFilteredProducts](backend.productrepository.md#getfilteredproducts)
- [getPaged](backend.productrepository.md#getpaged)
- [getProductById](backend.productrepository.md#getproductbyid)
- [getProductBySlug](backend.productrepository.md#getproductbyslug)
- [getProductRating](backend.productrepository.md#getproductrating)
- [getProducts](backend.productrepository.md#getproducts)
- [getProductsFromCategory](backend.productrepository.md#getproductsfromcategory)
- [getReviewsOfProduct](backend.productrepository.md#getreviewsofproduct)
- [handleProductInput](backend.productrepository.md#handleproductinput)
- [updateEntity](backend.productrepository.md#updateentity)
- [updateProduct](backend.productrepository.md#updateproduct)

## Constructors

### constructor

\+ **new ProductRepository**(): *ProductRepository*

**Returns:** *ProductRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:35](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L35)

## Methods

### applyAndGetPagedProducts

▸ **applyAndGetPagedProducts**(`qb`: *SelectQueryBuilder*<TProduct\>, `params?`: *TPagedParams*<TProduct\>): *Promise*<TPagedList<TProduct\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<TProduct\> |
`params?` | *TPagedParams*<TProduct\> |

**Returns:** *Promise*<TPagedList<TProduct\>\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:55](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L55)

___

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*Product*](backend.product.md)\> \| *DeleteQueryBuilder*<[*Product*](backend.product.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*Product*](backend.product.md)\> \| *DeleteQueryBuilder*<[*Product*](backend.product.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### applyGetProductRating

▸ **applyGetProductRating**(`qb`: *SelectQueryBuilder*<TProduct\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<TProduct\> |

**Returns:** *void*

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:41](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L41)

___

### applyGetProductViews

▸ **applyGetProductViews**(`qb`: *SelectQueryBuilder*<TProduct\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<TProduct\> |

**Returns:** *void*

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L49)

___

### applyProductFilter

▸ **applyProductFilter**(`qb`: *SelectQueryBuilder*<[*Product*](backend.product.md)\> \| *DeleteQueryBuilder*<[*Product*](backend.product.md)\>, `filterParams?`: [*ProductFilterInput*](backend.productfilterinput.md), `categoryId?`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*Product*](backend.product.md)\> \| *DeleteQueryBuilder*<[*Product*](backend.product.md)\> |
`filterParams?` | [*ProductFilterInput*](backend.productfilterinput.md) |
`categoryId?` | *string* |

**Returns:** *void*

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:203](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L203)

___

### createEntity

▸ **createEntity**(`input`: [*Product*](backend.product.md), `id?`: *string*): *Promise*<[*Product*](backend.product.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*Product*](backend.product.md) |
`id?` | *string* |

**Returns:** *Promise*<[*Product*](backend.product.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### createProduct

▸ **createProduct**(`createProduct`: TProductInput, `id?`: *string*): *Promise*<[*Product*](backend.product.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`createProduct` | TProductInput |
`id?` | *string* |

**Returns:** *Promise*<[*Product*](backend.product.md)\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:124](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L124)

___

### deleteEntity

▸ **deleteEntity**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L76)

___

### deleteMany

▸ **deleteMany**(`input`: TDeleteManyInput): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:97](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L97)

___

### deleteManyFilteredProducts

▸ **deleteManyFilteredProducts**(`input`: TDeleteManyInput, `filterParams?`: [*ProductFilterInput*](backend.productfilterinput.md)): *Promise*<undefined \| boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | [*ProductFilterInput*](backend.productfilterinput.md) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:301](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L301)

___

### deleteProduct

▸ **deleteProduct**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:157](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L157)

___

### getAll

▸ **getAll**(): *Promise*<[*Product*](backend.product.md)[]\>

**Returns:** *Promise*<[*Product*](backend.product.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Product*](backend.product.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Product*](backend.product.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Product*](backend.product.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Product*](backend.product.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getFilteredProducts

▸ **getFilteredProducts**(`pagedParams?`: *PagedParamsInput*<TProduct\>, `filterParams?`: [*ProductFilterInput*](backend.productfilterinput.md), `categoryId?`: *string*): *Promise*<TFilteredProductList\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *PagedParamsInput*<TProduct\> |
`filterParams?` | [*ProductFilterInput*](backend.productfilterinput.md) |
`categoryId?` | *string* |

**Returns:** *Promise*<TFilteredProductList\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:254](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L254)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*Product*](backend.product.md)\>): *Promise*<TPagedList<[*Product*](backend.product.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*Product*](backend.product.md)\> |

**Returns:** *Promise*<TPagedList<[*Product*](backend.product.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### getProductById

▸ **getProductById**(`id`: *string*): *Promise*<undefined \| [*Product*](backend.product.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<undefined \| [*Product*](backend.product.md)\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L76)

___

### getProductBySlug

▸ **getProductBySlug**(`slug`: *string*): *Promise*<undefined \| [*Product*](backend.product.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |

**Returns:** *Promise*<undefined \| [*Product*](backend.product.md)\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:84](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L84)

___

### getProductRating

▸ **getProductRating**(`productId`: *string*): *Promise*<TProductRating\>

#### Parameters:

Name | Type |
:------ | :------ |
`productId` | *string* |

**Returns:** *Promise*<TProductRating\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:187](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L187)

___

### getProducts

▸ **getProducts**(`params?`: *TPagedParams*<TProduct\>): *Promise*<TPagedList<TProduct\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<TProduct\> |

**Returns:** *Promise*<TPagedList<TProduct\>\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:70](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L70)

___

### getProductsFromCategory

▸ **getProductsFromCategory**(`categoryId`: *string*, `params?`: *TPagedParams*<TProduct\>): *Promise*<TPagedList<TProduct\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`categoryId` | *string* |
`params?` | *TPagedParams*<TProduct\> |

**Returns:** *Promise*<TPagedList<TProduct\>\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:170](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L170)

___

### getReviewsOfProduct

▸ **getReviewsOfProduct**(`productId`: *string*, `params?`: *TPagedParams*<TProductReview\>): *Promise*<TPagedList<TProductReview\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`productId` | *string* |
`params?` | *TPagedParams*<TProductReview\> |

**Returns:** *Promise*<TPagedList<TProductReview\>\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:178](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L178)

___

### handleProductInput

▸ **handleProductInput**(`product`: [*Product*](backend.product.md), `input`: TProductInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`product` | [*Product*](backend.product.md) |
`input` | TProductInput |

**Returns:** *Promise*<void\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:92](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L92)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*Product*](backend.product.md)): *Promise*<[*Product*](backend.product.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*Product*](backend.product.md) |

**Returns:** *Promise*<[*Product*](backend.product.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L61)

___

### updateProduct

▸ **updateProduct**(`id`: *string*, `updateProduct`: TProductInput): *Promise*<[*Product*](backend.product.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`updateProduct` | TProductInput |

**Returns:** *Promise*<[*Product*](backend.product.md)\>

Defined in: [system/core/backend/src/repositories/ProductRepository.ts:139](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/ProductRepository.ts#L139)
