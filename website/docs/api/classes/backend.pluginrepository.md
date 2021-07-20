[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PluginRepository

# Class: PluginRepository

[backend](../modules/backend.md).PluginRepository

## Hierarchy

* *BaseRepository*<[*PluginEntity*](backend.pluginentity.md)\>

  ↳ **PluginRepository**

## Table of contents

### Constructors

- [constructor](backend.pluginrepository.md#constructor)

### Methods

- [applyDeleteMany](backend.pluginrepository.md#applydeletemany)
- [createEntity](backend.pluginrepository.md#createentity)
- [createPlugin](backend.pluginrepository.md#createplugin)
- [deleteEntity](backend.pluginrepository.md#deleteentity)
- [deleteMany](backend.pluginrepository.md#deletemany)
- [deletePlugin](backend.pluginrepository.md#deleteplugin)
- [getAll](backend.pluginrepository.md#getall)
- [getById](backend.pluginrepository.md#getbyid)
- [getBySlug](backend.pluginrepository.md#getbyslug)
- [getPaged](backend.pluginrepository.md#getpaged)
- [getPluginById](backend.pluginrepository.md#getpluginbyid)
- [getPluginBySlug](backend.pluginrepository.md#getpluginbyslug)
- [getPluginSettings](backend.pluginrepository.md#getpluginsettings)
- [getPlugins](backend.pluginrepository.md#getplugins)
- [updateEntity](backend.pluginrepository.md#updateentity)
- [updatePlugin](backend.pluginrepository.md#updateplugin)

## Constructors

### constructor

\+ **new PluginRepository**(): *PluginRepository*

**Returns:** *PluginRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/PluginRepository.ts:12](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/PluginRepository.ts#L12)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*PluginEntity*](backend.pluginentity.md)\> \| *DeleteQueryBuilder*<[*PluginEntity*](backend.pluginentity.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*PluginEntity*](backend.pluginentity.md)\> \| *DeleteQueryBuilder*<[*PluginEntity*](backend.pluginentity.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### createEntity

▸ **createEntity**(`input`: [*PluginEntity*](backend.pluginentity.md), `id?`: *string*): *Promise*<[*PluginEntity*](backend.pluginentity.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*PluginEntity*](backend.pluginentity.md) |
`id?` | *string* |

**Returns:** *Promise*<[*PluginEntity*](backend.pluginentity.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### createPlugin

▸ **createPlugin**(`createPlugin`: TPluginEntityInput): *Promise*<[*PluginEntity*](backend.pluginentity.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`createPlugin` | TPluginEntityInput |

**Returns:** *Promise*<[*PluginEntity*](backend.pluginentity.md)\>

Defined in: [system/core/backend/src/repositories/PluginRepository.ts:45](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/PluginRepository.ts#L45)

___

### deleteEntity

▸ **deleteEntity**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L76)

___

### deleteMany

▸ **deleteMany**(`input`: TDeleteManyInput): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:97](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L97)

___

### deletePlugin

▸ **deletePlugin**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/PluginRepository.ts:71](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/PluginRepository.ts#L71)

___

### getAll

▸ **getAll**(): *Promise*<[*PluginEntity*](backend.pluginentity.md)[]\>

**Returns:** *Promise*<[*PluginEntity*](backend.pluginentity.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*PluginEntity*](backend.pluginentity.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*PluginEntity*](backend.pluginentity.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*PluginEntity*](backend.pluginentity.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*PluginEntity*](backend.pluginentity.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*PluginEntity*](backend.pluginentity.md)\>): *Promise*<TPagedList<[*PluginEntity*](backend.pluginentity.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*PluginEntity*](backend.pluginentity.md)\> |

**Returns:** *Promise*<TPagedList<[*PluginEntity*](backend.pluginentity.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### getPluginById

▸ **getPluginById**(`id`: *string*): *Promise*<undefined \| [*PluginEntity*](backend.pluginentity.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<undefined \| [*PluginEntity*](backend.pluginentity.md)\>

Defined in: [system/core/backend/src/repositories/PluginRepository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/PluginRepository.ts#L23)

___

### getPluginBySlug

▸ **getPluginBySlug**(`slug`: *string*): *Promise*<undefined \| [*PluginEntity*](backend.pluginentity.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |

**Returns:** *Promise*<undefined \| [*PluginEntity*](backend.pluginentity.md)\>

Defined in: [system/core/backend/src/repositories/PluginRepository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/PluginRepository.ts#L28)

___

### getPluginSettings

▸ **getPluginSettings**<T\>(`pluginName`: *string*): *Promise*<undefined \| T\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`pluginName` | *string* |

**Returns:** *Promise*<undefined \| T\>

Defined in: [system/core/backend/src/repositories/PluginRepository.ts:83](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/PluginRepository.ts#L83)

___

### getPlugins

▸ **getPlugins**(`params`: *TPagedParams*<[*PluginEntity*](backend.pluginentity.md)\>): *Promise*<TPagedList<[*PluginEntity*](backend.pluginentity.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params` | *TPagedParams*<[*PluginEntity*](backend.pluginentity.md)\> |

**Returns:** *Promise*<TPagedList<[*PluginEntity*](backend.pluginentity.md)\>\>

Defined in: [system/core/backend/src/repositories/PluginRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/PluginRepository.ts#L18)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*PluginEntity*](backend.pluginentity.md)): *Promise*<[*PluginEntity*](backend.pluginentity.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*PluginEntity*](backend.pluginentity.md) |

**Returns:** *Promise*<[*PluginEntity*](backend.pluginentity.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L61)

___

### updatePlugin

▸ **updatePlugin**(`id`: *string*, `updatePlugin`: TPluginEntityInput): *Promise*<[*PluginEntity*](backend.pluginentity.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`updatePlugin` | TPluginEntityInput |

**Returns:** *Promise*<[*PluginEntity*](backend.pluginentity.md)\>

Defined in: [system/core/backend/src/repositories/PluginRepository.ts:57](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/PluginRepository.ts#L57)
