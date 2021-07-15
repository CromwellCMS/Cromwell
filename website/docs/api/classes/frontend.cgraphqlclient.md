[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CGraphQLClient

# Class: CGraphQLClient

[frontend](../modules/frontend.md).CGraphQLClient

CGraphQLClient - CromwellCMS GraphQL API Client

## Table of contents

### Properties

- [AttributeFragment](frontend.cgraphqlclient.md#attributefragment)
- [OrderFragment](frontend.cgraphqlclient.md#orderfragment)
- [PagedMetaFragment](frontend.cgraphqlclient.md#pagedmetafragment)
- [PluginFragment](frontend.cgraphqlclient.md#pluginfragment)
- [PostFragment](frontend.cgraphqlclient.md#postfragment)
- [ProductCategoryFragment](frontend.cgraphqlclient.md#productcategoryfragment)
- [ProductFragment](frontend.cgraphqlclient.md#productfragment)
- [ProductReviewFragment](frontend.cgraphqlclient.md#productreviewfragment)
- [TagFragment](frontend.cgraphqlclient.md#tagfragment)
- [ThemeFragment](frontend.cgraphqlclient.md#themefragment)
- [UserFragment](frontend.cgraphqlclient.md#userfragment)
- [createAttribute](frontend.cgraphqlclient.md#createattribute)
- [createOrder](frontend.cgraphqlclient.md#createorder)
- [createPost](frontend.cgraphqlclient.md#createpost)
- [createProduct](frontend.cgraphqlclient.md#createproduct)
- [createProductCategory](frontend.cgraphqlclient.md#createproductcategory)
- [createProductReview](frontend.cgraphqlclient.md#createproductreview)
- [createTag](frontend.cgraphqlclient.md#createtag)
- [createUser](frontend.cgraphqlclient.md#createuser)
- [deleteAttribute](frontend.cgraphqlclient.md#deleteattribute)
- [deleteManyFilteredOrders](frontend.cgraphqlclient.md#deletemanyfilteredorders)
- [deleteManyFilteredPosts](frontend.cgraphqlclient.md#deletemanyfilteredposts)
- [deleteManyFilteredProductCategories](frontend.cgraphqlclient.md#deletemanyfilteredproductcategories)
- [deleteManyFilteredProductReviews](frontend.cgraphqlclient.md#deletemanyfilteredproductreviews)
- [deleteManyFilteredProducts](frontend.cgraphqlclient.md#deletemanyfilteredproducts)
- [deleteManyFilteredUsers](frontend.cgraphqlclient.md#deletemanyfilteredusers)
- [deleteManyOrders](frontend.cgraphqlclient.md#deletemanyorders)
- [deleteManyPosts](frontend.cgraphqlclient.md#deletemanyposts)
- [deleteManyProductCategories](frontend.cgraphqlclient.md#deletemanyproductcategories)
- [deleteManyProductReviews](frontend.cgraphqlclient.md#deletemanyproductreviews)
- [deleteManyProducts](frontend.cgraphqlclient.md#deletemanyproducts)
- [deleteManyTags](frontend.cgraphqlclient.md#deletemanytags)
- [deleteManyUsers](frontend.cgraphqlclient.md#deletemanyusers)
- [deleteOrder](frontend.cgraphqlclient.md#deleteorder)
- [deletePost](frontend.cgraphqlclient.md#deletepost)
- [deleteProduct](frontend.cgraphqlclient.md#deleteproduct)
- [deleteProductCategory](frontend.cgraphqlclient.md#deleteproductcategory)
- [deleteProductReview](frontend.cgraphqlclient.md#deleteproductreview)
- [deleteTag](frontend.cgraphqlclient.md#deletetag)
- [deleteUser](frontend.cgraphqlclient.md#deleteuser)
- [getAttributeById](frontend.cgraphqlclient.md#getattributebyid)
- [getFilteredOrders](frontend.cgraphqlclient.md#getfilteredorders)
- [getFilteredPosts](frontend.cgraphqlclient.md#getfilteredposts)
- [getFilteredProductCategories](frontend.cgraphqlclient.md#getfilteredproductcategories)
- [getFilteredProductReviews](frontend.cgraphqlclient.md#getfilteredproductreviews)
- [getFilteredUsers](frontend.cgraphqlclient.md#getfilteredusers)
- [getOrderById](frontend.cgraphqlclient.md#getorderbyid)
- [getOrderBySlug](frontend.cgraphqlclient.md#getorderbyslug)
- [getOrders](frontend.cgraphqlclient.md#getorders)
- [getPostById](frontend.cgraphqlclient.md#getpostbyid)
- [getPostBySlug](frontend.cgraphqlclient.md#getpostbyslug)
- [getPosts](frontend.cgraphqlclient.md#getposts)
- [getProductById](frontend.cgraphqlclient.md#getproductbyid)
- [getProductBySlug](frontend.cgraphqlclient.md#getproductbyslug)
- [getProductCategories](frontend.cgraphqlclient.md#getproductcategories)
- [getProductCategoryById](frontend.cgraphqlclient.md#getproductcategorybyid)
- [getProductCategoryBySlug](frontend.cgraphqlclient.md#getproductcategorybyslug)
- [getProductReviewById](frontend.cgraphqlclient.md#getproductreviewbyid)
- [getProductReviews](frontend.cgraphqlclient.md#getproductreviews)
- [getProducts](frontend.cgraphqlclient.md#getproducts)
- [getTagById](frontend.cgraphqlclient.md#gettagbyid)
- [getTagBySlug](frontend.cgraphqlclient.md#gettagbyslug)
- [getTags](frontend.cgraphqlclient.md#gettags)
- [getUserById](frontend.cgraphqlclient.md#getuserbyid)
- [getUserBySlug](frontend.cgraphqlclient.md#getuserbyslug)
- [getUsers](frontend.cgraphqlclient.md#getusers)
- [updateAttribute](frontend.cgraphqlclient.md#updateattribute)
- [updateOrder](frontend.cgraphqlclient.md#updateorder)
- [updatePost](frontend.cgraphqlclient.md#updatepost)
- [updateProduct](frontend.cgraphqlclient.md#updateproduct)
- [updateProductCategory](frontend.cgraphqlclient.md#updateproductcategory)
- [updateProductReview](frontend.cgraphqlclient.md#updateproductreview)
- [updateTag](frontend.cgraphqlclient.md#updatetag)
- [updateUser](frontend.cgraphqlclient.md#updateuser)

### Methods

- [createEntity](frontend.cgraphqlclient.md#createentity)
- [getAllEntities](frontend.cgraphqlclient.md#getallentities)
- [getAttributes](frontend.cgraphqlclient.md#getattributes)
- [getEntityById](frontend.cgraphqlclient.md#getentitybyid)
- [getFilteredProducts](frontend.cgraphqlclient.md#getfilteredproducts)
- [getProductsFromCategory](frontend.cgraphqlclient.md#getproductsfromcategory)
- [getRootCategories](frontend.cgraphqlclient.md#getrootcategories)
- [mutate](frontend.cgraphqlclient.md#mutate)
- [onError](frontend.cgraphqlclient.md#onerror)
- [onUnauthorized](frontend.cgraphqlclient.md#onunauthorized)
- [query](frontend.cgraphqlclient.md#query)
- [removeOnError](frontend.cgraphqlclient.md#removeonerror)
- [removeOnUnauthorized](frontend.cgraphqlclient.md#removeonunauthorized)
- [updateEntity](frontend.cgraphqlclient.md#updateentity)

## Properties

### AttributeFragment

• **AttributeFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:711](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L711)

___

### OrderFragment

• **OrderFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:866](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L866)

___

### PagedMetaFragment

• **PagedMetaFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:210](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L210)

___

### PluginFragment

• **PluginFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:934](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L934)

___

### PostFragment

• **PostFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:783](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L783)

___

### ProductCategoryFragment

• **ProductCategoryFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:650](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L650)

___

### ProductFragment

• **ProductFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:532](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L532)

___

### ProductReviewFragment

• **ProductReviewFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:753](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L753)

___

### TagFragment

• **TagFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:906](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L906)

___

### ThemeFragment

• **ThemeFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:956](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L956)

___

### UserFragment

• **UserFragment**: DocumentNode

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:832](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L832)

___

### createAttribute

• **createAttribute**: (`data`: TAttributeInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TAttribute\>

#### Type declaration:

▸ (`data`: TAttributeInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TAttribute\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | TAttributeInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TAttribute\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L327)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:731](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L731)

___

### createOrder

• **createOrder**: (`data`: TOrderInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TOrder\>

#### Type declaration:

▸ (`data`: TOrderInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TOrder\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | TOrderInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TOrder\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L327)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:895](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L895)

___

### createPost

• **createPost**: (`data`: TPostInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPost\>

#### Type declaration:

▸ (`data`: TPostInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPost\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | TPostInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPost\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L327)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:817](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L817)

___

### createProduct

• **createProduct**: (`data`: TProductInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TProduct\>

#### Type declaration:

▸ (`data`: TProductInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TProduct\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | TProductInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TProduct\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L327)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:575](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L575)

___

### createProductCategory

• **createProductCategory**: (`data`: TProductCategoryInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TProductCategory\>

#### Type declaration:

▸ (`data`: TProductCategoryInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TProductCategory\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | TProductCategoryInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TProductCategory\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L327)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:677](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L677)

___

### createProductReview

• **createProductReview**: (`data`: TProductReviewInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TProductReview\>

#### Type declaration:

▸ (`data`: TProductReviewInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TProductReview\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | TProductReviewInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TProductReview\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L327)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:772](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L772)

___

### createTag

• **createTag**: (`data`: TTagInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TTag\>

#### Type declaration:

▸ (`data`: TTagInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TTag\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | TTagInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TTag\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L327)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:927](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L927)

___

### createUser

• **createUser**: (`data`: TCreateUser, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TUser\>

#### Type declaration:

▸ (`data`: TCreateUser, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TUser\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | TCreateUser |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TUser\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L327)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:855](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L855)

___

### deleteAttribute

• **deleteAttribute**: (`id`: *string*) => *Promise*<any\>

#### Type declaration:

▸ (`id`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:351](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L351)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:732](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L732)

___

### deleteManyFilteredOrders

• **deleteManyFilteredOrders**: (`input`: TDeleteManyInput, `filterParams?`: TOrderFilter) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput, `filterParams?`: TOrderFilter): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | TOrderFilter |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:385](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L385)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:898](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L898)

___

### deleteManyFilteredPosts

• **deleteManyFilteredPosts**: (`input`: TDeleteManyInput, `filterParams?`: TPostFilter) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput, `filterParams?`: TPostFilter): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | TPostFilter |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:385](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L385)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:820](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L820)

___

### deleteManyFilteredProductCategories

• **deleteManyFilteredProductCategories**: (`input`: TDeleteManyInput, `filterParams?`: TProductCategoryFilter) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput, `filterParams?`: TProductCategoryFilter): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | TProductCategoryFilter |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:385](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L385)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:680](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L680)

___

### deleteManyFilteredProductReviews

• **deleteManyFilteredProductReviews**: (`input`: TDeleteManyInput, `filterParams?`: TProductReviewFilter) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput, `filterParams?`: TProductReviewFilter): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | TProductReviewFilter |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:385](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L385)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:775](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L775)

___

### deleteManyFilteredProducts

• **deleteManyFilteredProducts**: (`input`: TDeleteManyInput, `filterParams?`: TProductFilter) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput, `filterParams?`: TProductFilter): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | TProductFilter |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:385](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L385)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:578](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L578)

___

### deleteManyFilteredUsers

• **deleteManyFilteredUsers**: (`input`: TDeleteManyInput, `filterParams?`: TUserFilter) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput, `filterParams?`: TUserFilter): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |
`filterParams?` | TUserFilter |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:385](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L385)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:858](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L858)

___

### deleteManyOrders

• **deleteManyOrders**: (`input`: TDeleteManyInput) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:368](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L368)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:897](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L897)

___

### deleteManyPosts

• **deleteManyPosts**: (`input`: TDeleteManyInput) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:368](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L368)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:819](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L819)

___

### deleteManyProductCategories

• **deleteManyProductCategories**: (`input`: TDeleteManyInput) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:368](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L368)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:679](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L679)

___

### deleteManyProductReviews

• **deleteManyProductReviews**: (`input`: TDeleteManyInput) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:368](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L368)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:774](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L774)

___

### deleteManyProducts

• **deleteManyProducts**: (`input`: TDeleteManyInput) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:368](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L368)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:577](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L577)

___

### deleteManyTags

• **deleteManyTags**: (`input`: TDeleteManyInput) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:368](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L368)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:929](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L929)

___

### deleteManyUsers

• **deleteManyUsers**: (`input`: TDeleteManyInput) => *Promise*<any\>

#### Type declaration:

▸ (`input`: TDeleteManyInput): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TDeleteManyInput |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:368](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L368)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:857](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L857)

___

### deleteOrder

• **deleteOrder**: (`id`: *string*) => *Promise*<any\>

#### Type declaration:

▸ (`id`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:351](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L351)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:896](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L896)

___

### deletePost

• **deletePost**: (`id`: *string*) => *Promise*<any\>

#### Type declaration:

▸ (`id`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:351](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L351)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:818](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L818)

___

### deleteProduct

• **deleteProduct**: (`id`: *string*) => *Promise*<any\>

#### Type declaration:

▸ (`id`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:351](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L351)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:576](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L576)

___

### deleteProductCategory

• **deleteProductCategory**: (`id`: *string*) => *Promise*<any\>

#### Type declaration:

▸ (`id`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:351](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L351)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:678](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L678)

___

### deleteProductReview

• **deleteProductReview**: (`id`: *string*) => *Promise*<any\>

#### Type declaration:

▸ (`id`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:351](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L351)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:773](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L773)

___

### deleteTag

• **deleteTag**: (`id`: *string*) => *Promise*<any\>

#### Type declaration:

▸ (`id`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:351](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L351)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:928](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L928)

___

### deleteUser

• **deleteUser**: (`id`: *string*) => *Promise*<any\>

#### Type declaration:

▸ (`id`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:351](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L351)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:856](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L856)

___

### getAttributeById

• **getAttributeById**: (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TAttribute\>

#### Type declaration:

▸ (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TAttribute\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TAttribute\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L253)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:729](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L729)

___

### getFilteredOrders

• **getFilteredOrders**: (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TOrderFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TOrder\>  }) => *Promise*<TPagedList<TOrder\>\>

#### Type declaration:

▸ (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TOrderFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TOrder\>  }): *Promise*<TPagedList<TOrder\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *object* |
`options.customFragment?` | *undefined* \| DocumentNode |
`options.customFragmentName?` | *undefined* \| *string* |
`options.filterParams?` | *undefined* \| TOrderFilter |
`options.pagedParams?` | *undefined* \| *TPagedParams*<TOrder\> |

**Returns:** *Promise*<TPagedList<TOrder\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:404](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L404)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:899](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L899)

___

### getFilteredPosts

• **getFilteredPosts**: (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TPostFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TPost\>  }) => *Promise*<TPagedList<TPost\>\>

#### Type declaration:

▸ (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TPostFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TPost\>  }): *Promise*<TPagedList<TPost\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *object* |
`options.customFragment?` | *undefined* \| DocumentNode |
`options.customFragmentName?` | *undefined* \| *string* |
`options.filterParams?` | *undefined* \| TPostFilter |
`options.pagedParams?` | *undefined* \| *TPagedParams*<TPost\> |

**Returns:** *Promise*<TPagedList<TPost\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:404](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L404)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:821](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L821)

___

### getFilteredProductCategories

• **getFilteredProductCategories**: (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TProductCategoryFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TProductCategory\>  }) => *Promise*<TPagedList<TProductCategory\>\>

#### Type declaration:

▸ (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TProductCategoryFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TProductCategory\>  }): *Promise*<TPagedList<TProductCategory\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *object* |
`options.customFragment?` | *undefined* \| DocumentNode |
`options.customFragmentName?` | *undefined* \| *string* |
`options.filterParams?` | *undefined* \| TProductCategoryFilter |
`options.pagedParams?` | *undefined* \| *TPagedParams*<TProductCategory\> |

**Returns:** *Promise*<TPagedList<TProductCategory\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:404](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L404)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:681](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L681)

___

### getFilteredProductReviews

• **getFilteredProductReviews**: (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TProductReviewFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TProductReview\>  }) => *Promise*<TPagedList<TProductReview\>\>

#### Type declaration:

▸ (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TProductReviewFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TProductReview\>  }): *Promise*<TPagedList<TProductReview\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *object* |
`options.customFragment?` | *undefined* \| DocumentNode |
`options.customFragmentName?` | *undefined* \| *string* |
`options.filterParams?` | *undefined* \| TProductReviewFilter |
`options.pagedParams?` | *undefined* \| *TPagedParams*<TProductReview\> |

**Returns:** *Promise*<TPagedList<TProductReview\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:404](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L404)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:776](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L776)

___

### getFilteredUsers

• **getFilteredUsers**: (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TUserFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TUser\>  }) => *Promise*<TPagedList<TUser\>\>

#### Type declaration:

▸ (`options`: { `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TUserFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TUser\>  }): *Promise*<TPagedList<TUser\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *object* |
`options.customFragment?` | *undefined* \| DocumentNode |
`options.customFragmentName?` | *undefined* \| *string* |
`options.filterParams?` | *undefined* \| TUserFilter |
`options.pagedParams?` | *undefined* \| *TPagedParams*<TUser\> |

**Returns:** *Promise*<TPagedList<TUser\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:404](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L404)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:859](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L859)

___

### getOrderById

• **getOrderById**: (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TOrder\>

#### Type declaration:

▸ (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TOrder\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TOrder\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L253)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:892](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L892)

___

### getOrderBySlug

• **getOrderBySlug**: (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TOrder\>

#### Type declaration:

▸ (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TOrder\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TOrder\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:277](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L277)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:893](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L893)

___

### getOrders

• **getOrders**: (`pagedParams?`: *TPagedParams*<TOrder\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPagedList<TOrder\>\>

#### Type declaration:

▸ (`pagedParams?`: *TPagedParams*<TOrder\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPagedList<TOrder\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *TPagedParams*<TOrder\> |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPagedList<TOrder\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L222)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:891](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L891)

___

### getPostById

• **getPostById**: (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TPost\>

#### Type declaration:

▸ (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TPost\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TPost\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L253)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:814](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L814)

___

### getPostBySlug

• **getPostBySlug**: (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TPost\>

#### Type declaration:

▸ (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TPost\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TPost\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:277](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L277)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:815](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L815)

___

### getPosts

• **getPosts**: (`pagedParams?`: *TPagedParams*<TPost\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPagedList<TPost\>\>

#### Type declaration:

▸ (`pagedParams?`: *TPagedParams*<TPost\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPagedList<TPost\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *TPagedParams*<TPost\> |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPagedList<TPost\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L222)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:813](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L813)

___

### getProductById

• **getProductById**: (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TProduct\>

#### Type declaration:

▸ (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TProduct\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TProduct\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L253)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:572](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L572)

___

### getProductBySlug

• **getProductBySlug**: (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TProduct\>

#### Type declaration:

▸ (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TProduct\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TProduct\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:277](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L277)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:573](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L573)

___

### getProductCategories

• **getProductCategories**: (`pagedParams?`: *TPagedParams*<TProductCategory\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPagedList<TProductCategory\>\>

#### Type declaration:

▸ (`pagedParams?`: *TPagedParams*<TProductCategory\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPagedList<TProductCategory\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *TPagedParams*<TProductCategory\> |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPagedList<TProductCategory\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L222)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:673](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L673)

___

### getProductCategoryById

• **getProductCategoryById**: (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TProductCategory\>

#### Type declaration:

▸ (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TProductCategory\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TProductCategory\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L253)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:674](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L674)

___

### getProductCategoryBySlug

• **getProductCategoryBySlug**: (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TProductCategory\>

#### Type declaration:

▸ (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TProductCategory\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TProductCategory\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:277](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L277)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:675](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L675)

___

### getProductReviewById

• **getProductReviewById**: (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TProductReview\>

#### Type declaration:

▸ (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TProductReview\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TProductReview\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L253)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:770](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L770)

___

### getProductReviews

• **getProductReviews**: (`pagedParams?`: *TPagedParams*<TProductReview\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPagedList<TProductReview\>\>

#### Type declaration:

▸ (`pagedParams?`: *TPagedParams*<TProductReview\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPagedList<TProductReview\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *TPagedParams*<TProductReview\> |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPagedList<TProductReview\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L222)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:769](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L769)

___

### getProducts

• **getProducts**: (`pagedParams?`: *TPagedParams*<TProduct\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPagedList<TProduct\>\>

#### Type declaration:

▸ (`pagedParams?`: *TPagedParams*<TProduct\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPagedList<TProduct\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *TPagedParams*<TProduct\> |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPagedList<TProduct\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L222)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:571](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L571)

___

### getTagById

• **getTagById**: (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TTag\>

#### Type declaration:

▸ (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TTag\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TTag\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L253)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:924](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L924)

___

### getTagBySlug

• **getTagBySlug**: (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TTag\>

#### Type declaration:

▸ (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TTag\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TTag\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:277](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L277)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:925](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L925)

___

### getTags

• **getTags**: (`pagedParams?`: *TPagedParams*<TTag\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPagedList<TTag\>\>

#### Type declaration:

▸ (`pagedParams?`: *TPagedParams*<TTag\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPagedList<TTag\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *TPagedParams*<TTag\> |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPagedList<TTag\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L222)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:923](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L923)

___

### getUserById

• **getUserById**: (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TUser\>

#### Type declaration:

▸ (`id`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TUser\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TUser\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L253)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:852](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L852)

___

### getUserBySlug

• **getUserBySlug**: (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<undefined \| TUser\>

#### Type declaration:

▸ (`slug`: *string*, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TUser\>

#### Parameters:

Name | Type |
:------ | :------ |
`slug` | *string* |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TUser\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:277](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L277)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:853](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L853)

___

### getUsers

• **getUsers**: (`pagedParams?`: *TPagedParams*<TUser\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPagedList<TUser\>\>

#### Type declaration:

▸ (`pagedParams?`: *TPagedParams*<TUser\>, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPagedList<TUser\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`pagedParams?` | *TPagedParams*<TUser\> |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPagedList<TUser\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L222)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:851](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L851)

___

### updateAttribute

• **updateAttribute**: (`id`: *string*, `data`: TAttributeInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TAttribute\>

#### Type declaration:

▸ (`id`: *string*, `data`: TAttributeInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TAttribute\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`data` | TAttributeInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TAttribute\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L301)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:730](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L730)

___

### updateOrder

• **updateOrder**: (`id`: *string*, `data`: TOrderInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TOrder\>

#### Type declaration:

▸ (`id`: *string*, `data`: TOrderInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TOrder\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`data` | TOrderInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TOrder\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L301)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:894](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L894)

___

### updatePost

• **updatePost**: (`id`: *string*, `data`: TPostInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TPost\>

#### Type declaration:

▸ (`id`: *string*, `data`: TPostInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TPost\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`data` | TPostInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TPost\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L301)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:816](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L816)

___

### updateProduct

• **updateProduct**: (`id`: *string*, `data`: TProductInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TProduct\>

#### Type declaration:

▸ (`id`: *string*, `data`: TProductInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TProduct\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`data` | TProductInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TProduct\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L301)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:574](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L574)

___

### updateProductCategory

• **updateProductCategory**: (`id`: *string*, `data`: TProductCategoryInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TProductCategory\>

#### Type declaration:

▸ (`id`: *string*, `data`: TProductCategoryInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TProductCategory\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`data` | TProductCategoryInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TProductCategory\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L301)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:676](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L676)

___

### updateProductReview

• **updateProductReview**: (`id`: *string*, `data`: TProductReviewInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TProductReview\>

#### Type declaration:

▸ (`id`: *string*, `data`: TProductReviewInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TProductReview\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`data` | TProductReviewInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TProductReview\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L301)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:771](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L771)

___

### updateTag

• **updateTag**: (`id`: *string*, `data`: TTagInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TTag\>

#### Type declaration:

▸ (`id`: *string*, `data`: TTagInput, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TTag\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`data` | TTagInput |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TTag\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L301)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:926](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L926)

___

### updateUser

• **updateUser**: (`id`: *string*, `data`: TUpdateUser, `customFragment?`: DocumentNode, `customFragmentName?`: *string*) => *Promise*<TUser\>

#### Type declaration:

▸ (`id`: *string*, `data`: TUpdateUser, `customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<TUser\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`data` | TUpdateUser |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<TUser\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L301)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:854](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L854)

## Methods

### createEntity

▸ **createEntity**<EntityType, EntityInputType\>(`entityName`: *string*, `entityInputName`: *string*, `fragment`: DocumentNode, `fragmentName`: *string*, `data`: EntityInputType): *Promise*<undefined \| EntityType\>

Create a record by id of a generic entity

**`auth`** admin

#### Type parameters:

Name |
:------ |
`EntityType` |
`EntityInputType` |

#### Parameters:

Name | Type |
:------ | :------ |
`entityName` | *string* |
`entityInputName` | *string* |
`fragment` | DocumentNode |
`fragmentName` | *string* |
`data` | EntityInputType |

**Returns:** *Promise*<undefined \| EntityType\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:509](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L509)

___

### getAllEntities

▸ **getAllEntities**<EntityType\>(`entityName`: *string*, `fragment`: DocumentNode, `fragmentName`: *string*): *Promise*<EntityType[]\>

Get all records of a generic entity

**`auth`** admin

#### Type parameters:

Name |
:------ |
`EntityType` |

#### Parameters:

Name | Type |
:------ | :------ |
`entityName` | *string* |
`fragment` | DocumentNode |
`fragmentName` | *string* |

**Returns:** *Promise*<EntityType[]\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:446](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L446)

___

### getAttributes

▸ **getAttributes**(): *Promise*<undefined \| TAttribute[]\>

**Returns:** *Promise*<undefined \| TAttribute[]\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:734](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L734)

___

### getEntityById

▸ **getEntityById**<EntityType\>(`entityName`: *string*, `fragment`: DocumentNode, `fragmentName`: *string*, `entityId`: *string*): *Promise*<undefined \| EntityType\>

Get a record by id of a generic entity

**`auth`** admin

#### Type parameters:

Name |
:------ |
`EntityType` |

#### Parameters:

Name | Type |
:------ | :------ |
`entityName` | *string* |
`fragment` | DocumentNode |
`fragmentName` | *string* |
`entityId` | *string* |

**Returns:** *Promise*<undefined \| EntityType\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:464](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L464)

___

### getFilteredProducts

▸ **getFilteredProducts**(`__namedParameters`: { `categoryId?`: *undefined* \| *string* ; `customFragment?`: *undefined* \| DocumentNode ; `customFragmentName?`: *undefined* \| *string* ; `filterParams?`: *undefined* \| TProductFilter ; `pagedParams?`: *undefined* \| *TPagedParams*<TProduct\>  }): *Promise*<TFilteredProductList\>

#### Parameters:

Name | Type |
:------ | :------ |
`__namedParameters` | *object* |
`__namedParameters.categoryId?` | *undefined* \| *string* |
`__namedParameters.customFragment?` | *undefined* \| DocumentNode |
`__namedParameters.customFragmentName?` | *undefined* \| *string* |
`__namedParameters.filterParams?` | *undefined* \| TProductFilter |
`__namedParameters.pagedParams?` | *undefined* \| *TPagedParams*<TProduct\> |

**Returns:** *Promise*<TFilteredProductList\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:605](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L605)

___

### getProductsFromCategory

▸ **getProductsFromCategory**(`categoryId`: *string*, `pagedParams?`: *TPagedParams*<TProduct\>): *Promise*<TPagedList<TProduct\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`categoryId` | *string* |
`pagedParams?` | *TPagedParams*<TProduct\> |

**Returns:** *Promise*<TPagedList<TProduct\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:581](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L581)

___

### getRootCategories

▸ **getRootCategories**(`customFragment?`: DocumentNode, `customFragmentName?`: *string*): *Promise*<undefined \| TPagedList<TProductCategory\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`customFragment?` | DocumentNode |
`customFragmentName?` | *string* |

**Returns:** *Promise*<undefined \| TPagedList<TProductCategory\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:683](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L683)

___

### mutate

▸ **mutate**<T\>(`options`: *MutationOptions*<{ [key: string]: *any*;  }, OperationVariables\>, `path`: *string*): *Promise*<T\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *MutationOptions*<{ [key: string]: *any*;  }, OperationVariables\> |
`path` | *string* |

**Returns:** *Promise*<T\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:134](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L134)

▸ **mutate**<T\>(`options`: *MutationOptions*<{ [key: string]: *any*;  }, OperationVariables\>): *Promise*<Promise<FetchResult<unknown, Record<string, any\>, Record<string, any\>\>\>\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *MutationOptions*<{ [key: string]: *any*;  }, OperationVariables\> |

**Returns:** *Promise*<Promise<FetchResult<unknown, Record<string, any\>, Record<string, any\>\>\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:135](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L135)

___

### onError

▸ **onError**(`cb`: (`message`: *string*) => *any*, `id?`: *string*): *void*

Add on error callback. Triggers if any of methods of this
client get any type of error

#### Parameters:

Name | Type |
:------ | :------ |
`cb` | (`message`: *string*) => *any* |
`id?` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:198](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L198)

___

### onUnauthorized

▸ **onUnauthorized**(`callback`: () => *any*, `id?`: *string*): *void*

Add on unauthorized error callback. Triggers if any of methods of this
client get unauthorized error

#### Parameters:

Name | Type |
:------ | :------ |
`callback` | () => *any* |
`id?` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:182](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L182)

___

### query

▸ **query**<T\>(`options`: *QueryOptions*<OperationVariables, any\>, `path`: *string*): *Promise*<T\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *QueryOptions*<OperationVariables, any\> |
`path` | *string* |

**Returns:** *Promise*<T\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:117](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L117)

▸ **query**<T\>(`options`: *QueryOptions*<OperationVariables, any\>): *Promise*<ApolloQueryResult<T\>\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *QueryOptions*<OperationVariables, any\> |

**Returns:** *Promise*<ApolloQueryResult<T\>\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:118](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L118)

___

### removeOnError

▸ **removeOnError**(`id`: *string*): *void*

Remove on error callback

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:206](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L206)

___

### removeOnUnauthorized

▸ **removeOnUnauthorized**(`id`: *string*): *void*

Remove on unauthorized error callback

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:190](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L190)

___

### updateEntity

▸ **updateEntity**<EntityType, EntityInputType\>(`entityName`: *string*, `entityInputName`: *string*, `fragment`: DocumentNode, `fragmentName`: *string*, `entityId`: *string*, `data`: EntityInputType): *Promise*<undefined \| EntityType\>

Update a record of a generic entity

**`auth`** admin

#### Type parameters:

Name |
:------ |
`EntityType` |
`EntityInputType` |

#### Parameters:

Name | Type |
:------ | :------ |
`entityName` | *string* |
`entityInputName` | *string* |
`fragment` | DocumentNode |
`fragmentName` | *string* |
`entityId` | *string* |
`data` | EntityInputType |

**Returns:** *Promise*<undefined \| EntityType\>

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:486](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L486)
