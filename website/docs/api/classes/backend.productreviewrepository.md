[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / ProductReviewRepository

# Class: ProductReviewRepository

[backend](../modules/backend.md).ProductReviewRepository

## Hierarchy

* *BaseRepository*<[*ProductReview*](backend.productreview.md)\>

  ↳ **ProductReviewRepository**

## Table of contents

### Constructors

- [constructor](backend.productreviewrepository.md#constructor)

### Methods

- [applyDeleteMany](backend.productreviewrepository.md#applydeletemany)
- [applyProductReviewFilter](backend.productreviewrepository.md#applyproductreviewfilter)
- [createEntity](backend.productreviewrepository.md#createentity)
- [createProductReview](backend.productreviewrepository.md#createproductreview)
- [deleteEntity](backend.productreviewrepository.md#deleteentity)
- [deleteMany](backend.productreviewrepository.md#deletemany)
- [deleteManyFilteredProductReviews](backend.productreviewrepository.md#deletemanyfilteredproductreviews)
- [deleteProductReview](backend.productreviewrepository.md#deleteproductreview)
- [getAll](backend.productreviewrepository.md#getall)
- [getById](backend.productreviewrepository.md#getbyid)
- [getBySlug](backend.productreviewrepository.md#getbyslug)
- [getFilteredProductReviews](backend.productreviewrepository.md#getfilteredproductreviews)
- [getPaged](backend.productreviewrepository.md#getpaged)
- [getProductReview](backend.productreviewrepository.md#getproductreview)
- [getProductReviews](backend.productreviewrepository.md#getproductreviews)
- [handleProductReviewInput](backend.productreviewrepository.md#handleproductreviewinput)
- [updateEntity](backend.productreviewrepository.md#updateentity)
- [updateProductReview](backend.productreviewrepository.md#updateproductreview)

## Constructors

### constructor

\+ **new ProductReviewRepository**(`EntityClass`: (...`args`: *any*[]) => [*ProductReview*](backend.productreview.md) & { `id?`: *undefined* \| *string*  }): *ProductReviewRepository*

#### Parameters:

Name | Type |
:------ | :------ |
`EntityClass` | (...`args`: *any*[]) => [*ProductReview*](backend.productreview.md) & { `id?`: *undefined* \| *string*  } |

**Returns:** *ProductReviewRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:10](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L10)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*ProductReview*](backend.productreview.md)\> \| *DeleteQueryBuilder*<[*ProductReview*](backend.productreview.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*ProductReview*](backend.productreview.md)\> \| *DeleteQueryBuilder*<[*ProductReview*](backend.productreview.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### applyProductReviewFilter

▸ **applyProductReviewFilter**(`qb`: *SelectQueryBuilder*<TProductReview\> \| *DeleteQueryBuilder*<TProductReview\>, `filterParams?`: [*ProductReviewFilter*](backend.productreviewfilter.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<TProductReview\> \| *DeleteQueryBuilder*<TProductReview\> |
`filterParams?` | [*ProductReviewFilter*](backend.productreviewfilter.md) |

**Returns:** *void*

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:93](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L93)

___

### createEntity

▸ **createEntity**(`input`: [*ProductReview*](backend.productreview.md), `id?`: *string*): *Promise*<[*ProductReview*](backend.productreview.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*ProductReview*](backend.productreview.md) |
`id?` | *string* |

**Returns:** *Promise*<[*ProductReview*](backend.productreview.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### createProductReview

▸ **createProductReview**(`createProductReview`: TProductReviewInput, `id?`: *string*): *Promise*<TProductReview\>

#### Parameters:

Name | Type |
:------ | :------ |
`createProductReview` | TProductReviewInput |
`id?` | *string* |

**Returns:** *Promise*<TProductReview\>

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:54](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L54)

___

### deleteEntity

▸ **deleteEntity**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L76)

___

### deleteMany

▸ **deleteMany**(`input`: TDeleteManyInput): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:97](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L97)

___

### deleteManyFilteredProductReviews

▸ **deleteManyFilteredProductReviews**(`input`: TDeleteManyInput, `filterParams?`: [*ProductReviewFilter*](backend.productreviewfilter.md)): *Promise*<undefined \| boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | [*ProductReviewFilter*](backend.productreviewfilter.md) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:142](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L142)

___

### deleteProductReview

▸ **deleteProductReview**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:82](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L82)

___

### getAll

▸ **getAll**(): *Promise*<[*ProductReview*](backend.productreview.md)[]\>

**Returns:** *Promise*<[*ProductReview*](backend.productreview.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*ProductReview*](backend.productreview.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*ProductReview*](backend.productreview.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*ProductReview*](backend.productreview.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*ProductReview*](backend.productreview.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getFilteredProductReviews

▸ **getFilteredProductReviews**(`pagedParams?`: *PagedParamsInput*<TProductReview\>, `filterParams?`: [*ProductReviewFilter*](backend.productreviewfilter.md)): *Promise*<TPagedList<TProductReview\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *PagedParamsInput*<TProductReview\> |
`filterParams?` | [*ProductReviewFilter*](backend.productreviewfilter.md) |

**Returns:** *Promise*<TPagedList<TProductReview\>\>

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:134](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L134)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*ProductReview*](backend.productreview.md)\>): *Promise*<TPagedList<[*ProductReview*](backend.productreview.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*ProductReview*](backend.productreview.md)\> |

**Returns:** *Promise*<TPagedList<[*ProductReview*](backend.productreview.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### getProductReview

▸ **getProductReview**(`id`: *string*): *Promise*<[*ProductReview*](backend.productreview.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<[*ProductReview*](backend.productreview.md)\>

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L23)

___

### getProductReviews

▸ **getProductReviews**(`params`: *TPagedParams*<TProductReview\>): *Promise*<TPagedList<TProductReview\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params` | *TPagedParams*<TProductReview\> |

**Returns:** *Promise*<TPagedList<TProductReview\>\>

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:19](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L19)

___

### handleProductReviewInput

▸ **handleProductReviewInput**(`productReview`: [*ProductReview*](backend.productreview.md), `input`: TProductReviewInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`productReview` | [*ProductReview*](backend.productreview.md) |
`input` | TProductReviewInput |

**Returns:** *Promise*<void\>

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:32](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L32)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*ProductReview*](backend.productreview.md)): *Promise*<[*ProductReview*](backend.productreview.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*ProductReview*](backend.productreview.md) |

**Returns:** *Promise*<[*ProductReview*](backend.productreview.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L61)

___

### updateProductReview

▸ **updateProductReview**(`id`: *string*, `updateProductReview`: TProductReviewInput): *Promise*<[*ProductReview*](backend.productreview.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`updateProductReview` | TProductReviewInput |

**Returns:** *Promise*<[*ProductReview*](backend.productreview.md)\>

Defined in: [system/core/backend/src/repositories/ProductReviewRepository.ts:67](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/ProductReviewRepository.ts#L67)
