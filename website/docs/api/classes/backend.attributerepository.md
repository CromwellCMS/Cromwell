[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / AttributeRepository

# Class: AttributeRepository

[backend](../modules/backend.md).AttributeRepository

## Hierarchy

* *BaseRepository*<[*Attribute*](backend.attribute.md)\>

  ↳ **AttributeRepository**

## Table of contents

### Constructors

- [constructor](backend.attributerepository.md#constructor)

### Methods

- [applyDeleteMany](backend.attributerepository.md#applydeletemany)
- [createAttribute](backend.attributerepository.md#createattribute)
- [createEntity](backend.attributerepository.md#createentity)
- [deleteAttribute](backend.attributerepository.md#deleteattribute)
- [deleteEntity](backend.attributerepository.md#deleteentity)
- [deleteMany](backend.attributerepository.md#deletemany)
- [getAll](backend.attributerepository.md#getall)
- [getAttribute](backend.attributerepository.md#getattribute)
- [getAttributes](backend.attributerepository.md#getattributes)
- [getById](backend.attributerepository.md#getbyid)
- [getBySlug](backend.attributerepository.md#getbyslug)
- [getPaged](backend.attributerepository.md#getpaged)
- [handleAttributeInput](backend.attributerepository.md#handleattributeinput)
- [updateAttribute](backend.attributerepository.md#updateattribute)
- [updateEntity](backend.attributerepository.md#updateentity)

## Constructors

### constructor

\+ **new AttributeRepository**(`EntityClass`: (...`args`: *any*[]) => [*Attribute*](backend.attribute.md) & { `id?`: *undefined* \| *string*  }): *AttributeRepository*

#### Parameters:

Name | Type |
:------ | :------ |
`EntityClass` | (...`args`: *any*[]) => [*Attribute*](backend.attribute.md) & { `id?`: *undefined* \| *string*  } |

**Returns:** *AttributeRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:10](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L10)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*Attribute*](backend.attribute.md)\> \| *DeleteQueryBuilder*<[*Attribute*](backend.attribute.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*Attribute*](backend.attribute.md)\> \| *DeleteQueryBuilder*<[*Attribute*](backend.attribute.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### createAttribute

▸ **createAttribute**(`createAttribute`: TAttributeInput, `id?`: *string*): *Promise*<TAttribute\>

#### Parameters:

Name | Type |
:------ | :------ |
`createAttribute` | TAttributeInput |
`id?` | *string* |

**Returns:** *Promise*<TAttribute\>

Defined in: [system/core/backend/src/repositories/AttributeRepository.ts:34](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/AttributeRepository.ts#L34)

___

### createEntity

▸ **createEntity**(`input`: [*Attribute*](backend.attribute.md), `id?`: *string*): *Promise*<[*Attribute*](backend.attribute.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*Attribute*](backend.attribute.md) |
`id?` | *string* |

**Returns:** *Promise*<[*Attribute*](backend.attribute.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### deleteAttribute

▸ **deleteAttribute**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/AttributeRepository.ts:62](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/AttributeRepository.ts#L62)

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

### getAll

▸ **getAll**(): *Promise*<[*Attribute*](backend.attribute.md)[]\>

**Returns:** *Promise*<[*Attribute*](backend.attribute.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getAttribute

▸ **getAttribute**(`id`: *string*): *Promise*<undefined \| [*Attribute*](backend.attribute.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<undefined \| [*Attribute*](backend.attribute.md)\>

Defined in: [system/core/backend/src/repositories/AttributeRepository.ts:19](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/AttributeRepository.ts#L19)

___

### getAttributes

▸ **getAttributes**(): *Promise*<[*Attribute*](backend.attribute.md)[]\>

**Returns:** *Promise*<[*Attribute*](backend.attribute.md)[]\>

Defined in: [system/core/backend/src/repositories/AttributeRepository.ts:14](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/AttributeRepository.ts#L14)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Attribute*](backend.attribute.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Attribute*](backend.attribute.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Attribute*](backend.attribute.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Attribute*](backend.attribute.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*Attribute*](backend.attribute.md)\>): *Promise*<TPagedList<[*Attribute*](backend.attribute.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*Attribute*](backend.attribute.md)\> |

**Returns:** *Promise*<TPagedList<[*Attribute*](backend.attribute.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### handleAttributeInput

▸ **handleAttributeInput**(`attribute`: [*Attribute*](backend.attribute.md), `input`: TAttributeInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`attribute` | [*Attribute*](backend.attribute.md) |
`input` | TAttributeInput |

**Returns:** *Promise*<void\>

Defined in: [system/core/backend/src/repositories/AttributeRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/AttributeRepository.ts#L24)

___

### updateAttribute

▸ **updateAttribute**(`id`: *string*, `updateAttribute`: TAttributeInput): *Promise*<[*Attribute*](backend.attribute.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`updateAttribute` | TAttributeInput |

**Returns:** *Promise*<[*Attribute*](backend.attribute.md)\>

Defined in: [system/core/backend/src/repositories/AttributeRepository.ts:47](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/AttributeRepository.ts#L47)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*Attribute*](backend.attribute.md)): *Promise*<[*Attribute*](backend.attribute.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*Attribute*](backend.attribute.md) |

**Returns:** *Promise*<[*Attribute*](backend.attribute.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L61)
