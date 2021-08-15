[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / UserRepository

# Class: UserRepository

[backend](../modules/backend.md).UserRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`User`](backend.User.md)\>

  ↳ **`UserRepository`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [dbType](#dbtype)

### Methods

- [applyDeleteMany](#applydeletemany)
- [applyUserFilter](#applyuserfilter)
- [createEntity](#createentity)
- [createUser](#createuser)
- [deleteEntity](#deleteentity)
- [deleteMany](#deletemany)
- [deleteManyFilteredUsers](#deletemanyfilteredusers)
- [deleteUser](#deleteuser)
- [getAll](#getall)
- [getById](#getbyid)
- [getBySlug](#getbyslug)
- [getFilteredUsers](#getfilteredusers)
- [getPaged](#getpaged)
- [getSqlBoolStr](#getsqlboolstr)
- [getSqlLike](#getsqllike)
- [getUserByEmail](#getuserbyemail)
- [getUserById](#getuserbyid)
- [getUserBySlug](#getuserbyslug)
- [getUsers](#getusers)
- [handleUserInput](#handleuserinput)
- [hashPassword](#hashpassword)
- [quote](#quote)
- [updateEntity](#updateentity)
- [updateUser](#updateuser)

## Constructors

### constructor

• **new UserRepository**()

#### Overrides

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/user.repository.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/user.repository.ts#L19)

## Properties

### dbType

• **dbType**: ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"``

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[dbType](backend.BaseRepository.md#dbtype)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L11)

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

[system/core/backend/src/repositories/base.repository.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L94)

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

[system/core/backend/src/repositories/base.repository.ts:56](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L56)

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

[system/core/backend/src/repositories/base.repository.ts:83](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L83)

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

[system/core/backend/src/repositories/base.repository.ts:110](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L110)

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

[system/core/backend/src/repositories/base.repository.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L31)

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

[system/core/backend/src/repositories/base.repository.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L36)

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

[system/core/backend/src/repositories/base.repository.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L46)

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

[system/core/backend/src/repositories/base.repository.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L25)

___

### getSqlBoolStr

▸ **getSqlBoolStr**(`b`): ``"true"`` \| ``"false"`` \| ``"1"`` \| ``"0"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `boolean` |

#### Returns

``"true"`` \| ``"false"`` \| ``"1"`` \| ``"0"``

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getSqlBoolStr](backend.BaseRepository.md#getsqlboolstr)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L21)

___

### getSqlLike

▸ **getSqlLike**(): ``"ILIKE"`` \| ``"LIKE"``

#### Returns

``"ILIKE"`` \| ``"LIKE"``

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getSqlLike](backend.BaseRepository.md#getsqllike)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L22)

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

### quote

▸ **quote**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[quote](backend.BaseRepository.md#quote)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

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

[system/core/backend/src/repositories/base.repository.ts:68](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L68)

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
