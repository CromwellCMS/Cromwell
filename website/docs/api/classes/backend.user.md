[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / User

# Class: User

[backend](../modules/backend.md).User

## Hierarchy

* [*BasePageEntity*](backend.basepageentity.md)

  ↳ **User**

## Implements

* *TUser*

## Table of contents

### Constructors

- [constructor](backend.user.md#constructor)

### Properties

- [address](backend.user.md#address)
- [avatar](backend.user.md#avatar)
- [bio](backend.user.md#bio)
- [createDate](backend.user.md#createdate)
- [email](backend.user.md#email)
- [fullName](backend.user.md#fullname)
- [id](backend.user.md#id)
- [isEnabled](backend.user.md#isenabled)
- [pageDescription](backend.user.md#pagedescription)
- [pageTitle](backend.user.md#pagetitle)
- [password](backend.user.md#password)
- [phone](backend.user.md#phone)
- [refreshToken](backend.user.md#refreshtoken)
- [resetPasswordCode](backend.user.md#resetpasswordcode)
- [resetPasswordDate](backend.user.md#resetpassworddate)
- [role](backend.user.md#role)
- [slug](backend.user.md#slug)
- [updateDate](backend.user.md#updatedate)

## Constructors

### constructor

\+ **new User**(): [*User*](backend.user.md)

**Returns:** [*User*](backend.user.md)

Inherited from: [BasePageEntity](backend.basepageentity.md)

## Properties

### address

• `Optional` **address**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/User.ts:36](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L36)

___

### avatar

• `Optional` **avatar**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/User.ts:23](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L23)

___

### bio

• `Optional` **bio**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/User.ts:27](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L27)

___

### createDate

• **createDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[createDate](backend.basepageentity.md#createdate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:28](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L28)

___

### email

• **email**: *string*

Defined in: [system/core/backend/src/entities/User.ts:19](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L19)

___

### fullName

• **fullName**: *string*

Defined in: [system/core/backend/src/entities/User.ts:15](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L15)

___

### id

• **id**: *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[id](backend.basepageentity.md#id)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L12)

___

### isEnabled

• `Optional` **isEnabled**: *undefined* \| *boolean*

Inherited from: [BasePageEntity](backend.basepageentity.md).[isEnabled](backend.basepageentity.md#isenabled)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:36](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L36)

___

### pageDescription

• `Optional` **pageDescription**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[pageDescription](backend.basepageentity.md#pagedescription)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:24](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L24)

___

### pageTitle

• `Optional` **pageTitle**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[pageTitle](backend.basepageentity.md#pagetitle)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:20](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L20)

___

### password

• **password**: *string*

Defined in: [system/core/backend/src/entities/User.ts:44](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L44)

___

### phone

• `Optional` **phone**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/User.ts:41](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L41)

___

### refreshToken

• `Optional` **refreshToken**: *undefined* \| *null* \| *string*

Stringified array of Refresh tokens. We create one token per client during log-in
And then update them in this array on refresh Access token

Defined in: [system/core/backend/src/entities/User.ts:51](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L51)

___

### resetPasswordCode

• `Optional` **resetPasswordCode**: *undefined* \| *null* \| *string*

Defined in: [system/core/backend/src/entities/User.ts:55](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L55)

___

### resetPasswordDate

• `Optional` **resetPasswordDate**: *undefined* \| *null* \| Date

Defined in: [system/core/backend/src/entities/User.ts:59](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L59)

___

### role

• `Optional` **role**: *undefined* \| *administrator* \| *author* \| *customer* \| *guest*

Defined in: [system/core/backend/src/entities/User.ts:32](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/User.ts#L32)

___

### slug

• `Optional` **slug**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[slug](backend.basepageentity.md#slug)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L16)

___

### updateDate

• **updateDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[updateDate](backend.basepageentity.md#updatedate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:32](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L32)
