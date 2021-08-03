[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / CmsEntity

# Class: CmsEntity

[backend](../modules/backend.md).CmsEntity

## Hierarchy

- [`BasePageEntity`](backend.BasePageEntity.md)

  ↳ **`CmsEntity`**

## Implements

- `TCmsEntity`

## Table of contents

### Constructors

- [constructor](backend.CmsEntity.md#constructor)

### Properties

- [beta](backend.CmsEntity.md#beta)
- [createDate](backend.CmsEntity.md#createdate)
- [defaultPageSize](backend.CmsEntity.md#defaultpagesize)
- [defaultShippingPrice](backend.CmsEntity.md#defaultshippingprice)
- [favicon](backend.CmsEntity.md#favicon)
- [footerHtml](backend.CmsEntity.md#footerhtml)
- [headHtml](backend.CmsEntity.md#headhtml)
- [id](backend.CmsEntity.md#id)
- [installed](backend.CmsEntity.md#installed)
- [isEnabled](backend.CmsEntity.md#isenabled)
- [isUpdating](backend.CmsEntity.md#isupdating)
- [language](backend.CmsEntity.md#language)
- [logo](backend.CmsEntity.md#logo)
- [pageDescription](backend.CmsEntity.md#pagedescription)
- [pageTitle](backend.CmsEntity.md#pagetitle)
- [protocol](backend.CmsEntity.md#protocol)
- [sendFromEmail](backend.CmsEntity.md#sendfromemail)
- [slug](backend.CmsEntity.md#slug)
- [smtpConnectionString](backend.CmsEntity.md#smtpconnectionstring)
- [themeName](backend.CmsEntity.md#themename)
- [timezone](backend.CmsEntity.md#timezone)
- [updateDate](backend.CmsEntity.md#updatedate)
- [version](backend.CmsEntity.md#version)
- [versions](backend.CmsEntity.md#versions)

### Accessors

- [adminSettings](backend.CmsEntity.md#adminsettings)
- [currencies](backend.CmsEntity.md#currencies)

## Constructors

### constructor

• **new CmsEntity**()

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[constructor](backend.BasePageEntity.md#constructor)

## Properties

### beta

• `Optional` **beta**: `boolean`

#### Implementation of

TCmsEntity.beta

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:58](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L58)

___

### createDate

• **createDate**: `Date`

#### Implementation of

TCmsEntity.createDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[createDate](backend.BasePageEntity.md#createdate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L27)

___

### defaultPageSize

• `Optional` **defaultPageSize**: `number`

#### Implementation of

TCmsEntity.defaultPageSize

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L16)

___

### defaultShippingPrice

• `Optional` **defaultShippingPrice**: `number`

#### Implementation of

TCmsEntity.defaultShippingPrice

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:37](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L37)

___

### favicon

• `Optional` **favicon**: `string`

#### Implementation of

TCmsEntity.favicon

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L25)

___

### footerHtml

• `Optional` **footerHtml**: `string`

#### Implementation of

TCmsEntity.footerHtml

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L34)

___

### headHtml

• `Optional` **headHtml**: `string`

#### Implementation of

TCmsEntity.headHtml

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L31)

___

### id

• **id**: `string`

#### Implementation of

TCmsEntity.id

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[id](backend.BasePageEntity.md#id)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L11)

___

### installed

• `Optional` **installed**: `boolean`

#### Implementation of

TCmsEntity.installed

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:55](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L55)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TCmsEntity.isEnabled

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[isEnabled](backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L35)

___

### isUpdating

• `Optional` **isUpdating**: `boolean` = `false`

#### Implementation of

TCmsEntity.isUpdating

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:67](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L67)

___

### language

• `Optional` **language**: `string`

#### Implementation of

TCmsEntity.language

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L22)

___

### logo

• `Optional` **logo**: `string`

#### Implementation of

TCmsEntity.logo

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L28)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TCmsEntity.pageDescription

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageDescription](backend.BasePageEntity.md#pagedescription)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L23)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TCmsEntity.pageTitle

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageTitle](backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L19)

___

### protocol

• `Optional` **protocol**: ``"http"`` \| ``"https"``

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L13)

___

### sendFromEmail

• `Optional` **sendFromEmail**: `string`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:64](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L64)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TCmsEntity.slug

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[slug](backend.BasePageEntity.md#slug)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L15)

___

### smtpConnectionString

• `Optional` **smtpConnectionString**: `string`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:61](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L61)

___

### themeName

• `Optional` **themeName**: `string`

#### Implementation of

TCmsEntity.themeName

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L10)

___

### timezone

• `Optional` **timezone**: `number`

#### Implementation of

TCmsEntity.timezone

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L19)

___

### updateDate

• **updateDate**: `Date`

#### Implementation of

TCmsEntity.updateDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[updateDate](backend.BasePageEntity.md#updatedate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L31)

___

### version

• `Optional` **version**: `string`

#### Implementation of

TCmsEntity.version

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:49](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L49)

___

### versions

• `Optional` **versions**: `string`

#### Implementation of

TCmsEntity.versions

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:52](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L52)

## Accessors

### adminSettings

• `get` **adminSettings**(): `undefined` \| `TCmsAdminSettings`

#### Returns

`undefined` \| `TCmsAdminSettings`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:69](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L69)

• `set` **adminSettings**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `undefined` \| `TCmsAdminSettings` |

#### Returns

`void`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:72](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L72)

___

### currencies

• `get` **currencies**(): `undefined` \| `TCurrency`[]

#### Returns

`undefined` \| `TCurrency`[]

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:39](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L39)

• `set` **currencies**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `undefined` \| `TCurrency`[] |

#### Returns

`void`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:42](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L42)
