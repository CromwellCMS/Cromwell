[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / OrderRepository

# Class: OrderRepository

[backend](../modules/backend.md).OrderRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`Order`](backend.Order.md)\>

  ↳ **`OrderRepository`**

## Table of contents

### Constructors

- [constructor](backend.OrderRepository.md#constructor)

### Properties

- [dbType](backend.OrderRepository.md#dbtype)

### Methods

- [applyDeleteMany](backend.OrderRepository.md#applydeletemany)
- [applyOrderFilter](backend.OrderRepository.md#applyorderfilter)
- [createEntity](backend.OrderRepository.md#createentity)
- [createOrder](backend.OrderRepository.md#createorder)
- [deleteEntity](backend.OrderRepository.md#deleteentity)
- [deleteMany](backend.OrderRepository.md#deletemany)
- [deleteManyFilteredOrders](backend.OrderRepository.md#deletemanyfilteredorders)
- [deleteOrder](backend.OrderRepository.md#deleteorder)
- [getAll](backend.OrderRepository.md#getall)
- [getById](backend.OrderRepository.md#getbyid)
- [getBySlug](backend.OrderRepository.md#getbyslug)
- [getFilteredOrders](backend.OrderRepository.md#getfilteredorders)
- [getOrderById](backend.OrderRepository.md#getorderbyid)
- [getOrderBySlug](backend.OrderRepository.md#getorderbyslug)
- [getOrders](backend.OrderRepository.md#getorders)
- [getOrdersOfUser](backend.OrderRepository.md#getordersofuser)
- [getPaged](backend.OrderRepository.md#getpaged)
- [getSqlBoolStr](backend.OrderRepository.md#getsqlboolstr)
- [getSqlLike](backend.OrderRepository.md#getsqllike)
- [quote](backend.OrderRepository.md#quote)
- [updateEntity](backend.OrderRepository.md#updateentity)
- [updateOrder](backend.OrderRepository.md#updateorder)

## Constructors

### constructor

• **new OrderRepository**()

#### Overrides

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L19)

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
| `qb` | `SelectQueryBuilder`<[`Order`](backend.Order.md)\> \| `DeleteQueryBuilder`<[`Order`](backend.Order.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[applyDeleteMany](backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L94)

___

### applyOrderFilter

▸ **applyOrderFilter**(`qb`, `filterParams?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`TOrder`\> \| `DeleteQueryBuilder`<`TOrder`\> |
| `filterParams?` | [`OrderFilterInput`](backend.OrderFilterInput.md) |

#### Returns

`void`

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:103](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L103)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`Order`](backend.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`Order`](backend.Order.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`Order`](backend.Order.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[createEntity](backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L56)

___

### createOrder

▸ **createOrder**(`inputData`, `id?`): `Promise`<[`Order`](backend.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `TOrderInput` |
| `id?` | `string` |

#### Returns

`Promise`<[`Order`](backend.Order.md)\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:64](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L64)

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

### deleteManyFilteredOrders

▸ **deleteManyFilteredOrders**(`input`, `filterParams?`): `Promise`<`undefined` \| `boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | [`OrderFilterInput`](backend.OrderFilterInput.md) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:160](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L160)

___

### deleteOrder

▸ **deleteOrder**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:91](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L91)

___

### getAll

▸ **getAll**(): `Promise`<[`Order`](backend.Order.md)[]\>

#### Returns

`Promise`<[`Order`](backend.Order.md)[]\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getAll](backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L31)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getById](backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L36)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getBySlug](backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L46)

___

### getFilteredOrders

▸ **getFilteredOrders**(`pagedParams?`, `filterParams?`): `Promise`<`TPagedList`<`TOrder`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | [`PagedParamsInput`](backend.PagedParamsInput.md)<`TOrder`\> |
| `filterParams?` | [`OrderFilterInput`](backend.OrderFilterInput.md) |

#### Returns

`Promise`<`TPagedList`<`TOrder`\>\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:151](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L151)

___

### getOrderById

▸ **getOrderById**(`id`): `Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L28)

___

### getOrderBySlug

▸ **getOrderBySlug**(`slug`): `Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L33)

___

### getOrders

▸ **getOrders**(`params?`): `Promise`<`TPagedList`<[`Order`](backend.Order.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<`TOrder`\> |

#### Returns

`Promise`<`TPagedList`<[`Order`](backend.Order.md)\>\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L23)

___

### getOrdersOfUser

▸ **getOrdersOfUser**(`userId`, `pagedParams?`): `Promise`<`TPagedList`<`TOrder`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `pagedParams?` | [`PagedParamsInput`](backend.PagedParamsInput.md)<`TOrder`\> |

#### Returns

`Promise`<`TPagedList`<`TOrder`\>\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:168](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L168)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`Order`](backend.Order.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`Order`](backend.Order.md)\> |

#### Returns

`Promise`<`TPagedList`<[`Order`](backend.Order.md)\>\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getPaged](backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L25)

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

▸ **updateEntity**(`id`, `input`): `Promise`<[`Order`](backend.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`Order`](backend.Order.md) |

#### Returns

`Promise`<[`Order`](backend.Order.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[updateEntity](backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:68](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L68)

___

### updateOrder

▸ **updateOrder**(`id`, `inputData`): `Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `inputData` | `TOrderInput` |

#### Returns

`Promise`<`undefined` \| [`Order`](backend.Order.md)\>

#### Defined in

[system/core/backend/src/repositories/order.repository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/order.repository.ts#L76)
