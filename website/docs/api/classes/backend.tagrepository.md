[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / TagRepository

# Class: TagRepository

[backend](../modules/backend.md).TagRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`Tag`](backend.Tag.md)\>

  ↳ **`TagRepository`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [dbType](#dbtype)

### Methods

- [applyDeleteMany](#applydeletemany)
- [createEntity](#createentity)
- [createTag](#createtag)
- [deleteEntity](#deleteentity)
- [deleteMany](#deletemany)
- [deleteTag](#deletetag)
- [getAll](#getall)
- [getById](#getbyid)
- [getBySlug](#getbyslug)
- [getPaged](#getpaged)
- [getSqlBoolStr](#getsqlboolstr)
- [getSqlLike](#getsqllike)
- [getTagById](#gettagbyid)
- [getTagBySlug](#gettagbyslug)
- [getTags](#gettags)
- [getTagsByIds](#gettagsbyids)
- [quote](#quote)
- [updateEntity](#updateentity)
- [updateTag](#updatetag)

## Constructors

### constructor

• **new TagRepository**()

#### Overrides

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L14)

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
| `qb` | `SelectQueryBuilder`<[`Tag`](backend.Tag.md)\> \| `DeleteQueryBuilder`<[`Tag`](backend.Tag.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[applyDeleteMany](backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L94)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`Tag`](backend.Tag.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`Tag`](backend.Tag.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`Tag`](backend.Tag.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[createEntity](backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L56)

___

### createTag

▸ **createTag**(`inputData`, `id?`): `Promise`<[`Tag`](backend.Tag.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `TTagInput` |
| `id?` | `string` |

#### Returns

`Promise`<[`Tag`](backend.Tag.md)\>

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:47](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L47)

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

### deleteTag

▸ **deleteTag**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:74](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L74)

___

### getAll

▸ **getAll**(): `Promise`<[`Tag`](backend.Tag.md)[]\>

#### Returns

`Promise`<[`Tag`](backend.Tag.md)[]\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getAll](backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L31)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`Tag`](backend.Tag.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Tag`](backend.Tag.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getById](backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L36)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`Tag`](backend.Tag.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Tag`](backend.Tag.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getBySlug](backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L46)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`Tag`](backend.Tag.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`Tag`](backend.Tag.md)\> |

#### Returns

`Promise`<`TPagedList`<[`Tag`](backend.Tag.md)\>\>

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

### getTagById

▸ **getTagById**(`id`): `Promise`<`undefined` \| [`Tag`](backend.Tag.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| [`Tag`](backend.Tag.md)\>

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L23)

___

### getTagBySlug

▸ **getTagBySlug**(`slug`): `Promise`<`undefined` \| [`Tag`](backend.Tag.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<`undefined` \| [`Tag`](backend.Tag.md)\>

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L33)

___

### getTags

▸ **getTags**(`params?`): `Promise`<`TPagedList`<[`Tag`](backend.Tag.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<`TTag`\> |

#### Returns

`Promise`<`TPagedList`<[`Tag`](backend.Tag.md)\>\>

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L18)

___

### getTagsByIds

▸ **getTagsByIds**(`ids`): `Promise`<[`Tag`](backend.Tag.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `string`[] |

#### Returns

`Promise`<[`Tag`](backend.Tag.md)[]\>

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L28)

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

▸ **updateEntity**(`id`, `input`): `Promise`<[`Tag`](backend.Tag.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`Tag`](backend.Tag.md) |

#### Returns

`Promise`<[`Tag`](backend.Tag.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[updateEntity](backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:68](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L68)

___

### updateTag

▸ **updateTag**(`id`, `inputData`): `Promise`<[`Tag`](backend.Tag.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `inputData` | `TTagInput` |

#### Returns

`Promise`<[`Tag`](backend.Tag.md)\>

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:59](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L59)
