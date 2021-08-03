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

- [constructor](backend.Post.md#constructor)

### Properties

- [authorId](backend.Post.md#authorid)
- [comments](backend.Post.md#comments)
- [content](backend.Post.md#content)
- [createDate](backend.Post.md#createdate)
- [delta](backend.Post.md#delta)
- [excerpt](backend.Post.md#excerpt)
- [featured](backend.Post.md#featured)
- [id](backend.Post.md#id)
- [isEnabled](backend.Post.md#isenabled)
- [mainImage](backend.Post.md#mainimage)
- [pageDescription](backend.Post.md#pagedescription)
- [pageTitle](backend.Post.md#pagetitle)
- [publishDate](backend.Post.md#publishdate)
- [published](backend.Post.md#published)
- [readTime](backend.Post.md#readtime)
- [slug](backend.Post.md#slug)
- [tags](backend.Post.md#tags)
- [title](backend.Post.md#title)
- [updateDate](backend.Post.md#updatedate)

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

[system/core/backend/src/models/entities/base-page.entity.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L27)

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

[system/core/backend/src/models/entities/base-page.entity.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L11)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TPost.isEnabled

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[isEnabled](backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L35)

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

[system/core/backend/src/models/entities/base-page.entity.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L23)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TPost.pageTitle

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageTitle](backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L19)

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

[system/core/backend/src/models/entities/base-page.entity.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L15)

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

[system/core/backend/src/models/entities/base-page.entity.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L31)
