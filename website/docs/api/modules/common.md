[@cromwell/root](../README.md) / [Exports](../modules.md) / common

# Module: common

CromwellCMS Shared SDK

Exports common type definitions and helpers used by frontend and backend.

### Install
```
npm i @cromwell/core
```

### Use
Example of usage
```ts
import { getStoreItem, TCmsSettings } from '@cromwell/core';

const settings: TCmsSettings | undefined = getStoreItem('cmsSettings');
```

## Table of contents

### Enumerations

- [ECommonComponentNames](../enums/common.ECommonComponentNames.md)

### Type aliases

- [CrwDocumentContextType](#crwdocumentcontexttype)
- [GraphQLPathsType](#graphqlpathstype)
- [StaticPageContext](#staticpagecontext)
- [TAdditionalExports](#tadditionalexports)
- [TAttribute](#tattribute)
- [TAttributeInput](#tattributeinput)
- [TAttributeInstance](#tattributeinstance)
- [TAttributeInstanceValue](#tattributeinstancevalue)
- [TAttributeProductVariant](#tattributeproductvariant)
- [TAttributeValue](#tattributevalue)
- [TAuthRole](#tauthrole)
- [TBaseModuleConfig](#tbasemoduleconfig)
- [TBasePageEntity](#tbasepageentity)
- [TBasePageEntityInput](#tbasepageentityinput)
- [TBlockContentProvider](#tblockcontentprovider)
- [TCCSModuleInfo](#tccsmoduleinfo)
- [TCCSModuleShortInfo](#tccsmoduleshortinfo)
- [TCCSVersion](#tccsversion)
- [TCMSTheme](#tcmstheme)
- [TCmsAdminSettings](#tcmsadminsettings)
- [TCmsConfig](#tcmsconfig)
- [TCmsEntity](#tcmsentity)
- [TCmsEntityCore](#tcmsentitycore)
- [TCmsInfo](#tcmsinfo)
- [TCmsInternalSettings](#tcmsinternalsettings)
- [TCmsPublicSettings](#tcmspublicsettings)
- [TCmsRedirect](#tcmsredirect)
- [TCmsRedirectFunction](#tcmsredirectfunction)
- [TCmsRedirectObject](#tcmsredirectobject)
- [TCmsSettings](#tcmssettings)
- [TCmsStats](#tcmsstats)
- [TCmsStatus](#tcmsstatus)
- [TCommonComponentProps](#tcommoncomponentprops)
- [TContentComponentProps](#tcontentcomponentprops)
- [TCreateUser](#tcreateuser)
- [TCromwellBlock](#tcromwellblock)
- [TCromwellBlockData](#tcromwellblockdata)
- [TCromwellBlockProps](#tcromwellblockprops)
- [TCromwellBlockType](#tcromwellblocktype)
- [TCromwellNodeModules](#tcromwellnodemodules)
- [TCromwellNotify](#tcromwellnotify)
- [TCromwellPage](#tcromwellpage)
- [TCromwellPageCoreProps](#tcromwellpagecoreprops)
- [TCromwellStore](#tcromwellstore)
- [TCromwellaConfig](#tcromwellaconfig)
- [TCurrency](#tcurrency)
- [TDBAuxiliaryColumns](#tdbauxiliarycolumns)
- [TDBEntity](#tdbentity)
- [TDBInfo](#tdbinfo)
- [TDataComponentProps](#tdatacomponentprops)
- [TDefaultPageName](#tdefaultpagename)
- [TDeleteManyInput](#tdeletemanyinput)
- [TExternal](#texternal)
- [TFilteredProductList](#tfilteredproductlist)
- [TFrontendBundle](#tfrontendbundle)
- [TFrontendDependency](#tfrontenddependency)
- [TFrontendPluginProps](#tfrontendpluginprops)
- [TGallerySettings](#tgallerysettings)
- [TGetStaticProps](#tgetstaticprops)
- [TGraphQLNode](#tgraphqlnode)
- [TImageSettings](#timagesettings)
- [TModuleConfig](#tmoduleconfig)
- [TNotification](#tnotification)
- [TOrder](#torder)
- [TOrderCore](#tordercore)
- [TOrderFilter](#torderfilter)
- [TOrderInput](#torderinput)
- [TPackageCromwellConfig](#tpackagecromwellconfig)
- [TPackageJson](#tpackagejson)
- [TPageConfig](#tpageconfig)
- [TPageInfo](#tpageinfo)
- [TPageStats](#tpagestats)
- [TPagedList](#tpagedlist)
- [TPagedMeta](#tpagedmeta)
- [TPagedParams](#tpagedparams)
- [TPagesMetaInfo](#tpagesmetainfo)
- [TPalette](#tpalette)
- [TPaymentSession](#tpaymentsession)
- [TPluginConfig](#tpluginconfig)
- [TPluginEntity](#tpluginentity)
- [TPluginEntityCore](#tpluginentitycore)
- [TPluginEntityInput](#tpluginentityinput)
- [TPluginInfo](#tplugininfo)
- [TPluginSettingsProps](#tpluginsettingsprops)
- [TPost](#tpost)
- [TPostComment](#tpostcomment)
- [TPostCommentCore](#tpostcommentcore)
- [TPostCommentInput](#tpostcommentinput)
- [TPostFilter](#tpostfilter)
- [TPostInput](#tpostinput)
- [TProduct](#tproduct)
- [TProductCategory](#tproductcategory)
- [TProductCategoryCore](#tproductcategorycore)
- [TProductCategoryFilter](#tproductcategoryfilter)
- [TProductCategoryInput](#tproductcategoryinput)
- [TProductFilter](#tproductfilter)
- [TProductFilterAttribute](#tproductfilterattribute)
- [TProductFilterMeta](#tproductfiltermeta)
- [TProductInput](#tproductinput)
- [TProductRating](#tproductrating)
- [TProductReview](#tproductreview)
- [TProductReviewCore](#tproductreviewcore)
- [TProductReviewFilter](#tproductreviewfilter)
- [TProductReviewInput](#tproductreviewinput)
- [TRollupConfig](#trollupconfig)
- [TSalePerDay](#tsaleperday)
- [TScriptMetaInfo](#tscriptmetainfo)
- [TServiceVersions](#tserviceversions)
- [TStoreListItem](#tstorelistitem)
- [TTag](#ttag)
- [TTagInput](#ttaginput)
- [TThemeConfig](#tthemeconfig)
- [TThemeEntity](#tthemeentity)
- [TThemeEntityCore](#tthemeentitycore)
- [TThemeEntityInput](#tthemeentityinput)
- [TUpdateInfo](#tupdateinfo)
- [TUpdateUser](#tupdateuser)
- [TUser](#tuser)
- [TUserFilter](#tuserfilter)
- [TUserRole](#tuserrole)

### Variables

- [GraphQLPaths](#graphqlpaths)
- [bundledModulesDirName](#bundledmodulesdirname)
- [genericPageName](#genericpagename)
- [moduleArchiveFileName](#modulearchivefilename)
- [moduleBundleInfoFileName](#modulebundleinfofilename)
- [moduleChunksBuildDirChunk](#modulechunksbuilddirchunk)
- [moduleExportsDirChunk](#moduleexportsdirchunk)
- [moduleGeneratedFileName](#modulegeneratedfilename)
- [moduleLibBuildFileName](#modulelibbuildfilename)
- [moduleMainBuildFileName](#modulemainbuildfilename)
- [moduleMetaInfoFileName](#modulemetainfofilename)
- [moduleNodeBuildFileName](#modulenodebuildfilename)
- [moduleNodeGeneratedFileName](#modulenodegeneratedfilename)
- [moduleOneChunkGeneratedFileName](#moduleonechunkgeneratedfilename)
- [serviceLocator](#servicelocator)
- [systemPackages](#systempackages)

### Functions

- [findRedirect](#findredirect)
- [getBlockInstance](#getblockinstance)
- [getCmsSettings](#getcmssettings)
- [getCommonComponent](#getcommoncomponent)
- [getPageCustomConfig](#getpagecustomconfig)
- [getRandStr](#getrandstr)
- [getStore](#getstore)
- [getStoreItem](#getstoreitem)
- [getThemeCustomConfig](#getthemecustomconfig)
- [getThemeCustomConfigProp](#getthemecustomconfigprop)
- [isServer](#isserver)
- [onStoreChange](#onstorechange)
- [registerRedirect](#registerredirect)
- [registerRewrite](#registerrewrite)
- [removeOnStoreChange](#removeonstorechange)
- [resolvePageRoute](#resolvepageroute)
- [saveCommonComponent](#savecommoncomponent)
- [setStoreItem](#setstoreitem)
- [sleep](#sleep)

## Type aliases

### CrwDocumentContextType

Ƭ **CrwDocumentContextType**: `Partial`<`DocumentContext`\> & { `fullUrl?`: `string` ; `origin?`: `string`  }

#### Defined in

[system/core/common/src/types/blocks.ts:40](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L40)

___

### GraphQLPathsType

Ƭ **GraphQLPathsType**: { [K in TDBEntity]: TGraphQLNode}

#### Defined in

[system/core/common/src/types/data.ts:131](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L131)

___

### StaticPageContext

Ƭ **StaticPageContext**<`TPluginSettings`, `Q`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TPluginSettings` | `any` |
| `Q` | extends `ParsedUrlQuery``ParsedUrlQuery` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `params?` | `Q` |
| `pluginSettings?` | `TPluginSettings` |
| `preview?` | `boolean` |
| `previewData?` | `any` |

#### Defined in

[system/core/common/src/types/blocks.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L9)

___

### TAdditionalExports

Ƭ **TAdditionalExports**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `importType?` | ``"default"`` \| ``"named"`` |
| `name` | `string` |
| `path?` | `string` |
| `saveAsModules?` | `string`[] |

#### Defined in

[system/core/common/src/types/data.ts:410](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L410)

___

### TAttribute

Ƭ **TAttribute**: [`TBasePageEntity`](#tbasepageentity) & { `icon?`: `string` ; `key`: `string` ; `required?`: `boolean` ; `type`: ``"radio"`` \| ``"checkbox"`` ; `values`: [`TAttributeValue`](#tattributevalue)[]  }

Attribute

#### Defined in

[system/core/common/src/types/entities.ts:295](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L295)

___

### TAttributeInput

Ƭ **TAttributeInput**: `Omit`<[`TAttribute`](#tattribute), [`TDBAuxiliaryColumns`](#tdbauxiliarycolumns)\>

#### Defined in

[system/core/common/src/types/entities.ts:303](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L303)

___

### TAttributeInstance

Ƭ **TAttributeInstance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `values` | [`TAttributeInstanceValue`](#tattributeinstancevalue)[] |

#### Defined in

[system/core/common/src/types/entities.ts:310](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L310)

___

### TAttributeInstanceValue

Ƭ **TAttributeInstanceValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `productVariant?` | [`TAttributeProductVariant`](#tattributeproductvariant) |
| `value` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:315](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L315)

___

### TAttributeProductVariant

Ƭ **TAttributeProductVariant**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description?` | `string` |
| `descriptionDelta?` | `string` |
| `images?` | `string`[] |
| `mainImage?` | `string` |
| `name?` | `string` |
| `oldPrice?` | `number` |
| `price?` | `number` |
| `sku?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:320](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L320)

___

### TAttributeValue

Ƭ **TAttributeValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `icon?` | `string` |
| `value` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:305](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L305)

___

### TAuthRole

Ƭ **TAuthRole**: [`TUserRole`](#tuserrole) \| ``"self"`` \| ``"all"``

#### Defined in

[system/core/common/src/types/entities.ts:275](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L275)

___

### TBaseModuleConfig

Ƭ **TBaseModuleConfig**: `Object`

Base config for Theme / Plugin in cromwell.config.js

#### Type declaration

| Name | Type |
| :------ | :------ |
| `rollupConfig?` | () => [`TRollupConfig`](#trollupconfig) \| `Promise`<[`TRollupConfig`](#trollupconfig)\> |

#### Defined in

[system/core/common/src/types/data.ts:209](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L209)

___

### TBasePageEntity

Ƭ **TBasePageEntity**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `createDate?` | `Date` | DB createDate |
| `id` | `string` | DB id |
| `isEnabled?` | `boolean` | Is displaying at frontend |
| `pageDescription?` | `string` | Page meta description (SEO) |
| `pageTitle?` | `string` | Page meta title (SEO) |
| `slug?` | `string` | Slug for page route |
| `updateDate?` | `Date` | DB updateDate |

#### Defined in

[system/core/common/src/types/entities.ts:3](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L3)

___

### TBasePageEntityInput

Ƭ **TBasePageEntityInput**: `Omit`<[`TBasePageEntity`](#tbasepageentity), [`TDBAuxiliaryColumns`](#tdbauxiliarycolumns)\>

#### Defined in

[system/core/common/src/types/entities.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L36)

___

### TBlockContentProvider

Ƭ **TBlockContentProvider**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockClass?` | `string` | Additional CSS class to apply for block wrapper |
| `componentDidUpdate?` | () => `void` | - |
| `getter` | (`block`: [`TCromwellBlock`](#tcromwellblock)<`Component`<`Object`, `Object`, `any`\>\>) => `ReactNode` | - |

#### Defined in

[system/core/common/src/types/blocks.ts:248](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L248)

___

### TCCSModuleInfo

Ƭ **TCCSModuleInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `author` | `string` |
| `authorLink?` | `string` |
| `betaPackageVersion` | `string` |
| `betaVersion` | `string` |
| `createdAt` | `Date` |
| `description?` | `string` |
| `excerpt?` | `string` |
| `icon?` | `string` |
| `image?` | `string` |
| `images?` | `string`[] |
| `link?` | `string` |
| `name` | `string` |
| `packageName` | `string` |
| `packageVersion` | `string` |
| `slug?` | `string` |
| `tags?` | `string`[] |
| `title?` | `string` |
| `updatedAt` | `Date` |
| `version` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:500](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L500)

___

### TCCSModuleShortInfo

Ƭ **TCCSModuleShortInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `betaPackageVersion?` | `string` |
| `betaVersion?` | `string` |
| `packageVersion` | `string` |
| `version` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:493](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L493)

___

### TCCSVersion

Ƭ **TCCSVersion**: `Object`

Version of a CMS module.
CCS - Cromwell Central Server

#### Type declaration

| Name | Type |
| :------ | :------ |
| `beta` | `boolean` |
| `changelog?` | `string` |
| `createdAt` | `Date` |
| `description?` | `string` |
| `image?` | `string` |
| `name` | `string` |
| `onlyManualUpdate?` | `boolean` |
| `packageVersion` | `string` |
| `restartServices` | keyof [`TServiceVersions`](#tserviceversions)[] |
| `version` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:480](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L480)

___

### TCMSTheme

Ƭ **TCMSTheme**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mode?` | ``"default"`` \| ``"dark"`` |
| `palette?` | [`TPalette`](#tpalette) |

#### Defined in

[system/core/common/src/types/data.ts:536](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L536)

___

### TCmsAdminSettings

Ƭ **TCmsAdminSettings**: `Object`

Admin (private) CMS settings

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `sendFromEmail?` | `string` | E-mail to send mails from |
| `smtpConnectionString?` | `string` | SMTP connection string to e-mail service provider |

#### Defined in

[system/core/common/src/types/entities.ts:543](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L543)

___

### TCmsConfig

Ƭ **TCmsConfig**: `Object`

cmsconfig.json

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accessTokenExpirationTime?` | `number` |
| `accessTokenSecret?` | `string` |
| `adminPanelPort?` | `number` |
| `apiPort?` | `number` |
| `centralServerUrl?` | `string` |
| `cmsInfo?` | [`TCmsInfo`](#tcmsinfo) |
| `cookieSecret?` | `string` |
| `defaultSettings?` | [`TCmsEntityCore`](#tcmsentitycore) |
| `domain?` | `string` |
| `env?` | ``"dev"`` \| ``"prod"`` |
| `frontendPort?` | `number` |
| `managerPort?` | `number` |
| `orm?` | `ConnectionOptions` |
| `pm?` | ``"yarn"`` \| ``"cromwella"`` |
| `redirects?` | [`TCmsRedirect`](#tcmsredirect)[] |
| `refreshTokenExpirationTime?` | `number` |
| `refreshTokenSecret?` | `string` |
| `rewrites?` | [`TCmsRedirect`](#tcmsredirect)[] |
| `serviceSecret?` | `string` |
| `url?` | `string` |
| `useWatch?` | `boolean` |
| `watchPoll?` | `number` |

#### Defined in

[system/core/common/src/types/data.ts:167](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L167)

___

### TCmsEntity

Ƭ **TCmsEntity**: [`TCmsEntityCore`](#tcmsentitycore) & [`TBasePageEntity`](#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:587](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L587)

___

### TCmsEntityCore

Ƭ **TCmsEntityCore**: `Object`

DB CMS entity

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `adminSettings?` | [`TCmsAdminSettings`](#tcmsadminsettings) | Admin settings. Available from REST API endpoint with administrator role authorization |
| `internalSettings?` | [`TCmsInternalSettings`](#tcmsinternalsettings) | Internal settings. |
| `publicSettings?` | [`TCmsPublicSettings`](#tcmspublicsettings) | Pubic settings. Available from REST API endpoint without authentication. |

#### Defined in

[system/core/common/src/types/entities.ts:466](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L466)

___

### TCmsInfo

Ƭ **TCmsInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `packages` | `Partial`<`Record`<typeof [`systemPackages`](#systempackages)[`number`], `string`\>\> |

#### Defined in

[system/core/common/src/types/data.ts:545](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L545)

___

### TCmsInternalSettings

Ƭ **TCmsInternalSettings**: `Object`

Internal CMS settings

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `beta?` | `boolean` | Internal. Recieve unstable beta-updates |
| `installed?` | `boolean` | Internal. If false or not set, will launch installation at first Admin Panel visit. |
| `isUpdating?` | `boolean` | Internal. Is currently under update |
| `version?` | `string` | Internal. CMS version, used for updates |
| `versions?` | [`TServiceVersions`](#tserviceversions) | Internal. https://github.com/CromwellCMS/Cromwell/blob/55046c48d9da0a44e4b11e7918c73876fcd1cfc1/system/manager/src/managers/baseManager.ts#L194:L206 |

#### Defined in

[system/core/common/src/types/entities.ts:557](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L557)

___

### TCmsPublicSettings

Ƭ **TCmsPublicSettings**: `Object`

Public CMS settings

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `currencies?` | [`TCurrency`](#tcurrency)[] | Available currencies in the store and rates between them to convert |
| `defaultPageSize?` | `number` | Page size to use in lists, eg. at Product Category page |
| `defaultShippingPrice?` | `number` | Standard shipping price if no shipment methods specified |
| `favicon?` | `string` | Website favicon |
| `footerHtml?` | `string` | - |
| `headHtml?` | `string` | Custom HTML code injection |
| `language?` | `string` | Default language |
| `logo?` | `string` | Website logo |
| `redirects?` | [`TCmsRedirect`](#tcmsredirect)[] | HTTP Redirects for Next.js server |
| `rewrites?` | [`TCmsRedirect`](#tcmsredirect)[] | HTTP rewrites for Next.js server |
| `themeName?` | `string` | Package name of currently used theme |
| `timezone?` | `number` | Default timezone in GMT, number +- |
| `url?` | `string` | Website's URL |

#### Defined in

[system/core/common/src/types/entities.ts:486](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L486)

___

### TCmsRedirect

Ƭ **TCmsRedirect**: [`TCmsRedirectObject`](#tcmsredirectobject) \| [`TCmsRedirectFunction`](#tcmsredirectfunction)

#### Defined in

[system/core/common/src/types/entities.ts:614](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L614)

___

### TCmsRedirectFunction

Ƭ **TCmsRedirectFunction**: (`pathname`: `string`, `search?`: `string` \| ``null``) => [`TCmsRedirectObject`](#tcmsredirectobject) \| `undefined` \| `void`

#### Type declaration

▸ (`pathname`, `search?`): [`TCmsRedirectObject`](#tcmsredirectobject) \| `undefined` \| `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `pathname` | `string` |
| `search?` | `string` \| ``null`` |

##### Returns

[`TCmsRedirectObject`](#tcmsredirectobject) \| `undefined` \| `void`

#### Defined in

[system/core/common/src/types/entities.ts:612](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L612)

___

### TCmsRedirectObject

Ƭ **TCmsRedirectObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from?` | `string` |
| `permanent?` | `boolean` |
| `statusCode?` | `number` |
| `to?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:605](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L605)

___

### TCmsSettings

Ƭ **TCmsSettings**: [`TCmsConfig`](#tcmsconfig) & [`TCmsPublicSettings`](#tcmspublicsettings) & [`TCmsAdminSettings`](#tcmsadminsettings) & [`TCmsInternalSettings`](#tcmsinternalsettings)

Merged info form cmsconfig.json and settings from DB

#### Defined in

[system/core/common/src/types/data.ts:195](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L195)

___

### TCmsStats

Ƭ **TCmsStats**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `averageRating` | `number` |
| `customers` | `number` |
| `orders` | `number` |
| `pageViews` | `number` |
| `pages` | `number` |
| `reviews` | `number` |
| `salesPerDay` | [`TSalePerDay`](#tsaleperday)[] |
| `salesValue` | `number` |
| `topPageViews` | [`TPageStats`](#tpagestats)[] |

#### Defined in

[system/core/common/src/types/data.ts:423](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L423)

___

### TCmsStatus

Ƭ **TCmsStatus**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `currentVersion?` | `string` |
| `isUpdating?` | `boolean` |
| `notifications?` | [`TNotification`](#tnotification)[] |
| `updateAvailable` | `boolean` |
| `updateInfo?` | [`TUpdateInfo`](#tupdateinfo) |

#### Defined in

[system/core/common/src/types/data.ts:448](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L448)

___

### TCommonComponentProps

Ƭ **TCommonComponentProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | [`TProduct`](#tproduct) \| [`TPost`](#tpost) \| `any` |

#### Defined in

[system/core/common/src/types/blocks.ts:92](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L92)

___

### TContentComponentProps

Ƭ **TContentComponentProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `React.ReactNode` |
| `config?` | [`TCromwellBlockData`](#tcromwellblockdata) |
| `id` | `string` |

#### Defined in

[system/core/common/src/types/blocks.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L86)

___

### TCreateUser

Ƭ **TCreateUser**: `Omit`<[`TUser`](#tuser), [`TDBAuxiliaryColumns`](#tdbauxiliarycolumns)\> & { `password?`: `string`  }

#### Defined in

[system/core/common/src/types/entities.ts:277](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L277)

___

### TCromwellBlock

Ƭ **TCromwellBlock**<`TContentBlock`\>: `React.Component`<[`TCromwellBlockProps`](#tcromwellblockprops)<`TContentBlock`\>\> & { `addDidUpdateListener`: (`id`: `string`, `func`: () => `void`) => `void` ; `consumerRender`: (`jsxParentId?`: `string`) => ``null`` \| `Element` ; `contentRender`: (`getContent?`: ``null`` \| (`block`: [`TCromwellBlock`](#tcromwellblock)<`Component`<`Object`, `Object`, `any`\>\>) => `ReactNode`) => `ReactNode` ; `getBlockRef`: () => `RefObject`<`HTMLDivElement`\> ; `getContentInstance`: () => `undefined` \| `Component`<`Object`, `Object`, `any`\> & `TContentBlock` ; `getData`: () => `undefined` \| [`TCromwellBlockData`](#tcromwellblockdata) ; `getDefaultContent`: () => `ReactNode` ; `movedCompForceUpdate?`: () => `void` ; `notifyChildRegistered`: (`childInst`: [`TCromwellBlock`](#tcromwellblock)<`any`\>) => `void` ; `rerender`: () => `void` \| `Promise`<`void`\> ; `setContentInstance`: (`contentInstance`: `Component`<`Object`, `Object`, `any`\> & `TContentBlock`) => `void`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContentBlock` | `React.Component` |

#### Defined in

[system/core/common/src/types/blocks.ts:45](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L45)

___

### TCromwellBlockData

Ƭ **TCromwellBlockData**: `Object`

Modification for a Block. Used in the Page builder to store user's changes.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `editorStyles?` | `Object` | Styles applied from PageBuilder's UI |
| `editorStyles.align?` | ``"left"`` \| ``"right"`` \| ``"center"`` | - |
| `editorStyles.maxWidth?` | `number` | - |
| `editorStyles.offsetBottom?` | `number` | - |
| `editorStyles.offsetLeft?` | `number` | - |
| `editorStyles.offsetRight?` | `number` | - |
| `editorStyles.offsetTop?` | `number` | - |
| `gallery?` | [`TGallerySettings`](#tgallerysettings) | For gallery block |
| `global?` | `boolean` | Persist on all pages, all inner modifications will be saved as global |
| `html?` | `Object` | For "HTML" block |
| `html.innerHTML?` | `string` | - |
| `id` | `string` | Component's id, must be unique in a page. |
| `image?` | `Object` | For "image" block |
| `image.alt?` | `string` | - |
| `image.height?` | `number` \| `string` | - |
| `image.link?` | `string` | - |
| `image.objectFit?` | ``"contain"`` \| ``"cover"`` | - |
| `image.src?` | `string` | - |
| `image.width?` | `number` \| `string` | - |
| `image.withEffect?` | `boolean` | - |
| `index?` | `number` | Index inside children array of parent element |
| `isConstant?` | `boolean` | If true, user can't delete or modify this block in the editor |
| `isDeleted?` | `boolean` | Non-virtual blocks that exist in JSX cannot be deleted (or moved) in theme's source code by user but user can set isDeleted flag that will tell Blocks to render null instead |
| `isVirtual?` | `boolean` | If true, indicates that this Block was created in Page builder and it doesn't exist in source files as React component. Exists only in page's config. |
| `link?` | `Object` | For link block |
| `link.href?` | `string` | - |
| `link.text?` | `string` | - |
| `parentId?` | `string` | Id of Destination Component where this component will be displayed. |
| `plugin?` | `Object` | For plugin block |
| `plugin.instanceSettings?` | `Record`<`string`, `any`\> | Plugin's local settings |
| `plugin.pluginName?` | `string` | Plugin's name to render inside component. Same name must be in module.config.js |
| `style?` | `string` \| `React.CSSProperties` | CSS styles to apply to this block's wrapper |
| `text?` | `Object` | For text block |
| `text.content?` | `string` | - |
| `text.href?` | `string` | - |
| `text.textElementType?` | keyof `React.ReactHTML` | - |
| `type?` | [`TCromwellBlockType`](#tcromwellblocktype) | Component's type |

#### Defined in

[system/core/common/src/types/blocks.ts:101](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L101)

___

### TCromwellBlockProps

Ƭ **TCromwellBlockProps**<`TContentBlock`\>: { `className?`: `string` ; `id`: `string` ; `jsxParentId?`: `string` ; `type?`: [`TCromwellBlockType`](#tcromwellblocktype) ; `blockRef?`: (`block`: [`TCromwellBlock`](#tcromwellblock)<`TContentBlock`\>) => `void` ; `content?`: (`data`: `undefined` \| [`TCromwellBlockData`](#tcromwellblockdata), `blockRef`: `RefObject`<`HTMLDivElement`\>, `setContentInstance`: (`contentInstance`: `Component`<`Object`, `Object`, `any`\> & `TContentBlock`) => `void`) => `ReactNode` ; `onClick?`: (`event`: `MouseEvent`<`HTMLDivElement`, `MouseEvent`\>) => `any`  } & [`TCromwellBlockData`](#tcromwellblockdata)

Basic props for Blocks. Used in JSX by Theme authors

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContentBlock` | `React.Component` |

#### Defined in

[system/core/common/src/types/blocks.ts:67](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L67)

___

### TCromwellBlockType

Ƭ **TCromwellBlockType**: ``"container"`` \| ``"plugin"`` \| ``"text"`` \| ``"HTML"`` \| ``"image"`` \| ``"gallery"`` \| ``"list"`` \| ``"link"``

#### Defined in

[system/core/common/src/types/blocks.ts:96](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L96)

___

### TCromwellNodeModules

Ƭ **TCromwellNodeModules**: `Object`

Internal. Store for reusable Frontend dependencies.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hasBeenExecuted?` | `boolean` |
| `importStatuses?` | `Record`<`string`, ``"failed"`` \| ``"ready"`` \| ``"default"`` \| `Promise`<``"failed"`` \| ``"ready"`` \| ``"default"``\>\> |
| `imports?` | `Record`<`string`, `fn`\> |
| `moduleExternals?` | `Record`<`string`, `string`[]\> |
| `modules?` | `Record`<`string`, `any`\> |
| `prefix?` | `string` |
| `scriptStatuses?` | `Record`<`string`, ``"failed"`` \| ``"ready"`` \| `Promise`<``"failed"`` \| ``"ready"``\>\> |
| `importModule?` | (`moduleName`: `string`, `namedExports?`: `string`[]) => `boolean` \| `Promise`<`boolean`\> |
| `importScriptExternals?` | (`metaInfo`: [`TScriptMetaInfo`](#tscriptmetainfo)) => `Promise`<`boolean`\> |
| `setPrefix?` | (`prefix`: `string`) => `void` |

#### Defined in

[system/core/common/src/types/data.ts:294](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L294)

___

### TCromwellNotify

Ƭ **TCromwellNotify**: `Object`

UI Notification service. In Admin panel it's react-toastify, for example.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error?` | (`message`: `string`, `options?`: `any`) => `void` |
| `info?` | (`message`: `string`, `options?`: `any`) => `void` |
| `success?` | (`message`: `string`, `options?`: `any`) => `void` |
| `warning?` | (`message`: `string`, `options?`: `any`) => `void` |

#### Defined in

[system/core/common/src/types/data.ts:341](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L341)

___

### TCromwellPage

Ƭ **TCromwellPage**<`Props`\>: `NextPage`<`Props` & [`TCromwellPageCoreProps`](#tcromwellpagecoreprops)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | `any` \| `undefined` |

#### Defined in

[system/core/common/src/types/blocks.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L19)

___

### TCromwellPageCoreProps

Ƭ **TCromwellPageCoreProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `childStaticProps?` | `Record`<`string`, `any`\> \| ``null`` |
| `cmsSettings?` | [`TCmsSettings`](#tcmssettings) \| ``null`` |
| `defaultPages?` | `Record`<[`TDefaultPageName`](#tdefaultpagename), `string`\> |
| `documentContext?` | [`CrwDocumentContextType`](#crwdocumentcontexttype) |
| `pageConfig?` | [`TPageConfig`](#tpageconfig) \| ``null`` |
| `pageConfigName?` | `string` |
| `pagesInfo?` | [`TPageInfo`](#tpageinfo)[] \| ``null`` |
| `palette?` | [`TPalette`](#tpalette) \| ``null`` |
| `plugins?` | `Record`<`string`, `Object`\> |
| `resolvedPageRoute?` | `string` |
| `themeCustomConfig?` | `Record`<`string`, `any`\> \| ``null`` |
| `themeFooterHtml?` | `string` \| ``null`` |
| `themeHeadHtml?` | `string` \| ``null`` |

#### Defined in

[system/core/common/src/types/blocks.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L21)

___

### TCromwellStore

Ƭ **TCromwellStore**: `Object`

Global store mostly for internal usage.
If you need Redux interactivity, use onStoreChange.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiClients?` | `Object` | Internal |
| `apiClients.graphQLClient?` | `any` | - |
| `apiClients.restAPIClient?` | `any` | - |
| `blockInstances?` | `Record`<`string`, [`TCromwellBlock`](#tcromwellblock) \| `undefined`\> | Internal. References to all instances of Cromwell Blocks at the page { [CromwellBlockId]: Instance} |
| `cmsSettings?` | [`TCmsSettings`](#tcmssettings) | Public CMS Settings |
| `components?` | `Record`<`string`, `React.ComponentType`<[`TCommonComponentProps`](#tcommoncomponentprops) & { [x: string]: `any`;  }\>\> | Internal. Common component storage. E.g. product cards to be reused by Plugins  { [ComponentName]: (Class/function) } |
| `cstore?` | `any` | - |
| `currency?` | `string` | Active currency |
| `dbInfo?` | [`TDBInfo`](#tdbinfo) | Info about current DB for backend usage |
| `defaultPages?` | `Record`<[`TDefaultPageName`](#tdefaultpagename), `string`\> | See `defaultPages` in TThemeConfig |
| `environment?` | `Object` | - |
| `environment.isAdminPanel?` | `boolean` | - |
| `environment.mode?` | ``"dev"`` \| ``"prod"`` | - |
| `nodeModules?` | [`TCromwellNodeModules`](#tcromwellnodemodules) | - |
| `notifier?` | [`TCromwellNotify`](#tcromwellnotify) | - |
| `pageConfig?` | [`TPageConfig`](#tpageconfig) | Config of currently opened Theme's page |
| `pagesInfo?` | [`TPageInfo`](#tpageinfo)[] | Short pages info of current Theme |
| `plugins?` | `Record`<`string`, `Object`\> | Internal. Plugins data |
| `redirects?` | `Record`<`string`, [`TCmsRedirect`](#tcmsredirect)\> | HTTP Redirects for Next.js server |
| `rewrites?` | `Record`<`string`, [`TCmsRedirect`](#tcmsredirect)\> | HTTP rewrites for Next.js server |
| `storeChangeCallbacks?` | `Record`<`string`, (`prop`: `any`) => `any`[]\> | - |
| `theme?` | [`TCMSTheme`](#tcmstheme) | - |
| `themeCustomConfig?` | `Record`<`string`, `any`\> | - |
| `userInfo?` | [`TUser`](#tuser) | - |
| `webSocketClient?` | `any` | - |
| `forceUpdatePage?` | () => `void` | - |
| `fsRequire?` | (`path`: `string`) => `Promise`<`any`\> | - |

#### Defined in

[system/core/common/src/types/data.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L20)

___

### TCromwellaConfig

Ƭ **TCromwellaConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `frontendDependencies?` | (`string` \| [`TFrontendDependency`](#tfrontenddependency))[] |
| `packages` | `string`[] |

#### Defined in

[system/core/common/src/types/data.ts:388](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L388)

___

### TCurrency

Ƭ **TCurrency**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | - |
| `ratio?` | `number` | Ratio for currencies to compare: "USD": 1,"EURO": 0.83, "GBP": 0.72 etc. |
| `symbol?` | `string` | Local curency symbols that will be added to price in getPriceWithCurrency method |
| `tag` | `string` | - |
| `title?` | `string` | - |

#### Defined in

[system/core/common/src/types/entities.ts:590](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L590)

___

### TDBAuxiliaryColumns

Ƭ **TDBAuxiliaryColumns**: ``"id"`` \| ``"createDate"`` \| ``"updateDate"``

#### Defined in

[system/core/common/src/types/entities.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L34)

___

### TDBEntity

Ƭ **TDBEntity**: keyof { `Attribute`: `any` ; `CMS`: `any` ; `Generic`: `any` ; `Order`: `any` ; `Plugin`: `any` ; `Post`: `any` ; `PostComment`: `any` ; `Product`: `any` ; `ProductCategory`: `any` ; `ProductReview`: `any` ; `Tag`: `any` ; `Theme`: `any` ; `User`: `any`  }

#### Defined in

[system/core/common/src/types/data.ts:115](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L115)

___

### TDBInfo

Ƭ **TDBInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dbType?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:541](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L541)

___

### TDataComponentProps

Ƭ **TDataComponentProps**<`Data`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `Data` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `component` | `React.ComponentType`<`Data`\> |
| `pluginName` | `string` |

#### Defined in

[system/core/common/src/types/blocks.ts:59](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L59)

___

### TDefaultPageName

Ƭ **TDefaultPageName**: ``"index"`` \| ``"category"`` \| ``"product"`` \| ``"post"`` \| ``"tag"`` \| ``"pages"`` \| ``"account"`` \| ``"checkout"`` \| ``"blog"``

#### Defined in

[system/core/common/src/types/data.ts:251](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L251)

___

### TDeleteManyInput

Ƭ **TDeleteManyInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `all?` | `boolean` |
| `ids` | `string`[] |

#### Defined in

[system/core/common/src/types/entities.ts:600](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L600)

___

### TExternal

Ƭ **TExternal**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `importName?` | `string` |
| `moduleName?` | `string` |
| `usedName` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:404](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L404)

___

### TFilteredProductList

Ƭ **TFilteredProductList**: [`TPagedList`](#tpagedlist)<[`TProduct`](#tproduct)\> & { `filterMeta`: [`TProductFilterMeta`](#tproductfiltermeta)  }

#### Defined in

[system/core/common/src/types/entities.ts:168](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L168)

___

### TFrontendBundle

Ƭ **TFrontendBundle**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cjsPath?` | `string` |
| `meta?` | [`TScriptMetaInfo`](#tscriptmetainfo) |
| `source?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:328](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L328)

___

### TFrontendDependency

Ƭ **TFrontendDependency**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addExports?` | [`TAdditionalExports`](#tadditionalexports)[] |
| `builtins?` | `string`[] |
| `bundledCss?` | `string`[] |
| `excludeExports?` | `string`[] |
| `externals?` | [`TExternal`](#texternal)[] |
| `ignore?` | `string`[] |
| `name` | `string` |
| `version?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:393](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L393)

___

### TFrontendPluginProps

Ƭ **TFrontendPluginProps**<`TData`, `TInstanceSettings`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `any` |
| `TInstanceSettings` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `TData` |
| `instanceSettings?` | `TInstanceSettings` |
| `pluginName` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:530](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L530)

___

### TGallerySettings

Ƭ **TGallerySettings**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `autoHeight?` | `boolean` | - |
| `autoPlay?` | `boolean` | - |
| `backgroundSize?` | ``"contain"`` \| ``"cover"`` | - |
| `breakpoints?` | `any` | - |
| `classes?` | `Object` | - |
| `classes.navBtn?` | `string` | - |
| `components?` | `Object` | - |
| `components.backButton?` | `React.ComponentType` | - |
| `components.imgWrapper?` | `React.ComponentType`<`Object`\> | - |
| `components.nextButton?` | `React.ComponentType` | - |
| `effect?` | ``"slide"`` \| ``"fade"`` \| ``"cube"`` \| ``"coverflow"`` \| ``"flip"`` | - |
| `fullscreen?` | `boolean` | - |
| `height?` | `number` | - |
| `images?` | [`TImageSettings`](#timagesettings)[] | - |
| `interval?` | `number` | - |
| `lazy?` | `boolean` | - |
| `loop?` | `boolean` | - |
| `navigation?` | { `showOnHover?`: `boolean`  } \| `boolean` | - |
| `orientation?` | ``"horizontal"`` \| ``"vertical"`` | - |
| `pagination?` | `boolean` | - |
| `ratio?` | `number` | ratio = width / height |
| `responsive?` | `Record`<`number`, [`TGallerySettings`](#tgallerysettings)\> | - |
| `slideMaxWidth?` | `number` | - |
| `slideMinWidth?` | `number` | - |
| `slides?` | `React.ReactNode`[] | - |
| `spaceBetween?` | `number` | - |
| `speed?` | `number` | - |
| `thumbs?` | `boolean` \| { `backgroundSize?`: ``"contain"`` \| ``"cover"`` ; `height?`: `number` ; `loop?`: `boolean` ; `width?`: `number`  } | - |
| `visibleSlides?` | `number` | - |
| `width?` | `number` | - |
| `zoom?` | `boolean` | - |

#### Defined in

[system/core/common/src/types/blocks.ts:204](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L204)

___

### TGetStaticProps

Ƭ **TGetStaticProps**<`TPluginSettings`, `Q`\>: (`ctx`: [`StaticPageContext`](#staticpagecontext)<`TPluginSettings`, `Q`\>) => `Promise`<`any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TPluginSettings` | `any` |
| `Q` | extends `ParsedUrlQuery``ParsedUrlQuery` |

#### Type declaration

▸ (`ctx`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`StaticPageContext`](#staticpagecontext)<`TPluginSettings`, `Q`\> |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/common/src/types/blocks.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L15)

___

### TGraphQLNode

Ƭ **TGraphQLNode**: `Object`

#### Index signature

▪ [x: `string`]: `string`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | `string` |
| `delete` | `string` |
| `deleteMany` | `string` |
| `getMany` | `string` |
| `getOneById` | `string` |
| `getOneBySlug` | `string` |
| `update` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:133](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L133)

___

### TImageSettings

Ƭ **TImageSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `alt?` | `string` |
| `href?` | `string` |
| `id?` | `string` \| `number` |
| `src` | `string` |
| `thumb?` | `string` |

#### Defined in

[system/core/common/src/types/blocks.ts:196](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L196)

___

### TModuleConfig

Ƭ **TModuleConfig**: [`TThemeConfig`](#tthemeconfig) & [`TPluginConfig`](#tpluginconfig)

#### Defined in

[system/core/common/src/types/data.ts:249](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L249)

___

### TNotification

Ƭ **TNotification**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `documentationLink?` | `string` |
| `message` | `string` |
| `pageLink?` | `string` |
| `type` | ``"info"`` \| ``"warning"`` \| ``"error"`` |

#### Defined in

[system/core/common/src/types/data.ts:468](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L468)

___

### TOrder

Ƭ **TOrder**: [`TOrderCore`](#tordercore) & [`TBasePageEntity`](#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:381](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L381)

___

### TOrderCore

Ƭ **TOrderCore**: `Object`

Store order

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cart?` | `string` \| [`TStoreListItem`](#tstorelistitem)[] |
| `cartOldTotalPrice?` | `number` |
| `cartTotalPrice?` | `number` |
| `currency?` | `string` |
| `customerAddress?` | `string` |
| `customerComment?` | `string` |
| `customerEmail?` | `string` |
| `customerName?` | `string` |
| `customerPhone?` | `string` |
| `fromUrl?` | `string` |
| `orderTotalPrice?` | `number` |
| `paymentMethod?` | `string` |
| `shippingMethod?` | `string` |
| `shippingPrice?` | `number` |
| `status?` | `string` |
| `totalQnt?` | `number` |
| `userId?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:361](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L361)

___

### TOrderFilter

Ƭ **TOrderFilter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customerEmail?` | `string` |
| `customerName?` | `string` |
| `customerPhone?` | `string` |
| `dateFrom?` | `string` |
| `dateTo?` | `string` |
| `orderId?` | `string` |
| `status?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:385](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L385)

___

### TOrderInput

Ƭ **TOrderInput**: [`TOrderCore`](#tordercore) & [`TBasePageEntityInput`](#tbasepageentityinput)

#### Defined in

[system/core/common/src/types/entities.ts:383](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L383)

___

### TPackageCromwellConfig

Ƭ **TPackageCromwellConfig**: `Object`

Module info in package.json under "cromwell" property

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `author?` | `string` | - |
| `authorLink?` | `string` | - |
| `bundledDependencies?` | `string`[] | - |
| `description?` | `string` | - |
| `excerpt?` | `string` | - |
| `firstLoadedDependencies?` | `string`[] | - |
| `frontendDependencies?` | (`string` \| [`TFrontendDependency`](#tfrontenddependency))[] | - |
| `icon?` | `string` | - |
| `image?` | `string` | - |
| `images?` | `string`[] | - |
| `link?` | `string` | - |
| `minCmsVersion?` | `string` | Minimal CMS version since when this module available to install |
| `name?` | `string` | - |
| `packageName?` | `string` | - |
| `plugins?` | `string`[] | - |
| `tags?` | `string`[] | - |
| `themes?` | `string`[] | - |
| `title?` | `string` | - |
| `type?` | ``"plugin"`` \| ``"theme"`` | - |
| `version?` | `string` | - |

#### Defined in

[system/core/common/src/types/data.ts:364](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L364)

___

### TPackageJson

Ƭ **TPackageJson**: `Object`

package.json definition with cromwell info

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cromwell?` | [`TPackageCromwellConfig`](#tpackagecromwellconfig) |
| `dependencies?` | `Record`<`string`, `string`\> |
| `devDependencies?` | `Record`<`string`, `string`\> |
| `module?` | `string` |
| `name?` | `string` |
| `peerDependencies?` | `Record`<`string`, `string`\> |
| `version?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:351](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L351)

___

### TPageConfig

Ƭ **TPageConfig**: [`TPageInfo`](#tpageinfo) & { `adminPanelProps?`: `any` ; `footerHtml?`: `string` ; `headHtml?`: `string` ; `modifications`: [`TCromwellBlockData`](#tcromwellblockdata)[] ; `pageCustomConfig?`: `Record`<`string`, `any`\>  }

#### Defined in

[system/core/common/src/types/data.ts:281](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L281)

___

### TPageInfo

Ƭ **TPageInfo**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `description?` | `string` | Meta description (SEO) |
| `id` | `string` | Unique ID of a page |
| `isVirtual?` | `boolean` | If true, this page created in PageBuilder or manually in config and does not have a corresponding source file with React component |
| `name` | `string` | Name |
| `route` | `string` | Page's url/slug. Can be: 1. Filesystem relative path of page's react component without extension. If file name is "./post/[slug].tsx" then route must be "post/[slug]" 2. Route of a virtual page (generic page). Responsible component is "pages/[slug].js" , route must in format: "pages/any-slug" |
| `title?` | `string` | Meta title (SEO) |

#### Defined in

[system/core/common/src/types/data.ts:258](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L258)

___

### TPageStats

Ƭ **TPageStats**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pageId?` | `string` |
| `pageName?` | `string` |
| `pageRoute?` | `string` |
| `views?` | `number` |

#### Defined in

[system/core/common/src/types/data.ts:435](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L435)

___

### TPagedList

Ƭ **TPagedList**<`Entity`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `Entity` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `elements?` | `Entity`[] |
| `pagedMeta?` | [`TPagedMeta`](#tpagedmeta) |

#### Defined in

[system/core/common/src/types/data.ts:145](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L145)

___

### TPagedMeta

Ƭ **TPagedMeta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pageNumber?` | `number` |
| `pageSize?` | `number` |
| `totalElements?` | `number` |
| `totalPages?` | `number` |

#### Defined in

[system/core/common/src/types/data.ts:157](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L157)

___

### TPagedParams

Ƭ **TPagedParams**<`Entity`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `Entity` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `order?` | ``"ASC"`` \| ``"DESC"`` |
| `orderBy?` | keyof `Entity` |
| `pageNumber?` | `number` |
| `pageSize?` | `number` |

#### Defined in

[system/core/common/src/types/data.ts:150](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L150)

___

### TPagesMetaInfo

Ƭ **TPagesMetaInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `basePath?` | `string` |
| `buildDir?` | `string` |
| `paths` | { `basePath?`: `string` ; `importedStyles?`: `string`[] ; `localDepsBundle?`: `string` ; `localPath?`: `string` ; `pageName`: `string` ; `srcFullPath?`: `string`  }[] |
| `rootBuildDir?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:314](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L314)

___

### TPalette

Ƭ **TPalette**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `primaryColor?` | `string` |
| `secondaryColor?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:253](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L253)

___

### TPaymentSession

Ƭ **TPaymentSession**: [`TOrderCore`](#tordercore) & { `cancelUrl?`: `string` ; `paymentOptions?`: { `link?`: `string` ; `name?`: `string`  }[] ; `successUrl?`: `string`  }

#### Defined in

[system/core/common/src/types/entities.ts:395](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L395)

___

### TPluginConfig

Ƭ **TPluginConfig**: [`TBaseModuleConfig`](#tbasemoduleconfig) & { `adminInputFile?`: `string` ; `backend?`: `string` ; `defaultSettings?`: `any` ; `frontendInputFile?`: `string` ; `frontendModule?`: `string`  }

Plugin module config, part of cromwell.config.js

#### Defined in

[system/core/common/src/types/data.ts:241](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L241)

___

### TPluginEntity

Ƭ **TPluginEntity**: [`TPluginEntityCore`](#tpluginentitycore) & [`TBasePageEntity`](#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:458](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L458)

___

### TPluginEntityCore

Ƭ **TPluginEntityCore**: `Object`

Plugin entity

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultSettings?` | `string` |
| `hasAdminBundle?` | `boolean` |
| `isInstalled` | `boolean` |
| `isUpdating?` | `boolean` |
| `moduleInfo?` | `string` |
| `name` | `string` |
| `settings?` | `string` |
| `title?` | `string` |
| `version?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:446](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L446)

___

### TPluginEntityInput

Ƭ **TPluginEntityInput**: [`TPluginEntityCore`](#tpluginentitycore) & [`TBasePageEntityInput`](#tbasepageentityinput)

#### Defined in

[system/core/common/src/types/entities.ts:460](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L460)

___

### TPluginInfo

Ƭ **TPluginInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:334](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L334)

___

### TPluginSettingsProps

Ƭ **TPluginSettingsProps**<`TSettings`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TSettings` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pluginInfo?` | [`TPackageCromwellConfig`](#tpackagecromwellconfig) |
| `pluginName` | `string` |
| `pluginSettings?` | `TSettings` |

#### Defined in

[system/core/common/src/types/data.ts:524](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L524)

___

### TPost

Ƭ **TPost**: { `author?`: [`TUser`](#tuser) ; `content?`: `string` \| ``null`` ; `delta?`: `string` \| ``null`` ; `excerpt?`: `string` \| ``null`` ; `featured?`: `boolean` \| ``null`` ; `mainImage?`: `string` \| ``null`` ; `publishDate?`: `Date` \| ``null`` ; `published?`: `boolean` \| ``null`` ; `readTime?`: `string` \| ``null`` ; `tags?`: [`TTag`](#ttag)[] \| ``null`` ; `title?`: `string` \| ``null``  } & [`TBasePageEntity`](#tbasepageentity)

POST

#### Defined in

[system/core/common/src/types/entities.ts:181](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L181)

___

### TPostComment

Ƭ **TPostComment**: [`TPostCommentCore`](#tpostcommentcore) & [`TBasePageEntity`](#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:418](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L418)

___

### TPostCommentCore

Ƭ **TPostCommentCore**: `Object`

Blog comment

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approved?` | `boolean` |
| `comment?` | `string` |
| `postId` | `string` |
| `title?` | `string` |
| `userEmail?` | `string` |
| `userId?` | `string` |
| `userName?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:408](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L408)

___

### TPostCommentInput

Ƭ **TPostCommentInput**: [`TPostCommentCore`](#tpostcommentcore) & [`TBasePageEntityInput`](#tbasepageentityinput)

#### Defined in

[system/core/common/src/types/entities.ts:420](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L420)

___

### TPostFilter

Ƭ **TPostFilter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `authorId?` | `string` |
| `featured?` | `boolean` \| ``null`` |
| `published?` | `boolean` |
| `tagIds?` | `string`[] |
| `titleSearch?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:234](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L234)

___

### TPostInput

Ƭ **TPostInput**: `Omit`<[`TPost`](#tpost), [`TDBAuxiliaryColumns`](#tdbauxiliarycolumns) \| ``"author"`` \| ``"tags"``\> & { `authorId`: `string` ; `tagIds?`: `string`[] \| ``null``  }

#### Defined in

[system/core/common/src/types/entities.ts:229](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L229)

___

### TProduct

Ƭ **TProduct**: [`TBasePageEntity`](#tbasepageentity) & { `attributes?`: [`TAttributeInstance`](#tattributeinstance)[] ; `categories?`: [`TProductCategory`](#tproductcategory)[] ; `description?`: `string` ; `descriptionDelta?`: `string` ; `images?`: `string`[] ; `mainImage?`: `string` ; `name?`: `string` ; `oldPrice?`: `number` ; `price?`: `number` ; `rating?`: [`TProductRating`](#tproductrating) ; `reviews?`: [`TProductReview`](#tproductreview)[] ; `sku?`: `string` ; `views?`: `number`  }

PRODUCT

#### Defined in

[system/core/common/src/types/entities.ts:87](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L87)

___

### TProductCategory

Ƭ **TProductCategory**: [`TProductCategoryCore`](#tproductcategorycore) & [`TBasePageEntity`](#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:73](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L73)

___

### TProductCategoryCore

Ƭ **TProductCategoryCore**: `Object`

ProductCategory

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `children?` | [`TProductCategory`](#tproductcategory)[] | DB children |
| `description?` | `string` | Description (HTML allowed) |
| `descriptionDelta?` | `string` | Description in Quill format |
| `mainImage?` | `string` | Href of main image |
| `name` | `string` | Name of the category (h1) |
| `parent?` | [`TProductCategory`](#tproductcategory) \| ``null`` | DB parent |
| `products?` | [`TPagedList`](#tpagedlist)<[`TProduct`](#tproduct)\> | Products in category |

#### Defined in

[system/core/common/src/types/entities.ts:42](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L42)

___

### TProductCategoryFilter

Ƭ **TProductCategoryFilter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nameSearch?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:79](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L79)

___

### TProductCategoryInput

Ƭ **TProductCategoryInput**: [`TBasePageEntityInput`](#tbasepageentityinput) & `Omit`<[`TProductCategoryCore`](#tproductcategorycore), ``"children"`` \| ``"parent"`` \| ``"products"``\> & { `parentId?`: `string`  }

#### Defined in

[system/core/common/src/types/entities.ts:75](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L75)

___

### TProductFilter

Ƭ **TProductFilter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attributes?` | [`TProductFilterAttribute`](#tproductfilterattribute)[] |
| `maxPrice?` | `number` |
| `minPrice?` | `number` |
| `nameSearch?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:157](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L157)

___

### TProductFilterAttribute

Ƭ **TProductFilterAttribute**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `values` | `string`[] |

#### Defined in

[system/core/common/src/types/entities.ts:163](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L163)

___

### TProductFilterMeta

Ƭ **TProductFilterMeta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `maxPrice?` | `number` |
| `minPrice?` | `number` |

#### Defined in

[system/core/common/src/types/entities.ts:172](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L172)

___

### TProductInput

Ƭ **TProductInput**: `Omit`<[`TProduct`](#tproduct), [`TDBAuxiliaryColumns`](#tdbauxiliarycolumns) \| ``"categories"`` \| ``"rating"`` \| ``"reviews"``\> & { `categoryIds?`: `string`[]  }

#### Defined in

[system/core/common/src/types/entities.ts:153](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L153)

___

### TProductRating

Ƭ **TProductRating**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `average?` | `number` | Rating 1-5 |
| `reviewsNumber?` | `number` | Number of customer reviews |

#### Defined in

[system/core/common/src/types/entities.ts:142](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L142)

___

### TProductReview

Ƭ **TProductReview**: [`TProductReviewCore`](#tproductreviewcore) & [`TBasePageEntity`](#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:346](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L346)

___

### TProductReviewCore

Ƭ **TProductReviewCore**: `Object`

ProductReview

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approved?` | `boolean` |
| `description?` | `string` |
| `productId` | `string` |
| `rating?` | `number` |
| `title?` | `string` |
| `userEmail?` | `string` |
| `userId?` | `string` |
| `userName?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:335](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L335)

___

### TProductReviewFilter

Ƭ **TProductReviewFilter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approved?` | `boolean` |
| `productId?` | `string` |
| `userId?` | `string` |
| `userName?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:350](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L350)

___

### TProductReviewInput

Ƭ **TProductReviewInput**: [`TProductReviewCore`](#tproductreviewcore) & [`TBasePageEntityInput`](#tbasepageentityinput)

#### Defined in

[system/core/common/src/types/entities.ts:348](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L348)

___

### TRollupConfig

Ƭ **TRollupConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `adminPanel?` | `Record`<`string`, `any`\> |
| `backend?` | `Record`<`string`, `any`\> |
| `frontend?` | `Record`<`string`, `any`\> |
| `frontendCjs?` | `Record`<`string`, `any`\> |
| `main` | `Record`<`string`, `any`\> |
| `themePages?` | `Record`<`string`, `any`\> |

#### Defined in

[system/core/common/src/types/data.ts:197](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L197)

___

### TSalePerDay

Ƭ **TSalePerDay**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `orders` | `number` |
| `salesValue` | `number` |

#### Defined in

[system/core/common/src/types/data.ts:442](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L442)

___

### TScriptMetaInfo

Ƭ **TScriptMetaInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `externalDependencies` | `Record`<`string`, `string`[]\> |
| `import?` | ``"chunks"`` \| ``"lib"`` |
| `name` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:307](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L307)

___

### TServiceVersions

Ƭ **TServiceVersions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `admin?` | `number` |
| `api-server?` | `number` |
| `renderer?` | `number` |
| `server?` | `number` |

#### Defined in

[system/core/common/src/types/entities.ts:580](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L580)

___

### TStoreListItem

Ƭ **TStoreListItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount?` | `number` |
| `pickedAttributes?` | `Record`<`string`, `string`[]\> |
| `product?` | [`TProduct`](#tproduct) |

#### Defined in

[system/core/common/src/types/data.ts:417](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L417)

___

### TTag

Ƭ **TTag**: [`TBasePageEntity`](#tbasepageentity) & { `color?`: `string` \| ``null`` ; `description?`: `string` \| ``null`` ; `descriptionDelta?`: `string` \| ``null`` ; `image?`: `string` \| ``null`` ; `name`: `string`  }

#### Defined in

[system/core/common/src/types/entities.ts:242](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L242)

___

### TTagInput

Ƭ **TTagInput**: `Omit`<[`TTag`](#ttag), [`TDBAuxiliaryColumns`](#tdbauxiliarycolumns)\>

#### Defined in

[system/core/common/src/types/entities.ts:250](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L250)

___

### TThemeConfig

Ƭ **TThemeConfig**: [`TBaseModuleConfig`](#tbasemoduleconfig) & { `defaultPages?`: `Record`<[`TDefaultPageName`](#tdefaultpagename), `string`\> ; `footerHtml?`: `string` ; `globalCss?`: `string`[] ; `globalModifications?`: [`TCromwellBlockData`](#tcromwellblockdata)[] ; `headHtml?`: `string` ; `pages?`: [`TPageConfig`](#tpageconfig)[] ; `palette?`: [`TPalette`](#tpalette) ; `themeCustomConfig?`: `Record`<`string`, `any`\> ; `nextConfig?`: () => `any`  }

Theme module config, part of cromwell.config.js

#### Defined in

[system/core/common/src/types/data.ts:217](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L217)

___

### TThemeEntity

Ƭ **TThemeEntity**: [`TThemeEntityCore`](#tthemeentitycore) & [`TBasePageEntity`](#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:438](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L438)

___

### TThemeEntityCore

Ƭ **TThemeEntityCore**: `Object`

Theme entity

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultSettings?` | `string` |
| `hasAdminBundle?` | `boolean` |
| `isInstalled` | `boolean` |
| `isUpdating?` | `boolean` |
| `moduleInfo?` | `string` |
| `name` | `string` |
| `settings?` | `string` |
| `title?` | `string` |
| `version?` | `string` |

#### Defined in

[system/core/common/src/types/entities.ts:426](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L426)

___

### TThemeEntityInput

Ƭ **TThemeEntityInput**: [`TThemeEntityCore`](#tthemeentitycore) & [`TBasePageEntityInput`](#tbasepageentityinput)

#### Defined in

[system/core/common/src/types/entities.ts:440](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L440)

___

### TUpdateInfo

Ƭ **TUpdateInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `beta` | `boolean` |
| `changelog?` | `string` |
| `createdAt` | `Date` |
| `description?` | `string` |
| `image?` | `string` |
| `name` | `string` |
| `onlyManualUpdate?` | `boolean` |
| `packageVersion` | `string` |
| `version` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:456](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L456)

___

### TUpdateUser

Ƭ **TUpdateUser**: `Omit`<[`TUser`](#tuser), [`TDBAuxiliaryColumns`](#tdbauxiliarycolumns)\>

#### Defined in

[system/core/common/src/types/entities.ts:281](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L281)

___

### TUser

Ƭ **TUser**: [`TBasePageEntity`](#tbasepageentity) & { `address?`: `string` ; `avatar?`: `string` ; `bio?`: `string` ; `email`: `string` ; `fullName`: `string` ; `phone?`: `string` ; `role?`: [`TUserRole`](#tuserrole)  }

USER / AUTHOR

#### Defined in

[system/core/common/src/types/entities.ts:256](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L256)

___

### TUserFilter

Ƭ **TUserFilter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address?` | `string` |
| `email?` | `string` |
| `fullName?` | `string` |
| `phone?` | `string` |
| `role?` | [`TUserRole`](#tuserrole) |

#### Defined in

[system/core/common/src/types/entities.ts:283](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L283)

___

### TUserRole

Ƭ **TUserRole**: ``"administrator"`` \| ``"author"`` \| ``"customer"`` \| ``"guest"``

#### Defined in

[system/core/common/src/types/entities.ts:274](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L274)

## Variables

### GraphQLPaths

• `Const` **GraphQLPaths**: { [K in Exclude<TDBEntity, "Theme" \| "Plugin" \| "PostComment" \| "CMS"\>]: TGraphQLNode}

#### Defined in

[system/core/common/src/constants.ts:3](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L3)

___

### bundledModulesDirName

• `Const` **bundledModulesDirName**: ``"bundled-modules"``

#### Defined in

[system/core/common/src/constants.ts:116](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L116)

___

### genericPageName

• `Const` **genericPageName**: ``"pages/[slug]"``

#### Defined in

[system/core/common/src/constants.ts:108](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L108)

___

### moduleArchiveFileName

• `Const` **moduleArchiveFileName**: ``"module.zip"``

#### Defined in

[system/core/common/src/constants.ts:115](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L115)

___

### moduleBundleInfoFileName

• `Const` **moduleBundleInfoFileName**: ``"bundle.info.json"``

#### Defined in

[system/core/common/src/constants.ts:114](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L114)

___

### moduleChunksBuildDirChunk

• `Const` **moduleChunksBuildDirChunk**: ``"chunks"``

#### Defined in

[system/core/common/src/constants.ts:121](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L121)

___

### moduleExportsDirChunk

• `Const` **moduleExportsDirChunk**: ``"generated"``

#### Defined in

[system/core/common/src/constants.ts:120](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L120)

___

### moduleGeneratedFileName

• `Const` **moduleGeneratedFileName**: ``"generated.js"``

#### Defined in

[system/core/common/src/constants.ts:117](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L117)

___

### moduleLibBuildFileName

• `Const` **moduleLibBuildFileName**: ``"lib.bundle.js"``

#### Defined in

[system/core/common/src/constants.ts:111](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L111)

___

### moduleMainBuildFileName

• `Const` **moduleMainBuildFileName**: ``"main.bundle.js"``

#### Defined in

[system/core/common/src/constants.ts:110](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L110)

___

### moduleMetaInfoFileName

• `Const` **moduleMetaInfoFileName**: ``"meta.json"``

#### Defined in

[system/core/common/src/constants.ts:113](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L113)

___

### moduleNodeBuildFileName

• `Const` **moduleNodeBuildFileName**: ``"node.bundle.js"``

#### Defined in

[system/core/common/src/constants.ts:112](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L112)

___

### moduleNodeGeneratedFileName

• `Const` **moduleNodeGeneratedFileName**: ``"generated.node.js"``

#### Defined in

[system/core/common/src/constants.ts:119](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L119)

___

### moduleOneChunkGeneratedFileName

• `Const` **moduleOneChunkGeneratedFileName**: ``"generated.lib.js"``

#### Defined in

[system/core/common/src/constants.ts:118](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L118)

___

### serviceLocator

• `Const` **serviceLocator**: `Object`

Get base url of a CMS Service

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getAdminPanelUrl` | () => `undefined` \| `string` |
| `getApiWsUrl` | () => `undefined` \| `string` |
| `getFrontendUrl` | () => `undefined` \| `string` |
| `getMainApiUrl` | () => `undefined` \| `string` |

#### Defined in

[system/core/common/src/service-locator.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/service-locator.ts#L34)

___

### systemPackages

• `Const` **systemPackages**: readonly [``"@cromwell/core"``, ``"@cromwell/admin-panel"``, ``"@cromwell/cli"``, ``"@cromwell/core-backend"``, ``"@cromwell/core-frontend"``, ``"@cromwell/cms"``, ``"@cromwell/renderer"``, ``"@cromwell/server"``, ``"@cromwell/utils"``]

#### Defined in

[system/core/common/src/constants.ts:123](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L123)

## Functions

### findRedirect

▸ `Const` **findRedirect**(`pathname`, `search?`): `undefined` \| [`TCmsRedirectObject`](#tcmsredirectobject) & { `type`: ``"redirect"`` \| ``"rewrite"``  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathname` | `string` |
| `search?` | ``null`` \| `string` |

#### Returns

`undefined` \| [`TCmsRedirectObject`](#tcmsredirectobject) & { `type`: ``"redirect"`` \| ``"rewrite"``  }

#### Defined in

[system/core/common/src/redirects.ts:4](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/redirects.ts#L4)

___

### getBlockInstance

▸ `Const` **getBlockInstance**<`TContentBlock`\>(`blockId`): `undefined` \| [`TCromwellBlock`](#tcromwellblock)<`TContentBlock`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContentBlock` | `Component`<`Object`, `Object`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `string` |

#### Returns

`undefined` \| [`TCromwellBlock`](#tcromwellblock)<`TContentBlock`\>

#### Defined in

[system/core/common/src/global-store.ts:110](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L110)

___

### getCmsSettings

▸ `Const` **getCmsSettings**(): `undefined` \| [`TCmsSettings`](#tcmssettings)

#### Returns

`undefined` \| [`TCmsSettings`](#tcmssettings)

#### Defined in

[system/core/common/src/global-store.ts:71](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L71)

___

### getCommonComponent

▸ `Const` **getCommonComponent**(`componentName`): `undefined` \| `ComponentType`<[`TCommonComponentProps`](#tcommoncomponentprops) & `Record`<`string`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |

#### Returns

`undefined` \| `ComponentType`<[`TCommonComponentProps`](#tcommoncomponentprops) & `Record`<`string`, `any`\>\>

#### Defined in

[system/core/common/src/global-store.ts:95](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L95)

___

### getPageCustomConfig

▸ `Const` **getPageCustomConfig**(): `undefined` \| `Record`<`string`, `any`\>

#### Returns

`undefined` \| `Record`<`string`, `any`\>

#### Defined in

[system/core/common/src/global-store.ts:66](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L66)

___

### getRandStr

▸ `Const` **getRandStr**(`lenght?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `lenght` | `number` | `12` |

#### Returns

`string`

#### Defined in

[system/core/common/src/helpers.ts:6](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/helpers.ts#L6)

___

### getStore

▸ `Const` **getStore**(): [`TCromwellStore`](#tcromwellstore)

#### Returns

[`TCromwellStore`](#tcromwellstore)

#### Defined in

[system/core/common/src/global-store.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L20)

___

### getStoreItem

▸ `Const` **getStoreItem**<`K`\>(`itemName`): [`TCromwellStore`](#tcromwellstore)[`K`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TCromwellStore`](#tcromwellstore) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `K` |

#### Returns

[`TCromwellStore`](#tcromwellstore)[`K`]

#### Defined in

[system/core/common/src/global-store.ts:29](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L29)

___

### getThemeCustomConfig

▸ `Const` **getThemeCustomConfig**(): `undefined` \| `Record`<`string`, `any`\>

#### Returns

`undefined` \| `Record`<`string`, `any`\>

#### Defined in

[system/core/common/src/global-store.ts:76](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L76)

___

### getThemeCustomConfigProp

▸ `Const` **getThemeCustomConfigProp**(`propPath`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `propPath` | `string` |

#### Returns

`any`

#### Defined in

[system/core/common/src/global-store.ts:80](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L80)

___

### isServer

▸ `Const` **isServer**(): `boolean`

#### Returns

`boolean`

#### Defined in

[system/core/common/src/helpers.ts:4](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/helpers.ts#L4)

___

### onStoreChange

▸ `Const` **onStoreChange**<`K`\>(`itemName`, `callback`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TCromwellStore`](#tcromwellstore) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `K` |
| `callback` | (`itemValue`: [`TCromwellStore`](#tcromwellstore)[`K`]) => `any` |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:44](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L44)

___

### registerRedirect

▸ `Const` **registerRedirect**(`ruleName`, `redirect`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ruleName` | `string` |
| `redirect` | [`TCmsRedirect`](#tcmsredirect) |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:117](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L117)

___

### registerRewrite

▸ `Const` **registerRewrite**(`ruleName`, `rewrite`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ruleName` | `string` |
| `rewrite` | [`TCmsRedirect`](#tcmsredirect) |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:126](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L126)

___

### removeOnStoreChange

▸ `Const` **removeOnStoreChange**<`K`\>(`itemName`, `callback`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TCromwellStore`](#tcromwellstore) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `K` |
| `callback` | (`itemValue`: [`TCromwellStore`](#tcromwellstore)[`K`]) => `any` |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:58](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L58)

___

### resolvePageRoute

▸ `Const` **resolvePageRoute**(`pageName`, `routeOptions?`): `string`

Resolves page name to target page route

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pageName` | `string` | Can be: 1. TDefaultPageName (eg. `product`), 2. Resolved default page name (eg. `product/[slug]`), 3. Target page name (eg. `product/my-product`) |
| `routeOptions?` | `Object` | Options for resolving page route - `slug` - Page slug (URL) to resolve inputs in form of: `product/[slug]` |
| `routeOptions.id?` | `string` | - |
| `routeOptions.slug?` | `string` | - |

#### Returns

`string`

#### Defined in

[system/core/common/src/helpers.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/helpers.ts#L22)

___

### saveCommonComponent

▸ `Const` **saveCommonComponent**(`componentName`, `component`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |
| `component` | `ComponentType`<[`TCommonComponentProps`](#tcommoncomponentprops)\> |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:101](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L101)

___

### setStoreItem

▸ `Const` **setStoreItem**<`K`\>(`itemName`, `item`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TCromwellStore`](#tcromwellstore) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `K` |
| `item` | [`TCromwellStore`](#tcromwellstore)[`K`] |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L33)

___

### sleep

▸ `Const` **sleep**(`time`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `number` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[system/core/common/src/helpers.ts:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/helpers.ts#L10)
