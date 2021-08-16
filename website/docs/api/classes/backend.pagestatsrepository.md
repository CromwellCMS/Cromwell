[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PageStatsRepository

# Class: PageStatsRepository

[backend](../modules/backend.md).PageStatsRepository

## Hierarchy

- [`BaseRepository`](./backend.BaseRepository.md)<[`PageStats`](./backend.PageStats.md)\>

  ↳ **`PageStatsRepository`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [dbType](#dbtype)

### Methods

- [applyDeleteMany](#applydeletemany)
- [createEntity](#createentity)
- [deleteEntity](#deleteentity)
- [deleteMany](#deletemany)
- [getAll](#getall)
- [getById](#getbyid)
- [getBySlug](#getbyslug)
- [getPaged](#getpaged)
- [getSqlBoolStr](#getsqlboolstr)
- [getSqlLike](#getsqllike)
- [quote](#quote)
- [updateEntity](#updateentity)

## Constructors

### constructor

• **new PageStatsRepository**()

#### Overrides

[BaseRepository](./backend.BaseRepository.md).[constructor](./backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/page-stats.repository.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/page-stats.repository.ts#L9)

## Properties

### dbType

• **dbType**: ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"``

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[dbType](./backend.BaseRepository.md#dbtype)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L11)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`PageStats`](./backend.PageStats.md)\> \| `DeleteQueryBuilder`<[`PageStats`](./backend.PageStats.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[applyDeleteMany](./backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L94)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`PageStats`](./backend.PageStats.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PageStats`](./backend.PageStats.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`PageStats`](./backend.PageStats.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[createEntity](./backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L56)

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

### getAll

▸ **getAll**(): `Promise`<[`PageStats`](./backend.PageStats.md)[]\>

#### Returns

`Promise`<[`PageStats`](./backend.PageStats.md)[]\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getAll](./backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L31)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`PageStats`](./backend.PageStats.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`PageStats`](./backend.PageStats.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getById](./backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L36)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`PageStats`](./backend.PageStats.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`PageStats`](./backend.PageStats.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getBySlug](./backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L46)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`PageStats`](./backend.PageStats.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`PageStats`](./backend.PageStats.md)\> |

#### Returns

`Promise`<`TPagedList`<[`PageStats`](./backend.PageStats.md)\>\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getPaged](./backend.BaseRepository.md#getpaged)

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

▸ **updateEntity**(`id`, `input`): `Promise`<[`PageStats`](./backend.PageStats.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`PageStats`](./backend.PageStats.md) |

#### Returns

`Promise`<[`PageStats`](./backend.PageStats.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[updateEntity](./backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:68](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L68)
