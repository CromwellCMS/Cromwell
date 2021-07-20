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

- [BasePageNames](../enums/common.basepagenames.md)
- [BasePagePaths](../enums/common.basepagepaths.md)
- [ECommonComponentNames](../enums/common.ecommoncomponentnames.md)

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
- [TLogLevel](common.md#tloglevel)
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
- [TServerCreateOrder](common.md#tservercreateorder)
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
- [apiV1BaseRoute](common.md#apiv1baseroute)
- [currentApiVersion](common.md#currentapiversion)
- [genericPageName](common.md#genericpagename)
- [logLevels](common.md#loglevels)
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
- [logFor](common.md#logfor)
- [logLevelMoreThan](common.md#loglevelmorethan)
- [onStoreChange](common.md#onstorechange)
- [removeOnStoreChange](common.md#removeonstorechange)
- [saveCommonComponent](common.md#savecommoncomponent)
- [setStoreItem](common.md#setstoreitem)
- [sleep](common.md#sleep)

## Type aliases

### GraphQLPathsType

Ƭ **GraphQLPathsType**: { [K in TDBEntity]: TGraphQLNode}

Defined in: [system/core/common/src/types/data.ts:105](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L105)

___

### StaticPageContext

Ƭ **StaticPageContext**<Q\>: *object*

#### Type parameters:

Name | Type | Default |
:------ | :------ | :------ |
`Q` | ParsedUrlQuery | ParsedUrlQuery |

#### Type declaration:

Name | Type |
:------ | :------ |
`params`? | Q |
`pluginsConfig`? | *Record*<string, any\> |
`preview`? | *boolean* |
`previewData`? | *any* |

Defined in: [system/core/common/src/types/blocks.ts:8](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L8)

___

### TAdditionalExports

Ƭ **TAdditionalExports**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`importType`? | *default* \| *named* |
`name` | *string* |
`path`? | *string* |
`saveAsModules`? | *string*[] |

Defined in: [system/core/common/src/types/data.ts:360](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L360)

___

### TAttribute

Ƭ **TAttribute**: *TBasePageEntity* & { `icon?`: *string* ; `key`: *string* ; `required?`: *boolean* ; `type`: *radio* \| *checkbox* ; `values`: *TAttributeValue*[]  }

Attribute

Defined in: [system/core/common/src/types/entities.ts:289](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L289)

___

### TAttributeInput

Ƭ **TAttributeInput**: *Omit*<TAttribute, TDBAuxiliaryColumns\>

Defined in: [system/core/common/src/types/entities.ts:297](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L297)

___

### TAttributeInstance

Ƭ **TAttributeInstance**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`key` | *string* |
`values` | *TAttributeInstanceValue*[] |

Defined in: [system/core/common/src/types/entities.ts:304](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L304)

___

### TAttributeInstanceValue

Ƭ **TAttributeInstanceValue**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`productVariant`? | *TAttributeProductVariant* |
`value` | *string* |

Defined in: [system/core/common/src/types/entities.ts:309](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L309)

___

### TAttributeProductVariant

Ƭ **TAttributeProductVariant**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`description`? | *string* |
`descriptionDelta`? | *string* |
`images`? | *string*[] |
`mainImage`? | *string* |
`name`? | *string* |
`oldPrice`? | *number* |
`price`? | *number* |
`sku`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:314](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L314)

___

### TAttributeValue

Ƭ **TAttributeValue**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`icon`? | *string* |
`value` | *string* |

Defined in: [system/core/common/src/types/entities.ts:299](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L299)

___

### TAuthRole

Ƭ **TAuthRole**: *TUserRole* \| *self* \| *all*

Defined in: [system/core/common/src/types/entities.ts:269](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L269)

___

### TBasePageEntity

Ƭ **TBasePageEntity**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`createDate`? | Date | DB createDate   |
`id` | *string* | DB id   |
`isEnabled`? | *boolean* | Is displaying at frontend   |
`pageDescription`? | *string* | Page meta description (SEO)   |
`pageTitle`? | *string* | Page meta title (SEO)   |
`slug`? | *string* | Slug for page route   |
`updateDate`? | Date | DB updateDate   |

Defined in: [system/core/common/src/types/entities.ts:3](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L3)

___

### TBasePageEntityInput

Ƭ **TBasePageEntityInput**: *Omit*<TBasePageEntity, TDBAuxiliaryColumns\>

Defined in: [system/core/common/src/types/entities.ts:36](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L36)

___

### TBlockContentProvider

Ƭ **TBlockContentProvider**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`blockClass`? | *string* | Additional CSS class to apply for block wrapper   |
`componentDidUpdate`? | () => *void* | Additional function to run in internal componentDidUpdate of any block   |
`getter` | (`block`: *TCromwellBlock*) => React.ReactNode \| *null* | Will replace content inside any CromwellBlock by JSX this function returns   |

Defined in: [system/core/common/src/types/blocks.ts:228](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L228)

___

### TCCSModuleInfo

Ƭ **TCCSModuleInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`author` | *string* |
`authorLink` | *string* |
`betaPackageVersion` | *string* |
`betaVersion` | *string* |
`createdAt` | Date |
`description`? | *string* |
`excerpt`? | *string* |
`icon`? | *string* |
`image`? | *string* |
`images`? | *string*[] |
`name` | *string* |
`packageName` | *string* |
`packageVersion` | *string* |
`slug`? | *string* |
`tags`? | *string*[] |
`title`? | *string* |
`updatedAt` | Date |
`version` | *string* |

Defined in: [system/core/common/src/types/data.ts:453](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L453)

___

### TCCSModuleShortInfo

Ƭ **TCCSModuleShortInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`betaPackageVersion`? | *string* |
`betaVersion`? | *string* |
`packageVersion` | *string* |
`version` | *string* |

Defined in: [system/core/common/src/types/data.ts:446](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L446)

___

### TCCSVersion

Ƭ **TCCSVersion**: *object*

Version of a CMS module.
CCS - Cromwell Central Server

#### Type declaration:

Name | Type |
:------ | :------ |
`beta` | *boolean* |
`changelog`? | *string* |
`createdAt` | Date |
`description`? | *string* |
`image`? | *string* |
`name` | *string* |
`onlyManualUpdate`? | *boolean* |
`packageVersion` | *string* |
`restartServices` | keyof *TServiceVersions*[] |
`version` | *string* |

Defined in: [system/core/common/src/types/data.ts:433](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L433)

___

### TCMSTheme

Ƭ **TCMSTheme**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`mode`? | *default* \| *dark* |
`palette`? | *TPalette* |

Defined in: [system/core/common/src/types/data.ts:488](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L488)

___

### TCmsConfig

Ƭ **TCmsConfig**: *object*

cmsconfig.json

#### Type declaration:

Name | Type |
:------ | :------ |
`accessTokenExpirationTime`? | *number* |
`accessTokenSecret`? | *string* |
`adminPanelPort`? | *number* |
`apiPort`? | *number* |
`centralServerUrl`? | *string* |
`cookieSecret`? | *string* |
`defaultSettings`? | *TCmsEntityCore* |
`domain`? | *string* |
`env`? | *dev* \| *prod* |
`frontendPort`? | *number* |
`managerPort`? | *number* |
`orm`? | ConnectionOptions |
`pm`? | *yarn* \| *cromwella* |
`protocol`? | *http* \| *https* |
`refreshTokenExpirationTime`? | *number* |
`refreshTokenSecret`? | *string* |
`useWatch`? | *boolean* |
`watchPoll`? | *number* |

Defined in: [system/core/common/src/types/data.ts:141](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L141)

___

### TCmsEntity

Ƭ **TCmsEntity**: *TCmsEntityCore* & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:563](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L563)

___

### TCmsEntityCore

Ƭ **TCmsEntityCore**: *object*

DB CMS entity

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`beta`? | *boolean* | Internal. Recieve unstable beta-updates   |
`currencies`? | *TCurrency*[] | Available currencies in the store and rates between them to convert   |
`defaultPageSize`? | *number* | Page size to use in lists, eg. at Product Category page   |
`defaultShippingPrice`? | *number* | Standard shipping price if no shipment methods specified   |
`favicon`? | *string* | Website favicon   |
`footerHtml`? | *string* | - |
`headHtml`? | *string* | Custom HTML code injection   |
`installed`? | *boolean* | Internal. If false or not set, will launch installation at first Admin Panel visit.   |
`isUpdating`? | *boolean* | Internal. Is currently under update   |
`language`? | *string* | Default language   |
`logo`? | *string* | Website logo   |
`protocol`? | *http* \| *https* | Protocol for api client to use   |
`sendFromEmail`? | *string* | E-mail to send mails from   |
`smtpConnectionString`? | *string* | SMTP connection string to e-mail service provider   |
`themeName`? | *string* | Package name of currently used theme   |
`timezone`? | *number* | Default timezone in GMT, number +-   |
`version`? | *string* | Internal. CMS version, used for updates   |
`versions`? | *TServiceVersions* \| *string* | Internal. https://github.com/CromwellCMS/Cromwell/blob/55046c48d9da0a44e4b11e7918c73876fcd1cfc1/system/manager/src/managers/baseManager.ts#L194:L206   |

Defined in: [system/core/common/src/types/entities.ts:461](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L461)

___

### TCmsEntityInput

Ƭ **TCmsEntityInput**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`currencies`? | *TCurrency*[] |
`defaultPageSize`? | *number* |
`defaultShippingPrice`? | *number* |
`favicon`? | *string* |
`footerHtml`? | *string* |
`headHtml`? | *string* |
`language`? | *string* |
`logo`? | *string* |
`protocol`? | *http* \| *https* |
`sendFromEmail`? | *string* |
`smtpConnectionString`? | *string* |
`timezone`? | *number* |

Defined in: [system/core/common/src/types/entities.ts:541](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L541)

___

### TCmsSettings

Ƭ **TCmsSettings**: *TCmsConfig* & *TCmsEntityCore*

Merged info form cmsconfig.json and settings from DB

Defined in: [system/core/common/src/types/data.ts:165](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L165)

___

### TCmsStats

Ƭ **TCmsStats**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`averageRating` | *number* |
`customers` | *number* |
`orders` | *number* |
`pageViews` | *number* |
`pages` | *number* |
`reviews` | *number* |
`salesPerDay` | *TSalePerDay*[] |
`salesValue` | *number* |
`topPageViews` | *TPageStats*[] |

Defined in: [system/core/common/src/types/data.ts:373](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L373)

___

### TCmsStatus

Ƭ **TCmsStatus**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`currentVersion`? | *string* |
`isUpdating`? | *boolean* |
`notifications`? | *TNotification*[] |
`updateAvailable` | *boolean* |
`updateInfo`? | *TUpdateInfo* |

Defined in: [system/core/common/src/types/data.ts:401](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L401)

___

### TCommonComponentProps

Ƭ **TCommonComponentProps**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`data`? | *TProduct* \| *TPost* \| *any* |

Defined in: [system/core/common/src/types/blocks.ts:75](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L75)

___

### TContentComponentProps

Ƭ **TContentComponentProps**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`children`? | React.ReactNode |
`config`? | *TCromwellBlockData* |
`id` | *string* |

Defined in: [system/core/common/src/types/blocks.ts:69](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L69)

___

### TCreateUser

Ƭ **TCreateUser**: *Omit*<TUser, TDBAuxiliaryColumns\> & { `password?`: *string*  }

Defined in: [system/core/common/src/types/entities.ts:271](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L271)

___

### TCromwellBlock

Ƭ **TCromwellBlock**<TContentBlock\>: *React.Component*<TCromwellBlockProps<TContentBlock\>\> & { `addDidUpdateListener`: (`id`: *string*, `func`: () => *void*) => *void* ; `consumerRender`: (`jsxParentId?`: *string*) => JSX.Element \| *null* ; `contentRender`: (`getContent?`: *TBlockContentProvider*[*getter*] \| *null*) => React.ReactNode \| *null* ; `getBlockRef`: () => *React.RefObject*<HTMLDivElement\> ; `getContentInstance`: () => React.Component & TContentBlock \| *undefined* ; `getData`: () => *TCromwellBlockData* \| *undefined* ; `getDefaultContent`: () => React.ReactNode \| *null* ; `movedCompForceUpdate?`: () => *void* ; `notifyChildRegistered`: (`childInst`: *TCromwellBlock*<any\>) => *void* ; `rerender`: () => *Promise*<void\> \| *void* ; `setContentInstance`: (`contentInstance`: React.Component & TContentBlock) => *void*  }

#### Type parameters:

Name | Default |
:------ | :------ |
`TContentBlock` | React.Component |

Defined in: [system/core/common/src/types/blocks.ts:37](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L37)

___

### TCromwellBlockData

Ƭ **TCromwellBlockData**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`editorStyles`? | *object* | Styles applied from PageBuilder's UI   |
`editorStyles.align`? | *left* \| *right* \| *center* | - |
`editorStyles.maxWidth`? | *number* | - |
`editorStyles.offsetBottom`? | *number* | - |
`editorStyles.offsetLeft`? | *number* | - |
`editorStyles.offsetRight`? | *number* | - |
`editorStyles.offsetTop`? | *number* | - |
`gallery`? | *TGallerySettings* | For gallery block   |
`global`? | *boolean* | Persist on all pages, all inner modifications will be saved as global   |
`html`? | *object* | For "HTML" block   |
`html.innerHTML`? | *string* | - |
`id` | *string* | Component's id, must be unique in a page.   |
`image`? | *object* | For "image" block   |
`image.alt`? | *string* | - |
`image.height`? | *number* | - |
`image.link`? | *string* | - |
`image.objectFit`? | *contain* \| *cover* | - |
`image.src`? | *string* | - |
`image.width`? | *number* | - |
`image.withEffect`? | *boolean* | - |
`index`? | *number* | Index inside children array of parent element   |
`isConstant`? | *boolean* | If true, user can't delete or modify this block in the editor   |
`isDeleted`? | *boolean* | Non-virtual blocks that exist in JSX cannot be deleted (or moved) in theme's source code by user but user can set isDeleted flag that will tell Blocks to render null instead   |
`isVirtual`? | *boolean* | If true, indicates that this Block was created in Page builder and it doesn't exist in source files as React component. Exists only in page's config.   |
`link`? | *object* | For link block   |
`link.href`? | *string* | - |
`link.text`? | *string* | - |
`parentId`? | *string* | Id of Destination Component where this component will be displayed.   |
`plugin`? | *object* | For plugin block   |
`plugin.pluginName`? | *string* | Plugin's name to render inside component. Same name must be in module.config.js   |
`plugin.settings`? | *Record*<string, any\> | Plugin's local settings   |
`style`? | *string* \| React.CSSProperties | CSS styles to apply to this block's wrapper   |
`text`? | *object* | For text block   |
`text.content`? | *string* | - |
`text.href`? | *string* | - |
`text.textElementType`? | keyof React.ReactHTML | - |
`type`? | *TCromwellBlockType* | Component's type   |

Defined in: [system/core/common/src/types/blocks.ts:81](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L81)

___

### TCromwellBlockProps

Ƭ **TCromwellBlockProps**<TContentBlock\>: { `blockRef?`: <T\>(`block`: T) => *void* ; `className?`: *string* ; `content?`: (`data`: *TCromwellBlockData* \| *undefined*, `blockRef`: *React.RefObject*<HTMLDivElement\>, `setContentInstance`: *TCromwellBlock*<TContentBlock\>[*setContentInstance*]) => React.ReactNode ; `id`: *string* ; `jsxParentId?`: *string* ; `onClick?`: (`event`: *React.MouseEvent*<HTMLDivElement, MouseEvent\>) => *any* ; `type?`: *TCromwellBlockType*  } & *TCromwellBlockData*

#### Type parameters:

Name | Default |
:------ | :------ |
`TContentBlock` | React.Component |

Defined in: [system/core/common/src/types/blocks.ts:56](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L56)

___

### TCromwellBlockType

Ƭ **TCromwellBlockType**: *container* \| *plugin* \| *text* \| *HTML* \| *image* \| *gallery* \| *list* \| *link*

Defined in: [system/core/common/src/types/blocks.ts:79](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L79)

___

### TCromwellNodeModules

Ƭ **TCromwellNodeModules**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`hasBeenExecuted`? | *boolean* |
`importModule`? | (`moduleName`: *string*, `namedExports?`: *string*[]) => *Promise*<boolean\> \| *boolean* |
`importScriptExternals`? | (`metaInfo`: *TScriptMetaInfo*) => *Promise*<boolean\> |
`importStatuses`? | *Record*<string, *failed* \| *ready* \| *default* \| Promise<*failed* \| *ready* \| *default*\>\> |
`imports`? | *Record*<string, () => *void*\> |
`moduleExternals`? | *Record*<string, string[]\> |
`modules`? | *Record*<string, any\> |
`prefix`? | *string* |
`scriptStatuses`? | *Record*<string, *failed* \| *ready* \| Promise<*failed* \| *ready*\>\> |
`setPrefix`? | (`prefix`: *string*) => *void* |

Defined in: [system/core/common/src/types/data.ts:251](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L251)

___

### TCromwellNotify

Ƭ **TCromwellNotify**: *object*

UI Notification service. In Admin panel it's react-toastify, for example.

#### Type declaration:

Name | Type |
:------ | :------ |
`error`? | (`message`: *string*, `options?`: *any*) => *void* |
`info`? | (`message`: *string*, `options?`: *any*) => *void* |
`success`? | (`message`: *string*, `options?`: *any*) => *void* |
`warning`? | (`message`: *string*, `options?`: *any*) => *void* |

Defined in: [system/core/common/src/types/data.ts:300](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L300)

___

### TCromwellPage

Ƭ **TCromwellPage**<Props\>: *NextPage*<Props & *TCromwellPageCoreProps*\>

#### Type parameters:

Name | Default |
:------ | :------ |
`Props` | *any* \| *undefined* |

Defined in: [system/core/common/src/types/blocks.ts:19](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L19)

___

### TCromwellPageCoreProps

Ƭ **TCromwellPageCoreProps**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`childStaticProps`? | *Record*<string, any\> \| *null* |
`cmsSettings`? | *TCmsSettings* \| *null* |
`pageConfig`? | *TPageConfig* \| *null* |
`pagesInfo`? | *TPageInfo*[] \| *null* |
`palette`? | *TPalette* \| *null* |
`plugins`? | *Record*<string, { `code?`: *string* ; `data?`: *any* ; `settings?`: *any*  }\> |
`themeCustomConfig`? | *Record*<string, any\> \| *null* |
`themeFooterHtml`? | *string* \| *null* |
`themeHeadHtml`? | *string* \| *null* |

Defined in: [system/core/common/src/types/blocks.ts:21](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L21)

___

### TCromwellStore

Ƭ **TCromwellStore**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`apiClients`? | *object* | Internal   |
`apiClients.graphQLClient`? | *any* | - |
`apiClients.restAPIClient`? | *any* | - |
`blockInstances`? | *Record*<string, TCromwellBlock \| undefined\> | Internal. References to all instances of Cromwell Blocks at the page { [CromwellBlockId]: Instance}   |
`cmsSettings`? | *TCmsSettings* | Public CMS Settings   |
`components`? | *Record*<string, React.ComponentType<*TCommonComponentProps* & { [x: string]: *any*;  }\>\> | Internal. Common component storage. E.g. product cards to be reused by Plugins  { [ComponentName]: (Class/function) }   |
`cstore`? | *any* | - |
`currency`? | *string* | Active currency   |
`dbInfo`? | *TDBInfo* | Info about current DB for backend usage   |
`environment`? | *object* | - |
`environment.isAdminPanel`? | *boolean* | - |
`environment.logLevel`? | *TLogLevel* | - |
`environment.mode`? | *dev* \| *prod* | - |
`forceUpdatePage`? | () => *void* | Helper to invoke render (force update) of current page's root component   |
`fsRequire`? | (`path`: *string*) => *Promise*<any\> | - |
`nodeModules`? | *TCromwellNodeModules* | - |
`notifier`? | *TCromwellNotify* | - |
`pageConfig`? | *TPageConfig* | Config of currently opened Theme's page   |
`pagesInfo`? | *TPageInfo*[] | Short pages info of current Theme   |
`plugins`? | *Record*<string, { `code?`: *string* ; `component?`: *any* ; `data?`: *any* ; `settings?`: *any*  }\> | Internal. Plugins data   |
`storeChangeCallbacks`? | *Record*<string, (`prop`: *any*) => *any*[]\> | - |
`theme`? | *TCMSTheme* | - |
`themeCustomConfig`? | *Record*<string, any\> | - |
`userInfo`? | *TUser* | - |
`webSocketClient`? | *any* | - |

Defined in: [system/core/common/src/types/data.ts:6](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L6)

___

### TCromwellaConfig

Ƭ **TCromwellaConfig**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`frontendDependencies`? | (*string* \| *TFrontendDependency*)[] |
`packages` | *string*[] |

Defined in: [system/core/common/src/types/data.ts:338](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L338)

___

### TCurrency

Ƭ **TCurrency**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *string* | - |
`ratio`? | *number* | Ratio for currencies to compare: "USD": 1,"EURO": 0.83, "GBP": 0.72 etc.   |
`symbol`? | *string* | Local curency symbols that will be added to price in getPriceWithCurrency method   |
`tag` | *string* | - |
`title`? | *string* | - |

Defined in: [system/core/common/src/types/entities.ts:566](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L566)

___

### TDBAuxiliaryColumns

Ƭ **TDBAuxiliaryColumns**: *id* \| *createDate* \| *updateDate*

Defined in: [system/core/common/src/types/entities.ts:34](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L34)

___

### TDBEntity

Ƭ **TDBEntity**: keyof { `Attribute`: *any* ; `CMS`: *any* ; `Generic`: *any* ; `Order`: *any* ; `Plugin`: *any* ; `Post`: *any* ; `PostComment`: *any* ; `Product`: *any* ; `ProductCategory`: *any* ; `ProductReview`: *any* ; `Tag`: *any* ; `Theme`: *any* ; `User`: *any*  }

Defined in: [system/core/common/src/types/data.ts:89](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L89)

___

### TDBInfo

Ƭ **TDBInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`dbType`? | *string* |

Defined in: [system/core/common/src/types/data.ts:493](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L493)

___

### TDataComponentProps

Ƭ **TDataComponentProps**<Data\>: *object*

#### Type parameters:

Name |
:------ |
`Data` |

#### Type declaration:

Name | Type |
:------ | :------ |
`component` | *React.ComponentType*<Data\> |
`pluginName` | *string* |

Defined in: [system/core/common/src/types/blocks.ts:51](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L51)

___

### TDefaultPageName

Ƭ **TDefaultPageName**: *index* \| *category* \| *product* \| *post* \| *tag* \| *pages* \| *account* \| *checkout* \| *blog*

Defined in: [system/core/common/src/types/data.ts:199](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L199)

___

### TDeleteManyInput

Ƭ **TDeleteManyInput**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`all`? | *boolean* |
`ids` | *string*[] |

Defined in: [system/core/common/src/types/entities.ts:576](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L576)

___

### TExternal

Ƭ **TExternal**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`importName`? | *string* |
`moduleName`? | *string* |
`usedName` | *string* |

Defined in: [system/core/common/src/types/data.ts:354](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L354)

___

### TFilteredProductList

Ƭ **TFilteredProductList**: *TPagedList*<TProduct\> & { `filterMeta`: *TProductFilterMeta*  }

Defined in: [system/core/common/src/types/entities.ts:168](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L168)

___

### TFrontendBundle

Ƭ **TFrontendBundle**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`cjsPath`? | *string* |
`meta`? | *TScriptMetaInfo* |
`source`? | *string* |

Defined in: [system/core/common/src/types/data.ts:285](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L285)

___

### TFrontendDependency

Ƭ **TFrontendDependency**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`addExports`? | *TAdditionalExports*[] |
`builtins`? | *string*[] |
`bundledCss`? | *string*[] |
`excludeExports`? | *string*[] |
`externals`? | *TExternal*[] |
`ignore`? | *string*[] |
`name` | *string* |
`version`? | *string* |

Defined in: [system/core/common/src/types/data.ts:343](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L343)

___

### TFrontendPluginProps

Ƭ **TFrontendPluginProps**<TData, TGlobalSettings, TInstanceSettings\>: *object*

#### Type parameters:

Name | Default |
:------ | :------ |
`TData` | *any* |
`TGlobalSettings` | *any* |
`TInstanceSettings` | *any* |

#### Type declaration:

Name | Type |
:------ | :------ |
`data`? | TData |
`globalSettings`? | TGlobalSettings |
`instanceSettings`? | TInstanceSettings |
`pluginName` | *string* |

Defined in: [system/core/common/src/types/data.ts:481](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L481)

___

### TGallerySettings

Ƭ **TGallerySettings**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`autoHeight`? | *boolean* | - |
`autoPlay`? | *boolean* | - |
`backgroundSize`? | *contain* \| *cover* | - |
`breakpoints`? | *any* | - |
`classes`? | *object* | - |
`classes.navBtn`? | *string* | - |
`components`? | *object* | - |
`components.backButton`? | React.ComponentType | - |
`components.imgWrapper`? | *React.ComponentType*<{ `image?`: *TImageSettings*  }\> | - |
`components.nextButton`? | React.ComponentType | - |
`effect`? | *slide* \| *fade* \| *cube* \| *coverflow* \| *flip* | - |
`fullscreen`? | *boolean* | - |
`height`? | *number* | - |
`images`? | *TImageSettings*[] | - |
`interval`? | *number* | - |
`lazy`? | *boolean* | - |
`loop`? | *boolean* | - |
`navigation`? | { `showOnHover?`: *boolean*  } \| *boolean* | - |
`orientation`? | *horizontal* \| *vertical* | - |
`pagination`? | *boolean* | - |
`ratio`? | *number* | ratio = width / height   |
`responsive`? | *Record*<number, TGallerySettings\> | - |
`slideMaxWidth`? | *number* | - |
`slideMinWidth`? | *number* | - |
`slides`? | React.ReactNode[] | - |
`spaceBetween`? | *number* | - |
`speed`? | *number* | - |
`thumbs`? | *boolean* \| { `backgroundSize?`: *contain* \| *cover* ; `height?`: *number* ; `loop?`: *boolean* ; `width?`: *number*  } | - |
`visibleSlides`? | *number* | - |
`width`? | *number* | - |
`zoom`? | *boolean* | - |

Defined in: [system/core/common/src/types/blocks.ts:184](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L184)

___

### TGetStaticProps

Ƭ **TGetStaticProps**<P, Q\>: (`ctx`: *StaticPageContext*<Q\>) => *Promise*<P\>

#### Type parameters:

Name | Type | Default |
:------ | :------ | :------ |
`P` | *object* | { [key: string]: *any*;  } |
`Q` | ParsedUrlQuery | ParsedUrlQuery |

#### Type declaration:

▸ (`ctx`: *StaticPageContext*<Q\>): *Promise*<P\>

#### Parameters:

Name | Type |
:------ | :------ |
`ctx` | *StaticPageContext*<Q\> |

**Returns:** *Promise*<P\>

Defined in: [system/core/common/src/types/blocks.ts:14](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L14)

___

### TGraphQLNode

Ƭ **TGraphQLNode**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`create` | *string* |
`delete` | *string* |
`deleteMany` | *string* |
`getMany` | *string* |
`getOneById` | *string* |
`getOneBySlug` | *string* |
`update` | *string* |

Defined in: [system/core/common/src/types/data.ts:107](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L107)

___

### TImageSettings

Ƭ **TImageSettings**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`alt`? | *string* |
`href`? | *string* |
`id`? | *string* \| *number* |
`src` | *string* |
`thumb`? | *string* |

Defined in: [system/core/common/src/types/blocks.ts:176](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/blocks.ts#L176)

___

### TLogLevel

Ƭ **TLogLevel**: *none* \| *errors-only* \| *errors-warnings* \| *minimal* \| *detailed* \| *all*

Defined in: [system/core/common/src/types/data.ts:295](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L295)

___

### TModuleConfig

Ƭ **TModuleConfig**: *TThemeConfig* & *TPluginConfig*

Defined in: [system/core/common/src/types/data.ts:249](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L249)

___

### TNotification

Ƭ **TNotification**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`documentationLink`? | *string* |
`message` | *string* |
`pageLink`? | *string* |
`type` | *info* \| *warning* \| *error* |

Defined in: [system/core/common/src/types/data.ts:421](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L421)

___

### TOrder

Ƭ **TOrder**: *TOrderCore* & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:373](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L373)

___

### TOrderCore

Ƭ **TOrderCore**: *object*

Store order

#### Type declaration:

Name | Type |
:------ | :------ |
`cart`? | *string* \| *TStoreListItem*[] |
`cartOldTotalPrice`? | *number* |
`cartTotalPrice`? | *number* |
`customerAddress`? | *string* |
`customerComment`? | *string* |
`customerEmail`? | *string* |
`customerName`? | *string* |
`customerPhone`? | *string* |
`fromUrl`? | *string* |
`orderTotalPrice`? | *number* |
`shippingMethod`? | *string* |
`shippingPrice`? | *number* |
`status`? | *string* |
`totalQnt`? | *number* |
`userId`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:355](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L355)

___

### TOrderFilter

Ƭ **TOrderFilter**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`customerEmail`? | *string* |
`customerName`? | *string* |
`customerPhone`? | *string* |
`dateFrom`? | *string* |
`dateTo`? | *string* |
`orderId`? | *string* |
`status`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:390](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L390)

___

### TOrderInput

Ƭ **TOrderInput**: *TOrderCore* & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:375](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L375)

___

### TPackageCromwellConfig

Ƭ **TPackageCromwellConfig**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`author`? | *string* |
`authorLink`? | *string* |
`bundledDependencies`? | *string*[] |
`description`? | *string* |
`excerpt`? | *string* |
`firstLoadedDependencies`? | *string*[] |
`frontendDependencies`? | (*string* \| *TFrontendDependency*)[] |
`icon`? | *string* |
`image`? | *string* |
`images`? | *string*[] |
`name`? | *string* |
`packageName`? | *string* |
`plugins`? | *string*[] |
`tags`? | *string*[] |
`themes`? | *string*[] |
`title`? | *string* |
`type`? | *plugin* \| *theme* |
`version`? | *string* |

Defined in: [system/core/common/src/types/data.ts:317](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L317)

___

### TPackageJson

Ƭ **TPackageJson**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`cromwell`? | *TPackageCromwellConfig* |
`dependencies`? | *Record*<string, string\> |
`devDependencies`? | *Record*<string, string\> |
`module`? | *string* |
`name`? | *string* |
`peerDependencies`? | *Record*<string, string\> |
`version`? | *string* |

Defined in: [system/core/common/src/types/data.ts:307](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L307)

___

### TPageConfig

Ƭ **TPageConfig**: *TPageInfo* & { `adminPanelProps?`: *any* ; `footerHtml?`: *string* ; `headHtml?`: *string* ; `modifications`: *TCromwellBlockData*[] ; `pageCustomConfig?`: *Record*<string, any\>  }

Defined in: [system/core/common/src/types/data.ts:229](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L229)

___

### TPageInfo

Ƭ **TPageInfo**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`description`? | *string* | Meta description (SEO)   |
`id` | *string* | Unique ID of a page   |
`isVirtual`? | *boolean* | If true, this page created in PageBuilder or manually in config and does not have a corresponding source file with React component   |
`name` | *string* | Name   |
`route` | *string* | Page's url/slug. Can be: 1. Filesystem relative path of page's react component without extension. If file name is "./post/[slug].tsx" then route must be "post/[slug]" 2. Route of a virtual page (generic page). Responsible component is "pages/[slug].js" , route must in format: "pages/any-slug"   |
`title`? | *string* | Meta title (SEO)   |

Defined in: [system/core/common/src/types/data.ts:206](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L206)

___

### TPageStats

Ƭ **TPageStats**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`categorySlug`? | *string* |
`pageId`? | *string* |
`pageRoute`? | *string* |
`postSlug`? | *string* |
`productSlug`? | *string* |
`tagSlug`? | *string* |
`views`? | *number* |

Defined in: [system/core/common/src/types/data.ts:385](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L385)

___

### TPagedList

Ƭ **TPagedList**<Entity\>: *object*

#### Type parameters:

Name |
:------ |
`Entity` |

#### Type declaration:

Name | Type |
:------ | :------ |
`elements`? | Entity[] |
`pagedMeta`? | *TPagedMeta* |

Defined in: [system/core/common/src/types/data.ts:119](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L119)

___

### TPagedMeta

Ƭ **TPagedMeta**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`pageNumber`? | *number* |
`pageSize`? | *number* |
`totalElements`? | *number* |
`totalPages`? | *number* |

Defined in: [system/core/common/src/types/data.ts:131](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L131)

___

### TPagedParams

Ƭ **TPagedParams**<Entity\>: *object*

#### Type parameters:

Name |
:------ |
`Entity` |

#### Type declaration:

Name | Type |
:------ | :------ |
`order`? | *ASC* \| *DESC* |
`orderBy`? | keyof Entity |
`pageNumber`? | *number* |
`pageSize`? | *number* |

Defined in: [system/core/common/src/types/data.ts:124](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L124)

___

### TPagesMetaInfo

Ƭ **TPagesMetaInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`basePath`? | *string* |
`buildDir`? | *string* |
`paths` | { `basePath?`: *string* ; `importedStyles?`: *string*[] ; `localDepsBundle?`: *string* ; `localPath?`: *string* ; `pageName`: *string* ; `srcFullPath?`: *string*  }[] |
`rootBuildDir`? | *string* |

Defined in: [system/core/common/src/types/data.ts:271](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L271)

___

### TPalette

Ƭ **TPalette**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`primaryColor`? | *string* |
`secondaryColor`? | *string* |

Defined in: [system/core/common/src/types/data.ts:201](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L201)

___

### TPluginConfig

Ƭ **TPluginConfig**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`adminInputFile`? | *string* | - |
`backend`? | *string* | - |
`defaultSettings`? | *any* | - |
`frontendInputFile`? | *string* | - |
`frontendModule`? | *string* | - |
`rollupConfig`? | () => *TRollupConfig* \| *Promise*<TRollupConfig\> | Configs for Rollup   |

Defined in: [system/core/common/src/types/data.ts:239](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L239)

___

### TPluginEntity

Ƭ **TPluginEntity**: *TPluginEntityCore* & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:454](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L454)

___

### TPluginEntityCore

Ƭ **TPluginEntityCore**: *object*

Plugin entity

#### Type declaration:

Name | Type |
:------ | :------ |
`defaultSettings`? | *string* |
`hasAdminBundle`? | *boolean* |
`isInstalled` | *boolean* |
`isUpdating`? | *boolean* |
`moduleInfo`? | *string* |
`name` | *string* |
`settings`? | *string* |
`title`? | *string* |
`version`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:442](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L442)

___

### TPluginEntityInput

Ƭ **TPluginEntityInput**: *TPluginEntityCore* & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:456](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L456)

___

### TPluginInfo

Ƭ **TPluginInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`name` | *string* |

Defined in: [system/core/common/src/types/data.ts:291](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L291)

___

### TPluginSettingsProps

Ƭ **TPluginSettingsProps**<TSettings\>: *object*

#### Type parameters:

Name | Default |
:------ | :------ |
`TSettings` | *any* |

#### Type declaration:

Name | Type |
:------ | :------ |
`globalSettings`? | TSettings |
`pluginName` | *string* |

Defined in: [system/core/common/src/types/data.ts:476](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L476)

___

### TPost

Ƭ **TPost**: { `author?`: *TUser* ; `content?`: *string* \| *null* ; `delta?`: *string* \| *null* ; `excerpt?`: *string* \| *null* ; `mainImage?`: *string* \| *null* ; `publishDate?`: Date \| *null* ; `published?`: *boolean* \| *null* ; `readTime?`: *string* \| *null* ; `tags?`: *TTag*[] \| *null* ; `title?`: *string* \| *null*  } & *TBasePageEntity*

POST

Defined in: [system/core/common/src/types/entities.ts:181](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L181)

___

### TPostComment

Ƭ **TPostComment**: *TPostCommentCore* & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:414](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L414)

___

### TPostCommentCore

Ƭ **TPostCommentCore**: *object*

Blog comment

#### Type declaration:

Name | Type |
:------ | :------ |
`approved`? | *boolean* |
`comment`? | *string* |
`postId` | *string* |
`title`? | *string* |
`userEmail`? | *string* |
`userId`? | *string* |
`userName`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:404](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L404)

___

### TPostCommentInput

Ƭ **TPostCommentInput**: *TPostCommentCore* & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:416](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L416)

___

### TPostFilter

Ƭ **TPostFilter**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`authorId`? | *string* |
`published`? | *boolean* |
`tagIds`? | *string*[] |
`titleSearch`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:229](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L229)

___

### TPostInput

Ƭ **TPostInput**: *Omit*<TPost, TDBAuxiliaryColumns \| *author* \| *tags*\> & { `authorId`: *string* ; `tagIds?`: *string*[] \| *null*  }

Defined in: [system/core/common/src/types/entities.ts:224](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L224)

___

### TProduct

Ƭ **TProduct**: *TBasePageEntity* & { `attributes?`: *TAttributeInstance*[] ; `categories?`: *TProductCategory*[] ; `description?`: *string* ; `descriptionDelta?`: *string* ; `images?`: *string*[] ; `mainImage?`: *string* ; `name?`: *string* ; `oldPrice?`: *number* ; `price?`: *number* ; `rating?`: *TProductRating* ; `reviews?`: *TProductReview*[] ; `sku?`: *string* ; `views?`: *number*  }

PRODUCT

Defined in: [system/core/common/src/types/entities.ts:87](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L87)

___

### TProductCategory

Ƭ **TProductCategory**: *TProductCategoryCore* & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:73](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L73)

___

### TProductCategoryCore

Ƭ **TProductCategoryCore**: *object*

ProductCategory

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`children`? | *TProductCategory*[] | DB children   |
`description`? | *string* | Description (HTML allowed)   |
`descriptionDelta`? | *string* | Description in Quill format   |
`mainImage`? | *string* | Href of main image   |
`name` | *string* | Name of the category (h1)   |
`parent`? | *TProductCategory* \| *null* | DB parent   |
`products`? | *TPagedList*<TProduct\> | Products in category   |

Defined in: [system/core/common/src/types/entities.ts:42](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L42)

___

### TProductCategoryFilter

Ƭ **TProductCategoryFilter**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`nameSearch`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:79](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L79)

___

### TProductCategoryInput

Ƭ **TProductCategoryInput**: *TBasePageEntityInput* & *Omit*<TProductCategoryCore, *children* \| *parent* \| *products*\> & { `parentId?`: *string*  }

Defined in: [system/core/common/src/types/entities.ts:75](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L75)

___

### TProductFilter

Ƭ **TProductFilter**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`attributes`? | *TProductFilterAttribute*[] |
`maxPrice`? | *number* |
`minPrice`? | *number* |
`nameSearch`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:157](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L157)

___

### TProductFilterAttribute

Ƭ **TProductFilterAttribute**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`key` | *string* |
`values` | *string*[] |

Defined in: [system/core/common/src/types/entities.ts:163](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L163)

___

### TProductFilterMeta

Ƭ **TProductFilterMeta**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`maxPrice`? | *number* |
`minPrice`? | *number* |

Defined in: [system/core/common/src/types/entities.ts:172](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L172)

___

### TProductInput

Ƭ **TProductInput**: *Omit*<TProduct, TDBAuxiliaryColumns \| *categories* \| *rating* \| *reviews*\> & { `categoryIds?`: *string*[]  }

Defined in: [system/core/common/src/types/entities.ts:153](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L153)

___

### TProductRating

Ƭ **TProductRating**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`average`? | *number* | Rating 1-5   |
`reviewsNumber`? | *number* | Number of customer reviews   |

Defined in: [system/core/common/src/types/entities.ts:142](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L142)

___

### TProductReview

Ƭ **TProductReview**: *TProductReviewCore* & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:340](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L340)

___

### TProductReviewCore

Ƭ **TProductReviewCore**: *object*

ProductReview

#### Type declaration:

Name | Type |
:------ | :------ |
`approved`? | *boolean* |
`description`? | *string* |
`productId` | *string* |
`rating`? | *number* |
`title`? | *string* |
`userEmail`? | *string* |
`userId`? | *string* |
`userName`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:329](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L329)

___

### TProductReviewFilter

Ƭ **TProductReviewFilter**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`approved`? | *boolean* |
`productId`? | *string* |
`userId`? | *string* |
`userName`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:344](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L344)

___

### TProductReviewInput

Ƭ **TProductReviewInput**: *TProductReviewCore* & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:342](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L342)

___

### TRollupConfig

Ƭ **TRollupConfig**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`adminPanel`? | *Record*<string, any\> |
`backend`? | *Record*<string, any\> |
`frontend`? | *Record*<string, any\> |
`frontendCjs`? | *Record*<string, any\> |
`main` | *Record*<string, any\> |
`themePages`? | *Record*<string, any\> |

Defined in: [system/core/common/src/types/data.ts:167](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L167)

___

### TSalePerDay

Ƭ **TSalePerDay**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`date` | Date |
`orders` | *number* |
`salesValue` | *number* |

Defined in: [system/core/common/src/types/data.ts:395](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L395)

___

### TScriptMetaInfo

Ƭ **TScriptMetaInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`externalDependencies` | *Record*<string, string[]\> |
`import`? | *chunks* \| *lib* |
`name` | *string* |

Defined in: [system/core/common/src/types/data.ts:264](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L264)

___

### TServerCreateOrder

Ƭ **TServerCreateOrder**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`cart`? | *string* |
`customerAddress`? | *string* |
`customerComment`? | *string* |
`customerEmail`? | *string* |
`customerName`? | *string* |
`customerPhone`? | *string* |
`fromUrl`? | *string* |
`shippingMethod`? | *string* |
`status`? | *string* |
`userId`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:377](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L377)

___

### TServiceVersions

Ƭ **TServiceVersions**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`admin`? | *number* |
`api-server`? | *number* |
`renderer`? | *number* |
`server`? | *number* |

Defined in: [system/core/common/src/types/entities.ts:556](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L556)

___

### TStoreListItem

Ƭ **TStoreListItem**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`amount`? | *number* |
`pickedAttributes`? | *Record*<string, string[]\> |
`product`? | *TProduct* |

Defined in: [system/core/common/src/types/data.ts:367](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L367)

___

### TTag

Ƭ **TTag**: *TBasePageEntity* & { `color?`: *string* \| *null* ; `description?`: *string* \| *null* ; `descriptionDelta?`: *string* \| *null* ; `image?`: *string* \| *null* ; `name`: *string*  }

Defined in: [system/core/common/src/types/entities.ts:236](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L236)

___

### TTagInput

Ƭ **TTagInput**: *Omit*<TTag, TDBAuxiliaryColumns\>

Defined in: [system/core/common/src/types/entities.ts:244](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L244)

___

### TThemeConfig

Ƭ **TThemeConfig**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`defaultPages`? | *Record*<TDefaultPageName, string\> | Mapping of default CMS pages to theme's components. Such as { category: "category/[slug]" }   |
`footerHtml`? | *string* | Custom HTML to add to the end of every page   |
`globalCss`? | *string*[] | Global CSS files to import from node_modules   |
`globalModifications`? | *TCromwellBlockData*[] | Modifications to apply on all pages   |
`headHtml`? | *string* | Custom HTML to add into head of every page   |
`nextConfig`? | () => *any* | Next.js config that usually exported from next.config.js   |
`pages`? | *TPageConfig*[] | Pages' description and modifications   |
`palette`? | *TPalette* | Colors to use   |
`rollupConfig`? | () => *TRollupConfig* \| *Promise*<TRollupConfig\> | Configs for Rollup   |
`themeCustomConfig`? | *Record*<string, any\> | Custom config that will be available at every page in the Store inside pageConfig props   |

Defined in: [system/core/common/src/types/data.ts:176](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L176)

___

### TThemeEntity

Ƭ **TThemeEntity**: *TThemeEntityCore* & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:434](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L434)

___

### TThemeEntityCore

Ƭ **TThemeEntityCore**: *object*

Theme entity

#### Type declaration:

Name | Type |
:------ | :------ |
`defaultSettings`? | *string* |
`hasAdminBundle`? | *boolean* |
`isInstalled` | *boolean* |
`isUpdating`? | *boolean* |
`moduleInfo`? | *string* |
`name` | *string* |
`settings`? | *string* |
`title`? | *string* |
`version`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:422](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L422)

___

### TThemeEntityInput

Ƭ **TThemeEntityInput**: *TThemeEntityCore* & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:436](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L436)

___

### TUpdateInfo

Ƭ **TUpdateInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`beta` | *boolean* |
`changelog`? | *string* |
`createdAt` | Date |
`description`? | *string* |
`image`? | *string* |
`name` | *string* |
`onlyManualUpdate`? | *boolean* |
`packageVersion` | *string* |
`version` | *string* |

Defined in: [system/core/common/src/types/data.ts:409](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/data.ts#L409)

___

### TUpdateUser

Ƭ **TUpdateUser**: *Omit*<TUser, TDBAuxiliaryColumns\>

Defined in: [system/core/common/src/types/entities.ts:275](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L275)

___

### TUser

Ƭ **TUser**: *TBasePageEntity* & { `address?`: *string* ; `avatar?`: *string* ; `bio?`: *string* ; `email`: *string* ; `fullName`: *string* ; `phone?`: *string* ; `role?`: *TUserRole*  }

USER / AUTHOR

Defined in: [system/core/common/src/types/entities.ts:250](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L250)

___

### TUserFilter

Ƭ **TUserFilter**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`address`? | *string* |
`email`? | *string* |
`fullName`? | *string* |
`phone`? | *string* |
`role`? | *TUserRole* |

Defined in: [system/core/common/src/types/entities.ts:277](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L277)

___

### TUserRole

Ƭ **TUserRole**: *administrator* \| *author* \| *customer* \| *guest*

Defined in: [system/core/common/src/types/entities.ts:268](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/types/entities.ts#L268)

## Variables

### GraphQLPaths

• `Const` **GraphQLPaths**: { [K in Exclude<TDBEntity, "Theme" \| "Plugin" \| "PostComment" \| "CMS"\>]: TGraphQLNode}

Defined in: [system/core/common/src/constants.ts:17](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L17)

___

### apiV1BaseRoute

• `Const` **apiV1BaseRoute**: *api/v1*= 'api/v1'

Defined in: [system/core/common/src/constants.ts:119](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L119)

___

### currentApiVersion

• `Const` **currentApiVersion**: *1.0.0*= '1.0.0'

Defined in: [system/core/common/src/constants.ts:118](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L118)

___

### genericPageName

• `Const` **genericPageName**: *pages/[slug]*= 'pages/[slug]'

Defined in: [system/core/common/src/constants.ts:190](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L190)

___

### logLevels

• `Const` **logLevels**: *string*[]

Defined in: [system/core/common/src/constants.ts:171](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L171)

___

### serviceLocator

• `Const` **serviceLocator**: *object*

Get base url of a CMS Service

#### Type declaration:

Name | Type |
:------ | :------ |
`getAdminPanelUrl` | () => *undefined* \| *string* |
`getApiWsUrl` | () => *undefined* \| *string* |
`getFrontendUrl` | () => *undefined* \| *string* |
`getMainApiUrl` | () => *undefined* \| *string* |

Defined in: [system/core/common/src/constants.ts:151](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L151)

## Functions

### getBlockInstance

▸ `Const`**getBlockInstance**<TContentBlock\>(`blockId`: *string*): *undefined* \| *TCromwellBlock*<TContentBlock\>

#### Type parameters:

Name | Default |
:------ | :------ |
`TContentBlock` | *Component*<{}, {}, any\> |

#### Parameters:

Name | Type |
:------ | :------ |
`blockId` | *string* |

**Returns:** *undefined* \| *TCromwellBlock*<TContentBlock\>

Defined in: [system/core/common/src/GlobalStore.ts:108](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L108)

___

### getCmsSettings

▸ `Const`**getCmsSettings**(): *undefined* \| *TCmsSettings*

**Returns:** *undefined* \| *TCmsSettings*

Defined in: [system/core/common/src/GlobalStore.ts:69](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L69)

___

### getCommonComponent

▸ `Const`**getCommonComponent**(`componentName`: *string*): *undefined* \| *ComponentClass*<*TCommonComponentProps* & *Record*<string, any\>, any\> \| *FunctionComponent*<*TCommonComponentProps* & *Record*<string, any\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`componentName` | *string* |

**Returns:** *undefined* \| *ComponentClass*<*TCommonComponentProps* & *Record*<string, any\>, any\> \| *FunctionComponent*<*TCommonComponentProps* & *Record*<string, any\>\>

Defined in: [system/core/common/src/GlobalStore.ts:93](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L93)

___

### getPageCustomConfig

▸ `Const`**getPageCustomConfig**(): *undefined* \| *Record*<string, any\>

**Returns:** *undefined* \| *Record*<string, any\>

Defined in: [system/core/common/src/GlobalStore.ts:64](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L64)

___

### getRandStr

▸ `Const`**getRandStr**(`lenght?`: *number*): *string*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`lenght` | *number* | 12 |

**Returns:** *string*

Defined in: [system/core/common/src/constants.ts:185](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L185)

___

### getStore

▸ `Const`**getStore**(): *TCromwellStore*

**Returns:** *TCromwellStore*

Defined in: [system/core/common/src/GlobalStore.ts:18](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L18)

___

### getStoreItem

▸ `Const`**getStoreItem**<K\>(`itemName`: K): *TCromwellStore*[K]

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`itemName` | K |

**Returns:** *TCromwellStore*[K]

Defined in: [system/core/common/src/GlobalStore.ts:27](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L27)

___

### getThemeCustomConfig

▸ `Const`**getThemeCustomConfig**(): *undefined* \| *Record*<string, any\>

**Returns:** *undefined* \| *Record*<string, any\>

Defined in: [system/core/common/src/GlobalStore.ts:74](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L74)

___

### getThemeCustomConfigProp

▸ `Const`**getThemeCustomConfigProp**(`propPath`: *string*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`propPath` | *string* |

**Returns:** *any*

Defined in: [system/core/common/src/GlobalStore.ts:78](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L78)

___

### isServer

▸ `Const`**isServer**(): *boolean*

**Returns:** *boolean*

Defined in: [system/core/common/src/constants.ts:116](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L116)

___

### logFor

▸ `Const`**logFor**(`level`: *TLogLevel*, `msg`: *string*, `func?`: (`msg`: *string*) => *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`level` | *TLogLevel* |
`msg` | *string* |
`func?` | (`msg`: *string*) => *any* |

**Returns:** *void*

Defined in: [system/core/common/src/constants.ts:181](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L181)

___

### logLevelMoreThan

▸ `Const`**logLevelMoreThan**(`level`: *TLogLevel*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`level` | *TLogLevel* |

**Returns:** *boolean*

Defined in: [system/core/common/src/constants.ts:173](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L173)

___

### onStoreChange

▸ `Const`**onStoreChange**<K\>(`itemName`: K, `callback`: (`itemValue`: *TCromwellStore*[K]) => *any*): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`itemName` | K |
`callback` | (`itemValue`: *TCromwellStore*[K]) => *any* |

**Returns:** *void*

Defined in: [system/core/common/src/GlobalStore.ts:42](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L42)

___

### removeOnStoreChange

▸ `Const`**removeOnStoreChange**<K\>(`itemName`: K, `callback`: (`itemValue`: *TCromwellStore*[K]) => *any*): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`itemName` | K |
`callback` | (`itemValue`: *TCromwellStore*[K]) => *any* |

**Returns:** *void*

Defined in: [system/core/common/src/GlobalStore.ts:56](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L56)

___

### saveCommonComponent

▸ `Const`**saveCommonComponent**(`componentName`: *string*, `component`: *ComponentType*<TCommonComponentProps\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`componentName` | *string* |
`component` | *ComponentType*<TCommonComponentProps\> |

**Returns:** *void*

Defined in: [system/core/common/src/GlobalStore.ts:99](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L99)

___

### setStoreItem

▸ `Const`**setStoreItem**<K\>(`itemName`: K, `item`: *TCromwellStore*[K]): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`itemName` | K |
`item` | *TCromwellStore*[K] |

**Returns:** *void*

Defined in: [system/core/common/src/GlobalStore.ts:31](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/GlobalStore.ts#L31)

___

### sleep

▸ `Const`**sleep**(`time`: *number*): *Promise*<unknown\>

#### Parameters:

Name | Type |
:------ | :------ |
`time` | *number* |

**Returns:** *Promise*<unknown\>

Defined in: [system/core/common/src/constants.ts:192](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/common/src/constants.ts#L192)
