[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PageStatsRepository

# Class: PageStatsRepository

[backend](../modules/backend.md).PageStatsRepository

## Hierarchy

* *BaseRepository*<[*PageStats*](backend.pagestats.md)\>

  ↳ **PageStatsRepository**

## Table of contents

### Constructors

- [constructor](backend.pagestatsrepository.md#constructor)

### Methods

- [applyDeleteMany](backend.pagestatsrepository.md#applydeletemany)
- [createEntity](backend.pagestatsrepository.md#createentity)
- [deleteEntity](backend.pagestatsrepository.md#deleteentity)
- [deleteMany](backend.pagestatsrepository.md#deletemany)
- [getAll](backend.pagestatsrepository.md#getall)
- [getById](backend.pagestatsrepository.md#getbyid)
- [getBySlug](backend.pagestatsrepository.md#getbyslug)
- [getPaged](backend.pagestatsrepository.md#getpaged)
- [updateEntity](backend.pagestatsrepository.md#updateentity)

## Constructors

### constructor

\+ **new PageStatsRepository**(): *PageStatsRepository*

**Returns:** *PageStatsRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/PageStatsRepository.ts:7](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/PageStatsRepository.ts#L7)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*PageStats*](backend.pagestats.md)\> \| *DeleteQueryBuilder*<[*PageStats*](backend.pagestats.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*PageStats*](backend.pagestats.md)\> \| *DeleteQueryBuilder*<[*PageStats*](backend.pagestats.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### createEntity

▸ **createEntity**(`input`: [*PageStats*](backend.pagestats.md), `id?`: *string*): *Promise*<[*PageStats*](backend.pagestats.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*PageStats*](backend.pagestats.md) |
`id?` | *string* |

**Returns:** *Promise*<[*PageStats*](backend.pagestats.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### deleteEntity

▸ **deleteEntity**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L76)

___

### deleteMany

▸ **deleteMany**(`input`: TDeleteManyInput): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:97](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L97)

___

### getAll

▸ **getAll**(): *Promise*<[*PageStats*](backend.pagestats.md)[]\>

**Returns:** *Promise*<[*PageStats*](backend.pagestats.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*PageStats*](backend.pagestats.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*PageStats*](backend.pagestats.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*PageStats*](backend.pagestats.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*PageStats*](backend.pagestats.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*PageStats*](backend.pagestats.md)\>): *Promise*<TPagedList<[*PageStats*](backend.pagestats.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*PageStats*](backend.pagestats.md)\> |

**Returns:** *Promise*<TPagedList<[*PageStats*](backend.pagestats.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*PageStats*](backend.pagestats.md)): *Promise*<[*PageStats*](backend.pagestats.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*PageStats*](backend.pagestats.md) |

**Returns:** *Promise*<[*PageStats*](backend.pagestats.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L61)
