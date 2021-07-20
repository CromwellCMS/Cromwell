[@cromwell/root](../README.md) / [Exports](../modules.md) / backend

# Module: backend

CromwellCMS Backend SDK

Exports backend helpers, ORM repositories and entities.

### Install
```
npm i @cromwell/core-backend
```

### Use

Example of usage
```ts
import { ProductRepository } from '@cromwell/core-backend';
import { getCustomRepository } from 'typeorm';

const products = await getCustomRepository(ProductRepository).getProducts();
```

## Table of contents

### Classes

- [Attribute](../classes/backend.attribute.md)
- [AttributeInput](../classes/backend.attributeinput.md)
- [AttributeInstance](../classes/backend.attributeinstance.md)
- [AttributeInstanceValue](../classes/backend.attributeinstancevalue.md)
- [AttributeProductVariant](../classes/backend.attributeproductvariant.md)
- [AttributeRepository](../classes/backend.attributerepository.md)
- [AttributeValue](../classes/backend.attributevalue.md)
- [AttributeValueInput](../classes/backend.attributevalueinput.md)
- [BasePageEntity](../classes/backend.basepageentity.md)
- [BasePageInput](../classes/backend.basepageinput.md)
- [BaseRepository](../classes/backend.baserepository.md)
- [CmsEntity](../classes/backend.cmsentity.md)
- [CreatePost](../classes/backend.createpost.md)
- [CreateProduct](../classes/backend.createproduct.md)
- [CreateProductCategory](../classes/backend.createproductcategory.md)
- [CreateUser](../classes/backend.createuser.md)
- [DeleteManyInput](../classes/backend.deletemanyinput.md)
- [FilteredProduct](../classes/backend.filteredproduct.md)
- [InputOrder](../classes/backend.inputorder.md)
- [InputTag](../classes/backend.inputtag.md)
- [JwtAuthGuard](../classes/backend.jwtauthguard.md)
- [Order](../classes/backend.order.md)
- [OrderFilterInput](../classes/backend.orderfilterinput.md)
- [OrderRepository](../classes/backend.orderrepository.md)
- [PageStats](../classes/backend.pagestats.md)
- [PageStatsRepository](../classes/backend.pagestatsrepository.md)
- [PagedMeta](../classes/backend.pagedmeta.md)
- [PagedOrder](../classes/backend.pagedorder.md)
- [PagedParamsInput](../classes/backend.pagedparamsinput.md)
- [PagedPost](../classes/backend.pagedpost.md)
- [PagedProduct](../classes/backend.pagedproduct.md)
- [PagedProductCategory](../classes/backend.pagedproductcategory.md)
- [PagedProductReview](../classes/backend.pagedproductreview.md)
- [PagedTag](../classes/backend.pagedtag.md)
- [PagedUser](../classes/backend.pageduser.md)
- [PluginEntity](../classes/backend.pluginentity.md)
- [PluginInput](../classes/backend.plugininput.md)
- [PluginRepository](../classes/backend.pluginrepository.md)
- [Post](../classes/backend.post.md)
- [PostComment](../classes/backend.postcomment.md)
- [PostFilterInput](../classes/backend.postfilterinput.md)
- [PostRepository](../classes/backend.postrepository.md)
- [Product](../classes/backend.product.md)
- [ProductCategory](../classes/backend.productcategory.md)
- [ProductCategoryFilterInput](../classes/backend.productcategoryfilterinput.md)
- [ProductCategoryRepository](../classes/backend.productcategoryrepository.md)
- [ProductFilterAttributes](../classes/backend.productfilterattributes.md)
- [ProductFilterInput](../classes/backend.productfilterinput.md)
- [ProductFilterMeta](../classes/backend.productfiltermeta.md)
- [ProductRating](../classes/backend.productrating.md)
- [ProductRepository](../classes/backend.productrepository.md)
- [ProductReview](../classes/backend.productreview.md)
- [ProductReviewFilter](../classes/backend.productreviewfilter.md)
- [ProductReviewInput](../classes/backend.productreviewinput.md)
- [ProductReviewRepository](../classes/backend.productreviewrepository.md)
- [Tag](../classes/backend.tag.md)
- [TagRepository](../classes/backend.tagrepository.md)
- [ThemeEntity](../classes/backend.themeentity.md)
- [UpdatePost](../classes/backend.updatepost.md)
- [UpdateProduct](../classes/backend.updateproduct.md)
- [UpdateProductCategory](../classes/backend.updateproductcategory.md)
- [UpdateUser](../classes/backend.updateuser.md)
- [User](../classes/backend.user.md)
- [UserFilterInput](../classes/backend.userfilterinput.md)
- [UserRepository](../classes/backend.userrepository.md)

### Type aliases

- [ActionNames](backend.md#actionnames)
- [ActionTypes](backend.md#actiontypes)
- [TAuthUserInfo](backend.md#tauthuserinfo)
- [TBackendModule](backend.md#tbackendmodule)
- [TGraphQLContext](backend.md#tgraphqlcontext)
- [TPluginInfo](backend.md#tplugininfo)
- [TRequestWithUser](backend.md#trequestwithuser)
- [TTokenInfo](backend.md#ttokeninfo)
- [TTokenPayload](backend.md#ttokenpayload)

### Variables

- [ORMEntities](backend.md#ormentities)
- [adminPanelMessages](backend.md#adminpanelmessages)
- [buildDirName](backend.md#builddirname)
- [cmsConfigFileName](backend.md#cmsconfigfilename)
- [cmsName](backend.md#cmsname)
- [cmsPackageName](backend.md#cmspackagename)
- [configFileName](backend.md#configfilename)
- [defaultCmsConfig](backend.md#defaultcmsconfig)
- [pluginAdminBundlePath](backend.md#pluginadminbundlepath)
- [pluginAdminCjsPath](backend.md#pluginadmincjspath)
- [pluginFrontendBundlePath](backend.md#pluginfrontendbundlepath)
- [pluginFrontendCjsPath](backend.md#pluginfrontendcjspath)
- [rendererMessages](backend.md#renderermessages)
- [serverMessages](backend.md#servermessages)
- [tempDirName](backend.md#tempdirname)

### Functions

- [Roles](backend.md#roles)
- [applyGetManyFromOne](backend.md#applygetmanyfromone)
- [applyGetPaged](backend.md#applygetpaged)
- [checkEntitySlug](backend.md#checkentityslug)
- [createGenericEntity](backend.md#creategenericentity)
- [fireAction](backend.md#fireaction)
- [getAdminPanelDir](backend.md#getadminpaneldir)
- [getAdminPanelServiceBuildDir](backend.md#getadminpanelservicebuilddir)
- [getAdminPanelStartupPath](backend.md#getadminpanelstartuppath)
- [getAdminPanelStaticDir](backend.md#getadminpanelstaticdir)
- [getAdminPanelTempDir](backend.md#getadminpaneltempdir)
- [getAdminPanelWebPublicDir](backend.md#getadminpanelwebpublicdir)
- [getAdminPanelWebServiceBuildDir](backend.md#getadminpanelwebservicebuilddir)
- [getCMSConfigPath](backend.md#getcmsconfigpath)
- [getCmsEntity](backend.md#getcmsentity)
- [getCmsModuleConfig](backend.md#getcmsmoduleconfig)
- [getCmsModuleInfo](backend.md#getcmsmoduleinfo)
- [getCmsSettings](backend.md#getcmssettings)
- [getCoreBackendDir](backend.md#getcorebackenddir)
- [getCoreCommonDir](backend.md#getcorecommondir)
- [getCoreFrontendDir](backend.md#getcorefrontenddir)
- [getEmailTemplate](backend.md#getemailtemplate)
- [getErrorLogPath](backend.md#geterrorlogpath)
- [getLogger](backend.md#getlogger)
- [getLogsDir](backend.md#getlogsdir)
- [getManagerDir](backend.md#getmanagerdir)
- [getManagerTempDir](backend.md#getmanagertempdir)
- [getMetaInfoPath](backend.md#getmetainfopath)
- [getModulePackage](backend.md#getmodulepackage)
- [getModuleStaticDir](backend.md#getmodulestaticdir)
- [getNodeModuleDir](backend.md#getnodemoduledir)
- [getNodeModuleDirSync](backend.md#getnodemoduledirsync)
- [getPaged](backend.md#getpaged)
- [getPluginAdminBundlePath](backend.md#getpluginadminbundlepath)
- [getPluginAdminCjsPath](backend.md#getpluginadmincjspath)
- [getPluginBackendPath](backend.md#getpluginbackendpath)
- [getPluginFrontendBundlePath](backend.md#getpluginfrontendbundlepath)
- [getPluginFrontendCjsPath](backend.md#getpluginfrontendcjspath)
- [getPluginFrontendMetaPath](backend.md#getpluginfrontendmetapath)
- [getPublicDir](backend.md#getpublicdir)
- [getPublicPluginsDir](backend.md#getpublicpluginsdir)
- [getPublicThemesDir](backend.md#getpublicthemesdir)
- [getRendererBuildDir](backend.md#getrendererbuilddir)
- [getRendererDir](backend.md#getrendererdir)
- [getRendererStartupPath](backend.md#getrendererstartuppath)
- [getRendererTempDevDir](backend.md#getrenderertempdevdir)
- [getRendererTempDir](backend.md#getrenderertempdir)
- [getServerBuildDir](backend.md#getserverbuilddir)
- [getServerBuildPath](backend.md#getserverbuildpath)
- [getServerBuildProxyPath](backend.md#getserverbuildproxypath)
- [getServerDefaultEmailsDir](backend.md#getserverdefaultemailsdir)
- [getServerDir](backend.md#getserverdir)
- [getServerStartupPath](backend.md#getserverstartuppath)
- [getServerTempDir](backend.md#getservertempdir)
- [getServerTempEmailsDir](backend.md#getservertempemailsdir)
- [getTempDir](backend.md#gettempdir)
- [getThemeAdminPanelBundleDir](backend.md#getthemeadminpanelbundledir)
- [getThemeAdminPanelDir](backend.md#getthemeadminpaneldir)
- [getThemeBuildDir](backend.md#getthemebuilddir)
- [getThemeNextBuildDir](backend.md#getthemenextbuilddir)
- [getThemeNextBuildDirByPath](backend.md#getthemenextbuilddirbypath)
- [getThemePagesMetaPath](backend.md#getthemepagesmetapath)
- [getThemePagesVirtualPath](backend.md#getthemepagesvirtualpath)
- [getThemeRollupBuildDir](backend.md#getthemerollupbuilddir)
- [getThemeRollupBuildDirByPath](backend.md#getthemerollupbuilddirbypath)
- [getThemeTempAdminPanelDir](backend.md#getthemetempadminpaneldir)
- [getThemeTempRollupBuildDir](backend.md#getthemetemprollupbuilddir)
- [getUtilsBuildDir](backend.md#getutilsbuilddir)
- [getUtilsDir](backend.md#getutilsdir)
- [getUtilsImporterPath](backend.md#getutilsimporterpath)
- [getUtilsTempDir](backend.md#getutilstempdir)
- [graphQlAuthChecker](backend.md#graphqlauthchecker)
- [handleBaseInput](backend.md#handlebaseinput)
- [readCMSConfig](backend.md#readcmsconfig)
- [readCMSConfigSync](backend.md#readcmsconfigsync)
- [readCmsModules](backend.md#readcmsmodules)
- [readPackage](backend.md#readpackage)
- [readPluginsExports](backend.md#readpluginsexports)
- [registerAction](backend.md#registeraction)
- [resolvePackageJsonPath](backend.md#resolvepackagejsonpath)
- [runShellCommand](backend.md#runshellcommand)
- [sendEmail](backend.md#sendemail)
- [validateEmail](backend.md#validateemail)

## Type aliases

### ActionNames

Ƭ **ActionNames**: keyof [*ActionTypes*](backend.md#actiontypes)

Defined in: [system/core/backend/src/helpers/types.ts:71](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/types.ts#L71)

___

### ActionTypes

Ƭ **ActionTypes**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`create_attribute` | TAttribute |
`create_order` | TOrder |
`create_post` | TPost |
`create_post_comment` | TPostComment |
`create_product` | TProduct |
`create_product_category` | TProductCategory |
`create_product_review` | TProductReview |
`create_tag` | TTag |
`create_user` | TUser |
`delete_attribute` | *object* |
`delete_attribute.id` | *string* |
`delete_order` | *object* |
`delete_order.id` | *string* |
`delete_post` | *object* |
`delete_post.id` | *string* |
`delete_post_comment` | *object* |
`delete_post_comment.id` | *string* |
`delete_product` | *object* |
`delete_product.id` | *string* |
`delete_product_category` | *object* |
`delete_product_category.id` | *string* |
`delete_product_review` | *object* |
`delete_product_review.id` | *string* |
`delete_tag` | *object* |
`delete_tag.id` | *string* |
`delete_user` | *object* |
`delete_user.id` | *string* |
`install_plugin` | *object* |
`install_plugin.pluginName` | *string* |
`install_theme` | *object* |
`install_theme.themeName` | *string* |
`uninstall_plugin` | *object* |
`uninstall_plugin.pluginName` | *string* |
`uninstall_theme` | *object* |
`uninstall_theme.themeName` | *string* |
`update_attribute`? | TAttribute |
`update_order`? | TOrder |
`update_plugin` | *object* |
`update_plugin.pluginName` | *string* |
`update_post`? | TPost |
`update_post_comment`? | TPostComment |
`update_product`? | TProduct |
`update_product_category`? | TProductCategory |
`update_product_review`? | TProductReview |
`update_settings` | TCmsSettings |
`update_tag`? | TTag |
`update_theme` | *object* |
`update_theme.themeName` | *string* |
`update_user`? | TUser |

Defined in: [system/core/backend/src/helpers/types.ts:23](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/types.ts#L23)

___

### TAuthUserInfo

Ƭ **TAuthUserInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`email` | *string* |
`id` | *string* |
`role` | TUserRole |

Defined in: [system/core/backend/src/helpers/auth-guards.ts:7](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/auth-guards.ts#L7)

___

### TBackendModule

Ƭ **TBackendModule**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`controllers`? | *unknown*[] |
`entities`? | *unknown*[] |
`migrations`? | *unknown*[] |
`providers`? | *unknown*[] |
`resolvers`? | *unknown*[] |

Defined in: [system/core/backend/src/helpers/types.ts:14](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/types.ts#L14)

___

### TGraphQLContext

Ƭ **TGraphQLContext**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`user`? | [*TAuthUserInfo*](backend.md#tauthuserinfo) |

Defined in: [system/core/backend/src/helpers/auth-guards.ts:30](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/auth-guards.ts#L30)

___

### TPluginInfo

Ƭ **TPluginInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`adminPanelPath`? | *string* |
`backendPath`? | *string* |
`frontendPath`? | *string* |
`pluginName` | *string* |

Defined in: [system/core/backend/src/helpers/readPluginsExports.ts:15](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/readPluginsExports.ts#L15)

___

### TRequestWithUser

Ƭ **TRequestWithUser**: FastifyRequest & { `cookies`: *any* ; `user`: [*TAuthUserInfo*](backend.md#tauthuserinfo)  }

Defined in: [system/core/backend/src/helpers/auth-guards.ts:19](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/auth-guards.ts#L19)

___

### TTokenInfo

Ƭ **TTokenInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`cookie` | *string* |
`maxAge` | *string* |
`token` | *string* |

Defined in: [system/core/backend/src/helpers/auth-guards.ts:24](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/auth-guards.ts#L24)

___

### TTokenPayload

Ƭ **TTokenPayload**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`role` | TUserRole |
`sub` | *string* |
`username` | *string* |

Defined in: [system/core/backend/src/helpers/auth-guards.ts:13](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/auth-guards.ts#L13)

## Variables

### ORMEntities

• `Const` **ORMEntities**: (*typeof* [*Attribute*](../classes/backend.attribute.md) \| *typeof* [*CmsEntity*](../classes/backend.cmsentity.md) \| *typeof* [*Product*](../classes/backend.product.md) \| *typeof* [*Order*](../classes/backend.order.md) \| *typeof* [*Post*](../classes/backend.post.md) \| *typeof* [*ProductCategory*](../classes/backend.productcategory.md) \| *typeof* [*ProductReview*](../classes/backend.productreview.md) \| *typeof* [*Tag*](../classes/backend.tag.md) \| *typeof* [*User*](../classes/backend.user.md) \| *typeof* [*PageStats*](../classes/backend.pagestats.md) \| *typeof* [*PluginEntity*](../classes/backend.pluginentity.md) \| *typeof* [*PostComment*](../classes/backend.postcomment.md))[]

Defined in: [system/core/backend/src/helpers/constants.ts:18](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/constants.ts#L18)

___

### adminPanelMessages

• `Const` **adminPanelMessages**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`onBuildEndMessage` | *string* |
`onBuildErrorMessage` | *string* |
`onBuildStartMessage` | *string* |
`onStartErrorMessage` | *string* |
`onStartMessage` | *string* |

Defined in: [system/core/backend/src/helpers/constants.ts:33](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/constants.ts#L33)

___

### buildDirName

• `Const` **buildDirName**: *build*

Defined in: [system/core/backend/src/helpers/paths.ts:10](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L10)

___

### cmsConfigFileName

• `Const` **cmsConfigFileName**: *cmsconfig.json*= 'cmsconfig.json'

Defined in: [system/core/backend/src/helpers/paths.ts:12](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L12)

___

### cmsName

• `Const` **cmsName**: *cromwell*= 'cromwell'

Defined in: [system/core/backend/src/helpers/paths.ts:8](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L8)

___

### cmsPackageName

• `Const` **cmsPackageName**: *@cromwell/cms*= '@cromwell/cms'

Defined in: [system/core/backend/src/helpers/constants.ts:96](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/constants.ts#L96)

___

### configFileName

• `Const` **configFileName**: *string*

Defined in: [system/core/backend/src/helpers/paths.ts:11](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L11)

___

### defaultCmsConfig

• `Const` **defaultCmsConfig**: TCmsConfig

Defined in: [system/core/backend/src/helpers/constants.ts:49](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/constants.ts#L49)

___

### pluginAdminBundlePath

• `Const` **pluginAdminBundlePath**: *admin/index.js*= 'admin/index.js'

Defined in: [system/core/backend/src/helpers/paths.ts:209](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L209)

___

### pluginAdminCjsPath

• `Const` **pluginAdminCjsPath**: *admin/cjs.js*= 'admin/cjs.js'

Defined in: [system/core/backend/src/helpers/paths.ts:210](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L210)

___

### pluginFrontendBundlePath

• `Const` **pluginFrontendBundlePath**: *frontend/index.js*= 'frontend/index.js'

Defined in: [system/core/backend/src/helpers/paths.ts:207](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L207)

___

### pluginFrontendCjsPath

• `Const` **pluginFrontendCjsPath**: *frontend/cjs.js*= 'frontend/cjs.js'

Defined in: [system/core/backend/src/helpers/paths.ts:208](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L208)

___

### rendererMessages

• `Const` **rendererMessages**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`onBuildEndMessage` | *string* |
`onBuildErrorMessage` | *string* |
`onBuildStartMessage` | *string* |
`onStartErrorMessage` | *string* |
`onStartMessage` | *string* |

Defined in: [system/core/backend/src/helpers/constants.ts:25](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/constants.ts#L25)

___

### serverMessages

• `Const` **serverMessages**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`onBuildEndMessage` | *string* |
`onBuildErrorMessage` | *string* |
`onBuildStartMessage` | *string* |
`onStartErrorMessage` | *string* |
`onStartMessage` | *string* |

Defined in: [system/core/backend/src/helpers/constants.ts:41](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/constants.ts#L41)

___

### tempDirName

• `Const` **tempDirName**: *string*

Defined in: [system/core/backend/src/helpers/paths.ts:9](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L9)

## Functions

### Roles

▸ `Const`**Roles**(...`roles`: TAuthRole[]): *CustomDecorator*<string\>

#### Parameters:

Name | Type |
:------ | :------ |
`...roles` | TAuthRole[] |

**Returns:** *CustomDecorator*<string\>

Defined in: [system/core/backend/src/helpers/auth-guards.ts:34](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/auth-guards.ts#L34)

___

### applyGetManyFromOne

▸ `Const`**applyGetManyFromOne**<T\>(`qb`: *SelectQueryBuilder*<T\>, `firstEntityName`: *string*, `firstEntityProp`: keyof T, `secondEntityName`: *string*, `secondEntityId`: *string*): *SelectQueryBuilder*<T\>

Retrieve all related entities of one specified entity by id in many-to-many relationship
E.g. get all products from a category

**`prop`** firstEntityName - table DB name of many

**`prop`** firstEntityProp - property of many that refers to relationship

**`prop`** secondEntityName - table DB name of one

**`prop`** secondEntityId - DB id of one

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<T\> |
`firstEntityName` | *string* |
`firstEntityProp` | keyof T |
`secondEntityName` | *string* |
`secondEntityId` | *string* |

**Returns:** *SelectQueryBuilder*<T\>

Defined in: [system/core/backend/src/repositories/BaseQueries.ts:34](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseQueries.ts#L34)

___

### applyGetPaged

▸ `Const`**applyGetPaged**<T\>(`qb`: *SelectQueryBuilder*<T\>, `sortByTableName?`: *string*, `params?`: *TPagedParams*<T\>): *SelectQueryBuilder*<T\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<T\> |
`sortByTableName?` | *string* |
`params?` | *TPagedParams*<T\> |

**Returns:** *SelectQueryBuilder*<T\>

Defined in: [system/core/backend/src/repositories/BaseQueries.ts:8](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseQueries.ts#L8)

___

### checkEntitySlug

▸ `Const`**checkEntitySlug**<T\>(`entity`: T, `EntityClass`: (...`args`: *any*[]) => T): *Promise*<T\>

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | [*BasePageEntity*](../classes/backend.basepageentity.md)<T\> |

#### Parameters:

Name | Type |
:------ | :------ |
`entity` | T |
`EntityClass` | (...`args`: *any*[]) => T |

**Returns:** *Promise*<T\>

Defined in: [system/core/backend/src/repositories/BaseQueries.ts:69](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseQueries.ts#L69)

___

### createGenericEntity

▸ `Const`**createGenericEntity**<EntityType, EntityInputType\>(`entityName`: *string*, `EntityClass`: (...`args`: *any*[]) => EntityType, `InputEntityClass?`: (...`args`: *any*[]) => EntityInputType): *object*

#### Type parameters:

Name | Default |
:------ | :------ |
`EntityType` | - |
`EntityInputType` | EntityType |

#### Parameters:

Name | Type |
:------ | :------ |
`entityName` | *string* |
`EntityClass` | (...`args`: *any*[]) => EntityType |
`InputEntityClass?` | (...`args`: *any*[]) => EntityInputType |

**Returns:** *object*

Name | Type |
:------ | :------ |
`abstractResolver` | *any* |
`createArgs` | *any* |
`pagedEntity` | *any* |
`repository` | *ObjectType*<BaseRepository<EntityType, EntityInputType\>\> |
`updateArgs` | *any* |

Defined in: [system/core/backend/src/helpers/createGenericEntity.ts:9](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/createGenericEntity.ts#L9)

___

### fireAction

▸ `Const`**fireAction**<T, TPayload\>(`options`: { `actionName`: *string* \| T ; `payload?`: *undefined* \| TPayload  }): *Promise*<Record<string, any\>\>

#### Type parameters:

Name | Type | Default |
:------ | :------ | :------ |
`T` | keyof *any* | - |
`TPayload` | - | [*ActionTypes*](backend.md#actiontypes)[T] |

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *object* |
`options.actionName` | *string* \| T |
`options.payload?` | *undefined* \| TPayload |

**Returns:** *Promise*<Record<string, any\>\>

Defined in: [system/core/backend/src/helpers/actions.ts:23](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/actions.ts#L23)

___

### getAdminPanelDir

▸ `Const`**getAdminPanelDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:73](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L73)

___

### getAdminPanelServiceBuildDir

▸ `Const`**getAdminPanelServiceBuildDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:74](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L74)

___

### getAdminPanelStartupPath

▸ `Const`**getAdminPanelStartupPath**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:86](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L86)

___

### getAdminPanelStaticDir

▸ `Const`**getAdminPanelStaticDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:90](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L90)

___

### getAdminPanelTempDir

▸ `Const`**getAdminPanelTempDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:78](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L78)

___

### getAdminPanelWebPublicDir

▸ `Const`**getAdminPanelWebPublicDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:83](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L83)

___

### getAdminPanelWebServiceBuildDir

▸ `Const`**getAdminPanelWebServiceBuildDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:80](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L80)

___

### getCMSConfigPath

▸ `Const`**getCMSConfigPath**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:44](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L44)

___

### getCmsEntity

▸ `Const`**getCmsEntity**(): *Promise*<[*CmsEntity*](../classes/backend.cmsentity.md)\>

**Returns:** *Promise*<[*CmsEntity*](../classes/backend.cmsentity.md)\>

Defined in: [system/core/backend/src/helpers/cms-settings.ts:57](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/cms-settings.ts#L57)

___

### getCmsModuleConfig

▸ `Const`**getCmsModuleConfig**(`moduleName?`: *string*): *Promise*<undefined \| TModuleConfig\>

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName?` | *string* |

**Returns:** *Promise*<undefined \| TModuleConfig\>

Defined in: [system/core/backend/src/helpers/paths.ts:179](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L179)

___

### getCmsModuleInfo

▸ `Const`**getCmsModuleInfo**(`moduleName?`: *string*): *Promise*<undefined \| TPackageCromwellConfig\>

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName?` | *string* |

**Returns:** *Promise*<undefined \| TPackageCromwellConfig\>

Defined in: [system/core/backend/src/helpers/paths.ts:189](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L189)

___

### getCmsSettings

▸ `Const`**getCmsSettings**(): *Promise*<undefined \| TCmsSettings\>

**Returns:** *Promise*<undefined \| TCmsSettings\>

Defined in: [system/core/backend/src/helpers/cms-settings.ts:72](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/cms-settings.ts#L72)

___

### getCoreBackendDir

▸ `Const`**getCoreBackendDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:48](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L48)

___

### getCoreCommonDir

▸ `Const`**getCoreCommonDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:46](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L46)

___

### getCoreFrontendDir

▸ `Const`**getCoreFrontendDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:47](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L47)

___

### getEmailTemplate

▸ `Const`**getEmailTemplate**(`fileName`: *string*, `props?`: *Record*<string, any\>): *Promise*<undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`fileName` | *string* |
`props?` | *Record*<string, any\> |

**Returns:** *Promise*<undefined \| string\>

Defined in: [system/core/backend/src/helpers/emailing.ts:14](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/emailing.ts#L14)

___

### getErrorLogPath

▸ `Const`**getErrorLogPath**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:50](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L50)

___

### getLogger

▸ `Const`**getLogger**(`writeToFile?`: *boolean*): *object*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`writeToFile` | *boolean* | true |

**Returns:** *object*

Name | Type |
:------ | :------ |
`error` | (...`args`: *any*[]) => *void* |
`info` | (...`args`: *any*[]) => *void* |
`log` | (...`args`: *any*[]) => *void* |
`warn` | (...`args`: *any*[]) => *void* |

Defined in: [system/core/backend/src/helpers/logger.ts:17](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/logger.ts#L17)

___

### getLogsDir

▸ `Const`**getLogsDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:49](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L49)

___

### getManagerDir

▸ `Const`**getManagerDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:53](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L53)

___

### getManagerTempDir

▸ `Const`**getManagerTempDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:54](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L54)

___

### getMetaInfoPath

▸ `Const`**getMetaInfoPath**(`filename`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`filename` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:205](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L205)

___

### getModulePackage

▸ `Const`**getModulePackage**(`moduleName?`: *string*): *Promise*<undefined \| TPackageJson\>

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName?` | *string* |

**Returns:** *Promise*<undefined \| TPackageJson\>

Defined in: [system/core/backend/src/helpers/paths.ts:229](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L229)

___

### getModuleStaticDir

▸ `Const`**getModuleStaticDir**(`moduleName`: *string*): *Promise*<undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |

**Returns:** *Promise*<undefined \| string\>

Defined in: [system/core/backend/src/helpers/paths.ts:198](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L198)

___

### getNodeModuleDir

▸ `Const`**getNodeModuleDir**(`moduleName`: *string*): *Promise*<undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |

**Returns:** *Promise*<undefined \| string\>

Defined in: [system/core/backend/src/helpers/paths.ts:31](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L31)

___

### getNodeModuleDirSync

▸ `Const`**getNodeModuleDirSync**(`moduleName`: *string*): *undefined* \| *string*

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:22](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L22)

___

### getPaged

▸ `Const`**getPaged**<T\>(`qb`: *SelectQueryBuilder*<T\>, `sortByTableName?`: *string*, `params?`: *TPagedParams*<T\>): *Promise*<TPagedList<T\>\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`qb` | *SelectQueryBuilder*<T\> |
`sortByTableName?` | *string* |
`params?` | *TPagedParams*<T\> |

**Returns:** *Promise*<TPagedList<T\>\>

Defined in: [system/core/backend/src/repositories/BaseQueries.ts:41](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseQueries.ts#L41)

___

### getPluginAdminBundlePath

▸ `Const`**getPluginAdminBundlePath**(`distDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`distDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:214](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L214)

___

### getPluginAdminCjsPath

▸ `Const`**getPluginAdminCjsPath**(`distDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`distDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:215](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L215)

___

### getPluginBackendPath

▸ `Const`**getPluginBackendPath**(`distDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`distDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:216](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L216)

___

### getPluginFrontendBundlePath

▸ `Const`**getPluginFrontendBundlePath**(`distDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`distDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:211](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L211)

___

### getPluginFrontendCjsPath

▸ `Const`**getPluginFrontendCjsPath**(`distDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`distDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:212](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L212)

___

### getPluginFrontendMetaPath

▸ `Const`**getPluginFrontendMetaPath**(`distDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`distDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:213](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L213)

___

### getPublicDir

▸ `Const`**getPublicDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:220](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L220)

___

### getPublicPluginsDir

▸ `Const`**getPublicPluginsDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:221](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L221)

___

### getPublicThemesDir

▸ `Const`**getPublicThemesDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:222](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L222)

___

### getRendererBuildDir

▸ `Const`**getRendererBuildDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:65](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L65)

___

### getRendererDir

▸ `Const`**getRendererDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:58](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L58)

___

### getRendererStartupPath

▸ `Const`**getRendererStartupPath**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:59](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L59)

___

### getRendererTempDevDir

▸ `Const`**getRendererTempDevDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:64](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L64)

___

### getRendererTempDir

▸ `Const`**getRendererTempDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:63](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L63)

___

### getServerBuildDir

▸ `Const`**getServerBuildDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:101](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L101)

___

### getServerBuildPath

▸ `Const`**getServerBuildPath**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:105](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L105)

___

### getServerBuildProxyPath

▸ `Const`**getServerBuildProxyPath**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:109](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L109)

___

### getServerDefaultEmailsDir

▸ `Const`**getServerDefaultEmailsDir**(): *void*

**Returns:** *void*

Defined in: [system/core/backend/src/helpers/paths.ts:115](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L115)

___

### getServerDir

▸ `Const`**getServerDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:96](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L96)

___

### getServerStartupPath

▸ `Const`**getServerStartupPath**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:97](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L97)

___

### getServerTempDir

▸ `Const`**getServerTempDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:113](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L113)

___

### getServerTempEmailsDir

▸ `Const`**getServerTempEmailsDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:114](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L114)

___

### getTempDir

▸ `Const`**getTempDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:14](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L14)

___

### getThemeAdminPanelBundleDir

▸ `Const`**getThemeAdminPanelBundleDir**(`themeModuleName`: *string*, `pageRoute`: *string*): *Promise*<undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`themeModuleName` | *string* |
`pageRoute` | *string* |

**Returns:** *Promise*<undefined \| string\>

Defined in: [system/core/backend/src/helpers/paths.ts:172](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L172)

___

### getThemeAdminPanelDir

▸ `Const`**getThemeAdminPanelDir**(`themeModuleName`: *string*): *Promise*<undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`themeModuleName` | *string* |

**Returns:** *Promise*<undefined \| string\>

Defined in: [system/core/backend/src/helpers/paths.ts:166](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L166)

___

### getThemeBuildDir

▸ `Const`**getThemeBuildDir**(`themeModuleName`: *string*): *Promise*<undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`themeModuleName` | *string* |

**Returns:** *Promise*<undefined \| string\>

Defined in: [system/core/backend/src/helpers/paths.ts:134](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L134)

___

### getThemeNextBuildDir

▸ `Const`**getThemeNextBuildDir**(`themeModuleName`: *string*): *Promise*<undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`themeModuleName` | *string* |

**Returns:** *Promise*<undefined \| string\>

Defined in: [system/core/backend/src/helpers/paths.ts:153](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L153)

___

### getThemeNextBuildDirByPath

▸ `Const`**getThemeNextBuildDirByPath**(`themeDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`themeDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:159](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L159)

___

### getThemePagesMetaPath

▸ `Const`**getThemePagesMetaPath**(`distDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`distDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:217](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L217)

___

### getThemePagesVirtualPath

▸ `Const`**getThemePagesVirtualPath**(`distDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`distDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:218](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L218)

___

### getThemeRollupBuildDir

▸ `Const`**getThemeRollupBuildDir**(`themeModuleName`: *string*): *Promise*<undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`themeModuleName` | *string* |

**Returns:** *Promise*<undefined \| string\>

Defined in: [system/core/backend/src/helpers/paths.ts:143](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L143)

___

### getThemeRollupBuildDirByPath

▸ `Const`**getThemeRollupBuildDirByPath**(`themeDir`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`themeDir` | *string* |

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:149](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L149)

___

### getThemeTempAdminPanelDir

▸ `Const`**getThemeTempAdminPanelDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:162](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L162)

___

### getThemeTempRollupBuildDir

▸ `Const`**getThemeTempRollupBuildDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:140](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L140)

___

### getUtilsBuildDir

▸ `Const`**getUtilsBuildDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:127](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L127)

___

### getUtilsDir

▸ `Const`**getUtilsDir**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:122](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L122)

___

### getUtilsImporterPath

▸ `Const`**getUtilsImporterPath**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:123](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L123)

___

### getUtilsTempDir

▸ `Const`**getUtilsTempDir**(): *string*

**Returns:** *string*

Defined in: [system/core/backend/src/helpers/paths.ts:131](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L131)

___

### graphQlAuthChecker

▸ `Const`**graphQlAuthChecker**(`options?`: *null* \| { `args?`: *undefined* \| *Record*<string, any\> ; `context?`: *undefined* \| [*TGraphQLContext*](backend.md#tgraphqlcontext) ; `info?`: *any* ; `root?`: *any*  }, `roles?`: *null* \| TAuthRole[]): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | *null* \| { `args?`: *undefined* \| *Record*<string, any\> ; `context?`: *undefined* \| [*TGraphQLContext*](backend.md#tgraphqlcontext) ; `info?`: *any* ; `root?`: *any*  } |
`roles?` | *null* \| TAuthRole[] |

**Returns:** *boolean*

Defined in: [system/core/backend/src/helpers/auth-guards.ts:51](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/auth-guards.ts#L51)

___

### handleBaseInput

▸ `Const`**handleBaseInput**(`entity`: TBasePageEntity, `input`: TBasePageEntityInput): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`entity` | TBasePageEntity |
`input` | TBasePageEntityInput |

**Returns:** *void*

Defined in: [system/core/backend/src/repositories/BaseQueries.ts:59](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/repositories/BaseQueries.ts#L59)

___

### readCMSConfig

▸ `Const`**readCMSConfig**(): *Promise*<TCmsConfig\>

Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns

**Returns:** *Promise*<TCmsConfig\>

Defined in: [system/core/backend/src/helpers/cms-settings.ts:39](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/cms-settings.ts#L39)

___

### readCMSConfigSync

▸ `Const`**readCMSConfigSync**(): TCmsConfig

Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns

**Returns:** TCmsConfig

Defined in: [system/core/backend/src/helpers/cms-settings.ts:21](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/cms-settings.ts#L21)

___

### readCmsModules

▸ `Const`**readCmsModules**(): *Promise*<{ `plugins`: *string*[] ; `themes`: *string*[]  }\>

**Returns:** *Promise*<{ `plugins`: *string*[] ; `themes`: *string*[]  }\>

Defined in: [system/core/backend/src/helpers/readCmsModules.ts:7](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/readCmsModules.ts#L7)

___

### readPackage

▸ `Const`**readPackage**(`path`: *string*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`path` | *string* |

**Returns:** *Promise*<any\>

Defined in: [system/core/backend/src/helpers/paths.ts:224](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L224)

___

### readPluginsExports

▸ `Const`**readPluginsExports**(): *Promise*<[*TPluginInfo*](backend.md#tplugininfo)[]\>

**Returns:** *Promise*<[*TPluginInfo*](backend.md#tplugininfo)[]\>

Defined in: [system/core/backend/src/helpers/readPluginsExports.ts:22](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/readPluginsExports.ts#L22)

___

### registerAction

▸ `Const`**registerAction**<T, TPayload\>(`options`: { `action`: (`payload`: TPayload) => *any* ; `actionName`: *string* \| T ; `pluginName`: *string*  }): *void*

#### Type parameters:

Name | Type | Default |
:------ | :------ | :------ |
`T` | keyof *any* | - |
`TPayload` | - | [*ActionTypes*](backend.md#actiontypes)[T] |

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *object* |
`options.action` | (`payload`: TPayload) => *any* |
`options.actionName` | *string* \| T |
`options.pluginName` | *string* |

**Returns:** *void*

Defined in: [system/core/backend/src/helpers/actions.ts:7](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/actions.ts#L7)

___

### resolvePackageJsonPath

▸ `Const`**resolvePackageJsonPath**(`moduleName`: *string*): *undefined* \| *string*

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |

**Returns:** *undefined* \| *string*

Defined in: [system/core/backend/src/helpers/paths.ts:16](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/paths.ts#L16)

___

### runShellCommand

▸ `Const`**runShellCommand**(`command`: *string*, `cwd?`: *string*): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`command` | *string* |
`cwd?` | *string* |

**Returns:** *Promise*<void\>

Defined in: [system/core/backend/src/helpers/shell.ts:7](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/shell.ts#L7)

___

### sendEmail

▸ `Const`**sendEmail**(`addresses`: *string*[], `subject`: *string*, `htmlContent`: *string*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`addresses` | *string*[] |
`subject` | *string* |
`htmlContent` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/helpers/emailing.ts:34](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/emailing.ts#L34)

___

### validateEmail

▸ `Const`**validateEmail**(`email`: *any*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`email` | *any* |

**Returns:** *boolean*

Defined in: [system/core/backend/src/helpers/validation.ts:1](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/backend/src/helpers/validation.ts#L1)
