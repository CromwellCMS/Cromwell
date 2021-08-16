[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / User

# Class: User

[backend](../modules/backend.md).User

## Hierarchy

- [`BasePageEntity`](./backend.BasePageEntity.md)

  ↳ **`User`**

## Implements

- `TUser`

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [address](#address)
- [avatar](#avatar)
- [bio](#bio)
- [createDate](#createdate)
- [email](#email)
- [fullName](#fullname)
- [id](#id)
- [isEnabled](#isenabled)
- [pageDescription](#pagedescription)
- [pageTitle](#pagetitle)
- [password](#password)
- [phone](#phone)
- [refreshToken](#refreshtoken)
- [resetPasswordCode](#resetpasswordcode)
- [resetPasswordDate](#resetpassworddate)
- [role](#role)
- [slug](#slug)
- [updateDate](#updatedate)

## Constructors

### constructor

• **new User**()

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[constructor](./backend.BasePageEntity.md#constructor)

## Properties

### address

• `Optional` **address**: `string`

#### Implementation of

TUser.address

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L35)

___

### avatar

• `Optional` **avatar**: `string`

#### Implementation of

TUser.avatar

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L22)

___

### bio

• `Optional` **bio**: `string`

#### Implementation of

TUser.bio

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L26)

___

### createDate

• **createDate**: `Date`

#### Implementation of

TUser.createDate

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[createDate](./backend.BasePageEntity.md#createdate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:29](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L29)

___

### email

• **email**: `string`

#### Implementation of

TUser.email

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L18)

___

### fullName

• **fullName**: `string`

#### Implementation of

TUser.fullName

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L14)

___

### id

• **id**: `string`

#### Implementation of

TUser.id

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[id](./backend.BasePageEntity.md#id)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L12)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TUser.isEnabled

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[isEnabled](./backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L38)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TUser.pageDescription

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[pageDescription](./backend.BasePageEntity.md#pagedescription)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L24)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TUser.pageTitle

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[pageTitle](./backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L20)

___

### password

• **password**: `string`

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:43](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L43)

___

### phone

• `Optional` **phone**: `string`

#### Implementation of

TUser.phone

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:40](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L40)

___

### refreshToken

• `Optional` **refreshToken**: ``null`` \| `string`

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L46)

___

### resetPasswordCode

• `Optional` **resetPasswordCode**: ``null`` \| `string`

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:50](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L50)

___

### resetPasswordDate

• `Optional` **resetPasswordDate**: ``null`` \| `Date`

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:54](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L54)

___

### role

• `Optional` **role**: `TUserRole`

#### Implementation of

TUser.role

#### Defined in

[system/core/backend/src/models/entities/user.entity.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/user.entity.ts#L31)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TUser.slug

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[slug](./backend.BasePageEntity.md#slug)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L16)

___

### updateDate

• **updateDate**: `Date`

#### Implementation of

TUser.updateDate

#### Inherited from

[BasePageEntity](./backend.BasePageEntity.md).[updateDate](./backend.BasePageEntity.md#updatedate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L34)
