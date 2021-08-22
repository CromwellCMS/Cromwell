[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PluginRepository

# Class: PluginRepository

[backend](../modules/backend.md).PluginRepository

## Hierarchy

- [`BaseRepository`](./backend.BaseRepository.md)<[`PluginEntity`](./backend.PluginEntity.md)\>

  ↳ **`PluginRepository`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [dbType](#dbtype)

### Methods

- [applyDeleteMany](#applydeletemany)
- [createEntity](#createentity)
- [createPlugin](#createplugin)
- [deleteEntity](#deleteentity)
- [deleteMany](#deletemany)
- [deletePlugin](#deleteplugin)
- [getAll](#getall)
- [getById](#getbyid)
- [getBySlug](#getbyslug)
- [getPaged](#getpaged)
- [getPluginById](#getpluginbyid)
- [getPluginBySlug](#getpluginbyslug)
- [getPluginSettings](#getpluginsettings)
- [getPlugins](#getplugins)
- [getSqlBoolStr](#getsqlboolstr)
- [getSqlLike](#getsqllike)
- [quote](#quote)
- [updateEntity](#updateentity)
- [updatePlugin](#updateplugin)

## Constructors

### constructor

• **new PluginRepository**()

#### Overrides

[BaseRepository](./backend.BaseRepository.md).[constructor](./backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L14)

## Properties

### dbType

• **dbType**: ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"`` \| ``"capacitor"``

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
| `qb` | `SelectQueryBuilder`<[`PluginEntity`](./backend.PluginEntity.md)\> \| `DeleteQueryBuilder`<[`PluginEntity`](./backend.PluginEntity.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[applyDeleteMany](./backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L94)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`PluginEntity`](./backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PluginEntity`](./backend.PluginEntity.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`PluginEntity`](./backend.PluginEntity.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[createEntity](./backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L56)

___

### createPlugin

▸ **createPlugin**(`createPlugin`): `Promise`<[`PluginEntity`](./backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createPlugin` | `TPluginEntityInput` |

#### Returns

`Promise`<[`PluginEntity`](./backend.PluginEntity.md)\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:45](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L45)

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

### deletePlugin

▸ **deletePlugin**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:71](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L71)

___

### getAll

▸ **getAll**(): `Promise`<[`PluginEntity`](./backend.PluginEntity.md)[]\>

#### Returns

`Promise`<[`PluginEntity`](./backend.PluginEntity.md)[]\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getAll](./backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L31)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`PluginEntity`](./backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`PluginEntity`](./backend.PluginEntity.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getById](./backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L36)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`PluginEntity`](./backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`PluginEntity`](./backend.PluginEntity.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getBySlug](./backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L46)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`PluginEntity`](./backend.PluginEntity.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`PluginEntity`](./backend.PluginEntity.md)\> |

#### Returns

`Promise`<`TPagedList`<[`PluginEntity`](./backend.PluginEntity.md)\>\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[getPaged](./backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L25)

___

### getPluginById

▸ **getPluginById**(`id`): `Promise`<`undefined` \| [`PluginEntity`](./backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| [`PluginEntity`](./backend.PluginEntity.md)\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L23)

___

### getPluginBySlug

▸ **getPluginBySlug**(`slug`): `Promise`<`undefined` \| [`PluginEntity`](./backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<`undefined` \| [`PluginEntity`](./backend.PluginEntity.md)\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L28)

___

### getPluginSettings

▸ **getPluginSettings**<`T`\>(`pluginName`): `Promise`<`undefined` \| `T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName` | `string` |

#### Returns

`Promise`<`undefined` \| `T`\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:83](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L83)

___

### getPlugins

▸ **getPlugins**(`params`): `Promise`<`TPagedList`<[`PluginEntity`](./backend.PluginEntity.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TPagedParams`<[`PluginEntity`](./backend.PluginEntity.md)\> |

#### Returns

`Promise`<`TPagedList`<[`PluginEntity`](./backend.PluginEntity.md)\>\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L18)

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

▸ **updateEntity**(`id`, `input`): `Promise`<[`PluginEntity`](./backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`PluginEntity`](./backend.PluginEntity.md) |

#### Returns

`Promise`<[`PluginEntity`](./backend.PluginEntity.md)\>

#### Inherited from

[BaseRepository](./backend.BaseRepository.md).[updateEntity](./backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:68](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L68)

___

### updatePlugin

▸ **updatePlugin**(`id`, `updatePlugin`): `Promise`<[`PluginEntity`](./backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updatePlugin` | `TPluginEntityInput` |

#### Returns

`Promise`<[`PluginEntity`](./backend.PluginEntity.md)\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:57](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L57)
