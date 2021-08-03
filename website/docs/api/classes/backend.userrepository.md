[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / UserRepository

# Class: UserRepository

[backend](../modules/backend.md).UserRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`User`](backend.User.md)\>

  ↳ **`UserRepository`**

## Table of contents

### Constructors

- [constructor](backend.UserRepository.md#constructor)

### Methods

- [applyDeleteMany](backend.UserRepository.md#applydeletemany)
- [applyUserFilter](backend.UserRepository.md#applyuserfilter)
- [createEntity](backend.UserRepository.md#createentity)
- [createUser](backend.UserRepository.md#createuser)
- [deleteEntity](backend.UserRepository.md#deleteentity)
- [deleteMany](backend.UserRepository.md#deletemany)
- [deleteManyFilteredUsers](backend.UserRepository.md#deletemanyfilteredusers)
- [deleteUser](backend.UserRepository.md#deleteuser)
- [getAll](backend.UserRepository.md#getall)
- [getById](backend.UserRepository.md#getbyid)
- [getBySlug](backend.UserRepository.md#getbyslug)
- [getFilteredUsers](backend.UserRepository.md#getfilteredusers)
- [getPaged](backend.UserRepository.md#getpaged)
- [getUserByEmail](backend.UserRepository.md#getuserbyemail)
- [getUserById](backend.UserRepository.md#getuserbyid)
- [getUserBySlug](backend.UserRepository.md#getuserbyslug)
- [getUsers](backend.UserRepository.md#getusers)
- [handleUserInput](backend.UserRepository.md#handleuserinput)
- [hashPassword](backend.UserRepository.md#hashpassword)
- [updateEntity](backend.UserRepository.md#updateentity)
- [updateUser](backend.UserRepository.md#updateuser)

## Constructors

### constructor

• **new UserRepository**()

#### Overrides

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L19)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`User`](backend.User.md)\> \| `DeleteQueryBuilder`<[`User`](backend.User.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[applyDeleteMany](backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L86)

___

### applyUserFilter

▸ **applyUserFilter**(`qb`, `filterParams?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`TUser`\> \| `DeleteQueryBuilder`<`TUser`\> |
| `filterParams?` | [`UserFilterInput`](backend.UserFilterInput.md) |

#### Returns

`void`

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:121](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L121)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`User`](backend.User.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`User`](backend.User.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[createEntity](backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L48)

___

### createUser

▸ **createUser**(`createUser`, `id?`): `Promise`<[`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createUser` | `TCreateUser` |
| `id?` | `string` |

#### Returns

`Promise`<[`User`](backend.User.md)\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:62](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L62)

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

### deleteManyFilteredUsers

▸ **deleteManyFilteredUsers**(`input`, `filterParams?`): `Promise`<`undefined` \| `boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | [`UserFilterInput`](backend.UserFilterInput.md) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:164](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L164)

___

### deleteUser

▸ **deleteUser**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:108](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L108)

___

### getAll

▸ **getAll**(): `Promise`<[`User`](backend.User.md)[]\>

#### Returns

`Promise`<[`User`](backend.User.md)[]\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getAll](backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getById](backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L28)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getBySlug](backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L38)

___

### getFilteredUsers

▸ **getFilteredUsers**(`pagedParams?`, `filterParams?`): `Promise`<`TPagedList`<`TUser`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | [`PagedParamsInput`](backend.PagedParamsInput.md)<`TUser`\> |
| `filterParams?` | [`UserFilterInput`](backend.UserFilterInput.md) |

#### Returns

`Promise`<`TPagedList`<`TUser`\>\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:157](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L157)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`User`](backend.User.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`User`](backend.User.md)\> |

#### Returns

`Promise`<`TPagedList`<[`User`](backend.User.md)\>\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getPaged](backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L17)

___

### getUserByEmail

▸ **getUserByEmail**(`email`): `Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L33)

___

### getUserById

▸ **getUserById**(`id`): `Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L28)

___

### getUserBySlug

▸ **getUserBySlug**(`slug`): `Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<`undefined` \| [`User`](backend.User.md)\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:43](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L43)

___

### getUsers

▸ **getUsers**(`params?`): `Promise`<`TPagedList`<[`User`](backend.User.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`User`](backend.User.md)\> |

#### Returns

`Promise`<`TPagedList`<[`User`](backend.User.md)\>\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L23)

___

### handleUserInput

▸ **handleUserInput**(`user`, `userInput`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](backend.User.md) |
| `userInput` | `TUpdateUser` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L48)

___

### hashPassword

▸ **hashPassword**(`password`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:88](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L88)

___

### updateEntity

▸ **updateEntity**(`id`, `input`): `Promise`<[`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`User`](backend.User.md) |

#### Returns

`Promise`<[`User`](backend.User.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[updateEntity](backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:60](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L60)

___

### updateUser

▸ **updateUser**(`id`, `updateUser`): `Promise`<[`User`](backend.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updateUser` | `TUpdateUser` |

#### Returns

`Promise`<[`User`](backend.User.md)\>

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:92](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L92)
