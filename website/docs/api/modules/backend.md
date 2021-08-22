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

- [Attribute](../classes/backend.Attribute.md)
- [AttributeInput](../classes/backend.AttributeInput.md)
- [AttributeInstance](../classes/backend.AttributeInstance.md)
- [AttributeInstanceValue](../classes/backend.AttributeInstanceValue.md)
- [AttributeProductVariant](../classes/backend.AttributeProductVariant.md)
- [AttributeRepository](../classes/backend.AttributeRepository.md)
- [AttributeValue](../classes/backend.AttributeValue.md)
- [AttributeValueInput](../classes/backend.AttributeValueInput.md)
- [BasePageEntity](../classes/backend.BasePageEntity.md)
- [BasePageInput](../classes/backend.BasePageInput.md)
- [BaseRepository](../classes/backend.BaseRepository.md)
- [CmsEntity](../classes/backend.CmsEntity.md)
- [CreatePost](../classes/backend.CreatePost.md)
- [CreateProduct](../classes/backend.CreateProduct.md)
- [CreateProductCategory](../classes/backend.CreateProductCategory.md)
- [CreateUser](../classes/backend.CreateUser.md)
- [DeleteManyInput](../classes/backend.DeleteManyInput.md)
- [FilteredProduct](../classes/backend.FilteredProduct.md)
- [GenericPluginResolver](../classes/backend.GenericPluginResolver.md)
- [GenericThemeResolver](../classes/backend.GenericThemeResolver.md)
- [InputTag](../classes/backend.InputTag.md)
- [JwtAuthGuard](../classes/backend.JwtAuthGuard.md)
- [Order](../classes/backend.Order.md)
- [OrderFilterInput](../classes/backend.OrderFilterInput.md)
- [OrderInput](../classes/backend.OrderInput.md)
- [OrderRepository](../classes/backend.OrderRepository.md)
- [PageStats](../classes/backend.PageStats.md)
- [PageStatsRepository](../classes/backend.PageStatsRepository.md)
- [PagedMeta](../classes/backend.PagedMeta.md)
- [PagedOrder](../classes/backend.PagedOrder.md)
- [PagedParamsInput](../classes/backend.PagedParamsInput.md)
- [PagedPost](../classes/backend.PagedPost.md)
- [PagedProduct](../classes/backend.PagedProduct.md)
- [PagedProductCategory](../classes/backend.PagedProductCategory.md)
- [PagedProductReview](../classes/backend.PagedProductReview.md)
- [PagedTag](../classes/backend.PagedTag.md)
- [PagedUser](../classes/backend.PagedUser.md)
- [PluginEntity](../classes/backend.PluginEntity.md)
- [PluginInput](../classes/backend.PluginInput.md)
- [PluginRepository](../classes/backend.PluginRepository.md)
- [Post](../classes/backend.Post.md)
- [PostComment](../classes/backend.PostComment.md)
- [PostFilterInput](../classes/backend.PostFilterInput.md)
- [PostRepository](../classes/backend.PostRepository.md)
- [Product](../classes/backend.Product.md)
- [ProductCategory](../classes/backend.ProductCategory.md)
- [ProductCategoryFilterInput](../classes/backend.ProductCategoryFilterInput.md)
- [ProductCategoryRepository](../classes/backend.ProductCategoryRepository.md)
- [ProductFilterAttributes](../classes/backend.ProductFilterAttributes.md)
- [ProductFilterInput](../classes/backend.ProductFilterInput.md)
- [ProductFilterMeta](../classes/backend.ProductFilterMeta.md)
- [ProductRating](../classes/backend.ProductRating.md)
- [ProductRepository](../classes/backend.ProductRepository.md)
- [ProductReview](../classes/backend.ProductReview.md)
- [ProductReviewFilter](../classes/backend.ProductReviewFilter.md)
- [ProductReviewInput](../classes/backend.ProductReviewInput.md)
- [ProductReviewRepository](../classes/backend.ProductReviewRepository.md)
- [Tag](../classes/backend.Tag.md)
- [TagRepository](../classes/backend.TagRepository.md)
- [ThemeEntity](../classes/backend.ThemeEntity.md)
- [UpdatePost](../classes/backend.UpdatePost.md)
- [UpdateProduct](../classes/backend.UpdateProduct.md)
- [UpdateProductCategory](../classes/backend.UpdateProductCategory.md)
- [UpdateUser](../classes/backend.UpdateUser.md)
- [User](../classes/backend.User.md)
- [UserFilterInput](../classes/backend.UserFilterInput.md)
- [UserRepository](../classes/backend.UserRepository.md)

### Type aliases

- [Action](#action)
- [ActionNames](#actionnames)
- [ActionTypes](#actiontypes)
- [TAllThemeConfigs](#tallthemeconfigs)
- [TAuthUserInfo](#tauthuserinfo)
- [TBackendModule](#tbackendmodule)
- [TGraphQLContext](#tgraphqlcontext)
- [TPluginInfo](#tplugininfo)
- [TRequestWithUser](#trequestwithuser)
- [TTokenInfo](#ttokeninfo)
- [TTokenPayload](#ttokenpayload)

### Variables

- [GenericCms](#genericcms)
- [GenericPlugin](#genericplugin)
- [GenericTheme](#generictheme)
- [ORMEntities](#ormentities)
- [adminPanelMessages](#adminpanelmessages)
- [buildDirName](#builddirname)
- [cmsConfigFileName](#cmsconfigfilename)
- [cmsName](#cmsname)
- [cmsPackageName](#cmspackagename)
- [configFileName](#configfilename)
- [defaultCmsConfig](#defaultcmsconfig)
- [pluginAdminBundlePath](#pluginadminbundlepath)
- [pluginAdminCjsPath](#pluginadmincjspath)
- [pluginFrontendBundlePath](#pluginfrontendbundlepath)
- [pluginFrontendCjsPath](#pluginfrontendcjspath)
- [rendererMessages](#renderermessages)
- [serverMessages](#servermessages)
- [tempDirName](#tempdirname)

### Functions

- [Roles](#roles)
- [applyGetManyFromOne](#applygetmanyfromone)
- [applyGetPaged](#applygetpaged)
- [checkEntitySlug](#checkentityslug)
- [createGenericEntity](#creategenericentity)
- [findPlugin](#findplugin)
- [findTheme](#findtheme)
- [fireAction](#fireaction)
- [getAdminPanelDir](#getadminpaneldir)
- [getAdminPanelServiceBuildDir](#getadminpanelservicebuilddir)
- [getAdminPanelStartupPath](#getadminpanelstartuppath)
- [getAdminPanelStaticDir](#getadminpanelstaticdir)
- [getAdminPanelTempDir](#getadminpaneltempdir)
- [getAdminPanelWebPublicDir](#getadminpanelwebpublicdir)
- [getAdminPanelWebServiceBuildDir](#getadminpanelwebservicebuilddir)
- [getBundledModulesDir](#getbundledmodulesdir)
- [getCMSConfigPath](#getcmsconfigpath)
- [getCmsEntity](#getcmsentity)
- [getCmsInfo](#getcmsinfo)
- [getCmsModuleConfig](#getcmsmoduleconfig)
- [getCmsModuleInfo](#getcmsmoduleinfo)
- [getCmsSettings](#getcmssettings)
- [getCoreBackendDir](#getcorebackenddir)
- [getCoreCommonDir](#getcorecommondir)
- [getCoreFrontendDir](#getcorefrontenddir)
- [getEmailTemplate](#getemailtemplate)
- [getErrorLogPath](#geterrorlogpath)
- [getLogger](#getlogger)
- [getLogsDir](#getlogsdir)
- [getManagerDir](#getmanagerdir)
- [getManagerTempDir](#getmanagertempdir)
- [getMetaInfoPath](#getmetainfopath)
- [getModulePackage](#getmodulepackage)
- [getModuleStaticDir](#getmodulestaticdir)
- [getNodeModuleDir](#getnodemoduledir)
- [getNodeModuleDirSync](#getnodemoduledirsync)
- [getPaged](#getpaged)
- [getPluginAdminBundlePath](#getpluginadminbundlepath)
- [getPluginAdminCjsPath](#getpluginadmincjspath)
- [getPluginBackendPath](#getpluginbackendpath)
- [getPluginFrontendBundlePath](#getpluginfrontendbundlepath)
- [getPluginFrontendCjsPath](#getpluginfrontendcjspath)
- [getPluginFrontendMetaPath](#getpluginfrontendmetapath)
- [getPluginSettings](#getpluginsettings)
- [getPublicDir](#getpublicdir)
- [getPublicPluginsDir](#getpublicpluginsdir)
- [getPublicThemesDir](#getpublicthemesdir)
- [getRendererBuildDir](#getrendererbuilddir)
- [getRendererDir](#getrendererdir)
- [getRendererStartupPath](#getrendererstartuppath)
- [getRendererTempDevDir](#getrenderertempdevdir)
- [getRendererTempDir](#getrenderertempdir)
- [getServerBuildDir](#getserverbuilddir)
- [getServerBuildMonitorPath](#getserverbuildmonitorpath)
- [getServerBuildPath](#getserverbuildpath)
- [getServerBuildProxyPath](#getserverbuildproxypath)
- [getServerDefaultEmailsDir](#getserverdefaultemailsdir)
- [getServerDir](#getserverdir)
- [getServerStartupPath](#getserverstartuppath)
- [getServerTempDir](#getservertempdir)
- [getServerTempEmailsDir](#getservertempemailsdir)
- [getSqlBoolStr](#getsqlboolstr)
- [getSqlLike](#getsqllike)
- [getTempDir](#gettempdir)
- [getThemeAdminPanelBundleDir](#getthemeadminpanelbundledir)
- [getThemeAdminPanelDir](#getthemeadminpaneldir)
- [getThemeBuildDir](#getthemebuilddir)
- [getThemeConfigs](#getthemeconfigs)
- [getThemeNextBuildDir](#getthemenextbuilddir)
- [getThemeNextBuildDirByPath](#getthemenextbuilddirbypath)
- [getThemePagesMetaPath](#getthemepagesmetapath)
- [getThemePagesVirtualPath](#getthemepagesvirtualpath)
- [getThemeRollupBuildDir](#getthemerollupbuilddir)
- [getThemeRollupBuildDirByPath](#getthemerollupbuilddirbypath)
- [getThemeTempAdminPanelDir](#getthemetempadminpaneldir)
- [getThemeTempRollupBuildDir](#getthemetemprollupbuilddir)
- [getUtilsBuildDir](#getutilsbuilddir)
- [getUtilsDir](#getutilsdir)
- [getUtilsImporterPath](#getutilsimporterpath)
- [getUtilsTempDir](#getutilstempdir)
- [graphQlAuthChecker](#graphqlauthchecker)
- [handleBaseInput](#handlebaseinput)
- [isExternalForm](#isexternalform)
- [readCMSConfig](#readcmsconfig)
- [readCMSConfigSync](#readcmsconfigsync)
- [readCmsModules](#readcmsmodules)
- [readPackage](#readpackage)
- [readPluginsExports](#readpluginsexports)
- [registerAction](#registeraction)
- [requestPage](#requestpage)
- [resolvePackageJsonPath](#resolvepackagejsonpath)
- [runShellCommand](#runshellcommand)
- [savePlugin](#saveplugin)
- [savePluginSettings](#savepluginsettings)
- [sendEmail](#sendemail)
- [validateEmail](#validateemail)
- [wrapInQuotes](#wrapinquotes)

## Type aliases

### Action

Ƭ **Action**<`PayloadType`, `OutputType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `PayloadType` |
| `OutputType` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `output` | `OutputType` |
| `payload` | `PayloadType` |

#### Defined in

[system/core/backend/src/helpers/types.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/types.ts#L23)

___

### ActionNames

Ƭ **ActionNames**: keyof [`ActionTypes`](#actiontypes)

#### Defined in

[system/core/backend/src/helpers/types.ts:81](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/types.ts#L81)

___

### ActionTypes

Ƭ **ActionTypes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create_attribute` | [`Action`](#action)<`TAttribute`\> |
| `create_order` | [`Action`](#action)<`TOrder`\> |
| `create_payment` | [`Action`](#action)<`TPaymentSession`, `Object`\> |
| `create_post` | [`Action`](#action)<`TPost`\> |
| `create_post_comment` | [`Action`](#action)<`TPostComment`\> |
| `create_product` | [`Action`](#action)<`TProduct`\> |
| `create_product_category` | [`Action`](#action)<`TProductCategory`\> |
| `create_product_review` | [`Action`](#action)<`TProductReview`\> |
| `create_tag` | [`Action`](#action)<`TTag`\> |
| `create_user` | [`Action`](#action)<`TUser`\> |
| `delete_attribute` | [`Action`](#action)<`Object`\> |
| `delete_order` | [`Action`](#action)<`Object`\> |
| `delete_post` | [`Action`](#action)<`Object`\> |
| `delete_post_comment` | [`Action`](#action)<`Object`\> |
| `delete_product` | [`Action`](#action)<`Object`\> |
| `delete_product_category` | [`Action`](#action)<`Object`\> |
| `delete_product_review` | [`Action`](#action)<`Object`\> |
| `delete_tag` | [`Action`](#action)<`Object`\> |
| `delete_user` | [`Action`](#action)<`Object`\> |
| `install_plugin` | [`Action`](#action)<`Object`\> |
| `install_theme` | [`Action`](#action)<`Object`\> |
| `uninstall_plugin` | [`Action`](#action)<`Object`\> |
| `uninstall_theme` | [`Action`](#action)<`Object`\> |
| `update_attribute` | [`Action`](#action)<`TAttribute`\> |
| `update_order` | [`Action`](#action)<`TOrder`\> |
| `update_plugin` | [`Action`](#action)<`Object`\> |
| `update_post` | [`Action`](#action)<`TPost`\> |
| `update_post_comment` | [`Action`](#action)<`TPostComment`\> |
| `update_product` | [`Action`](#action)<`TProduct`\> |
| `update_product_category` | [`Action`](#action)<`TProductCategory`\> |
| `update_product_review` | [`Action`](#action)<`TProductReview`\> |
| `update_settings` | [`Action`](#action)<`TCmsSettings`\> |
| `update_tag` | [`Action`](#action)<`TTag`\> |
| `update_theme` | [`Action`](#action)<`Object`\> |
| `update_user` | [`Action`](#action)<`TUser`\> |

#### Defined in

[system/core/backend/src/helpers/types.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/types.ts#L28)

___

### TAllThemeConfigs

Ƭ **TAllThemeConfigs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cmsSettings` | `TCmsSettings` \| `undefined` |
| `themeConfig` | `TThemeConfig` \| ``null`` |
| `themeInfo` | `TPackageCromwellConfig` \| ``null`` |
| `userConfig` | `TThemeConfig` \| ``null`` |

#### Defined in

[system/core/backend/src/helpers/theme-config.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/theme-config.ts#L18)

___

### TAuthUserInfo

Ƭ **TAuthUserInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `id` | `string` |
| `role` | `TUserRole` |

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L7)

___

### TBackendModule

Ƭ **TBackendModule**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `controllers?` | `unknown`[] |
| `entities?` | `unknown`[] |
| `migrations?` | `unknown`[] |
| `providers?` | `unknown`[] |
| `resolvers?` | `unknown`[] |

#### Defined in

[system/core/backend/src/helpers/types.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/types.ts#L15)

___

### TGraphQLContext

Ƭ **TGraphQLContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `user?` | [`TAuthUserInfo`](#tauthuserinfo) |

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:30](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L30)

___

### TPluginInfo

Ƭ **TPluginInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `adminPanelPath?` | `string` |
| `backendPath?` | `string` |
| `frontendPath?` | `string` |
| `pluginDir` | `string` |
| `pluginName` | `string` |

#### Defined in

[system/core/backend/src/helpers/plugin-exports.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/plugin-exports.ts#L15)

___

### TRequestWithUser

Ƭ **TRequestWithUser**: `FastifyRequest` & { `cookies`: `any` ; `user`: [`TAuthUserInfo`](#tauthuserinfo)  }

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L19)

___

### TTokenInfo

Ƭ **TTokenInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cookie` | `string` |
| `maxAge` | `string` |
| `token` | `string` |

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L24)

___

### TTokenPayload

Ƭ **TTokenPayload**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `role` | `TUserRole` |
| `sub` | `string` |
| `username` | `string` |

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L13)

## Variables

### GenericCms

• `Const` **GenericCms**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abstractResolver` | `any` |
| `createArgs` | `any` |
| `pagedEntity` | `any` |
| `repository` | `ObjectType`<[`BaseRepository`](../classes/backend.BaseRepository.md)<[`CmsEntity`](../classes/backend.CmsEntity.md), [`CmsEntity`](../classes/backend.CmsEntity.md)\>\> |
| `updateArgs` | `any` |

#### Defined in

[system/core/backend/src/helpers/generic-entities.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/generic-entities.ts#L12)

___

### GenericPlugin

• `Const` **GenericPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abstractResolver` | `any` |
| `createArgs` | `any` |
| `pagedEntity` | `any` |
| `repository` | `ObjectType`<[`BaseRepository`](../classes/backend.BaseRepository.md)<[`PluginEntity`](../classes/backend.PluginEntity.md), `TPluginEntityInput`\>\> |
| `updateArgs` | `any` |

#### Defined in

[system/core/backend/src/helpers/generic-entities.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/generic-entities.ts#L11)

___

### GenericTheme

• `Const` **GenericTheme**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abstractResolver` | `any` |
| `createArgs` | `any` |
| `pagedEntity` | `any` |
| `repository` | `ObjectType`<[`BaseRepository`](../classes/backend.BaseRepository.md)<[`ThemeEntity`](../classes/backend.ThemeEntity.md), `TThemeEntityInput`\>\> |
| `updateArgs` | `any` |

#### Defined in

[system/core/backend/src/helpers/generic-entities.ts:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/generic-entities.ts#L10)

___

### ORMEntities

• `Const` **ORMEntities**: (typeof [`ThemeEntity`](../classes/backend.ThemeEntity.md) \| typeof [`Product`](../classes/backend.Product.md) \| typeof [`ProductCategory`](../classes/backend.ProductCategory.md) \| typeof [`Post`](../classes/backend.Post.md) \| typeof [`User`](../classes/backend.User.md) \| typeof [`Attribute`](../classes/backend.Attribute.md) \| typeof [`ProductReview`](../classes/backend.ProductReview.md) \| typeof [`Order`](../classes/backend.Order.md) \| typeof [`CmsEntity`](../classes/backend.CmsEntity.md) \| typeof [`Tag`](../classes/backend.Tag.md) \| typeof [`PageStats`](../classes/backend.PageStats.md) \| typeof [`PostComment`](../classes/backend.PostComment.md))[]

#### Defined in

[system/core/backend/src/helpers/constants.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/constants.ts#L18)

___

### adminPanelMessages

• `Const` **adminPanelMessages**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onBuildEndMessage` | `string` |
| `onBuildErrorMessage` | `string` |
| `onBuildStartMessage` | `string` |
| `onStartErrorMessage` | `string` |
| `onStartMessage` | `string` |

#### Defined in

[system/core/backend/src/helpers/constants.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/constants.ts#L33)

___

### buildDirName

• `Const` **buildDirName**: ``"build"``

#### Defined in

[system/core/backend/src/helpers/paths.ts:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L10)

___

### cmsConfigFileName

• `Const` **cmsConfigFileName**: ``"cmsconfig.json"``

#### Defined in

[system/core/backend/src/helpers/paths.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L12)

___

### cmsName

• `Const` **cmsName**: ``"cromwell"``

#### Defined in

[system/core/backend/src/helpers/paths.ts:8](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L8)

___

### cmsPackageName

• `Const` **cmsPackageName**: ``"@cromwell/cms"``

#### Defined in

[system/core/backend/src/helpers/constants.ts:100](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/constants.ts#L100)

___

### configFileName

• `Const` **configFileName**: `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L11)

___

### defaultCmsConfig

• `Const` **defaultCmsConfig**: `TCmsConfig`

#### Defined in

[system/core/backend/src/helpers/constants.ts:49](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/constants.ts#L49)

___

### pluginAdminBundlePath

• `Const` **pluginAdminBundlePath**: ``"admin/index.js"``

#### Defined in

[system/core/backend/src/helpers/paths.ts:213](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L213)

___

### pluginAdminCjsPath

• `Const` **pluginAdminCjsPath**: ``"admin/cjs.js"``

#### Defined in

[system/core/backend/src/helpers/paths.ts:214](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L214)

___

### pluginFrontendBundlePath

• `Const` **pluginFrontendBundlePath**: ``"frontend/index.js"``

#### Defined in

[system/core/backend/src/helpers/paths.ts:211](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L211)

___

### pluginFrontendCjsPath

• `Const` **pluginFrontendCjsPath**: ``"frontend/cjs.js"``

#### Defined in

[system/core/backend/src/helpers/paths.ts:212](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L212)

___

### rendererMessages

• `Const` **rendererMessages**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onBuildEndMessage` | `string` |
| `onBuildErrorMessage` | `string` |
| `onBuildStartMessage` | `string` |
| `onStartErrorMessage` | `string` |
| `onStartMessage` | `string` |

#### Defined in

[system/core/backend/src/helpers/constants.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/constants.ts#L25)

___

### serverMessages

• `Const` **serverMessages**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onBuildEndMessage` | `string` |
| `onBuildErrorMessage` | `string` |
| `onBuildStartMessage` | `string` |
| `onStartErrorMessage` | `string` |
| `onStartMessage` | `string` |

#### Defined in

[system/core/backend/src/helpers/constants.ts:41](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/constants.ts#L41)

___

### tempDirName

• `Const` **tempDirName**: `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L9)

## Functions

### Roles

▸ `Const` **Roles**(...`roles`): `CustomDecorator`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...roles` | `TAuthRole`[] |

#### Returns

`CustomDecorator`<`string`\>

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L34)

___

### applyGetManyFromOne

▸ `Const` **applyGetManyFromOne**<`T`\>(`qb`, `firstEntityName`, `firstEntityProp`, `secondEntityName`, `secondEntityId`): `SelectQueryBuilder`<`T`\>

Retrieve all related entities of one specified entity by id in many-to-many relationship
E.g. get all products from a category

**`prop`** firstEntityName - table DB name of many

**`prop`** firstEntityProp - property of many that refers to relationship

**`prop`** secondEntityName - table DB name of one

**`prop`** secondEntityId - DB id of one

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`T`\> |
| `firstEntityName` | `string` |
| `firstEntityProp` | keyof `T` |
| `secondEntityName` | `string` |
| `secondEntityId` | `string` |

#### Returns

`SelectQueryBuilder`<`T`\>

#### Defined in

[system/core/backend/src/helpers/base-queries.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/base-queries.ts#L34)

___

### applyGetPaged

▸ `Const` **applyGetPaged**<`T`\>(`qb`, `sortByTableName?`, `params?`): `SelectQueryBuilder`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`T`\> |
| `sortByTableName?` | `string` |
| `params?` | `TPagedParams`<`T`\> |

#### Returns

`SelectQueryBuilder`<`T`\>

#### Defined in

[system/core/backend/src/helpers/base-queries.ts:8](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/base-queries.ts#L8)

___

### checkEntitySlug

▸ `Const` **checkEntitySlug**<`T`\>(`entity`, `EntityClass`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`BasePageEntity`](../classes/backend.BasePageEntity.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `T` |
| `EntityClass` | (...`args`: `any`[]) => `T` |

#### Returns

`Promise`<`T`\>

#### Defined in

[system/core/backend/src/helpers/base-queries.ts:69](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/base-queries.ts#L69)

___

### createGenericEntity

▸ `Const` **createGenericEntity**<`EntityType`, `EntityInputType`\>(`entityName`, `EntityClass`, `InputEntityClass?`): `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `EntityType` | `EntityType` |
| `EntityInputType` | `EntityType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entityName` | `string` |
| `EntityClass` | (...`args`: `any`[]) => `EntityType` |
| `InputEntityClass?` | (...`args`: `any`[]) => `EntityInputType` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `abstractResolver` | `any` |
| `createArgs` | `any` |
| `pagedEntity` | `any` |
| `repository` | `ObjectType`<[`BaseRepository`](../classes/backend.BaseRepository.md)<`EntityType`, `EntityInputType`\>\> |
| `updateArgs` | `any` |

#### Defined in

[system/core/backend/src/helpers/create-generic-entity.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/create-generic-entity.ts#L9)

___

### findPlugin

▸ `Const` **findPlugin**(`pluginName`): `Promise`<`undefined` \| `TPluginEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName` | `string` |

#### Returns

`Promise`<`undefined` \| `TPluginEntity`\>

#### Defined in

[system/core/backend/src/helpers/plugin-settings.ts:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/plugin-settings.ts#L7)

___

### findTheme

▸ `Const` **findTheme**(`themeName`): `Promise`<`undefined` \| `TThemeEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeName` | `string` |

#### Returns

`Promise`<`undefined` \| `TThemeEntity`\>

#### Defined in

[system/core/backend/src/helpers/theme-config.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/theme-config.ts#L9)

___

### fireAction

▸ `Const` **fireAction**<`T`, `TPayload`, `TOutput`\>(`options`): `Promise`<`Record`<`string`, `TOutput`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`ActionTypes`](#actiontypes) |
| `TPayload` | [`ActionTypes`](#actiontypes)[`T`][``"payload"``] |
| `TOutput` | [`ActionTypes`](#actiontypes)[`T`][``"output"``] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.actionName` | `string` \| `T` |
| `options.payload?` | `TPayload` |

#### Returns

`Promise`<`Record`<`string`, `TOutput`\>\>

#### Defined in

[system/core/backend/src/helpers/actions.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/actions.ts#L27)

___

### getAdminPanelDir

▸ `Const` **getAdminPanelDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:73](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L73)

___

### getAdminPanelServiceBuildDir

▸ `Const` **getAdminPanelServiceBuildDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:74](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L74)

___

### getAdminPanelStartupPath

▸ `Const` **getAdminPanelStartupPath**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L86)

___

### getAdminPanelStaticDir

▸ `Const` **getAdminPanelStaticDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:90](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L90)

___

### getAdminPanelTempDir

▸ `Const` **getAdminPanelTempDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:78](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L78)

___

### getAdminPanelWebPublicDir

▸ `Const` **getAdminPanelWebPublicDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:83](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L83)

___

### getAdminPanelWebServiceBuildDir

▸ `Const` **getAdminPanelWebServiceBuildDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:80](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L80)

___

### getBundledModulesDir

▸ `Const` **getBundledModulesDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:224](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L224)

___

### getCMSConfigPath

▸ `Const` **getCMSConfigPath**(`dir?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir?` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:44](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L44)

___

### getCmsEntity

▸ `Const` **getCmsEntity**(): `Promise`<[`CmsEntity`](../classes/backend.CmsEntity.md)\>

#### Returns

`Promise`<[`CmsEntity`](../classes/backend.CmsEntity.md)\>

#### Defined in

[system/core/backend/src/helpers/cms-settings.ts:57](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/cms-settings.ts#L57)

___

### getCmsInfo

▸ `Const` **getCmsInfo**(): `Promise`<`TCmsInfo`\>

#### Returns

`Promise`<`TCmsInfo`\>

#### Defined in

[system/core/backend/src/helpers/cms-settings.ts:104](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/cms-settings.ts#L104)

___

### getCmsModuleConfig

▸ `Const` **getCmsModuleConfig**(`moduleName?`): `Promise`<`undefined` \| `TModuleConfig`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName?` | `string` |

#### Returns

`Promise`<`undefined` \| `TModuleConfig`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:183](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L183)

___

### getCmsModuleInfo

▸ `Const` **getCmsModuleInfo**(`moduleName?`): `Promise`<`undefined` \| `TPackageCromwellConfig`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName?` | `string` |

#### Returns

`Promise`<`undefined` \| `TPackageCromwellConfig`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:193](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L193)

___

### getCmsSettings

▸ `Const` **getCmsSettings**(): `Promise`<`undefined` \| `TCmsSettings`\>

#### Returns

`Promise`<`undefined` \| `TCmsSettings`\>

#### Defined in

[system/core/backend/src/helpers/cms-settings.ts:72](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/cms-settings.ts#L72)

___

### getCoreBackendDir

▸ `Const` **getCoreBackendDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L48)

___

### getCoreCommonDir

▸ `Const` **getCoreCommonDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:46](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L46)

___

### getCoreFrontendDir

▸ `Const` **getCoreFrontendDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:47](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L47)

___

### getEmailTemplate

▸ `Const` **getEmailTemplate**(`fileName`, `props?`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileName` | `string` |
| `props?` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[system/core/backend/src/helpers/emailing.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/emailing.ts#L14)

___

### getErrorLogPath

▸ `Const` **getErrorLogPath**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:50](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L50)

___

### getLogger

▸ `Const` **getLogger**(`writeToFile?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `writeToFile` | `boolean` | `true` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `error` | (...`args`: `any`[]) => `void` |
| `info` | (...`args`: `any`[]) => `void` |
| `log` | (...`args`: `any`[]) => `void` |
| `warn` | (...`args`: `any`[]) => `void` |

#### Defined in

[system/core/backend/src/helpers/logger.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/logger.ts#L17)

___

### getLogsDir

▸ `Const` **getLogsDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:49](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L49)

___

### getManagerDir

▸ `Const` **getManagerDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:53](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L53)

___

### getManagerTempDir

▸ `Const` **getManagerTempDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:54](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L54)

___

### getMetaInfoPath

▸ `Const` **getMetaInfoPath**(`filename`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:209](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L209)

___

### getModulePackage

▸ `Const` **getModulePackage**(`moduleName?`): `Promise`<`undefined` \| `TPackageJson`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName?` | `string` |

#### Returns

`Promise`<`undefined` \| `TPackageJson`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:235](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L235)

___

### getModuleStaticDir

▸ `Const` **getModuleStaticDir**(`moduleName`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:202](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L202)

___

### getNodeModuleDir

▸ `Const` **getNodeModuleDir**(`moduleName`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L31)

___

### getNodeModuleDirSync

▸ `Const` **getNodeModuleDirSync**(`moduleName`): `undefined` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L22)

___

### getPaged

▸ `Const` **getPaged**<`T`\>(`qb`, `sortByTableName?`, `params?`): `Promise`<`TPagedList`<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `qb` | `SelectQueryBuilder`<`T`\> |
| `sortByTableName?` | `string` |
| `params?` | `TPagedParams`<`T`\> |

#### Returns

`Promise`<`TPagedList`<`T`\>\>

#### Defined in

[system/core/backend/src/helpers/base-queries.ts:41](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/base-queries.ts#L41)

___

### getPluginAdminBundlePath

▸ `Const` **getPluginAdminBundlePath**(`distDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `distDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:218](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L218)

___

### getPluginAdminCjsPath

▸ `Const` **getPluginAdminCjsPath**(`distDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `distDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:219](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L219)

___

### getPluginBackendPath

▸ `Const` **getPluginBackendPath**(`distDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `distDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:220](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L220)

___

### getPluginFrontendBundlePath

▸ `Const` **getPluginFrontendBundlePath**(`distDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `distDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:215](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L215)

___

### getPluginFrontendCjsPath

▸ `Const` **getPluginFrontendCjsPath**(`distDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `distDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:216](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L216)

___

### getPluginFrontendMetaPath

▸ `Const` **getPluginFrontendMetaPath**(`distDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `distDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:217](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L217)

___

### getPluginSettings

▸ `Const` **getPluginSettings**(`pluginName`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[system/core/backend/src/helpers/plugin-settings.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/plugin-settings.ts#L25)

___

### getPublicDir

▸ `Const` **getPublicDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:226](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L226)

___

### getPublicPluginsDir

▸ `Const` **getPublicPluginsDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:227](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L227)

___

### getPublicThemesDir

▸ `Const` **getPublicThemesDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:228](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L228)

___

### getRendererBuildDir

▸ `Const` **getRendererBuildDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:65](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L65)

___

### getRendererDir

▸ `Const` **getRendererDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:58](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L58)

___

### getRendererStartupPath

▸ `Const` **getRendererStartupPath**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:59](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L59)

___

### getRendererTempDevDir

▸ `Const` **getRendererTempDevDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:64](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L64)

___

### getRendererTempDir

▸ `Const` **getRendererTempDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:63](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L63)

___

### getServerBuildDir

▸ `Const` **getServerBuildDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:101](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L101)

___

### getServerBuildMonitorPath

▸ `Const` **getServerBuildMonitorPath**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:113](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L113)

___

### getServerBuildPath

▸ `Const` **getServerBuildPath**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:105](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L105)

___

### getServerBuildProxyPath

▸ `Const` **getServerBuildProxyPath**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:109](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L109)

___

### getServerDefaultEmailsDir

▸ `Const` **getServerDefaultEmailsDir**(): `void`

#### Returns

`void`

#### Defined in

[system/core/backend/src/helpers/paths.ts:119](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L119)

___

### getServerDir

▸ `Const` **getServerDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:96](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L96)

___

### getServerStartupPath

▸ `Const` **getServerStartupPath**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:97](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L97)

___

### getServerTempDir

▸ `Const` **getServerTempDir**(`dir?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir?` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:117](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L117)

___

### getServerTempEmailsDir

▸ `Const` **getServerTempEmailsDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:118](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L118)

___

### getSqlBoolStr

▸ `Const` **getSqlBoolStr**(`dbType`, `b`): ``"true"`` \| ``"false"`` \| ``"1"`` \| ``"0"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbType` | ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"`` \| ``"capacitor"`` |
| `b` | `boolean` |

#### Returns

``"true"`` \| ``"false"`` \| ``"1"`` \| ``"0"``

#### Defined in

[system/core/backend/src/helpers/base-queries.ts:104](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/base-queries.ts#L104)

___

### getSqlLike

▸ `Const` **getSqlLike**(`dbType`): ``"ILIKE"`` \| ``"LIKE"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbType` | ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"`` \| ``"capacitor"`` |

#### Returns

``"ILIKE"`` \| ``"LIKE"``

#### Defined in

[system/core/backend/src/helpers/base-queries.ts:111](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/base-queries.ts#L111)

___

### getTempDir

▸ `Const` **getTempDir**(`dir?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir?` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L14)

___

### getThemeAdminPanelBundleDir

▸ `Const` **getThemeAdminPanelBundleDir**(`themeModuleName`, `pageRoute`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeModuleName` | `string` |
| `pageRoute` | `string` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:176](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L176)

___

### getThemeAdminPanelDir

▸ `Const` **getThemeAdminPanelDir**(`themeModuleName`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeModuleName` | `string` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:170](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L170)

___

### getThemeBuildDir

▸ `Const` **getThemeBuildDir**(`themeModuleName`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeModuleName` | `string` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:138](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L138)

___

### getThemeConfigs

▸ `Const` **getThemeConfigs**(): `Promise`<[`TAllThemeConfigs`](#tallthemeconfigs)\>

Get currently active Theme's configs from DB

#### Returns

`Promise`<[`TAllThemeConfigs`](#tallthemeconfigs)\>

#### Defined in

[system/core/backend/src/helpers/theme-config.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/theme-config.ts#L28)

___

### getThemeNextBuildDir

▸ `Const` **getThemeNextBuildDir**(`themeModuleName`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeModuleName` | `string` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:157](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L157)

___

### getThemeNextBuildDirByPath

▸ `Const` **getThemeNextBuildDirByPath**(`themeDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:163](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L163)

___

### getThemePagesMetaPath

▸ `Const` **getThemePagesMetaPath**(`distDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `distDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:221](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L221)

___

### getThemePagesVirtualPath

▸ `Const` **getThemePagesVirtualPath**(`distDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `distDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:222](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L222)

___

### getThemeRollupBuildDir

▸ `Const` **getThemeRollupBuildDir**(`themeModuleName`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeModuleName` | `string` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:147](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L147)

___

### getThemeRollupBuildDirByPath

▸ `Const` **getThemeRollupBuildDirByPath**(`themeDir`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeDir` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:153](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L153)

___

### getThemeTempAdminPanelDir

▸ `Const` **getThemeTempAdminPanelDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:166](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L166)

___

### getThemeTempRollupBuildDir

▸ `Const` **getThemeTempRollupBuildDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:144](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L144)

___

### getUtilsBuildDir

▸ `Const` **getUtilsBuildDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:131](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L131)

___

### getUtilsDir

▸ `Const` **getUtilsDir**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:126](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L126)

___

### getUtilsImporterPath

▸ `Const` **getUtilsImporterPath**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:127](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L127)

___

### getUtilsTempDir

▸ `Const` **getUtilsTempDir**(): `string`

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:135](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L135)

___

### graphQlAuthChecker

▸ `Const` **graphQlAuthChecker**(`options?`, `roles?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | ``null`` \| { `args?`: `Record`<`string`, `any`\> ; `context?`: [`TGraphQLContext`](#tgraphqlcontext) ; `info?`: `any` ; `root?`: `any`  } |
| `roles?` | ``null`` \| `TAuthRole`[] |

#### Returns

`boolean`

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:51](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L51)

___

### handleBaseInput

▸ `Const` **handleBaseInput**(`entity`, `input`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `TBasePageEntity` |
| `input` | `TBasePageEntityInput` |

#### Returns

`void`

#### Defined in

[system/core/backend/src/helpers/base-queries.ts:59](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/base-queries.ts#L59)

___

### isExternalForm

▸ `Const` **isExternalForm**(`id`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`boolean`

#### Defined in

[system/core/backend/src/helpers/paths.ts:223](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L223)

___

### readCMSConfig

▸ `Const` **readCMSConfig**(`path?`): `Promise`<`TCmsConfig`\>

Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns

#### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | `string` |

#### Returns

`Promise`<`TCmsConfig`\>

#### Defined in

[system/core/backend/src/helpers/cms-settings.ts:39](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/cms-settings.ts#L39)

___

### readCMSConfigSync

▸ `Const` **readCMSConfigSync**(`path?`): `TCmsConfig`

Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns

#### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | `string` |

#### Returns

`TCmsConfig`

#### Defined in

[system/core/backend/src/helpers/cms-settings.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/cms-settings.ts#L21)

___

### readCmsModules

▸ `Const` **readCmsModules**(): `Promise`<`Object`\>

#### Returns

`Promise`<`Object`\>

#### Defined in

[system/core/backend/src/helpers/cms-modules.ts:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/cms-modules.ts#L7)

___

### readPackage

▸ `Const` **readPackage**(`path`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[system/core/backend/src/helpers/paths.ts:230](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L230)

___

### readPluginsExports

▸ `Const` **readPluginsExports**(): `Promise`<[`TPluginInfo`](#tplugininfo)[]\>

#### Returns

`Promise`<[`TPluginInfo`](#tplugininfo)[]\>

#### Defined in

[system/core/backend/src/helpers/plugin-exports.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/plugin-exports.ts#L23)

___

### registerAction

▸ `Const` **registerAction**<`T`, `TPayload`, `TOutput`\>(`options`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`ActionTypes`](#actiontypes)keyof [`ActionTypes`](#actiontypes) |
| `TPayload` | [`ActionTypes`](#actiontypes)[`T`][``"payload"``] |
| `TOutput` | [`ActionTypes`](#actiontypes)[`T`][``"output"``] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.actionName` | `T` |
| `options.pluginName` | `string` |
| `options.action` | (`payload`: `TPayload`) => `Promise`<`TOutput`\> |

#### Returns

`void`

#### Defined in

[system/core/backend/src/helpers/actions.ts:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/actions.ts#L7)

___

### requestPage

▸ `Const` **requestPage**(`pageName`, `routeOptions?`): `Promise`<`void`\>

Request frontend page by page name and slug. Used to revalidate Next.js static pages
after data update.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `TDefaultPageName` |
| `routeOptions?` | `Object` |
| `routeOptions.id?` | `string` |
| `routeOptions.slug?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/helpers/request-page.ts:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/request-page.ts#L13)

___

### resolvePackageJsonPath

▸ `Const` **resolvePackageJsonPath**(`moduleName`): `undefined` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/backend/src/helpers/paths.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/paths.ts#L16)

___

### runShellCommand

▸ `Const` **runShellCommand**(`command`, `cwd?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `string` |
| `cwd?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/backend/src/helpers/shell.ts:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/shell.ts#L7)

___

### savePlugin

▸ `Const` **savePlugin**(`plugin`): `Promise`<`TPluginEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | `TPluginEntity` |

#### Returns

`Promise`<`TPluginEntity`\>

#### Defined in

[system/core/backend/src/helpers/plugin-settings.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/plugin-settings.ts#L20)

___

### savePluginSettings

▸ `Const` **savePluginSettings**(`pluginName`, `input`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName` | `string` |
| `input` | `any` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/helpers/plugin-settings.ts:49](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/plugin-settings.ts#L49)

___

### sendEmail

▸ `Const` **sendEmail**(`addresses`, `subject`, `htmlContent`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `string`[] |
| `subject` | `string` |
| `htmlContent` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[system/core/backend/src/helpers/emailing.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/emailing.ts#L34)

___

### validateEmail

▸ `Const` **validateEmail**(`email`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `any` |

#### Returns

`boolean`

#### Defined in

[system/core/backend/src/helpers/validation.ts:1](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/validation.ts#L1)

___

### wrapInQuotes

▸ `Const` **wrapInQuotes**(`dbType`, `str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbType` | ``"mysql"`` \| ``"mariadb"`` \| ``"postgres"`` \| ``"cockroachdb"`` \| ``"sqlite"`` \| ``"mssql"`` \| ``"sap"`` \| ``"oracle"`` \| ``"cordova"`` \| ``"nativescript"`` \| ``"react-native"`` \| ``"sqljs"`` \| ``"mongodb"`` \| ``"aurora-data-api"`` \| ``"aurora-data-api-pg"`` \| ``"expo"`` \| ``"better-sqlite3"`` \| ``"capacitor"`` |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[system/core/backend/src/helpers/base-queries.ts:116](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/base-queries.ts#L116)
