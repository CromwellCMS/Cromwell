[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PluginRepository

# Class: PluginRepository

[backend](../modules/backend.md).PluginRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`PluginEntity`](backend.PluginEntity.md)\>

  ↳ **`PluginRepository`**

## Table of contents

### Constructors

- [constructor](backend.PluginRepository.md#constructor)

### Methods

- [applyDeleteMany](backend.PluginRepository.md#applydeletemany)
- [createEntity](backend.PluginRepository.md#createentity)
- [createPlugin](backend.PluginRepository.md#createplugin)
- [deleteEntity](backend.PluginRepository.md#deleteentity)
- [deleteMany](backend.PluginRepository.md#deletemany)
- [deletePlugin](backend.PluginRepository.md#deleteplugin)
- [getAll](backend.PluginRepository.md#getall)
- [getById](backend.PluginRepository.md#getbyid)
- [getBySlug](backend.PluginRepository.md#getbyslug)
- [getPaged](backend.PluginRepository.md#getpaged)
- [getPluginById](backend.PluginRepository.md#getpluginbyid)
- [getPluginBySlug](backend.PluginRepository.md#getpluginbyslug)
- [getPluginSettings](backend.PluginRepository.md#getpluginsettings)
- [getPlugins](backend.PluginRepository.md#getplugins)
- [updateEntity](backend.PluginRepository.md#updateentity)
- [updatePlugin](backend.PluginRepository.md#updateplugin)

## Constructors

### constructor

• **new PluginRepository**()

#### Overrides

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L14)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`PluginEntity`](backend.PluginEntity.md)\> \| `DeleteQueryBuilder`<[`PluginEntity`](backend.PluginEntity.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[applyDeleteMany](backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L86)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`PluginEntity`](backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PluginEntity`](backend.PluginEntity.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`PluginEntity`](backend.PluginEntity.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[createEntity](backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L48)

___

### createPlugin

▸ **createPlugin**(`createPlugin`): `Promise`<[`PluginEntity`](backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createPlugin` | `TPluginEntityInput` |

#### Returns

`Promise`<[`PluginEntity`](backend.PluginEntity.md)\>

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

▸ **getAll**(): `Promise`<[`PluginEntity`](backend.PluginEntity.md)[]\>

#### Returns

`Promise`<[`PluginEntity`](backend.PluginEntity.md)[]\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getAll](backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`PluginEntity`](backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`PluginEntity`](backend.PluginEntity.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getById](backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L28)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`PluginEntity`](backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`PluginEntity`](backend.PluginEntity.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getBySlug](backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L38)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`PluginEntity`](backend.PluginEntity.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`PluginEntity`](backend.PluginEntity.md)\> |

#### Returns

`Promise`<`TPagedList`<[`PluginEntity`](backend.PluginEntity.md)\>\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getPaged](backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L17)

___

### getPluginById

▸ **getPluginById**(`id`): `Promise`<`undefined` \| [`PluginEntity`](backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| [`PluginEntity`](backend.PluginEntity.md)\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L23)

___

### getPluginBySlug

▸ **getPluginBySlug**(`slug`): `Promise`<`undefined` \| [`PluginEntity`](backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<`undefined` \| [`PluginEntity`](backend.PluginEntity.md)\>

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

▸ **getPlugins**(`params`): `Promise`<`TPagedList`<[`PluginEntity`](backend.PluginEntity.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TPagedParams`<[`PluginEntity`](backend.PluginEntity.md)\> |

#### Returns

`Promise`<`TPagedList`<[`PluginEntity`](backend.PluginEntity.md)\>\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L18)

___

### updateEntity

▸ **updateEntity**(`id`, `input`): `Promise`<[`PluginEntity`](backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`PluginEntity`](backend.PluginEntity.md) |

#### Returns

`Promise`<[`PluginEntity`](backend.PluginEntity.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[updateEntity](backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:60](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L60)

___

### updatePlugin

▸ **updatePlugin**(`id`, `updatePlugin`): `Promise`<[`PluginEntity`](backend.PluginEntity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updatePlugin` | `TPluginEntityInput` |

#### Returns

`Promise`<[`PluginEntity`](backend.PluginEntity.md)\>

#### Defined in

[system/core/backend/src/repositories/plugin.repository.ts:57](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/plugin.repository.ts#L57)
