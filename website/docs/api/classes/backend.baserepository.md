[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / BaseRepository

# Class: BaseRepository<EntityType, EntityInputType\>

[backend](../modules/backend.md).BaseRepository

## Type parameters

Name | Default |
:------ | :------ |
`EntityType` | - |
`EntityInputType` | EntityType |

## Hierarchy

* *Repository*<EntityType\>

  ↳ **BaseRepository**

## Table of contents

### Constructors

- [constructor](backend.baserepository.md#constructor)

### Methods

- [applyDeleteMany](backend.baserepository.md#applydeletemany)
- [createEntity](backend.baserepository.md#createentity)
- [deleteEntity](backend.baserepository.md#deleteentity)
- [deleteMany](backend.baserepository.md#deletemany)
- [getAll](backend.baserepository.md#getall)
- [getById](backend.baserepository.md#getbyid)
- [getBySlug](backend.baserepository.md#getbyslug)
- [getPaged](backend.baserepository.md#getpaged)
- [updateEntity](backend.baserepository.md#updateentity)

## Constructors

### constructor

\+ **new BaseRepository**<EntityType, EntityInputType\>(`EntityClass`: (...`args`: *any*[]) => EntityType & { `id?`: *undefined* \| *string*  }): *BaseRepository*<EntityType, EntityInputType\>

#### Type parameters:

Name | Default |
:------ | :------ |
`EntityType` | - |
`EntityInputType` | EntityType |

#### Parameters:

Name | Type |
:------ | :------ |
`EntityClass` | (...`args`: *any*[]) => EntityType & { `id?`: *undefined* \| *string*  } |

**Returns:** *BaseRepository*<EntityType, EntityInputType\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:10](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L10)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<EntityType\> \| *DeleteQueryBuilder*<EntityType\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<EntityType\> \| *DeleteQueryBuilder*<EntityType\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### createEntity

▸ **createEntity**(`input`: EntityInputType, `id?`: *string*): *Promise*<EntityType\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | EntityInputType |
`id?` | *string* |

**Returns:** *Promise*<EntityType\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### deleteEntity

▸ **deleteEntity**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L76)

___

### deleteMany

▸ **deleteMany**(`input`: TDeleteManyInput): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:97](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L97)

___

### getAll

▸ **getAll**(): *Promise*<EntityType[]\>

**Returns:** *Promise*<EntityType[]\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| EntityType\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| EntityType\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| EntityType\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| EntityType\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<EntityType\>): *Promise*<TPagedList<EntityType\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<EntityType\> |

**Returns:** *Promise*<TPagedList<EntityType\>\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: EntityInputType): *Promise*<EntityType\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | EntityInputType |

**Returns:** *Promise*<EntityType\>

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/repositories/BaseRepository.ts#L61)
