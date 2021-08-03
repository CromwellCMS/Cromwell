[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / AttributeRepository

# Class: AttributeRepository

[backend](../modules/backend.md).AttributeRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`Attribute`](backend.Attribute.md)\>

  ↳ **`AttributeRepository`**

## Table of contents

### Constructors

- [constructor](backend.AttributeRepository.md#constructor)

### Methods

- [applyDeleteMany](backend.AttributeRepository.md#applydeletemany)
- [createAttribute](backend.AttributeRepository.md#createattribute)
- [createEntity](backend.AttributeRepository.md#createentity)
- [deleteAttribute](backend.AttributeRepository.md#deleteattribute)
- [deleteEntity](backend.AttributeRepository.md#deleteentity)
- [deleteMany](backend.AttributeRepository.md#deletemany)
- [getAll](backend.AttributeRepository.md#getall)
- [getAttribute](backend.AttributeRepository.md#getattribute)
- [getAttributes](backend.AttributeRepository.md#getattributes)
- [getById](backend.AttributeRepository.md#getbyid)
- [getBySlug](backend.AttributeRepository.md#getbyslug)
- [getPaged](backend.AttributeRepository.md#getpaged)
- [handleAttributeInput](backend.AttributeRepository.md#handleattributeinput)
- [updateAttribute](backend.AttributeRepository.md#updateattribute)
- [updateEntity](backend.AttributeRepository.md#updateentity)

## Constructors

### constructor

• **new AttributeRepository**(`EntityClass`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `EntityClass` | (...`args`: `any`[]) => [`Attribute`](backend.Attribute.md) & { `id?`: `string`  } |

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L11)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`Attribute`](backend.Attribute.md)\> \| `DeleteQueryBuilder`<[`Attribute`](backend.Attribute.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[applyDeleteMany](backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L86)

___

### createAttribute

▸ **createAttribute**(`createAttribute`, `id?`): `Promise`<`TAttribute`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createAttribute` | `TAttributeInput` |
| `id?` | `string` |

#### Returns

`Promise`<`TAttribute`\>

#### Defined in

[system/core/backend/src/repositories/attribute.repository.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/attribute.repository.ts#L34)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`Attribute`](backend.Attribute.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`Attribute`](backend.Attribute.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`Attribute`](backend.Attribute.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[createEntity](backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L48)

___

### deleteAttribute

▸ **deleteAttribute**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/attribute.repository.ts:62](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/attribute.repository.ts#L62)

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

▸ **getAll**(): `Promise`<[`Attribute`](backend.Attribute.md)[]\>

#### Returns

`Promise`<[`Attribute`](backend.Attribute.md)[]\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getAll](backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

___

### getAttribute

▸ **getAttribute**(`id`): `Promise`<`undefined` \| [`Attribute`](backend.Attribute.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| [`Attribute`](backend.Attribute.md)\>

#### Defined in

[system/core/backend/src/repositories/attribute.repository.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/attribute.repository.ts#L19)

___

### getAttributes

▸ **getAttributes**(): `Promise`<[`Attribute`](backend.Attribute.md)[]\>

#### Returns

`Promise`<[`Attribute`](backend.Attribute.md)[]\>

#### Defined in

[system/core/backend/src/repositories/attribute.repository.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/attribute.repository.ts#L14)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`Attribute`](backend.Attribute.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Attribute`](backend.Attribute.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getById](backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L28)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`Attribute`](backend.Attribute.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Attribute`](backend.Attribute.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getBySlug](backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L38)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`Attribute`](backend.Attribute.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`Attribute`](backend.Attribute.md)\> |

#### Returns

`Promise`<`TPagedList`<[`Attribute`](backend.Attribute.md)\>\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getPaged](backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L17)

___

### handleAttributeInput

▸ **handleAttributeInput**(`attribute`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `attribute` | [`Attribute`](backend.Attribute.md) |
| `input` | `TAttributeInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/repositories/attribute.repository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/attribute.repository.ts#L24)

___

### updateAttribute

▸ **updateAttribute**(`id`, `updateAttribute`): `Promise`<[`Attribute`](backend.Attribute.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updateAttribute` | `TAttributeInput` |

#### Returns

`Promise`<[`Attribute`](backend.Attribute.md)\>

#### Defined in

[system/core/backend/src/repositories/attribute.repository.ts:47](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/attribute.repository.ts#L47)

___

### updateEntity

▸ **updateEntity**(`id`, `input`): `Promise`<[`Attribute`](backend.Attribute.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`Attribute`](backend.Attribute.md) |

#### Returns

`Promise`<[`Attribute`](backend.Attribute.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[updateEntity](backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:60](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L60)
