[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / Post

# Class: Post

[backend](../modules/backend.md).Post

## Hierarchy

* [*BasePageEntity*](backend.basepageentity.md)

  ↳ **Post**

## Implements

* *TPost*

## Table of contents

### Constructors

- [constructor](backend.post.md#constructor)

### Properties

- [authorId](backend.post.md#authorid)
- [comments](backend.post.md#comments)
- [content](backend.post.md#content)
- [createDate](backend.post.md#createdate)
- [delta](backend.post.md#delta)
- [excerpt](backend.post.md#excerpt)
- [id](backend.post.md#id)
- [isEnabled](backend.post.md#isenabled)
- [mainImage](backend.post.md#mainimage)
- [pageDescription](backend.post.md#pagedescription)
- [pageTitle](backend.post.md#pagetitle)
- [publishDate](backend.post.md#publishdate)
- [published](backend.post.md#published)
- [readTime](backend.post.md#readtime)
- [slug](backend.post.md#slug)
- [tags](backend.post.md#tags)
- [title](backend.post.md#title)
- [updateDate](backend.post.md#updatedate)

## Constructors

### constructor

\+ **new Post**(): [*Post*](backend.post.md)

**Returns:** [*Post*](backend.post.md)

Inherited from: [BasePageEntity](backend.basepageentity.md)

## Properties

### authorId

• **authorId**: *string*

Defined in: [system/core/backend/src/entities/Post.ts:21](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L21)

___

### comments

• `Optional` **comments**: *undefined* \| TPostComment[]

Defined in: [system/core/backend/src/entities/Post.ts:60](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L60)

___

### content

• `Optional` **content**: *undefined* \| *null* \| *string*

Defined in: [system/core/backend/src/entities/Post.ts:25](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L25)

___

### createDate

• **createDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[createDate](backend.basepageentity.md#createdate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:28](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L28)

___

### delta

• `Optional` **delta**: *undefined* \| *null* \| *string*

Defined in: [system/core/backend/src/entities/Post.ts:29](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L29)

___

### excerpt

• `Optional` **excerpt**: *undefined* \| *null* \| *string*

Defined in: [system/core/backend/src/entities/Post.ts:33](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L33)

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

### mainImage

• `Optional` **mainImage**: *undefined* \| *null* \| *string*

Defined in: [system/core/backend/src/entities/Post.ts:37](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L37)

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

### publishDate

• `Optional` **publishDate**: *undefined* \| *null* \| Date

Defined in: [system/core/backend/src/entities/Post.ts:55](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L55)

___

### published

• `Optional` **published**: *undefined* \| *null* \| *boolean*

Defined in: [system/core/backend/src/entities/Post.ts:51](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L51)

___

### readTime

• `Optional` **readTime**: *undefined* \| *null* \| *string*

Defined in: [system/core/backend/src/entities/Post.ts:41](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L41)

___

### slug

• `Optional` **slug**: *undefined* \| *string*

Inherited from: [BasePageEntity](backend.basepageentity.md).[slug](backend.basepageentity.md#slug)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L16)

___

### tags

• `Optional` **tags**: *undefined* \| *null* \| [*Tag*](backend.tag.md)[]

Defined in: [system/core/backend/src/entities/Post.ts:46](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L46)

___

### title

• `Optional` **title**: *undefined* \| *null* \| *string*

Defined in: [system/core/backend/src/entities/Post.ts:17](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/Post.ts#L17)

___

### updateDate

• **updateDate**: Date

Inherited from: [BasePageEntity](backend.basepageentity.md).[updateDate](backend.basepageentity.md#updatedate)

Defined in: [system/core/backend/src/entities/BasePageEntity.ts:32](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/backend/src/entities/BasePageEntity.ts#L32)
