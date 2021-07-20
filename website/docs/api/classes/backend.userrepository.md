[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / UserRepository

# Class: UserRepository

[backend](../modules/backend.md).UserRepository

## Hierarchy

* *BaseRepository*<[*User*](backend.user.md)\>

  ↳ **UserRepository**

## Table of contents

### Constructors

- [constructor](backend.userrepository.md#constructor)

### Methods

- [applyDeleteMany](backend.userrepository.md#applydeletemany)
- [applyUserFilter](backend.userrepository.md#applyuserfilter)
- [createEntity](backend.userrepository.md#createentity)
- [createUser](backend.userrepository.md#createuser)
- [deleteEntity](backend.userrepository.md#deleteentity)
- [deleteMany](backend.userrepository.md#deletemany)
- [deleteManyFilteredUsers](backend.userrepository.md#deletemanyfilteredusers)
- [deleteUser](backend.userrepository.md#deleteuser)
- [getAll](backend.userrepository.md#getall)
- [getById](backend.userrepository.md#getbyid)
- [getBySlug](backend.userrepository.md#getbyslug)
- [getFilteredUsers](backend.userrepository.md#getfilteredusers)
- [getPaged](backend.userrepository.md#getpaged)
- [getUserByEmail](backend.userrepository.md#getuserbyemail)
- [getUserById](backend.userrepository.md#getuserbyid)
- [getUserBySlug](backend.userrepository.md#getuserbyslug)
- [getUsers](backend.userrepository.md#getusers)
- [handleUserInput](backend.userrepository.md#handleuserinput)
- [hashPassword](backend.userrepository.md#hashpassword)
- [updateEntity](backend.userrepository.md#updateentity)
- [updateUser](backend.userrepository.md#updateuser)

## Constructors

### constructor

\+ **new UserRepository**(): *UserRepository*

**Returns:** *UserRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/UserRepository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L17)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*User*](backend.user.md)\> \| *DeleteQueryBuilder*<[*User*](backend.user.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*User*](backend.user.md)\> \| *DeleteQueryBuilder*<[*User*](backend.user.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### applyUserFilter

▸ **applyUserFilter**(`qb`: *SelectQueryBuilder*<TUser\> \| *DeleteQueryBuilder*<TUser\>, `filterParams?`: [*UserFilterInput*](backend.userfilterinput.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<TUser\> \| *DeleteQueryBuilder*<TUser\> |
`filterParams?` | [*UserFilterInput*](backend.userfilterinput.md) |

**Returns:** *void*

Defined in: [system/core/backend/src/repositories/UserRepository.ts:121](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L121)

___

### createEntity

▸ **createEntity**(`input`: [*User*](backend.user.md), `id?`: *string*): *Promise*<[*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*User*](backend.user.md) |
`id?` | *string* |

**Returns:** *Promise*<[*User*](backend.user.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### createUser

▸ **createUser**(`createUser`: TCreateUser, `id?`: *string*): *Promise*<[*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`createUser` | TCreateUser |
`id?` | *string* |

**Returns:** *Promise*<[*User*](backend.user.md)\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:62](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L62)

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

### deleteManyFilteredUsers

▸ **deleteManyFilteredUsers**(`input`: TDeleteManyInput, `filterParams?`: [*UserFilterInput*](backend.userfilterinput.md)): *Promise*<undefined \| boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | [*UserFilterInput*](backend.userfilterinput.md) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:164](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L164)

___

### deleteUser

▸ **deleteUser**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:108](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L108)

___

### getAll

▸ **getAll**(): *Promise*<[*User*](backend.user.md)[]\>

**Returns:** *Promise*<[*User*](backend.user.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*User*](backend.user.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*User*](backend.user.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getFilteredUsers

▸ **getFilteredUsers**(`pagedParams?`: *PagedParamsInput*<TUser\>, `filterParams?`: [*UserFilterInput*](backend.userfilterinput.md)): *Promise*<TPagedList<TUser\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *PagedParamsInput*<TUser\> |
`filterParams?` | [*UserFilterInput*](backend.userfilterinput.md) |

**Returns:** *Promise*<TPagedList<TUser\>\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:157](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L157)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*User*](backend.user.md)\>): *Promise*<TPagedList<[*User*](backend.user.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*User*](backend.user.md)\> |

**Returns:** *Promise*<TPagedList<[*User*](backend.user.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### getUserByEmail

▸ **getUserByEmail**(`email`: *string*): *Promise*<undefined \| [*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`email` | *string* |

**Returns:** *Promise*<undefined \| [*User*](backend.user.md)\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:33](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L33)

___

### getUserById

▸ **getUserById**(`id`: *string*): *Promise*<undefined \| [*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<undefined \| [*User*](backend.user.md)\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L28)

___

### getUserBySlug

▸ **getUserBySlug**(`slug`: *string*): *Promise*<undefined \| [*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |

**Returns:** *Promise*<undefined \| [*User*](backend.user.md)\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:43](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L43)

___

### getUsers

▸ **getUsers**(`params?`: *TPagedParams*<[*User*](backend.user.md)\>): *Promise*<TPagedList<[*User*](backend.user.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*User*](backend.user.md)\> |

**Returns:** *Promise*<TPagedList<[*User*](backend.user.md)\>\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L23)

___

### handleUserInput

▸ **handleUserInput**(`user`: [*User*](backend.user.md), `userInput`: TUpdateUser): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`user` | [*User*](backend.user.md) |
`userInput` | TUpdateUser |

**Returns:** *Promise*<void\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L48)

___

### hashPassword

▸ **hashPassword**(`password`: *string*): *Promise*<string\>

#### Parameters:

Name | Type |
:------ | :------ |
`password` | *string* |

**Returns:** *Promise*<string\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:88](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L88)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*User*](backend.user.md)): *Promise*<[*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*User*](backend.user.md) |

**Returns:** *Promise*<[*User*](backend.user.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/BaseRepository.ts#L61)

___

### updateUser

▸ **updateUser**(`id`: *string*, `updateUser`: TUpdateUser): *Promise*<[*User*](backend.user.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`updateUser` | TUpdateUser |

**Returns:** *Promise*<[*User*](backend.user.md)\>

Defined in: [system/core/backend/src/repositories/UserRepository.ts:92](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/repositories/UserRepository.ts#L92)
