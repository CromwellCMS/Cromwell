[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PostRepository

# Class: PostRepository

[backend](../modules/backend.md).PostRepository

## Hierarchy

- [`BaseRepository`](backend.BaseRepository.md)<[`Post`](backend.Post.md)\>

  ↳ **`PostRepository`**

## Table of contents

### Constructors

- [constructor](backend.PostRepository.md#constructor)

### Methods

- [applyDeleteMany](backend.PostRepository.md#applydeletemany)
- [applyPostFilter](backend.PostRepository.md#applypostfilter)
- [createEntity](backend.PostRepository.md#createentity)
- [createPost](backend.PostRepository.md#createpost)
- [deleteEntity](backend.PostRepository.md#deleteentity)
- [deleteMany](backend.PostRepository.md#deletemany)
- [deleteManyFilteredPosts](backend.PostRepository.md#deletemanyfilteredposts)
- [deletePost](backend.PostRepository.md#deletepost)
- [getAll](backend.PostRepository.md#getall)
- [getById](backend.PostRepository.md#getbyid)
- [getBySlug](backend.PostRepository.md#getbyslug)
- [getFilteredPosts](backend.PostRepository.md#getfilteredposts)
- [getPaged](backend.PostRepository.md#getpaged)
- [getPostById](backend.PostRepository.md#getpostbyid)
- [getPostBySlug](backend.PostRepository.md#getpostbyslug)
- [getPosts](backend.PostRepository.md#getposts)
- [getTagsOfPost](backend.PostRepository.md#gettagsofpost)
- [updateEntity](backend.PostRepository.md#updateentity)
- [updatePost](backend.PostRepository.md#updatepost)

## Constructors

### constructor

• **new PostRepository**()

#### Overrides

[BaseRepository](backend.BaseRepository.md).[constructor](backend.BaseRepository.md#constructor)

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L21)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`, `input`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<[`Post`](backend.Post.md)\> \| `DeleteQueryBuilder`<[`Post`](backend.Post.md)\> |
| `input` | `TDeleteManyInput` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[applyDeleteMany](backend.BaseRepository.md#applydeletemany)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L86)

___

### applyPostFilter

▸ **applyPostFilter**(`qb`, `filterParams?`): `SelectQueryBuilder`<`TPost`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`TPost`\> |
| `filterParams?` | [`PostFilterInput`](backend.PostFilterInput.md) |

#### Returns

`SelectQueryBuilder`<`TPost`\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:116](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L116)

___

### createEntity

▸ **createEntity**(`input`, `id?`): `Promise`<[`Post`](backend.Post.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`Post`](backend.Post.md) |
| `id?` | `string` |

#### Returns

`Promise`<[`Post`](backend.Post.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[createEntity](backend.BaseRepository.md#createentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L48)

___

### createPost

▸ **createPost**(`createPost`, `id?`): `Promise`<[`Post`](backend.Post.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `createPost` | `TPostInput` |
| `id?` | `string` |

#### Returns

`Promise`<[`Post`](backend.Post.md)\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:77](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L77)

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

### deleteManyFilteredPosts

▸ **deleteManyFilteredPosts**(`input`, `filterParams?`): `Promise`<`undefined` \| `boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | [`PostFilterInput`](backend.PostFilterInput.md) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:178](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L178)

___

### deletePost

▸ **deletePost**(`id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:104](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L104)

___

### getAll

▸ **getAll**(): `Promise`<[`Post`](backend.Post.md)[]\>

#### Returns

`Promise`<[`Post`](backend.Post.md)[]\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getAll](backend.BaseRepository.md#getall)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L23)

___

### getById

▸ **getById**(`id`, `relations?`): `Promise`<`undefined` \| [`Post`](backend.Post.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Post`](backend.Post.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getById](backend.BaseRepository.md#getbyid)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L28)

___

### getBySlug

▸ **getBySlug**(`slug`, `relations?`): `Promise`<`undefined` \| [`Post`](backend.Post.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<`undefined` \| [`Post`](backend.Post.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getBySlug](backend.BaseRepository.md#getbyslug)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L38)

___

### getFilteredPosts

▸ **getFilteredPosts**(`pagedParams?`, `filterParams?`): `Promise`<`TPagedList`<`TPost`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | [`PagedParamsInput`](backend.PagedParamsInput.md)<[`Post`](backend.Post.md)\> |
| `filterParams?` | [`PostFilterInput`](backend.PostFilterInput.md) |

#### Returns

`Promise`<`TPagedList`<`TPost`\>\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:171](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L171)

___

### getPaged

▸ **getPaged**(`params?`): `Promise`<`TPagedList`<[`Post`](backend.Post.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<[`Post`](backend.Post.md)\> |

#### Returns

`Promise`<`TPagedList`<[`Post`](backend.Post.md)\>\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[getPaged](backend.BaseRepository.md#getpaged)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L17)

___

### getPostById

▸ **getPostById**(`id`): `Promise`<`undefined` \| [`Post`](backend.Post.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| [`Post`](backend.Post.md)\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:30](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L30)

___

### getPostBySlug

▸ **getPostBySlug**(`slug`): `Promise`<`undefined` \| [`Post`](backend.Post.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<`undefined` \| [`Post`](backend.Post.md)\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L35)

___

### getPosts

▸ **getPosts**(`params`): `Promise`<`TPagedList`<[`Post`](backend.Post.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TPagedParams`<[`Post`](backend.Post.md)\> |

#### Returns

`Promise`<`TPagedList`<[`Post`](backend.Post.md)\>\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L25)

___

### getTagsOfPost

▸ **getTagsOfPost**(`postId`): `Promise`<`undefined` \| ``null`` \| [`Tag`](backend.Tag.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `postId` | `string` |

#### Returns

`Promise`<`undefined` \| ``null`` \| [`Tag`](backend.Tag.md)[]\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:196](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L196)

___

### updateEntity

▸ **updateEntity**(`id`, `input`): `Promise`<[`Post`](backend.Post.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`Post`](backend.Post.md) |

#### Returns

`Promise`<[`Post`](backend.Post.md)\>

#### Inherited from

[BaseRepository](backend.BaseRepository.md).[updateEntity](backend.BaseRepository.md#updateentity)

#### Defined in

[system/core/backend/src/repositories/base.repository.ts:60](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/base.repository.ts#L60)

___

### updatePost

▸ **updatePost**(`id`, `updatePost`): `Promise`<[`Post`](backend.Post.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `updatePost` | `TPostInput` |

#### Returns

`Promise`<[`Post`](backend.Post.md)\>

#### Defined in

[system/core/backend/src/repositories/post.repository.ts:89](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/repositories/post.repository.ts#L89)
