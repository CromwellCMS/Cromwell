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

- [GraphQLPathsType](common.md#graphqlpathstype)
- [StaticPageContext](common.md#staticpagecontext)
- [TAdditionalExports](common.md#tadditionalexports)
- [TAttribute](common.md#tattribute)
- [TAttributeInput](common.md#tattributeinput)
- [TAttributeInstance](common.md#tattributeinstance)
- [TAttributeInstanceValue](common.md#tattributeinstancevalue)
- [TAttributeProductVariant](common.md#tattributeproductvariant)
- [TAttributeValue](common.md#tattributevalue)
- [TAuthRole](common.md#tauthrole)
- [TBasePageEntity](common.md#tbasepageentity)
- [TBasePageEntityInput](common.md#tbasepageentityinput)
- [TBlockContentProvider](common.md#tblockcontentprovider)
- [TCCSModuleInfo](common.md#tccsmoduleinfo)
- [TCCSModuleShortInfo](common.md#tccsmoduleshortinfo)
- [TCCSVersion](common.md#tccsversion)
- [TCMSTheme](common.md#tcmstheme)
- [TCmsAdminSettings](common.md#tcmsadminsettings)
- [TCmsConfig](common.md#tcmsconfig)
- [TCmsEntity](common.md#tcmsentity)
- [TCmsEntityCore](common.md#tcmsentitycore)
- [TCmsEntityInput](common.md#tcmsentityinput)
- [TCmsSettings](common.md#tcmssettings)
- [TCmsStats](common.md#tcmsstats)
- [TCmsStatus](common.md#tcmsstatus)
- [TCommonComponentProps](common.md#tcommoncomponentprops)
- [TContentComponentProps](common.md#tcontentcomponentprops)
- [TCreateUser](common.md#tcreateuser)
- [TCromwellBlock](common.md#tcromwellblock)
- [TCromwellBlockData](common.md#tcromwellblockdata)
- [TCromwellBlockProps](common.md#tcromwellblockprops)
- [TCromwellBlockType](common.md#tcromwellblocktype)
- [TCromwellNodeModules](common.md#tcromwellnodemodules)
- [TCromwellNotify](common.md#tcromwellnotify)
- [TCromwellPage](common.md#tcromwellpage)
- [TCromwellPageCoreProps](common.md#tcromwellpagecoreprops)
- [TCromwellStore](common.md#tcromwellstore)
- [TCromwellaConfig](common.md#tcromwellaconfig)
- [TCurrency](common.md#tcurrency)
- [TDBAuxiliaryColumns](common.md#tdbauxiliarycolumns)
- [TDBEntity](common.md#tdbentity)
- [TDBInfo](common.md#tdbinfo)
- [TDataComponentProps](common.md#tdatacomponentprops)
- [TDefaultPageName](common.md#tdefaultpagename)
- [TDeleteManyInput](common.md#tdeletemanyinput)
- [TExternal](common.md#texternal)
- [TFilteredProductList](common.md#tfilteredproductlist)
- [TFrontendBundle](common.md#tfrontendbundle)
- [TFrontendDependency](common.md#tfrontenddependency)
- [TFrontendPluginProps](common.md#tfrontendpluginprops)
- [TGallerySettings](common.md#tgallerysettings)
- [TGetStaticProps](common.md#tgetstaticprops)
- [TGraphQLNode](common.md#tgraphqlnode)
- [TImageSettings](common.md#timagesettings)
- [TModuleConfig](common.md#tmoduleconfig)
- [TNotification](common.md#tnotification)
- [TOrder](common.md#torder)
- [TOrderCore](common.md#tordercore)
- [TOrderFilter](common.md#torderfilter)
- [TOrderInput](common.md#torderinput)
- [TPackageCromwellConfig](common.md#tpackagecromwellconfig)
- [TPackageJson](common.md#tpackagejson)
- [TPageConfig](common.md#tpageconfig)
- [TPageInfo](common.md#tpageinfo)
- [TPageStats](common.md#tpagestats)
- [TPagedList](common.md#tpagedlist)
- [TPagedMeta](common.md#tpagedmeta)
- [TPagedParams](common.md#tpagedparams)
- [TPagesMetaInfo](common.md#tpagesmetainfo)
- [TPalette](common.md#tpalette)
- [TPaymentSession](common.md#tpaymentsession)
- [TPluginConfig](common.md#tpluginconfig)
- [TPluginEntity](common.md#tpluginentity)
- [TPluginEntityCore](common.md#tpluginentitycore)
- [TPluginEntityInput](common.md#tpluginentityinput)
- [TPluginInfo](common.md#tplugininfo)
- [TPluginSettingsProps](common.md#tpluginsettingsprops)
- [TPost](common.md#tpost)
- [TPostComment](common.md#tpostcomment)
- [TPostCommentCore](common.md#tpostcommentcore)
- [TPostCommentInput](common.md#tpostcommentinput)
- [TPostFilter](common.md#tpostfilter)
- [TPostInput](common.md#tpostinput)
- [TProduct](common.md#tproduct)
- [TProductCategory](common.md#tproductcategory)
- [TProductCategoryCore](common.md#tproductcategorycore)
- [TProductCategoryFilter](common.md#tproductcategoryfilter)
- [TProductCategoryInput](common.md#tproductcategoryinput)
- [TProductFilter](common.md#tproductfilter)
- [TProductFilterAttribute](common.md#tproductfilterattribute)
- [TProductFilterMeta](common.md#tproductfiltermeta)
- [TProductInput](common.md#tproductinput)
- [TProductRating](common.md#tproductrating)
- [TProductReview](common.md#tproductreview)
- [TProductReviewCore](common.md#tproductreviewcore)
- [TProductReviewFilter](common.md#tproductreviewfilter)
- [TProductReviewInput](common.md#tproductreviewinput)
- [TRollupConfig](common.md#trollupconfig)
- [TSalePerDay](common.md#tsaleperday)
- [TScriptMetaInfo](common.md#tscriptmetainfo)
- [TServiceVersions](common.md#tserviceversions)
- [TStoreListItem](common.md#tstorelistitem)
- [TTag](common.md#ttag)
- [TTagInput](common.md#ttaginput)
- [TThemeConfig](common.md#tthemeconfig)
- [TThemeEntity](common.md#tthemeentity)
- [TThemeEntityCore](common.md#tthemeentitycore)
- [TThemeEntityInput](common.md#tthemeentityinput)
- [TUpdateInfo](common.md#tupdateinfo)
- [TUpdateUser](common.md#tupdateuser)
- [TUser](common.md#tuser)
- [TUserFilter](common.md#tuserfilter)
- [TUserRole](common.md#tuserrole)

### Variables

- [GraphQLPaths](common.md#graphqlpaths)
- [genericPageName](common.md#genericpagename)
- [serviceLocator](common.md#servicelocator)

### Functions

- [getBlockInstance](common.md#getblockinstance)
- [getCmsSettings](common.md#getcmssettings)
- [getCommonComponent](common.md#getcommoncomponent)
- [getPageCustomConfig](common.md#getpagecustomconfig)
- [getRandStr](common.md#getrandstr)
- [getStore](common.md#getstore)
- [getStoreItem](common.md#getstoreitem)
- [getThemeCustomConfig](common.md#getthemecustomconfig)
- [getThemeCustomConfigProp](common.md#getthemecustomconfigprop)
- [isServer](common.md#isserver)
- [onStoreChange](common.md#onstorechange)
- [removeOnStoreChange](common.md#removeonstorechange)
- [resolvePageRoute](common.md#resolvepageroute)
- [saveCommonComponent](common.md#savecommoncomponent)
- [setStoreItem](common.md#setstoreitem)
- [sleep](common.md#sleep)

## Type aliases

### GraphQLPathsType

Ƭ **GraphQLPathsType**: { [K in TDBEntity]: TGraphQLNode}

#### Defined in

[system/core/common/src/types/data.ts:112](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L112)

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

[system/core/common/src/types/blocks.ts:8](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L8)

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

[system/core/common/src/types/data.ts:380](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L380)

___

### TAttribute

Ƭ **TAttribute**: [`TBasePageEntity`](common.md#tbasepageentity) & { `icon?`: `string` ; `key`: `string` ; `required?`: `boolean` ; `type`: ``"radio"`` \| ``"checkbox"`` ; `values`: [`TAttributeValue`](common.md#tattributevalue)[]  }

Attribute

#### Defined in

[system/core/common/src/types/entities.ts:295](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L295)

___

### TAttributeInput

Ƭ **TAttributeInput**: `Omit`<[`TAttribute`](common.md#tattribute), [`TDBAuxiliaryColumns`](common.md#tdbauxiliarycolumns)\>

#### Defined in

[system/core/common/src/types/entities.ts:303](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L303)

___

### TAttributeInstance

Ƭ **TAttributeInstance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `values` | [`TAttributeInstanceValue`](common.md#tattributeinstancevalue)[] |

#### Defined in

[system/core/common/src/types/entities.ts:310](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L310)

___

### TAttributeInstanceValue

Ƭ **TAttributeInstanceValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `productVariant?` | [`TAttributeProductVariant`](common.md#tattributeproductvariant) |
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

Ƭ **TAuthRole**: [`TUserRole`](common.md#tuserrole) \| ``"self"`` \| ``"all"``

#### Defined in

[system/core/common/src/types/entities.ts:275](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L275)

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

Ƭ **TBasePageEntityInput**: `Omit`<[`TBasePageEntity`](common.md#tbasepageentity), [`TDBAuxiliaryColumns`](common.md#tdbauxiliarycolumns)\>

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
| `getter` | (`block`: [`TCromwellBlock`](common.md#tcromwellblock)<`Component`<`Object`, `Object`, `any`\>\>) => `ReactNode` | - |

#### Defined in

[system/core/common/src/types/blocks.ts:240](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L240)

___

### TCCSModuleInfo

Ƭ **TCCSModuleInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `author` | `string` |
| `authorLink` | `string` |
| `betaPackageVersion` | `string` |
| `betaVersion` | `string` |
| `createdAt` | `Date` |
| `description?` | `string` |
| `excerpt?` | `string` |
| `icon?` | `string` |
| `image?` | `string` |
| `images?` | `string`[] |
| `name` | `string` |
| `packageName` | `string` |
| `packageVersion` | `string` |
| `slug?` | `string` |
| `tags?` | `string`[] |
| `title?` | `string` |
| `updatedAt` | `Date` |
| `version` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:470](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L470)

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

[system/core/common/src/types/data.ts:463](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L463)

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
| `restartServices` | keyof [`TServiceVersions`](common.md#tserviceversions)[] |
| `version` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:450](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L450)

___

### TCMSTheme

Ƭ **TCMSTheme**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mode?` | ``"default"`` \| ``"dark"`` |
| `palette?` | [`TPalette`](common.md#tpalette) |

#### Defined in

[system/core/common/src/types/data.ts:505](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L505)

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

[system/core/common/src/types/entities.ts:539](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L539)

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
| `cookieSecret?` | `string` |
| `defaultSettings?` | [`TCmsEntityCore`](common.md#tcmsentitycore) |
| `domain?` | `string` |
| `env?` | ``"dev"`` \| ``"prod"`` |
| `frontendPort?` | `number` |
| `managerPort?` | `number` |
| `orm?` | `ConnectionOptions` |
| `pm?` | ``"yarn"`` \| ``"cromwella"`` |
| `refreshTokenExpirationTime?` | `number` |
| `refreshTokenSecret?` | `string` |
| `serviceSecret?` | `string` |
| `useWatch?` | `boolean` |
| `watchPoll?` | `number` |

#### Defined in

[system/core/common/src/types/data.ts:148](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L148)

___

### TCmsEntity

Ƭ **TCmsEntity**: [`TCmsEntityCore`](common.md#tcmsentitycore) & [`TBasePageEntity`](common.md#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:570](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L570)

___

### TCmsEntityCore

Ƭ **TCmsEntityCore**: `Object`

DB CMS entity

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `adminSettings?` | [`TCmsAdminSettings`](common.md#tcmsadminsettings) | Admin config |
| `beta?` | `boolean` | Internal. Recieve unstable beta-updates |
| `currencies?` | [`TCurrency`](common.md#tcurrency)[] | Available currencies in the store and rates between them to convert |
| `defaultPageSize?` | `number` | Page size to use in lists, eg. at Product Category page |
| `defaultShippingPrice?` | `number` | Standard shipping price if no shipment methods specified |
| `favicon?` | `string` | Website favicon |
| `footerHtml?` | `string` | - |
| `headHtml?` | `string` | Custom HTML code injection |
| `installed?` | `boolean` | Internal. If false or not set, will launch installation at first Admin Panel visit. |
| `isUpdating?` | `boolean` | Internal. Is currently under update |
| `language?` | `string` | Default language |
| `logo?` | `string` | Website logo |
| `themeName?` | `string` | Package name of currently used theme |
| `timezone?` | `number` | Default timezone in GMT, number +- |
| `version?` | `string` | Internal. CMS version, used for updates |
| `versions?` | [`TServiceVersions`](common.md#tserviceversions) \| `string` | Internal. https://github.com/CromwellCMS/Cromwell/blob/55046c48d9da0a44e4b11e7918c73876fcd1cfc1/system/manager/src/managers/baseManager.ts#L194:L206 |

#### Defined in

[system/core/common/src/types/entities.ts:466](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L466)

___

### TCmsEntityInput

Ƭ **TCmsEntityInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `adminSettings?` | [`TCmsAdminSettings`](common.md#tcmsadminsettings) |
| `currencies?` | [`TCurrency`](common.md#tcurrency)[] |
| `defaultPageSize?` | `number` |
| `defaultShippingPrice?` | `number` |
| `favicon?` | `string` |
| `footerHtml?` | `string` |
| `headHtml?` | `string` |
| `language?` | `string` |
| `logo?` | `string` |
| `timezone?` | `number` |

#### Defined in

[system/core/common/src/types/entities.ts:550](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L550)

___

### TCmsSettings

Ƭ **TCmsSettings**: [`TCmsConfig`](common.md#tcmsconfig) & [`TCmsEntityCore`](common.md#tcmsentitycore)

Merged info form cmsconfig.json and settings from DB

#### Defined in

[system/core/common/src/types/data.ts:172](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L172)

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
| `salesPerDay` | [`TSalePerDay`](common.md#tsaleperday)[] |
| `salesValue` | `number` |
| `topPageViews` | [`TPageStats`](common.md#tpagestats)[] |

#### Defined in

[system/core/common/src/types/data.ts:393](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L393)

___

### TCmsStatus

Ƭ **TCmsStatus**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `currentVersion?` | `string` |
| `isUpdating?` | `boolean` |
| `notifications?` | [`TNotification`](common.md#tnotification)[] |
| `updateAvailable` | `boolean` |
| `updateInfo?` | [`TUpdateInfo`](common.md#tupdateinfo) |

#### Defined in

[system/core/common/src/types/data.ts:418](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L418)

___

### TCommonComponentProps

Ƭ **TCommonComponentProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | [`TProduct`](common.md#tproduct) \| [`TPost`](common.md#tpost) \| `any` |

#### Defined in

[system/core/common/src/types/blocks.ts:84](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L84)

___

### TContentComponentProps

Ƭ **TContentComponentProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `React.ReactNode` |
| `config?` | [`TCromwellBlockData`](common.md#tcromwellblockdata) |
| `id` | `string` |

#### Defined in

[system/core/common/src/types/blocks.ts:78](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L78)

___

### TCreateUser

Ƭ **TCreateUser**: `Omit`<[`TUser`](common.md#tuser), [`TDBAuxiliaryColumns`](common.md#tdbauxiliarycolumns)\> & { `password?`: `string`  }

#### Defined in

[system/core/common/src/types/entities.ts:277](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L277)

___

### TCromwellBlock

Ƭ **TCromwellBlock**<`TContentBlock`\>: `React.Component`<[`TCromwellBlockProps`](common.md#tcromwellblockprops)<`TContentBlock`\>\> & { `addDidUpdateListener`: (`id`: `string`, `func`: () => `void`) => `void` ; `consumerRender`: (`jsxParentId?`: `string`) => ``null`` \| `Element` ; `contentRender`: (`getContent?`: ``null`` \| (`block`: [`TCromwellBlock`](common.md#tcromwellblock)<`Component`<`Object`, `Object`, `any`\>\>) => `ReactNode`) => `ReactNode` ; `getBlockRef`: () => `RefObject`<`HTMLDivElement`\> ; `getContentInstance`: () => `undefined` \| `Component`<`Object`, `Object`, `any`\> & `TContentBlock` ; `getData`: () => `undefined` \| [`TCromwellBlockData`](common.md#tcromwellblockdata) ; `getDefaultContent`: () => `ReactNode` ; `movedCompForceUpdate?`: () => `void` ; `notifyChildRegistered`: (`childInst`: [`TCromwellBlock`](common.md#tcromwellblock)<`any`\>) => `void` ; `rerender`: () => `void` \| `Promise`<`void`\> ; `setContentInstance`: (`contentInstance`: `Component`<`Object`, `Object`, `any`\> & `TContentBlock`) => `void`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContentBlock` | `React.Component` |

#### Defined in

[system/core/common/src/types/blocks.ts:37](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L37)

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
| `gallery?` | [`TGallerySettings`](common.md#tgallerysettings) | For gallery block |
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
| `type?` | [`TCromwellBlockType`](common.md#tcromwellblocktype) | Component's type |

#### Defined in

[system/core/common/src/types/blocks.ts:93](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L93)

___

### TCromwellBlockProps

Ƭ **TCromwellBlockProps**<`TContentBlock`\>: { `className?`: `string` ; `id`: `string` ; `jsxParentId?`: `string` ; `type?`: [`TCromwellBlockType`](common.md#tcromwellblocktype) ; `blockRef?`: (`block`: [`TCromwellBlock`](common.md#tcromwellblock)<`TContentBlock`\>) => `void` ; `content?`: (`data`: `undefined` \| [`TCromwellBlockData`](common.md#tcromwellblockdata), `blockRef`: `RefObject`<`HTMLDivElement`\>, `setContentInstance`: (`contentInstance`: `Component`<`Object`, `Object`, `any`\> & `TContentBlock`) => `void`) => `ReactNode` ; `onClick?`: (`event`: `MouseEvent`<`HTMLDivElement`, `MouseEvent`\>) => `any`  } & [`TCromwellBlockData`](common.md#tcromwellblockdata)

Basic props for Blocks. Used in JSX by Theme authors

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContentBlock` | `React.Component` |

#### Defined in

[system/core/common/src/types/blocks.ts:59](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L59)

___

### TCromwellBlockType

Ƭ **TCromwellBlockType**: ``"container"`` \| ``"plugin"`` \| ``"text"`` \| ``"HTML"`` \| ``"image"`` \| ``"gallery"`` \| ``"list"`` \| ``"link"``

#### Defined in

[system/core/common/src/types/blocks.ts:88](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L88)

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
| `importScriptExternals?` | (`metaInfo`: [`TScriptMetaInfo`](common.md#tscriptmetainfo)) => `Promise`<`boolean`\> |
| `setPrefix?` | (`prefix`: `string`) => `void` |

#### Defined in

[system/core/common/src/types/data.ts:267](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L267)

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

[system/core/common/src/types/data.ts:314](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L314)

___

### TCromwellPage

Ƭ **TCromwellPage**<`Props`\>: `NextPage`<`Props` & [`TCromwellPageCoreProps`](common.md#tcromwellpagecoreprops)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | `any` \| `undefined` |

#### Defined in

[system/core/common/src/types/blocks.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L18)

___

### TCromwellPageCoreProps

Ƭ **TCromwellPageCoreProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `childStaticProps?` | `Record`<`string`, `any`\> \| ``null`` |
| `cmsSettings?` | [`TCmsSettings`](common.md#tcmssettings) \| ``null`` |
| `defaultPages?` | `Record`<[`TDefaultPageName`](common.md#tdefaultpagename), `string`\> |
| `pageConfig?` | [`TPageConfig`](common.md#tpageconfig) \| ``null`` |
| `pageConfigName?` | `string` |
| `pagesInfo?` | [`TPageInfo`](common.md#tpageinfo)[] \| ``null`` |
| `palette?` | [`TPalette`](common.md#tpalette) \| ``null`` |
| `plugins?` | `Record`<`string`, `Object`\> |
| `themeCustomConfig?` | `Record`<`string`, `any`\> \| ``null`` |
| `themeFooterHtml?` | `string` \| ``null`` |
| `themeHeadHtml?` | `string` \| ``null`` |

#### Defined in

[system/core/common/src/types/blocks.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L20)

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
| `blockInstances?` | `Record`<`string`, [`TCromwellBlock`](common.md#tcromwellblock) \| `undefined`\> | Internal. References to all instances of Cromwell Blocks at the page { [CromwellBlockId]: Instance} |
| `cmsSettings?` | [`TCmsSettings`](common.md#tcmssettings) | Public CMS Settings |
| `components?` | `Record`<`string`, `React.ComponentType`<[`TCommonComponentProps`](common.md#tcommoncomponentprops) & { [x: string]: `any`;  }\>\> | Internal. Common component storage. E.g. product cards to be reused by Plugins  { [ComponentName]: (Class/function) } |
| `cstore?` | `any` | - |
| `currency?` | `string` | Active currency |
| `dbInfo?` | [`TDBInfo`](common.md#tdbinfo) | Info about current DB for backend usage |
| `defaultPages?` | `Record`<[`TDefaultPageName`](common.md#tdefaultpagename), `string`\> | See `defaultPages` in TThemeConfig |
| `environment?` | `Object` | - |
| `environment.isAdminPanel?` | `boolean` | - |
| `environment.mode?` | ``"dev"`` \| ``"prod"`` | - |
| `nodeModules?` | [`TCromwellNodeModules`](common.md#tcromwellnodemodules) | - |
| `notifier?` | [`TCromwellNotify`](common.md#tcromwellnotify) | - |
| `pageConfig?` | [`TPageConfig`](common.md#tpageconfig) | Config of currently opened Theme's page |
| `pagesInfo?` | [`TPageInfo`](common.md#tpageinfo)[] | Short pages info of current Theme |
| `plugins?` | `Record`<`string`, `Object`\> | Internal. Plugins data |
| `storeChangeCallbacks?` | `Record`<`string`, (`prop`: `any`) => `any`[]\> | - |
| `theme?` | [`TCMSTheme`](common.md#tcmstheme) | - |
| `themeCustomConfig?` | `Record`<`string`, `any`\> | - |
| `userInfo?` | [`TUser`](common.md#tuser) | - |
| `webSocketClient?` | `any` | - |
| `forceUpdatePage?` | () => `void` | - |
| `fsRequire?` | (`path`: `string`) => `Promise`<`any`\> | - |

#### Defined in

[system/core/common/src/types/data.ts:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L10)

___

### TCromwellaConfig

Ƭ **TCromwellaConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `frontendDependencies?` | (`string` \| [`TFrontendDependency`](common.md#tfrontenddependency))[] |
| `packages` | `string`[] |

#### Defined in

[system/core/common/src/types/data.ts:358](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L358)

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

[system/core/common/src/types/entities.ts:573](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L573)

___

### TDBAuxiliaryColumns

Ƭ **TDBAuxiliaryColumns**: ``"id"`` \| ``"createDate"`` \| ``"updateDate"``

#### Defined in

[system/core/common/src/types/entities.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L34)

___

### TDBEntity

Ƭ **TDBEntity**: keyof { `Attribute`: `any` ; `CMS`: `any` ; `Generic`: `any` ; `Order`: `any` ; `Plugin`: `any` ; `Post`: `any` ; `PostComment`: `any` ; `Product`: `any` ; `ProductCategory`: `any` ; `ProductReview`: `any` ; `Tag`: `any` ; `Theme`: `any` ; `User`: `any`  }

#### Defined in

[system/core/common/src/types/data.ts:96](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L96)

___

### TDBInfo

Ƭ **TDBInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dbType?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:510](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L510)

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

[system/core/common/src/types/blocks.ts:51](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L51)

___

### TDefaultPageName

Ƭ **TDefaultPageName**: ``"index"`` \| ``"category"`` \| ``"product"`` \| ``"post"`` \| ``"tag"`` \| ``"pages"`` \| ``"account"`` \| ``"checkout"`` \| ``"blog"``

#### Defined in

[system/core/common/src/types/data.ts:209](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L209)

___

### TDeleteManyInput

Ƭ **TDeleteManyInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `all?` | `boolean` |
| `ids` | `string`[] |

#### Defined in

[system/core/common/src/types/entities.ts:583](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L583)

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

[system/core/common/src/types/data.ts:374](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L374)

___

### TFilteredProductList

Ƭ **TFilteredProductList**: [`TPagedList`](common.md#tpagedlist)<[`TProduct`](common.md#tproduct)\> & { `filterMeta`: [`TProductFilterMeta`](common.md#tproductfiltermeta)  }

#### Defined in

[system/core/common/src/types/entities.ts:168](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L168)

___

### TFrontendBundle

Ƭ **TFrontendBundle**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cjsPath?` | `string` |
| `meta?` | [`TScriptMetaInfo`](common.md#tscriptmetainfo) |
| `source?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:301](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L301)

___

### TFrontendDependency

Ƭ **TFrontendDependency**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addExports?` | [`TAdditionalExports`](common.md#tadditionalexports)[] |
| `builtins?` | `string`[] |
| `bundledCss?` | `string`[] |
| `excludeExports?` | `string`[] |
| `externals?` | [`TExternal`](common.md#texternal)[] |
| `ignore?` | `string`[] |
| `name` | `string` |
| `version?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:363](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L363)

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

[system/core/common/src/types/data.ts:499](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L499)

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
| `images?` | [`TImageSettings`](common.md#timagesettings)[] | - |
| `interval?` | `number` | - |
| `lazy?` | `boolean` | - |
| `loop?` | `boolean` | - |
| `navigation?` | { `showOnHover?`: `boolean`  } \| `boolean` | - |
| `orientation?` | ``"horizontal"`` \| ``"vertical"`` | - |
| `pagination?` | `boolean` | - |
| `ratio?` | `number` | ratio = width / height |
| `responsive?` | `Record`<`number`, [`TGallerySettings`](common.md#tgallerysettings)\> | - |
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

[system/core/common/src/types/blocks.ts:196](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L196)

___

### TGetStaticProps

Ƭ **TGetStaticProps**<`TPluginSettings`, `Q`\>: (`ctx`: [`StaticPageContext`](common.md#staticpagecontext)<`TPluginSettings`, `Q`\>) => `Promise`<`any`\>

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
| `ctx` | [`StaticPageContext`](common.md#staticpagecontext)<`TPluginSettings`, `Q`\> |

##### Returns

`Promise`<`any`\>

#### Defined in

[system/core/common/src/types/blocks.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L14)

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

[system/core/common/src/types/data.ts:114](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L114)

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

[system/core/common/src/types/blocks.ts:188](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L188)

___

### TModuleConfig

Ƭ **TModuleConfig**: [`TThemeConfig`](common.md#tthemeconfig) & [`TPluginConfig`](common.md#tpluginconfig)

#### Defined in

[system/core/common/src/types/data.ts:262](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L262)

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

[system/core/common/src/types/data.ts:438](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L438)

___

### TOrder

Ƭ **TOrder**: [`TOrderCore`](common.md#tordercore) & [`TBasePageEntity`](common.md#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:381](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L381)

___

### TOrderCore

Ƭ **TOrderCore**: `Object`

Store order

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cart?` | `string` \| [`TStoreListItem`](common.md#tstorelistitem)[] |
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

Ƭ **TOrderInput**: [`TOrderCore`](common.md#tordercore) & [`TBasePageEntityInput`](common.md#tbasepageentityinput)

#### Defined in

[system/core/common/src/types/entities.ts:383](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L383)

___

### TPackageCromwellConfig

Ƭ **TPackageCromwellConfig**: `Object`

Module info in package.json under "cromwell" property

#### Type declaration

| Name | Type |
| :------ | :------ |
| `author?` | `string` |
| `authorLink?` | `string` |
| `bundledDependencies?` | `string`[] |
| `description?` | `string` |
| `excerpt?` | `string` |
| `firstLoadedDependencies?` | `string`[] |
| `frontendDependencies?` | (`string` \| [`TFrontendDependency`](common.md#tfrontenddependency))[] |
| `icon?` | `string` |
| `image?` | `string` |
| `images?` | `string`[] |
| `name?` | `string` |
| `packageName?` | `string` |
| `plugins?` | `string`[] |
| `tags?` | `string`[] |
| `themes?` | `string`[] |
| `title?` | `string` |
| `type?` | ``"plugin"`` \| ``"theme"`` |
| `version?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:337](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L337)

___

### TPackageJson

Ƭ **TPackageJson**: `Object`

package.json definition with cromwell info

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cromwell?` | [`TPackageCromwellConfig`](common.md#tpackagecromwellconfig) |
| `dependencies?` | `Record`<`string`, `string`\> |
| `devDependencies?` | `Record`<`string`, `string`\> |
| `module?` | `string` |
| `name?` | `string` |
| `peerDependencies?` | `Record`<`string`, `string`\> |
| `version?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:324](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L324)

___

### TPageConfig

Ƭ **TPageConfig**: [`TPageInfo`](common.md#tpageinfo) & { `adminPanelProps?`: `any` ; `footerHtml?`: `string` ; `headHtml?`: `string` ; `modifications`: [`TCromwellBlockData`](common.md#tcromwellblockdata)[] ; `pageCustomConfig?`: `Record`<`string`, `any`\>  }

#### Defined in

[system/core/common/src/types/data.ts:239](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L239)

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

[system/core/common/src/types/data.ts:216](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L216)

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

[system/core/common/src/types/data.ts:405](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L405)

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
| `pagedMeta?` | [`TPagedMeta`](common.md#tpagedmeta) |

#### Defined in

[system/core/common/src/types/data.ts:126](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L126)

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

[system/core/common/src/types/data.ts:138](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L138)

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

[system/core/common/src/types/data.ts:131](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L131)

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

[system/core/common/src/types/data.ts:287](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L287)

___

### TPalette

Ƭ **TPalette**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `primaryColor?` | `string` |
| `secondaryColor?` | `string` |

#### Defined in

[system/core/common/src/types/data.ts:211](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L211)

___

### TPaymentSession

Ƭ **TPaymentSession**: [`TOrderCore`](common.md#tordercore) & { `cancelUrl?`: `string` ; `paymentOptions?`: { `link?`: `string` ; `name?`: `string`  }[] ; `successUrl?`: `string`  }

#### Defined in

[system/core/common/src/types/entities.ts:395](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L395)

___

### TPluginConfig

Ƭ **TPluginConfig**: `Object`

Plugin module config, part of cromwell.config.js

#### Type declaration

| Name | Type |
| :------ | :------ |
| `adminInputFile?` | `string` |
| `backend?` | `string` |
| `defaultSettings?` | `any` |
| `frontendInputFile?` | `string` |
| `frontendModule?` | `string` |
| `rollupConfig?` | () => [`TRollupConfig`](common.md#trollupconfig) \| `Promise`<[`TRollupConfig`](common.md#trollupconfig)\> |

#### Defined in

[system/core/common/src/types/data.ts:252](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L252)

___

### TPluginEntity

Ƭ **TPluginEntity**: [`TPluginEntityCore`](common.md#tpluginentitycore) & [`TBasePageEntity`](common.md#tbasepageentity)

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

Ƭ **TPluginEntityInput**: [`TPluginEntityCore`](common.md#tpluginentitycore) & [`TBasePageEntityInput`](common.md#tbasepageentityinput)

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

[system/core/common/src/types/data.ts:307](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L307)

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
| `pluginInfo?` | [`TPackageCromwellConfig`](common.md#tpackagecromwellconfig) |
| `pluginName` | `string` |
| `pluginSettings?` | `TSettings` |

#### Defined in

[system/core/common/src/types/data.ts:493](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L493)

___

### TPost

Ƭ **TPost**: { `author?`: [`TUser`](common.md#tuser) ; `content?`: `string` \| ``null`` ; `delta?`: `string` \| ``null`` ; `excerpt?`: `string` \| ``null`` ; `featured?`: `boolean` \| ``null`` ; `mainImage?`: `string` \| ``null`` ; `publishDate?`: `Date` \| ``null`` ; `published?`: `boolean` \| ``null`` ; `readTime?`: `string` \| ``null`` ; `tags?`: [`TTag`](common.md#ttag)[] \| ``null`` ; `title?`: `string` \| ``null``  } & [`TBasePageEntity`](common.md#tbasepageentity)

POST

#### Defined in

[system/core/common/src/types/entities.ts:181](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L181)

___

### TPostComment

Ƭ **TPostComment**: [`TPostCommentCore`](common.md#tpostcommentcore) & [`TBasePageEntity`](common.md#tbasepageentity)

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

Ƭ **TPostCommentInput**: [`TPostCommentCore`](common.md#tpostcommentcore) & [`TBasePageEntityInput`](common.md#tbasepageentityinput)

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

Ƭ **TPostInput**: `Omit`<[`TPost`](common.md#tpost), [`TDBAuxiliaryColumns`](common.md#tdbauxiliarycolumns) \| ``"author"`` \| ``"tags"``\> & { `authorId`: `string` ; `tagIds?`: `string`[] \| ``null``  }

#### Defined in

[system/core/common/src/types/entities.ts:229](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L229)

___

### TProduct

Ƭ **TProduct**: [`TBasePageEntity`](common.md#tbasepageentity) & { `attributes?`: [`TAttributeInstance`](common.md#tattributeinstance)[] ; `categories?`: [`TProductCategory`](common.md#tproductcategory)[] ; `description?`: `string` ; `descriptionDelta?`: `string` ; `images?`: `string`[] ; `mainImage?`: `string` ; `name?`: `string` ; `oldPrice?`: `number` ; `price?`: `number` ; `rating?`: [`TProductRating`](common.md#tproductrating) ; `reviews?`: [`TProductReview`](common.md#tproductreview)[] ; `sku?`: `string` ; `views?`: `number`  }

PRODUCT

#### Defined in

[system/core/common/src/types/entities.ts:87](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L87)

___

### TProductCategory

Ƭ **TProductCategory**: [`TProductCategoryCore`](common.md#tproductcategorycore) & [`TBasePageEntity`](common.md#tbasepageentity)

#### Defined in

[system/core/common/src/types/entities.ts:73](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L73)

___

### TProductCategoryCore

Ƭ **TProductCategoryCore**: `Object`

ProductCategory

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `children?` | [`TProductCategory`](common.md#tproductcategory)[] | DB children |
| `description?` | `string` | Description (HTML allowed) |
| `descriptionDelta?` | `string` | Description in Quill format |
| `mainImage?` | `string` | Href of main image |
| `name` | `string` | Name of the category (h1) |
| `parent?` | [`TProductCategory`](common.md#tproductcategory) \| ``null`` | DB parent |
| `products?` | [`TPagedList`](common.md#tpagedlist)<[`TProduct`](common.md#tproduct)\> | Products in category |

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

Ƭ **TProductCategoryInput**: [`TBasePageEntityInput`](common.md#tbasepageentityinput) & `Omit`<[`TProductCategoryCore`](common.md#tproductcategorycore), ``"children"`` \| ``"parent"`` \| ``"products"``\> & { `parentId?`: `string`  }

#### Defined in

[system/core/common/src/types/entities.ts:75](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L75)

___

### TProductFilter

Ƭ **TProductFilter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attributes?` | [`TProductFilterAttribute`](common.md#tproductfilterattribute)[] |
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

Ƭ **TProductInput**: `Omit`<[`TProduct`](common.md#tproduct), [`TDBAuxiliaryColumns`](common.md#tdbauxiliarycolumns) \| ``"categories"`` \| ``"rating"`` \| ``"reviews"``\> & { `categoryIds?`: `string`[]  }

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

Ƭ **TProductReview**: [`TProductReviewCore`](common.md#tproductreviewcore) & [`TBasePageEntity`](common.md#tbasepageentity)

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

Ƭ **TProductReviewInput**: [`TProductReviewCore`](common.md#tproductreviewcore) & [`TBasePageEntityInput`](common.md#tbasepageentityinput)

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

[system/core/common/src/types/data.ts:174](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L174)

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

[system/core/common/src/types/data.ts:412](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L412)

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

[system/core/common/src/types/data.ts:280](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L280)

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

[system/core/common/src/types/entities.ts:563](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L563)

___

### TStoreListItem

Ƭ **TStoreListItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount?` | `number` |
| `pickedAttributes?` | `Record`<`string`, `string`[]\> |
| `product?` | [`TProduct`](common.md#tproduct) |

#### Defined in

[system/core/common/src/types/data.ts:387](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L387)

___

### TTag

Ƭ **TTag**: [`TBasePageEntity`](common.md#tbasepageentity) & { `color?`: `string` \| ``null`` ; `description?`: `string` \| ``null`` ; `descriptionDelta?`: `string` \| ``null`` ; `image?`: `string` \| ``null`` ; `name`: `string`  }

#### Defined in

[system/core/common/src/types/entities.ts:242](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L242)

___

### TTagInput

Ƭ **TTagInput**: `Omit`<[`TTag`](common.md#ttag), [`TDBAuxiliaryColumns`](common.md#tdbauxiliarycolumns)\>

#### Defined in

[system/core/common/src/types/entities.ts:250](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L250)

___

### TThemeConfig

Ƭ **TThemeConfig**: `Object`

Theme module config, part of cromwell.config.js

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `defaultPages?` | `Record`<[`TDefaultPageName`](common.md#tdefaultpagename), `string`\> | Mapping of default CMS pages to theme's components. Such as { category: "category/[slug]" } |
| `footerHtml?` | `string` | Custom HTML to add to the end of every page |
| `globalCss?` | `string`[] | Global CSS files to import from node_modules |
| `globalModifications?` | [`TCromwellBlockData`](common.md#tcromwellblockdata)[] | Modifications to apply on all pages |
| `headHtml?` | `string` | Custom HTML to add into head of every page |
| `pages?` | [`TPageConfig`](common.md#tpageconfig)[] | Pages' description and modifications |
| `palette?` | [`TPalette`](common.md#tpalette) | Colors to use |
| `themeCustomConfig?` | `Record`<`string`, `any`\> | Custom config that will be available at every page in the Store inside pageConfig props |
| `nextConfig?` | () => `any` | - |
| `rollupConfig?` | () => [`TRollupConfig`](common.md#trollupconfig) \| `Promise`<[`TRollupConfig`](common.md#trollupconfig)\> | - |

#### Defined in

[system/core/common/src/types/data.ts:186](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L186)

___

### TThemeEntity

Ƭ **TThemeEntity**: [`TThemeEntityCore`](common.md#tthemeentitycore) & [`TBasePageEntity`](common.md#tbasepageentity)

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

Ƭ **TThemeEntityInput**: [`TThemeEntityCore`](common.md#tthemeentitycore) & [`TBasePageEntityInput`](common.md#tbasepageentityinput)

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

[system/core/common/src/types/data.ts:426](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/data.ts#L426)

___

### TUpdateUser

Ƭ **TUpdateUser**: `Omit`<[`TUser`](common.md#tuser), [`TDBAuxiliaryColumns`](common.md#tdbauxiliarycolumns)\>

#### Defined in

[system/core/common/src/types/entities.ts:281](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/entities.ts#L281)

___

### TUser

Ƭ **TUser**: [`TBasePageEntity`](common.md#tbasepageentity) & { `address?`: `string` ; `avatar?`: `string` ; `bio?`: `string` ; `email`: `string` ; `fullName`: `string` ; `phone?`: `string` ; `role?`: [`TUserRole`](common.md#tuserrole)  }

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
| `role?` | [`TUserRole`](common.md#tuserrole) |

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

### genericPageName

• `Const` **genericPageName**: ``"pages/[slug]"``

#### Defined in

[system/core/common/src/constants.ts:108](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/constants.ts#L108)

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

## Functions

### getBlockInstance

▸ `Const` **getBlockInstance**<`TContentBlock`\>(`blockId`): `undefined` \| [`TCromwellBlock`](common.md#tcromwellblock)<`TContentBlock`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContentBlock` | `Component`<`Object`, `Object`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `string` |

#### Returns

`undefined` \| [`TCromwellBlock`](common.md#tcromwellblock)<`TContentBlock`\>

#### Defined in

[system/core/common/src/global-store.ts:109](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L109)

___

### getCmsSettings

▸ `Const` **getCmsSettings**(): `undefined` \| [`TCmsSettings`](common.md#tcmssettings)

#### Returns

`undefined` \| [`TCmsSettings`](common.md#tcmssettings)

#### Defined in

[system/core/common/src/global-store.ts:70](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L70)

___

### getCommonComponent

▸ `Const` **getCommonComponent**(`componentName`): `undefined` \| `ComponentType`<[`TCommonComponentProps`](common.md#tcommoncomponentprops) & `Record`<`string`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |

#### Returns

`undefined` \| `ComponentType`<[`TCommonComponentProps`](common.md#tcommoncomponentprops) & `Record`<`string`, `any`\>\>

#### Defined in

[system/core/common/src/global-store.ts:94](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L94)

___

### getPageCustomConfig

▸ `Const` **getPageCustomConfig**(): `undefined` \| `Record`<`string`, `any`\>

#### Returns

`undefined` \| `Record`<`string`, `any`\>

#### Defined in

[system/core/common/src/global-store.ts:65](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L65)

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

▸ `Const` **getStore**(): [`TCromwellStore`](common.md#tcromwellstore)

#### Returns

[`TCromwellStore`](common.md#tcromwellstore)

#### Defined in

[system/core/common/src/global-store.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L19)

___

### getStoreItem

▸ `Const` **getStoreItem**<`K`\>(`itemName`): [`TCromwellStore`](common.md#tcromwellstore)[`K`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TCromwellStore`](common.md#tcromwellstore) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `K` |

#### Returns

[`TCromwellStore`](common.md#tcromwellstore)[`K`]

#### Defined in

[system/core/common/src/global-store.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L28)

___

### getThemeCustomConfig

▸ `Const` **getThemeCustomConfig**(): `undefined` \| `Record`<`string`, `any`\>

#### Returns

`undefined` \| `Record`<`string`, `any`\>

#### Defined in

[system/core/common/src/global-store.ts:75](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L75)

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

[system/core/common/src/global-store.ts:79](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L79)

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
| `K` | extends keyof [`TCromwellStore`](common.md#tcromwellstore) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `K` |
| `callback` | (`itemValue`: [`TCromwellStore`](common.md#tcromwellstore)[`K`]) => `any` |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:43](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L43)

___

### removeOnStoreChange

▸ `Const` **removeOnStoreChange**<`K`\>(`itemName`, `callback`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TCromwellStore`](common.md#tcromwellstore) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `K` |
| `callback` | (`itemValue`: [`TCromwellStore`](common.md#tcromwellstore)[`K`]) => `any` |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:57](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L57)

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
| `component` | `ComponentType`<[`TCommonComponentProps`](common.md#tcommoncomponentprops)\> |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:100](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L100)

___

### setStoreItem

▸ `Const` **setStoreItem**<`K`\>(`itemName`, `item`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TCromwellStore`](common.md#tcromwellstore) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `K` |
| `item` | [`TCromwellStore`](common.md#tcromwellstore)[`K`] |

#### Returns

`void`

#### Defined in

[system/core/common/src/global-store.ts:32](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/global-store.ts#L32)

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
