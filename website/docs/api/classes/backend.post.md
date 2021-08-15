[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / Post

# Class: Post

[backend](../modules/backend.md).Post

## Hierarchy

- [`BasePageEntity`](backend.BasePageEntity.md)

  ↳ **`Post`**

## Implements

- `TPost`

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [authorId](#authorid)
- [comments](#comments)
- [content](#content)
- [createDate](#createdate)
- [delta](#delta)
- [excerpt](#excerpt)
- [featured](#featured)
- [id](#id)
- [isEnabled](#isenabled)
- [mainImage](#mainimage)
- [pageDescription](#pagedescription)
- [pageTitle](#pagetitle)
- [publishDate](#publishdate)
- [published](#published)
- [readTime](#readtime)
- [slug](#slug)
- [tags](#tags)
- [title](#title)
- [updateDate](#updatedate)

## Constructors

### constructor

• **new Post**()

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[constructor](backend.BasePageEntity.md#constructor)

## Properties

### authorId

• **authorId**: `string`

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L20)

___

### comments

• `Optional` **comments**: `TPostComment`[]

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:59](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L59)

___

### content

• `Optional` **content**: ``null`` \| `string`

#### Implementation of

TPost.content

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L24)

___

### createDate

• **createDate**: `Date`

#### Implementation of

TPost.createDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[createDate](backend.BasePageEntity.md#createdate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:29](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L29)

___

### delta

• `Optional` **delta**: ``null`` \| `string`

#### Implementation of

TPost.delta

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L28)

___

### excerpt

• `Optional` **excerpt**: ``null`` \| `string`

#### Implementation of

TPost.excerpt

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:32](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L32)

___

### featured

• `Optional` **featured**: ``null`` \| `boolean`

#### Implementation of

TPost.featured

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:64](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L64)

___

### id

• **id**: `string`

#### Implementation of

TPost.id

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[id](backend.BasePageEntity.md#id)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L12)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TPost.isEnabled

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[isEnabled](backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L38)

___

### mainImage

• `Optional` **mainImage**: ``null`` \| `string`

#### Implementation of

TPost.mainImage

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L36)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TPost.pageDescription

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageDescription](backend.BasePageEntity.md#pagedescription)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L24)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TPost.pageTitle

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageTitle](backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L20)

___

### publishDate

• `Optional` **publishDate**: ``null`` \| `Date`

#### Implementation of

TPost.publishDate

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:54](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L54)

___

### published

• `Optional` **published**: ``null`` \| `boolean`

#### Implementation of

TPost.published

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:50](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L50)

___

### readTime

• `Optional` **readTime**: ``null`` \| `string`

#### Implementation of

TPost.readTime

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:40](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L40)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TPost.slug

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[slug](backend.BasePageEntity.md#slug)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L16)

___

### tags

• `Optional` **tags**: ``null`` \| [`Tag`](backend.Tag.md)[]

#### Implementation of

TPost.tags

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:45](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L45)

___

### title

• `Optional` **title**: ``null`` \| `string`

#### Implementation of

TPost.title

#### Defined in

[system/core/backend/src/models/entities/post.entity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/post.entity.ts#L16)

___

### updateDate

• **updateDate**: `Date`

#### Implementation of

TPost.updateDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[updateDate](backend.BasePageEntity.md#updatedate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L34)
