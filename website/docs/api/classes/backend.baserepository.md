[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / BaseRepository

# Class: BaseRepository<EntityType, EntityInputType\>

[backend](../modules/backend.md).BaseRepository

## Type parameters

| Name | Type |
| :------ | :------ |
| `EntityType` | `EntityType` |
| `EntityInputType` | `EntityType` |

## Hierarchy

- `Repository`<`EntityType`\>

  ↳ **`BaseRepository`**

  ↳↳ [`AttributeRepository`](backend.AttributeRepository.md)

  ↳↳ [`OrderRepository`](backend.OrderRepository.md)

  ↳↳ [`PageStatsRepository`](backend.PageStatsRepository.md)

  ↳↳ [`PluginRepository`](backend.PluginRepository.md)

  ↳↳ [`PostRepository`](backend.PostRepository.md)

  ↳↳ [`ProductReviewRepository`](backend.ProductReviewRepository.md)

  ↳↳ [`ProductRepository`](backend.ProductRepository.md)

  ↳↳ [`TagRepository`](backend.TagRepository.md)

  ↳↳ [`UserRepository`](backend.UserRepository.md)

## Table of contents

### Constructors

- [constructor](backend.BaseRepository.md#constructor)

### Properties

- [dbType](backend.BaseRepository.md#dbtype)

### Methods

- [applyDeleteMany](backend.BaseRepository.md#applydeletemany)
- [createEntity](backend.BaseRepository.md#createentity)
- [deleteEntity](backend.BaseRepository.md#deleteentity)
- [deleteMany](backend.BaseRepository.md#deletemany)
- [getAll](backend.BaseRepository.md#getall)
- [getById](backend.BaseRepository.md#getbyid)
- [getBySlug](backend.BaseRepository.md#getbyslug)
- [getPaged](backend.BaseRepository.md#getpaged)
- [getSqlBoolStr](backend.BaseRepository.md#getsqlboolstr)
- [getSqlLike](backend.BaseRepository.md#getsqllike)
- [quote](backend.BaseRepository.md#quote)
- [updateEntity](backend.BaseRepository.md#updateentity)

## Constructors

### constructor

• **new BaseRepository**<`EntityType`, `EntityInputType`\>(`EntityClass`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `EntityType` | `EntityType` |
| `EntityInputType` | `EntityType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `EntityClass` | (...`args`: `any`[]) => `EntityType` & { `id?`: `string`  } |

#### Overrides

Repository&lt;EntityType\&gt;.constructor

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L13)

## Properties

### dbType

• **dbType**: ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"``

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L11)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`EntityType`\> \| `DeleteQueryBuilder`<`EntityType`\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L94)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<`EntityType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `EntityInputType` |
| `id?` | `string` |

#### Returns

`Promise`<`EntityType`\>

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

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:110](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L110)

___

### getAll

▸ **getAll**(): `Promise`<`EntityType`[]\>

#### Returns

`Promise`<`EntityType`[]\>

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L31)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| `EntityType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| `EntityType`\>

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L36)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| `EntityType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| `EntityType`\>

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L46)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<`EntityType`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<`EntityType`\> |

#### Returns

`Promise`<`TPagedList`<`EntityType`\>\>

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

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L21)

___

### getSqlLike

▸ **getSqlLike**(): ``"ILIKE"`` \| ``"LIKE"``

#### Returns

``"ILIKE"`` \| ``"LIKE"``

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

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

___

### updateEntity

▸ **updateEntity**(`id`, `input`): `Promise`<`EntityType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | `EntityInputType` |

#### Returns

`Promise`<`EntityType`\>

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:68](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L68)
