[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / TagRepository

# Class: TagRepository

[backend](../modules/backend.md).TagRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`Tag`](backend.Tag.md)\>

  ↳ **`TagRepository`**

## Table of contents

### Constructors

- [constructor](backend.TagRepository.md#constructor)

### Methods

- [applyDeleteMany](backend.TagRepository.md#applydeletemany)
- [createEntity](backend.TagRepository.md#createentity)
- [createTag](backend.TagRepository.md#createtag)
- [deleteEntity](backend.TagRepository.md#deleteentity)
- [deleteMany](backend.TagRepository.md#deletemany)
- [deleteTag](backend.TagRepository.md#deletetag)
- [getAll](backend.TagRepository.md#getall)
- [getById](backend.TagRepository.md#getbyid)
- [getBySlug](backend.TagRepository.md#getbyslug)
- [getPaged](backend.TagRepository.md#getpaged)
- [getTagById](backend.TagRepository.md#gettagbyid)
- [getTagBySlug](backend.TagRepository.md#gettagbyslug)
- [getTags](backend.TagRepository.md#gettags)
- [getTagsByIds](backend.TagRepository.md#gettagsbyids)
- [updateEntity](backend.TagRepository.md#updateentity)
- [updateTag](backend.TagRepository.md#updatetag)

## Constructors

### constructor

• **new TagRepository**()

#### Overrides

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/tag.repository.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/tag.repository.ts#L14)

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

[system/core/backend/src/repositories/base.repository.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L86)

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

[system/core/backend/src/repositories/base.repository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L48)

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

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

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

[system/core/backend/src/repositories/base.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L28)

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

[system/core/backend/src/repositories/base.repository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L38)

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

[system/core/backend/src/repositories/base.repository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L17)

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

[system/core/backend/src/repositories/base.repository.ts:60](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L60)

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
