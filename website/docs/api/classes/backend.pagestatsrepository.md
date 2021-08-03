[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PageStatsRepository

# Class: PageStatsRepository

[backend](../modules/backend.md).PageStatsRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`PageStats`](backend.PageStats.md)\>

  ↳ **`PageStatsRepository`**

## Table of contents

### Constructors

- [constructor](backend.PageStatsRepository.md#constructor)

### Methods

- [applyDeleteMany](backend.PageStatsRepository.md#applydeletemany)
- [createEntity](backend.PageStatsRepository.md#createentity)
- [deleteEntity](backend.PageStatsRepository.md#deleteentity)
- [deleteMany](backend.PageStatsRepository.md#deletemany)
- [getAll](backend.PageStatsRepository.md#getall)
- [getById](backend.PageStatsRepository.md#getbyid)
- [getBySlug](backend.PageStatsRepository.md#getbyslug)
- [getPaged](backend.PageStatsRepository.md#getpaged)
- [updateEntity](backend.PageStatsRepository.md#updateentity)

## Constructors

### constructor

• **new PageStatsRepository**()

#### Overrides

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/page-stats.repository.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/page-stats.repository.ts#L9)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`PageStats`](backend.PageStats.md)\> \| `DeleteQueryBuilder`<[`PageStats`](backend.PageStats.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[applyDeleteMany](backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L86)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`PageStats`](backend.PageStats.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PageStats`](backend.PageStats.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`PageStats`](backend.PageStats.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[createEntity](backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L48)

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

[system/core/backend/src/repositories/base.repository.ts:75](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L75)

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

[system/core/backend/src/repositories/base.repository.ts:96](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L96)

___

### getAll

▸ **getAll**(): `Promise`<[`PageStats`](backend.PageStats.md)[]\>

#### Returns

`Promise`<[`PageStats`](backend.PageStats.md)[]\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getAll](backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`PageStats`](backend.PageStats.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`PageStats`](backend.PageStats.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getById](backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L28)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`PageStats`](backend.PageStats.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`PageStats`](backend.PageStats.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getBySlug](backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L38)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`PageStats`](backend.PageStats.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`PageStats`](backend.PageStats.md)\> |

#### Returns

`Promise`<`TPagedList`<[`PageStats`](backend.PageStats.md)\>\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getPaged](backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L17)

___

### updateEntity

▸ **updateEntity**(`id`, `input`): `Promise`<[`PageStats`](backend.PageStats.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`PageStats`](backend.PageStats.md) |

#### Returns

`Promise`<[`PageStats`](backend.PageStats.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[updateEntity](backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:60](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L60)
