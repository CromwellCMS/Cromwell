[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / TagRepository

# Class: TagRepository

[backend](../modules/backend.md).TagRepository

## Hierarchy

* *BaseRepository*<[*Tag*](backend.tag.md)\>

  ↳ **TagRepository**

## Table of contents

### Constructors

- [constructor](backend.tagrepository.md#constructor)

### Methods

- [applyDeleteMany](backend.tagrepository.md#applydeletemany)
- [createEntity](backend.tagrepository.md#createentity)
- [createTag](backend.tagrepository.md#createtag)
- [deleteEntity](backend.tagrepository.md#deleteentity)
- [deleteMany](backend.tagrepository.md#deletemany)
- [deleteTag](backend.tagrepository.md#deletetag)
- [getAll](backend.tagrepository.md#getall)
- [getById](backend.tagrepository.md#getbyid)
- [getBySlug](backend.tagrepository.md#getbyslug)
- [getPaged](backend.tagrepository.md#getpaged)
- [getTagById](backend.tagrepository.md#gettagbyid)
- [getTagBySlug](backend.tagrepository.md#gettagbyslug)
- [getTags](backend.tagrepository.md#gettags)
- [getTagsByIds](backend.tagrepository.md#gettagsbyids)
- [updateEntity](backend.tagrepository.md#updateentity)
- [updateTag](backend.tagrepository.md#updatetag)

## Constructors

### constructor

\+ **new TagRepository**(): *TagRepository*

**Returns:** *TagRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/TagRepository.ts:12](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/TagRepository.ts#L12)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*Tag*](backend.tag.md)\> \| *DeleteQueryBuilder*<[*Tag*](backend.tag.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*Tag*](backend.tag.md)\> \| *DeleteQueryBuilder*<[*Tag*](backend.tag.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### createEntity

▸ **createEntity**(`input`: [*Tag*](backend.tag.md), `id?`: *string*): *Promise*<[*Tag*](backend.tag.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*Tag*](backend.tag.md) |
`id?` | *string* |

**Returns:** *Promise*<[*Tag*](backend.tag.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### createTag

▸ **createTag**(`inputData`: TTagInput, `id?`: *string*): *Promise*<[*Tag*](backend.tag.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`inputData` | TTagInput |
`id?` | *string* |

**Returns:** *Promise*<[*Tag*](backend.tag.md)\>

Defined in: [system/core/backend/src/repositories/TagRepository.ts:47](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/TagRepository.ts#L47)

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

### deleteTag

▸ **deleteTag**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/TagRepository.ts:74](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/TagRepository.ts#L74)

___

### getAll

▸ **getAll**(): *Promise*<[*Tag*](backend.tag.md)[]\>

**Returns:** *Promise*<[*Tag*](backend.tag.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Tag*](backend.tag.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Tag*](backend.tag.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Tag*](backend.tag.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Tag*](backend.tag.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*Tag*](backend.tag.md)\>): *Promise*<TPagedList<[*Tag*](backend.tag.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*Tag*](backend.tag.md)\> |

**Returns:** *Promise*<TPagedList<[*Tag*](backend.tag.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### getTagById

▸ **getTagById**(`id`: *string*): *Promise*<undefined \| [*Tag*](backend.tag.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<undefined \| [*Tag*](backend.tag.md)\>

Defined in: [system/core/backend/src/repositories/TagRepository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/TagRepository.ts#L23)

___

### getTagBySlug

▸ **getTagBySlug**(`slug`: *string*): *Promise*<undefined \| [*Tag*](backend.tag.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |

**Returns:** *Promise*<undefined \| [*Tag*](backend.tag.md)\>

Defined in: [system/core/backend/src/repositories/TagRepository.ts:33](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/TagRepository.ts#L33)

___

### getTags

▸ **getTags**(`params?`: *TPagedParams*<TTag\>): *Promise*<TPagedList<[*Tag*](backend.tag.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<TTag\> |

**Returns:** *Promise*<TPagedList<[*Tag*](backend.tag.md)\>\>

Defined in: [system/core/backend/src/repositories/TagRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/TagRepository.ts#L18)

___

### getTagsByIds

▸ **getTagsByIds**(`ids`: *string*[]): *Promise*<[*Tag*](backend.tag.md)[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`ids` | *string*[] |

**Returns:** *Promise*<[*Tag*](backend.tag.md)[]\>

Defined in: [system/core/backend/src/repositories/TagRepository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/TagRepository.ts#L28)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*Tag*](backend.tag.md)): *Promise*<[*Tag*](backend.tag.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*Tag*](backend.tag.md) |

**Returns:** *Promise*<[*Tag*](backend.tag.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/BaseRepository.ts#L61)

___

### updateTag

▸ **updateTag**(`id`: *string*, `inputData`: TTagInput): *Promise*<undefined \| [*Tag*](backend.tag.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`inputData` | TTagInput |

**Returns:** *Promise*<undefined \| [*Tag*](backend.tag.md)\>

Defined in: [system/core/backend/src/repositories/TagRepository.ts:59](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/backend/src/repositories/TagRepository.ts#L59)
