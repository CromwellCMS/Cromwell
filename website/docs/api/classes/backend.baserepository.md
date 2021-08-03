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

### Methods

- [applyDeleteMany](backend.BaseRepository.md#applydeletemany)
- [createEntity](backend.BaseRepository.md#createentity)
- [deleteEntity](backend.BaseRepository.md#deleteentity)
- [deleteMany](backend.BaseRepository.md#deletemany)
- [getAll](backend.BaseRepository.md#getall)
- [getById](backend.BaseRepository.md#getbyid)
- [getBySlug](backend.BaseRepository.md#getbyslug)
- [getPaged](backend.BaseRepository.md#getpaged)
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

[system/core/backend/src/repositories/base.repository.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L86)

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

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:96](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L96)

___

### getAll

▸ **getAll**(): `Promise`<`EntityType`[]\>

#### Returns

`Promise`<`EntityType`[]\>

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

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

[system/core/backend/src/repositories/base.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L28)

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

[system/core/backend/src/repositories/base.repository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L38)

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

[system/core/backend/src/repositories/base.repository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L17)

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

[system/core/backend/src/repositories/base.repository.ts:60](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L60)
