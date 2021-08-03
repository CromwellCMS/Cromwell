[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CGraphQLClient

# Class: CGraphQLClient

[frontend](../modules/frontend.md).CGraphQLClient

CGraphQLClient - CromwellCMS GraphQL API Client

## Table of contents

### Properties

- [AttributeFragment](frontend.CGraphQLClient.md#attributefragment)
- [OrderFragment](frontend.CGraphQLClient.md#orderfragment)
- [PagedMetaFragment](frontend.CGraphQLClient.md#pagedmetafragment)
- [PluginFragment](frontend.CGraphQLClient.md#pluginfragment)
- [PostFragment](frontend.CGraphQLClient.md#postfragment)
- [ProductCategoryFragment](frontend.CGraphQLClient.md#productcategoryfragment)
- [ProductFragment](frontend.CGraphQLClient.md#productfragment)
- [ProductReviewFragment](frontend.CGraphQLClient.md#productreviewfragment)
- [TagFragment](frontend.CGraphQLClient.md#tagfragment)
- [ThemeFragment](frontend.CGraphQLClient.md#themefragment)
- [UserFragment](frontend.CGraphQLClient.md#userfragment)
- [createAttribute](frontend.CGraphQLClient.md#createattribute)
- [createOrder](frontend.CGraphQLClient.md#createorder)
- [createPost](frontend.CGraphQLClient.md#createpost)
- [createProduct](frontend.CGraphQLClient.md#createproduct)
- [createProductCategory](frontend.CGraphQLClient.md#createproductcategory)
- [createProductReview](frontend.CGraphQLClient.md#createproductreview)
- [createTag](frontend.CGraphQLClient.md#createtag)
- [createUser](frontend.CGraphQLClient.md#createuser)
- [deleteAttribute](frontend.CGraphQLClient.md#deleteattribute)
- [deleteManyFilteredOrders](frontend.CGraphQLClient.md#deletemanyfilteredorders)
- [deleteManyFilteredPosts](frontend.CGraphQLClient.md#deletemanyfilteredposts)
- [deleteManyFilteredProductCategories](frontend.CGraphQLClient.md#deletemanyfilteredproductcategories)
- [deleteManyFilteredProductReviews](frontend.CGraphQLClient.md#deletemanyfilteredproductreviews)
- [deleteManyFilteredProducts](frontend.CGraphQLClient.md#deletemanyfilteredproducts)
- [deleteManyFilteredUsers](frontend.CGraphQLClient.md#deletemanyfilteredusers)
- [deleteManyOrders](frontend.CGraphQLClient.md#deletemanyorders)
- [deleteManyPosts](frontend.CGraphQLClient.md#deletemanyposts)
- [deleteManyProductCategories](frontend.CGraphQLClient.md#deletemanyproductcategories)
- [deleteManyProductReviews](frontend.CGraphQLClient.md#deletemanyproductreviews)
- [deleteManyProducts](frontend.CGraphQLClient.md#deletemanyproducts)
- [deleteManyTags](frontend.CGraphQLClient.md#deletemanytags)
- [deleteManyUsers](frontend.CGraphQLClient.md#deletemanyusers)
- [deleteOrder](frontend.CGraphQLClient.md#deleteorder)
- [deletePost](frontend.CGraphQLClient.md#deletepost)
- [deleteProduct](frontend.CGraphQLClient.md#deleteproduct)
- [deleteProductCategory](frontend.CGraphQLClient.md#deleteproductcategory)
- [deleteProductReview](frontend.CGraphQLClient.md#deleteproductreview)
- [deleteTag](frontend.CGraphQLClient.md#deletetag)
- [deleteUser](frontend.CGraphQLClient.md#deleteuser)
- [getAttributeById](frontend.CGraphQLClient.md#getattributebyid)
- [getFilteredOrders](frontend.CGraphQLClient.md#getfilteredorders)
- [getFilteredPosts](frontend.CGraphQLClient.md#getfilteredposts)
- [getFilteredProductCategories](frontend.CGraphQLClient.md#getfilteredproductcategories)
- [getFilteredProductReviews](frontend.CGraphQLClient.md#getfilteredproductreviews)
- [getFilteredUsers](frontend.CGraphQLClient.md#getfilteredusers)
- [getOrderById](frontend.CGraphQLClient.md#getorderbyid)
- [getOrderBySlug](frontend.CGraphQLClient.md#getorderbyslug)
- [getOrders](frontend.CGraphQLClient.md#getorders)
- [getPostById](frontend.CGraphQLClient.md#getpostbyid)
- [getPostBySlug](frontend.CGraphQLClient.md#getpostbyslug)
- [getPosts](frontend.CGraphQLClient.md#getposts)
- [getProductById](frontend.CGraphQLClient.md#getproductbyid)
- [getProductBySlug](frontend.CGraphQLClient.md#getproductbyslug)
- [getProductCategories](frontend.CGraphQLClient.md#getproductcategories)
- [getProductCategoryById](frontend.CGraphQLClient.md#getproductcategorybyid)
- [getProductCategoryBySlug](frontend.CGraphQLClient.md#getproductcategorybyslug)
- [getProductReviewById](frontend.CGraphQLClient.md#getproductreviewbyid)
- [getProductReviews](frontend.CGraphQLClient.md#getproductreviews)
- [getProducts](frontend.CGraphQLClient.md#getproducts)
- [getTagById](frontend.CGraphQLClient.md#gettagbyid)
- [getTagBySlug](frontend.CGraphQLClient.md#gettagbyslug)
- [getTags](frontend.CGraphQLClient.md#gettags)
- [getUserById](frontend.CGraphQLClient.md#getuserbyid)
- [getUserBySlug](frontend.CGraphQLClient.md#getuserbyslug)
- [getUsers](frontend.CGraphQLClient.md#getusers)
- [updateAttribute](frontend.CGraphQLClient.md#updateattribute)
- [updateOrder](frontend.CGraphQLClient.md#updateorder)
- [updatePost](frontend.CGraphQLClient.md#updatepost)
- [updateProduct](frontend.CGraphQLClient.md#updateproduct)
- [updateProductCategory](frontend.CGraphQLClient.md#updateproductcategory)
- [updateProductReview](frontend.CGraphQLClient.md#updateproductreview)
- [updateTag](frontend.CGraphQLClient.md#updatetag)
- [updateUser](frontend.CGraphQLClient.md#updateuser)

### Methods

- [createEntity](frontend.CGraphQLClient.md#createentity)
- [getAllEntities](frontend.CGraphQLClient.md#getallentities)
- [getAttributes](frontend.CGraphQLClient.md#getattributes)
- [getEntityById](frontend.CGraphQLClient.md#getentitybyid)
- [getFilteredProducts](frontend.CGraphQLClient.md#getfilteredproducts)
- [getOrdersOfUser](frontend.CGraphQLClient.md#getordersofuser)
- [getProductsFromCategory](frontend.CGraphQLClient.md#getproductsfromcategory)
- [getRootCategories](frontend.CGraphQLClient.md#getrootcategories)
- [mutate](frontend.CGraphQLClient.md#mutate)
- [onError](frontend.CGraphQLClient.md#onerror)
- [onUnauthorized](frontend.CGraphQLClient.md#onunauthorized)
- [query](frontend.CGraphQLClient.md#query)
- [removeOnError](frontend.CGraphQLClient.md#removeonerror)
- [removeOnUnauthorized](frontend.CGraphQLClient.md#removeonunauthorized)
- [updateEntity](frontend.CGraphQLClient.md#updateentity)

## Properties

### AttributeFragment

• **AttributeFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:727](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L727)

___

### OrderFragment

• **OrderFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:883](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L883)

___

### PagedMetaFragment

• **PagedMetaFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:226](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L226)

___

### PluginFragment

• **PluginFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:982](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L982)

___

### PostFragment

• **PostFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:799](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L799)

___

### ProductCategoryFragment

• **ProductCategoryFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:666](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L666)

___

### ProductFragment

• **ProductFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:548](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L548)

___

### ProductReviewFragment

• **ProductReviewFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:769](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L769)

___

### TagFragment

• **TagFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:954](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L954)

___

### ThemeFragment

• **ThemeFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:1004](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L1004)

___

### UserFragment

• **UserFragment**: `DocumentNode`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:849](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L849)

___

### createAttribute

• **createAttribute**: (`data`: `TAttributeInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TAttribute`\>

#### Type declaration

▸ (`data`, `customFragment?`, `customFragmentName?`): `Promise`<`TAttribute`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TAttributeInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TAttribute`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:747](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L747)

___

### createOrder

• **createOrder**: (`data`: `TOrderInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TOrder`\>

#### Type declaration

▸ (`data`, `customFragment?`, `customFragmentName?`): `Promise`<`TOrder`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TOrderInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TOrder`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:914](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L914)

___

### createPost

• **createPost**: (`data`: `TPostInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPost`\>

#### Type declaration

▸ (`data`, `customFragment?`, `customFragmentName?`): `Promise`<`TPost`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TPostInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPost`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:834](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L834)

___

### createProduct

• **createProduct**: (`data`: `TProductInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TProduct`\>

#### Type declaration

▸ (`data`, `customFragment?`, `customFragmentName?`): `Promise`<`TProduct`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TProductInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TProduct`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:591](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L591)

___

### createProductCategory

• **createProductCategory**: (`data`: `TProductCategoryInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TProductCategory`\>

#### Type declaration

▸ (`data`, `customFragment?`, `customFragmentName?`): `Promise`<`TProductCategory`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TProductCategoryInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TProductCategory`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:693](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L693)

___

### createProductReview

• **createProductReview**: (`data`: `TProductReviewInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TProductReview`\>

#### Type declaration

▸ (`data`, `customFragment?`, `customFragmentName?`): `Promise`<`TProductReview`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TProductReviewInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TProductReview`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:788](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L788)

___

### createTag

• **createTag**: (`data`: `TTagInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TTag`\>

#### Type declaration

▸ (`data`, `customFragment?`, `customFragmentName?`): `Promise`<`TTag`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TTagInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TTag`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:975](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L975)

___

### createUser

• **createUser**: (`data`: `TCreateUser`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TUser`\>

#### Type declaration

▸ (`data`, `customFragment?`, `customFragmentName?`): `Promise`<`TUser`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TCreateUser` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TUser`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:872](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L872)

___

### deleteAttribute

• **deleteAttribute**: (`id`: `string`) => `Promise`<`any`\>

#### Type declaration

▸ (`id`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:748](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L748)

___

### deleteManyFilteredOrders

• **deleteManyFilteredOrders**: (`input`: `TDeleteManyInput`, `filterParams?`: `TOrderFilter`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`, `filterParams?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | `TOrderFilter` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:917](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L917)

___

### deleteManyFilteredPosts

• **deleteManyFilteredPosts**: (`input`: `TDeleteManyInput`, `filterParams?`: `TPostFilter`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`, `filterParams?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | `TPostFilter` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:837](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L837)

___

### deleteManyFilteredProductCategories

• **deleteManyFilteredProductCategories**: (`input`: `TDeleteManyInput`, `filterParams?`: `TProductCategoryFilter`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`, `filterParams?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | `TProductCategoryFilter` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:696](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L696)

___

### deleteManyFilteredProductReviews

• **deleteManyFilteredProductReviews**: (`input`: `TDeleteManyInput`, `filterParams?`: `TProductReviewFilter`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`, `filterParams?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | `TProductReviewFilter` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:791](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L791)

___

### deleteManyFilteredProducts

• **deleteManyFilteredProducts**: (`input`: `TDeleteManyInput`, `filterParams?`: `TProductFilter`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`, `filterParams?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | `TProductFilter` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:594](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L594)

___

### deleteManyFilteredUsers

• **deleteManyFilteredUsers**: (`input`: `TDeleteManyInput`, `filterParams?`: `TUserFilter`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`, `filterParams?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |
| `filterParams?` | `TUserFilter` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:875](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L875)

___

### deleteManyOrders

• **deleteManyOrders**: (`input`: `TDeleteManyInput`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:916](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L916)

___

### deleteManyPosts

• **deleteManyPosts**: (`input`: `TDeleteManyInput`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:836](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L836)

___

### deleteManyProductCategories

• **deleteManyProductCategories**: (`input`: `TDeleteManyInput`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:695](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L695)

___

### deleteManyProductReviews

• **deleteManyProductReviews**: (`input`: `TDeleteManyInput`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:790](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L790)

___

### deleteManyProducts

• **deleteManyProducts**: (`input`: `TDeleteManyInput`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:593](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L593)

___

### deleteManyTags

• **deleteManyTags**: (`input`: `TDeleteManyInput`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:977](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L977)

___

### deleteManyUsers

• **deleteManyUsers**: (`input`: `TDeleteManyInput`) => `Promise`<`any`\>

#### Type declaration

▸ (`input`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TDeleteManyInput` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:874](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L874)

___

### deleteOrder

• **deleteOrder**: (`id`: `string`) => `Promise`<`any`\>

#### Type declaration

▸ (`id`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:915](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L915)

___

### deletePost

• **deletePost**: (`id`: `string`) => `Promise`<`any`\>

#### Type declaration

▸ (`id`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:835](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L835)

___

### deleteProduct

• **deleteProduct**: (`id`: `string`) => `Promise`<`any`\>

#### Type declaration

▸ (`id`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:592](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L592)

___

### deleteProductCategory

• **deleteProductCategory**: (`id`: `string`) => `Promise`<`any`\>

#### Type declaration

▸ (`id`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:694](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L694)

___

### deleteProductReview

• **deleteProductReview**: (`id`: `string`) => `Promise`<`any`\>

#### Type declaration

▸ (`id`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:789](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L789)

___

### deleteTag

• **deleteTag**: (`id`: `string`) => `Promise`<`any`\>

#### Type declaration

▸ (`id`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:976](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L976)

___

### deleteUser

• **deleteUser**: (`id`: `string`) => `Promise`<`any`\>

#### Type declaration

▸ (`id`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:873](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L873)

___

### getAttributeById

• **getAttributeById**: (`id`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TAttribute`\>

#### Type declaration

▸ (`id`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TAttribute`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TAttribute`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:745](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L745)

___

### getFilteredOrders

• **getFilteredOrders**: (`options`: { `customFragment?`: `DocumentNode` ; `customFragmentName?`: `string` ; `filterParams?`: `TOrderFilter` ; `pagedParams?`: `TPagedParams`<`TOrder`\>  }) => `Promise`<`TPagedList`<`TOrder`\>\>

#### Type declaration

▸ (`options`): `Promise`<`TPagedList`<`TOrder`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.customFragment?` | `DocumentNode` |
| `options.customFragmentName?` | `string` |
| `options.filterParams?` | `TOrderFilter` |
| `options.pagedParams?` | `TPagedParams`<`TOrder`\> |

##### Returns

`Promise`<`TPagedList`<`TOrder`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:918](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L918)

___

### getFilteredPosts

• **getFilteredPosts**: (`options`: { `customFragment?`: `DocumentNode` ; `customFragmentName?`: `string` ; `filterParams?`: `TPostFilter` ; `pagedParams?`: `TPagedParams`<`TPost`\>  }) => `Promise`<`TPagedList`<`TPost`\>\>

#### Type declaration

▸ (`options`): `Promise`<`TPagedList`<`TPost`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.customFragment?` | `DocumentNode` |
| `options.customFragmentName?` | `string` |
| `options.filterParams?` | `TPostFilter` |
| `options.pagedParams?` | `TPagedParams`<`TPost`\> |

##### Returns

`Promise`<`TPagedList`<`TPost`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:838](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L838)

___

### getFilteredProductCategories

• **getFilteredProductCategories**: (`options`: { `customFragment?`: `DocumentNode` ; `customFragmentName?`: `string` ; `filterParams?`: `TProductCategoryFilter` ; `pagedParams?`: `TPagedParams`<`TProductCategory`\>  }) => `Promise`<`TPagedList`<`TProductCategory`\>\>

#### Type declaration

▸ (`options`): `Promise`<`TPagedList`<`TProductCategory`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.customFragment?` | `DocumentNode` |
| `options.customFragmentName?` | `string` |
| `options.filterParams?` | `TProductCategoryFilter` |
| `options.pagedParams?` | `TPagedParams`<`TProductCategory`\> |

##### Returns

`Promise`<`TPagedList`<`TProductCategory`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:697](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L697)

___

### getFilteredProductReviews

• **getFilteredProductReviews**: (`options`: { `customFragment?`: `DocumentNode` ; `customFragmentName?`: `string` ; `filterParams?`: `TProductReviewFilter` ; `pagedParams?`: `TPagedParams`<`TProductReview`\>  }) => `Promise`<`TPagedList`<`TProductReview`\>\>

#### Type declaration

▸ (`options`): `Promise`<`TPagedList`<`TProductReview`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.customFragment?` | `DocumentNode` |
| `options.customFragmentName?` | `string` |
| `options.filterParams?` | `TProductReviewFilter` |
| `options.pagedParams?` | `TPagedParams`<`TProductReview`\> |

##### Returns

`Promise`<`TPagedList`<`TProductReview`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:792](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L792)

___

### getFilteredUsers

• **getFilteredUsers**: (`options`: { `customFragment?`: `DocumentNode` ; `customFragmentName?`: `string` ; `filterParams?`: `TUserFilter` ; `pagedParams?`: `TPagedParams`<`TUser`\>  }) => `Promise`<`TPagedList`<`TUser`\>\>

#### Type declaration

▸ (`options`): `Promise`<`TPagedList`<`TUser`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.customFragment?` | `DocumentNode` |
| `options.customFragmentName?` | `string` |
| `options.filterParams?` | `TUserFilter` |
| `options.pagedParams?` | `TPagedParams`<`TUser`\> |

##### Returns

`Promise`<`TPagedList`<`TUser`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:876](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L876)

___

### getOrderById

• **getOrderById**: (`id`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TOrder`\>

#### Type declaration

▸ (`id`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TOrder`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TOrder`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:911](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L911)

___

### getOrderBySlug

• **getOrderBySlug**: (`slug`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TOrder`\>

#### Type declaration

▸ (`slug`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TOrder`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TOrder`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:912](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L912)

___

### getOrders

• **getOrders**: (`pagedParams?`: `TPagedParams`<`TOrder`\>, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPagedList`<`TOrder`\>\>

#### Type declaration

▸ (`pagedParams?`, `customFragment?`, `customFragmentName?`): `Promise`<`TPagedList`<`TOrder`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | `TPagedParams`<`TOrder`\> |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPagedList`<`TOrder`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:910](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L910)

___

### getPostById

• **getPostById**: (`id`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TPost`\>

#### Type declaration

▸ (`id`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TPost`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TPost`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:831](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L831)

___

### getPostBySlug

• **getPostBySlug**: (`slug`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TPost`\>

#### Type declaration

▸ (`slug`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TPost`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TPost`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:832](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L832)

___

### getPosts

• **getPosts**: (`pagedParams?`: `TPagedParams`<`TPost`\>, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPagedList`<`TPost`\>\>

#### Type declaration

▸ (`pagedParams?`, `customFragment?`, `customFragmentName?`): `Promise`<`TPagedList`<`TPost`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | `TPagedParams`<`TPost`\> |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPagedList`<`TPost`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:830](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L830)

___

### getProductById

• **getProductById**: (`id`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TProduct`\>

#### Type declaration

▸ (`id`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TProduct`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TProduct`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:588](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L588)

___

### getProductBySlug

• **getProductBySlug**: (`slug`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TProduct`\>

#### Type declaration

▸ (`slug`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TProduct`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TProduct`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:589](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L589)

___

### getProductCategories

• **getProductCategories**: (`pagedParams?`: `TPagedParams`<`TProductCategory`\>, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPagedList`<`TProductCategory`\>\>

#### Type declaration

▸ (`pagedParams?`, `customFragment?`, `customFragmentName?`): `Promise`<`TPagedList`<`TProductCategory`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | `TPagedParams`<`TProductCategory`\> |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPagedList`<`TProductCategory`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:689](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L689)

___

### getProductCategoryById

• **getProductCategoryById**: (`id`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TProductCategory`\>

#### Type declaration

▸ (`id`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TProductCategory`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TProductCategory`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:690](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L690)

___

### getProductCategoryBySlug

• **getProductCategoryBySlug**: (`slug`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TProductCategory`\>

#### Type declaration

▸ (`slug`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TProductCategory`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TProductCategory`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:691](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L691)

___

### getProductReviewById

• **getProductReviewById**: (`id`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TProductReview`\>

#### Type declaration

▸ (`id`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TProductReview`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TProductReview`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:786](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L786)

___

### getProductReviews

• **getProductReviews**: (`pagedParams?`: `TPagedParams`<`TProductReview`\>, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPagedList`<`TProductReview`\>\>

#### Type declaration

▸ (`pagedParams?`, `customFragment?`, `customFragmentName?`): `Promise`<`TPagedList`<`TProductReview`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | `TPagedParams`<`TProductReview`\> |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPagedList`<`TProductReview`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:785](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L785)

___

### getProducts

• **getProducts**: (`pagedParams?`: `TPagedParams`<`TProduct`\>, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPagedList`<`TProduct`\>\>

#### Type declaration

▸ (`pagedParams?`, `customFragment?`, `customFragmentName?`): `Promise`<`TPagedList`<`TProduct`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | `TPagedParams`<`TProduct`\> |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPagedList`<`TProduct`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:587](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L587)

___

### getTagById

• **getTagById**: (`id`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TTag`\>

#### Type declaration

▸ (`id`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TTag`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TTag`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:972](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L972)

___

### getTagBySlug

• **getTagBySlug**: (`slug`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TTag`\>

#### Type declaration

▸ (`slug`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TTag`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TTag`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:973](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L973)

___

### getTags

• **getTags**: (`pagedParams?`: `TPagedParams`<`TTag`\>, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPagedList`<`TTag`\>\>

#### Type declaration

▸ (`pagedParams?`, `customFragment?`, `customFragmentName?`): `Promise`<`TPagedList`<`TTag`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | `TPagedParams`<`TTag`\> |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPagedList`<`TTag`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:971](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L971)

___

### getUserById

• **getUserById**: (`id`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TUser`\>

#### Type declaration

▸ (`id`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TUser`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TUser`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:869](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L869)

___

### getUserBySlug

• **getUserBySlug**: (`slug`: `string`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`undefined` \| `TUser`\>

#### Type declaration

▸ (`slug`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TUser`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`undefined` \| `TUser`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:870](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L870)

___

### getUsers

• **getUsers**: (`pagedParams?`: `TPagedParams`<`TUser`\>, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPagedList`<`TUser`\>\>

#### Type declaration

▸ (`pagedParams?`, `customFragment?`, `customFragmentName?`): `Promise`<`TPagedList`<`TUser`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `pagedParams?` | `TPagedParams`<`TUser`\> |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPagedList`<`TUser`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:868](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L868)

___

### updateAttribute

• **updateAttribute**: (`id`: `string`, `data`: `TAttributeInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TAttribute`\>

#### Type declaration

▸ (`id`, `data`, `customFragment?`, `customFragmentName?`): `Promise`<`TAttribute`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `TAttributeInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TAttribute`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:746](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L746)

___

### updateOrder

• **updateOrder**: (`id`: `string`, `data`: `TOrderInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TOrder`\>

#### Type declaration

▸ (`id`, `data`, `customFragment?`, `customFragmentName?`): `Promise`<`TOrder`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `TOrderInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TOrder`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:913](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L913)

___

### updatePost

• **updatePost**: (`id`: `string`, `data`: `TPostInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TPost`\>

#### Type declaration

▸ (`id`, `data`, `customFragment?`, `customFragmentName?`): `Promise`<`TPost`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `TPostInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TPost`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:833](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L833)

___

### updateProduct

• **updateProduct**: (`id`: `string`, `data`: `TProductInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TProduct`\>

#### Type declaration

▸ (`id`, `data`, `customFragment?`, `customFragmentName?`): `Promise`<`TProduct`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `TProductInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TProduct`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:590](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L590)

___

### updateProductCategory

• **updateProductCategory**: (`id`: `string`, `data`: `TProductCategoryInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TProductCategory`\>

#### Type declaration

▸ (`id`, `data`, `customFragment?`, `customFragmentName?`): `Promise`<`TProductCategory`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `TProductCategoryInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TProductCategory`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:692](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L692)

___

### updateProductReview

• **updateProductReview**: (`id`: `string`, `data`: `TProductReviewInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TProductReview`\>

#### Type declaration

▸ (`id`, `data`, `customFragment?`, `customFragmentName?`): `Promise`<`TProductReview`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `TProductReviewInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TProductReview`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:787](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L787)

___

### updateTag

• **updateTag**: (`id`: `string`, `data`: `TTagInput`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TTag`\>

#### Type declaration

▸ (`id`, `data`, `customFragment?`, `customFragmentName?`): `Promise`<`TTag`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `TTagInput` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TTag`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:974](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L974)

___

### updateUser

• **updateUser**: (`id`: `string`, `data`: `TUpdateUser`, `customFragment?`: `DocumentNode`, `customFragmentName?`: `string`) => `Promise`<`TUser`\>

#### Type declaration

▸ (`id`, `data`, `customFragment?`, `customFragmentName?`): `Promise`<`TUser`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `TUpdateUser` |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

##### Returns

`Promise`<`TUser`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:871](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L871)

## Methods

### createEntity

▸ **createEntity**<`EntityType`, `EntityInputType`\>(`entityName`, `entityInputName`, `fragment`, `fragmentName`, `data`): `Promise`<`undefined` \| `EntityType`\>

Create a record by id of a generic entity

**`auth`** admin

#### Type parameters

| Name |
| :------ |
| `EntityType` |
| `EntityInputType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entityName` | `string` |
| `entityInputName` | `string` |
| `fragment` | `DocumentNode` |
| `fragmentName` | `string` |
| `data` | `EntityInputType` |

#### Returns

`Promise`<`undefined` \| `EntityType`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:525](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L525)

___

### getAllEntities

▸ **getAllEntities**<`EntityType`\>(`entityName`, `fragment`, `fragmentName`): `Promise`<`EntityType`[]\>

Get all records of a generic entity

**`auth`** admin

#### Type parameters

| Name |
| :------ |
| `EntityType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entityName` | `string` |
| `fragment` | `DocumentNode` |
| `fragmentName` | `string` |

#### Returns

`Promise`<`EntityType`[]\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:462](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L462)

___

### getAttributes

▸ **getAttributes**(): `Promise`<`undefined` \| `TAttribute`[]\>

#### Returns

`Promise`<`undefined` \| `TAttribute`[]\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:750](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L750)

___

### getEntityById

▸ **getEntityById**<`EntityType`\>(`entityName`, `fragment`, `fragmentName`, `entityId`): `Promise`<`undefined` \| `EntityType`\>

Get a record by id of a generic entity

**`auth`** admin

#### Type parameters

| Name |
| :------ |
| `EntityType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entityName` | `string` |
| `fragment` | `DocumentNode` |
| `fragmentName` | `string` |
| `entityId` | `string` |

#### Returns

`Promise`<`undefined` \| `EntityType`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:480](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L480)

___

### getFilteredProducts

▸ **getFilteredProducts**(`__namedParameters`): `Promise`<`TFilteredProductList`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.categoryId?` | `string` |
| `__namedParameters.customFragment?` | `DocumentNode` |
| `__namedParameters.customFragmentName?` | `string` |
| `__namedParameters.filterParams?` | `TProductFilter` |
| `__namedParameters.pagedParams?` | `TPagedParams`<`TProduct`\> |

#### Returns

`Promise`<`TFilteredProductList`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:621](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L621)

___

### getOrdersOfUser

▸ **getOrdersOfUser**(`userId`, `pagedParams`, `customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TPagedList`<`TOrder`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `pagedParams` | `TPagedParams`<`TOrder`\> |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

#### Returns

`Promise`<`undefined` \| `TPagedList`<`TOrder`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:921](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L921)

___

### getProductsFromCategory

▸ **getProductsFromCategory**(`categoryId`, `pagedParams?`): `Promise`<`TPagedList`<`TProduct`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `categoryId` | `string` |
| `pagedParams?` | `TPagedParams`<`TProduct`\> |

#### Returns

`Promise`<`TPagedList`<`TProduct`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:597](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L597)

___

### getRootCategories

▸ **getRootCategories**(`customFragment?`, `customFragmentName?`): `Promise`<`undefined` \| `TPagedList`<`TProductCategory`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customFragment?` | `DocumentNode` |
| `customFragmentName?` | `string` |

#### Returns

`Promise`<`undefined` \| `TPagedList`<`TProductCategory`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:699](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L699)

___

### mutate

▸ **mutate**<`T`\>(`options`, `path`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `MutationOptions`<`Object`, `OperationVariables`\> |
| `path` | `string` |

#### Returns

`Promise`<`T`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:150](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L150)

▸ **mutate**<`T`\>(`options`): `Promise`<`Promise`<`FetchResult`<`unknown`, `Record`<`string`, `any`\>, `Record`<`string`, `any`\>\>\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `MutationOptions`<`Object`, `OperationVariables`\> |

#### Returns

`Promise`<`Promise`<`FetchResult`<`unknown`, `Record`<`string`, `any`\>, `Record`<`string`, `any`\>\>\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:151](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L151)

___

### onError

▸ **onError**(`cb`, `id?`): `void`

Add on error callback. Triggers if any of methods of this
client get any type of error

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`message`: [`TGraphQLErrorInfo`](../modules/frontend.md#tgraphqlerrorinfo)) => `any` |
| `id?` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:214](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L214)

___

### onUnauthorized

▸ **onUnauthorized**(`callback`, `id?`): `void`

Add on unauthorized error callback. Triggers if any of methods of this
client get unauthorized error

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | () => `any` |
| `id?` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:198](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L198)

___

### query

▸ **query**<`T`\>(`options`, `path`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `QueryOptions`<`OperationVariables`, `any`\> |
| `path` | `string` |

#### Returns

`Promise`<`T`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:133](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L133)

▸ **query**<`T`\>(`options`): `Promise`<`ApolloQueryResult`<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `QueryOptions`<`OperationVariables`, `any`\> |

#### Returns

`Promise`<`ApolloQueryResult`<`T`\>\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:134](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L134)

___

### removeOnError

▸ **removeOnError**(`id`): `void`

Remove on error callback

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L222)

___

### removeOnUnauthorized

▸ **removeOnUnauthorized**(`id`): `void`

Remove on unauthorized error callback

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:206](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L206)

___

### updateEntity

▸ **updateEntity**<`EntityType`, `EntityInputType`\>(`entityName`, `entityInputName`, `fragment`, `fragmentName`, `entityId`, `data`): `Promise`<`undefined` \| `EntityType`\>

Update a record of a generic entity

**`auth`** admin

#### Type parameters

| Name |
| :------ |
| `EntityType` |
| `EntityInputType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entityName` | `string` |
| `entityInputName` | `string` |
| `fragment` | `DocumentNode` |
| `fragmentName` | `string` |
| `entityId` | `string` |
| `data` | `EntityInputType` |

#### Returns

`Promise`<`undefined` \| `EntityType`\>

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:502](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L502)
