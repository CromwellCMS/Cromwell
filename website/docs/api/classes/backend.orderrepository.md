[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / OrderRepository

# Class: OrderRepository

[backend](../modules/backend.md).OrderRepository

## Hierarchy

* *BaseRepository*<[*Order*](backend.order.md)\>

  ↳ **OrderRepository**

## Table of contents

### Constructors

- [constructor](backend.orderrepository.md#constructor)

### Methods

- [applyDeleteMany](backend.orderrepository.md#applydeletemany)
- [applyOrderFilter](backend.orderrepository.md#applyorderfilter)
- [createEntity](backend.orderrepository.md#createentity)
- [createOrder](backend.orderrepository.md#createorder)
- [deleteEntity](backend.orderrepository.md#deleteentity)
- [deleteMany](backend.orderrepository.md#deletemany)
- [deleteManyFilteredOrders](backend.orderrepository.md#deletemanyfilteredorders)
- [deleteOrder](backend.orderrepository.md#deleteorder)
- [getAll](backend.orderrepository.md#getall)
- [getById](backend.orderrepository.md#getbyid)
- [getBySlug](backend.orderrepository.md#getbyslug)
- [getFilteredOrders](backend.orderrepository.md#getfilteredorders)
- [getOrderById](backend.orderrepository.md#getorderbyid)
- [getOrderBySlug](backend.orderrepository.md#getorderbyslug)
- [getOrders](backend.orderrepository.md#getorders)
- [getPaged](backend.orderrepository.md#getpaged)
- [updateEntity](backend.orderrepository.md#updateentity)
- [updateOrder](backend.orderrepository.md#updateorder)

## Constructors

### constructor

\+ **new OrderRepository**(): *OrderRepository*

**Returns:** *OrderRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L17)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*Order*](backend.order.md)\> \| *DeleteQueryBuilder*<[*Order*](backend.order.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*Order*](backend.order.md)\> \| *DeleteQueryBuilder*<[*Order*](backend.order.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### applyOrderFilter

▸ **applyOrderFilter**(`qb`: *SelectQueryBuilder*<TOrder\> \| *DeleteQueryBuilder*<TOrder\>, `filterParams?`: [*OrderFilterInput*](backend.orderfilterinput.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<TOrder\> \| *DeleteQueryBuilder*<TOrder\> |
`filterParams?` | [*OrderFilterInput*](backend.orderfilterinput.md) |

**Returns:** *void*

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:101](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L101)

___

### createEntity

▸ **createEntity**(`input`: [*Order*](backend.order.md), `id?`: *string*): *Promise*<[*Order*](backend.order.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*Order*](backend.order.md) |
`id?` | *string* |

**Returns:** *Promise*<[*Order*](backend.order.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### createOrder

▸ **createOrder**(`inputData`: TOrderInput, `id?`: *string*): *Promise*<[*Order*](backend.order.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`inputData` | TOrderInput |
`id?` | *string* |

**Returns:** *Promise*<[*Order*](backend.order.md)\>

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:62](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L62)

___

### deleteEntity

▸ **deleteEntity**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L76)

___

### deleteMany

▸ **deleteMany**(`input`: TDeleteManyInput): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:97](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L97)

___

### deleteManyFilteredOrders

▸ **deleteManyFilteredOrders**(`input`: TDeleteManyInput, `filterParams?`: [*OrderFilterInput*](backend.orderfilterinput.md)): *Promise*<undefined \| boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | [*OrderFilterInput*](backend.orderfilterinput.md) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:157](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L157)

___

### deleteOrder

▸ **deleteOrder**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:89](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L89)

___

### getAll

▸ **getAll**(): *Promise*<[*Order*](backend.order.md)[]\>

**Returns:** *Promise*<[*Order*](backend.order.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Order*](backend.order.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Order*](backend.order.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Order*](backend.order.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Order*](backend.order.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getFilteredOrders

▸ **getFilteredOrders**(`pagedParams?`: *PagedParamsInput*<TOrder\>, `filterParams?`: [*OrderFilterInput*](backend.orderfilterinput.md)): *Promise*<TPagedList<TOrder\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *PagedParamsInput*<TOrder\> |
`filterParams?` | [*OrderFilterInput*](backend.orderfilterinput.md) |

**Returns:** *Promise*<TPagedList<TOrder\>\>

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:149](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L149)

___

### getOrderById

▸ **getOrderById**(`id`: *string*): *Promise*<undefined \| [*Order*](backend.order.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<undefined \| [*Order*](backend.order.md)\>

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L28)

___

### getOrderBySlug

▸ **getOrderBySlug**(`slug`: *string*): *Promise*<undefined \| [*Order*](backend.order.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |

**Returns:** *Promise*<undefined \| [*Order*](backend.order.md)\>

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:33](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L33)

___

### getOrders

▸ **getOrders**(`params?`: *TPagedParams*<TOrder\>): *Promise*<TPagedList<[*Order*](backend.order.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<TOrder\> |

**Returns:** *Promise*<TPagedList<[*Order*](backend.order.md)\>\>

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L23)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*Order*](backend.order.md)\>): *Promise*<TPagedList<[*Order*](backend.order.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*Order*](backend.order.md)\> |

**Returns:** *Promise*<TPagedList<[*Order*](backend.order.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*Order*](backend.order.md)): *Promise*<[*Order*](backend.order.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*Order*](backend.order.md) |

**Returns:** *Promise*<[*Order*](backend.order.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L61)

___

### updateOrder

▸ **updateOrder**(`id`: *string*, `inputData`: TOrderInput): *Promise*<undefined \| [*Order*](backend.order.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`inputData` | TOrderInput |

**Returns:** *Promise*<undefined \| [*Order*](backend.order.md)\>

Defined in: [system/core/backend/src/repositories/OrderRepository.ts:74](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/OrderRepository.ts#L74)
