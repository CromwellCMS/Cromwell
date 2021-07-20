[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / CmsEntity

# Class: CmsEntity

[backend](../modules/backend.md).CmsEntity

## Hierarchy

* [*BasePageEntity*](backend.basepageentity.md)

  ↳ **CmsEntity**

## Implements

* *TCmsEntity*

## Table of contents

### Constructors

- [constructor](backend.cmsentity.md#constructor)

### Properties

- [beta](backend.cmsentity.md#beta)
- [createDate](backend.cmsentity.md#createdate)
- [defaultPageSize](backend.cmsentity.md#defaultpagesize)
- [defaultShippingPrice](backend.cmsentity.md#defaultshippingprice)
- [favicon](backend.cmsentity.md#favicon)
- [footerHtml](backend.cmsentity.md#footerhtml)
- [headHtml](backend.cmsentity.md#headhtml)
- [id](backend.cmsentity.md#id)
- [installed](backend.cmsentity.md#installed)
- [isEnabled](backend.cmsentity.md#isenabled)
- [isUpdating](backend.cmsentity.md#isupdating)
- [language](backend.cmsentity.md#language)
- [logo](backend.cmsentity.md#logo)
- [pageDescription](backend.cmsentity.md#pagedescription)
- [pageTitle](backend.cmsentity.md#pagetitle)
- [protocol](backend.cmsentity.md#protocol)
- [sendFromEmail](backend.cmsentity.md#sendfromemail)
- [slug](backend.cmsentity.md#slug)
- [smtpConnectionString](backend.cmsentity.md#smtpconnectionstring)
- [themeName](backend.cmsentity.md#themename)
- [timezone](backend.cmsentity.md#timezone)
- [updateDate](backend.cmsentity.md#updatedate)
- [version](backend.cmsentity.md#version)
- [versions](backend.cmsentity.md#versions)

### Accessors

- [currencies](backend.cmsentity.md#currencies)

## Constructors

### constructor

\+ **new CmsEntity**(): [*CmsEntity*](backend.cmsentity.md)

**Returns:** [*CmsEntity*](backend.cmsentity.md)

Inherited from: [BasePageEntity](backend.basepageentity.md)

## Properties

### beta

• `Optional` **beta**: *undefined* \| *boolean*

Defined in: [system/core/backend/src/entities/Cms.ts:59](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L59)

___

### createDate

• **createDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[createDate](backend.basepageentity.md#createdate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:28](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L28)

___

### defaultPageSize

• `Optional` **defaultPageSize**: *undefined* \| *number*

Defined in: [system/core/backend/src/entities/Cms.ts:17](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L17)

___

### defaultShippingPrice

• `Optional` **defaultShippingPrice**: *undefined* \| *number*

Defined in: [system/core/backend/src/entities/Cms.ts:38](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L38)

___

### favicon

• `Optional` **favicon**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:26](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L26)

___

### footerHtml

• `Optional` **footerHtml**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:35](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L35)

___

### headHtml

• `Optional` **headHtml**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:32](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L32)

___

### id

• **id**: *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[id](backend.basepageentity.md#id)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L12)

___

### installed

• `Optional` **installed**: *undefined* \| *boolean*

Defined in: [system/core/backend/src/entities/Cms.ts:56](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L56)

___

### isEnabled

• `Optional` **isEnabled**: *undefined* \| *boolean*

Inherited from: [BasePageEntity](backend.basepageentity.md).[isEnabled](backend.basepageentity.md#isenabled)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:36](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L36)

___

### isUpdating

• `Optional` **isUpdating**: *undefined* \| *boolean*= false

Defined in: [system/core/backend/src/entities/Cms.ts:68](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L68)

___

### language

• `Optional` **language**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:23](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L23)

___

### logo

• `Optional` **logo**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:29](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L29)

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

### protocol

• `Optional` **protocol**: *undefined* \| *http* \| *https*

Defined in: [system/core/backend/src/entities/Cms.ts:14](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L14)

___

### sendFromEmail

• `Optional` **sendFromEmail**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:65](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L65)

___

### slug

• `Optional` **slug**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[slug](backend.basepageentity.md#slug)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L16)

___

### smtpConnectionString

• `Optional` **smtpConnectionString**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:62](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L62)

___

### themeName

• `Optional` **themeName**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:11](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L11)

___

### timezone

• `Optional` **timezone**: *undefined* \| *number*

Defined in: [system/core/backend/src/entities/Cms.ts:20](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L20)

___

### updateDate

• **updateDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[updateDate](backend.basepageentity.md#updatedate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:32](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L32)

___

### version

• `Optional` **version**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:50](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L50)

___

### versions

• `Optional` **versions**: *undefined* \| *string*

Defined in: [system/core/backend/src/entities/Cms.ts:53](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L53)

## Accessors

### currencies

• get **currencies**(): *undefined* \| TCurrency[]

**Returns:** *undefined* \| TCurrency[]

Defined in: [system/core/backend/src/entities/Cms.ts:40](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L40)

• set **currencies**(`data`: *undefined* \| TCurrency[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *undefined* \| TCurrency[] |

**Returns:** *void*

Defined in: [system/core/backend/src/entities/Cms.ts:43](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Cms.ts#L43)
