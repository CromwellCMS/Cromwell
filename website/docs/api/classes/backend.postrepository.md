[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PostRepository

# Class: PostRepository

[backend](../modules/backend.md).PostRepository

## Hierarchy

* *BaseRepository*<[*Post*](backend.post.md)\>

  ↳ **PostRepository**

## Table of contents

### Constructors

- [constructor](backend.postrepository.md#constructor)

### Methods

- [applyDeleteMany](backend.postrepository.md#applydeletemany)
- [applyPostFilter](backend.postrepository.md#applypostfilter)
- [createEntity](backend.postrepository.md#createentity)
- [createPost](backend.postrepository.md#createpost)
- [deleteEntity](backend.postrepository.md#deleteentity)
- [deleteMany](backend.postrepository.md#deletemany)
- [deleteManyFilteredPosts](backend.postrepository.md#deletemanyfilteredposts)
- [deletePost](backend.postrepository.md#deletepost)
- [getAll](backend.postrepository.md#getall)
- [getById](backend.postrepository.md#getbyid)
- [getBySlug](backend.postrepository.md#getbyslug)
- [getFilteredPosts](backend.postrepository.md#getfilteredposts)
- [getPaged](backend.postrepository.md#getpaged)
- [getPostById](backend.postrepository.md#getpostbyid)
- [getPostBySlug](backend.postrepository.md#getpostbyslug)
- [getPosts](backend.postrepository.md#getposts)
- [getTagsOfPost](backend.postrepository.md#gettagsofpost)
- [updateEntity](backend.postrepository.md#updateentity)
- [updatePost](backend.postrepository.md#updatepost)

## Constructors

### constructor

\+ **new PostRepository**(): *PostRepository*

**Returns:** *PostRepository*

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/PostRepository.ts:19](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L19)

## Methods

### applyDeleteMany

▸ **applyDeleteMany**(`qb`: *SelectQueryBuilder*<[*Post*](backend.post.md)\> \| *DeleteQueryBuilder*<[*Post*](backend.post.md)\>, `input`: TDeleteManyInput): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<[*Post*](backend.post.md)\> \| *DeleteQueryBuilder*<[*Post*](backend.post.md)\> |
`input` | TDeleteManyInput |

**Returns:** *Promise*<void\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:87](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L87)

___

### applyPostFilter

▸ **applyPostFilter**(`qb`: *SelectQueryBuilder*<TPost\>, `filterParams?`: [*PostFilterInput*](backend.postfilterinput.md)): *SelectQueryBuilder*<TPost\>

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<TPost\> |
`filterParams?` | [*PostFilterInput*](backend.postfilterinput.md) |

**Returns:** *SelectQueryBuilder*<TPost\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:115](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L115)

___

### createEntity

▸ **createEntity**(`input`: [*Post*](backend.post.md), `id?`: *string*): *Promise*<[*Post*](backend.post.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | [*Post*](backend.post.md) |
`id?` | *string* |

**Returns:** *Promise*<[*Post*](backend.post.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:49](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L49)

___

### createPost

▸ **createPost**(`createPost`: TPostInput, `id?`: *string*): *Promise*<[*Post*](backend.post.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`createPost` | TPostInput |
`id?` | *string* |

**Returns:** *Promise*<[*Post*](backend.post.md)\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L76)

___

### deleteEntity

▸ **deleteEntity**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:76](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L76)

___

### deleteMany

▸ **deleteMany**(`input`: TDeleteManyInput): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<boolean\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:97](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L97)

___

### deleteManyFilteredPosts

▸ **deleteManyFilteredPosts**(`input`: TDeleteManyInput, `filterParams?`: [*PostFilterInput*](backend.postfilterinput.md)): *Promise*<undefined \| boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | [*PostFilterInput*](backend.postfilterinput.md) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:161](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L161)

___

### deletePost

▸ **deletePost**(`id`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:103](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L103)

___

### getAll

▸ **getAll**(): *Promise*<[*Post*](backend.post.md)[]\>

**Returns:** *Promise*<[*Post*](backend.post.md)[]\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:24](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L24)

___

### getById

▸ **getById**(`id`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Post*](backend.post.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Post*](backend.post.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:29](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L29)

___

### getBySlug

▸ **getBySlug**(`slug`: *string*, `relations?`: *string*[]): *Promise*<undefined \| [*Post*](backend.post.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`relations?` | *string*[] |

**Returns:** *Promise*<undefined \| [*Post*](backend.post.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:39](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L39)

___

### getFilteredPosts

▸ **getFilteredPosts**(`pagedParams?`: *PagedParamsInput*<[*Post*](backend.post.md)\>, `filterParams?`: [*PostFilterInput*](backend.postfilterinput.md)): *Promise*<TPagedList<TPost\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *PagedParamsInput*<[*Post*](backend.post.md)\> |
`filterParams?` | [*PostFilterInput*](backend.postfilterinput.md) |

**Returns:** *Promise*<TPagedList<TPost\>\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:154](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L154)

___

### getPaged

▸ **getPaged**(`params?`: *TPagedParams*<[*Post*](backend.post.md)\>): *Promise*<TPagedList<[*Post*](backend.post.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<[*Post*](backend.post.md)\> |

**Returns:** *Promise*<TPagedList<[*Post*](backend.post.md)\>\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:18](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L18)

___

### getPostById

▸ **getPostById**(`id`: *string*): *Promise*<undefined \| [*Post*](backend.post.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<undefined \| [*Post*](backend.post.md)\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:30](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L30)

___

### getPostBySlug

▸ **getPostBySlug**(`slug`: *string*): *Promise*<undefined \| [*Post*](backend.post.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |

**Returns:** *Promise*<undefined \| [*Post*](backend.post.md)\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:35](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L35)

___

### getPosts

▸ **getPosts**(`params`: *TPagedParams*<[*Post*](backend.post.md)\>): *Promise*<TPagedList<[*Post*](backend.post.md)\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params` | *TPagedParams*<[*Post*](backend.post.md)\> |

**Returns:** *Promise*<TPagedList<[*Post*](backend.post.md)\>\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:25](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L25)

___

### getTagsOfPost

▸ **getTagsOfPost**(`postId`: *string*): *Promise*<undefined \| *null* \| [*Tag*](backend.tag.md)[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`postId` | *string* |

**Returns:** *Promise*<undefined \| *null* \| [*Tag*](backend.tag.md)[]\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:179](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L179)

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `input`: [*Post*](backend.post.md)): *Promise*<[*Post*](backend.post.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`input` | [*Post*](backend.post.md) |

**Returns:** *Promise*<[*Post*](backend.post.md)\>

Inherited from: BaseRepository

Defined in: [system/core/backend/src/repositories/BaseRepository.ts:61](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseRepository.ts#L61)

___

### updatePost

▸ **updatePost**(`id`: *string*, `updatePost`: TPostInput): *Promise*<[*Post*](backend.post.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`updatePost` | TPostInput |

**Returns:** *Promise*<[*Post*](backend.post.md)\>

Defined in: [system/core/backend/src/repositories/PostRepository.ts:88](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/PostRepository.ts#L88)
