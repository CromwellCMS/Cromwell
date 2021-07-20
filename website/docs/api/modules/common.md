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

### Interfaces

- [TAttribute](../interfaces/common.tattribute.md)
- [TPost](../interfaces/common.tpost.md)
- [TProduct](../interfaces/common.tproduct.md)
- [TTag](../interfaces/common.ttag.md)
- [TUser](../interfaces/common.tuser.md)

### Type aliases

- [GraphQLPathsType](common.md#graphqlpathstype)
- [StaticPageContext](common.md#staticpagecontext)
- [TAdditionalExports](common.md#tadditionalexports)
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
- [TDBEntity](common.md#tdbentity)
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
- [TPluginEntityInput](common.md#tpluginentityinput)
- [TPluginInfo](common.md#tplugininfo)
- [TPluginSettingsProps](common.md#tpluginsettingsprops)
- [TPostComment](common.md#tpostcomment)
- [TPostCommentInput](common.md#tpostcommentinput)
- [TPostFilter](common.md#tpostfilter)
- [TPostInput](common.md#tpostinput)
- [TProductCategory](common.md#tproductcategory)
- [TProductCategoryFilter](common.md#tproductcategoryfilter)
- [TProductCategoryInput](common.md#tproductcategoryinput)
- [TProductFilter](common.md#tproductfilter)
- [TProductFilterAttribute](common.md#tproductfilterattribute)
- [TProductFilterMeta](common.md#tproductfiltermeta)
- [TProductInput](common.md#tproductinput)
- [TProductRating](common.md#tproductrating)
- [TProductReview](common.md#tproductreview)
- [TProductReviewFilter](common.md#tproductreviewfilter)
- [TProductReviewInput](common.md#tproductreviewinput)
- [TRollupConfig](common.md#trollupconfig)
- [TSalePerDay](common.md#tsaleperday)
- [TScriptMetaInfo](common.md#tscriptmetainfo)
- [TServerCreateOrder](common.md#tservercreateorder)
- [TServiceVersions](common.md#tserviceversions)
- [TStoreListItem](common.md#tstorelistitem)
- [TTagInput](common.md#ttaginput)
- [TThemeConfig](common.md#tthemeconfig)
- [TThemeEntity](common.md#tthemeentity)
- [TThemeEntityInput](common.md#tthemeentityinput)
- [TUpdateInfo](common.md#tupdateinfo)
- [TUpdateUser](common.md#tupdateuser)
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

Defined in: [system/core/common/src/types/data.ts:71](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L71)

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

Defined in: [system/core/common/src/types/blocks.ts:8](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L8)

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

Defined in: [system/core/common/src/types/data.ts:320](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L320)

___

### TAttributeInput

Ƭ **TAttributeInput**: *Omit*<TAttribute, TDBAuxiliaryColumns\>

Defined in: [system/core/common/src/types/entities.ts:206](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L206)

___

### TAttributeInstance

Ƭ **TAttributeInstance**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`key` | *string* |
`values` | *TAttributeInstanceValue*[] |

Defined in: [system/core/common/src/types/entities.ts:213](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L213)

___

### TAttributeInstanceValue

Ƭ **TAttributeInstanceValue**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`productVariant`? | *TAttributeProductVariant* |
`value` | *string* |

Defined in: [system/core/common/src/types/entities.ts:218](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L218)

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

Defined in: [system/core/common/src/types/entities.ts:223](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L223)

___

### TAttributeValue

Ƭ **TAttributeValue**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`icon`? | *string* |
`value` | *string* |

Defined in: [system/core/common/src/types/entities.ts:208](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L208)

___

### TAuthRole

Ƭ **TAuthRole**: *TUserRole* \| *self* \| *all*

Defined in: [system/core/common/src/types/entities.ts:180](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L180)

___

### TBasePageEntity

Ƭ **TBasePageEntity**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`createDate`? | Date |
`id` | *string* |
`isEnabled`? | *boolean* |
`pageDescription`? | *string* |
`pageTitle`? | *string* |
`slug`? | *string* |
`updateDate`? | Date |

Defined in: [system/core/common/src/types/entities.ts:3](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L3)

___

### TBasePageEntityInput

Ƭ **TBasePageEntityInput**: *Omit*<TBasePageEntity, TDBAuxiliaryColumns\>

Defined in: [system/core/common/src/types/entities.ts:22](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L22)

___

### TBlockContentProvider

Ƭ **TBlockContentProvider**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`blockClass`? | *string* |
`componentDidUpdate`? | () => *void* |
`getter` | (`block`: *TCromwellBlock*) => React.ReactNode \| *null* |

Defined in: [system/core/common/src/types/blocks.ts:228](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L228)

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

Defined in: [system/core/common/src/types/data.ts:410](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L410)

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

Defined in: [system/core/common/src/types/data.ts:403](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L403)

___

### TCCSVersion

Ƭ **TCCSVersion**: *object*

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

Defined in: [system/core/common/src/types/data.ts:390](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L390)

___

### TCmsConfig

Ƭ **TCmsConfig**: *object*

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

Defined in: [system/core/common/src/types/data.ts:105](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L105)

___

### TCmsEntity

Ƭ **TCmsEntity**: *TCmsEntityCore* & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:434](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L434)

___

### TCmsEntityCore

Ƭ **TCmsEntityCore**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`beta`? | *boolean* |
`currencies`? | *TCurrency*[] |
`defaultPageSize`? | *number* |
`defaultShippingPrice`? | *number* |
`favicon`? | *string* |
`footerHtml`? | *string* |
`headHtml`? | *string* |
`installed`? | *boolean* |
`isUpdating`? | *boolean* |
`language`? | *string* |
`logo`? | *string* |
`protocol`? | *http* \| *https* |
`sendFromEmail`? | *string* |
`smtpConnectionString`? | *string* |
`themeName`? | *string* |
`timezone`? | *number* |
`version`? | *string* |
`versions`? | *TServiceVersions* \| *string* |

Defined in: [system/core/common/src/types/entities.ts:364](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L364)

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

Defined in: [system/core/common/src/types/entities.ts:412](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L412)

___

### TCmsSettings

Ƭ **TCmsSettings**: *TCmsConfig* & *TCmsEntityCore*

Defined in: [system/core/common/src/types/data.ts:127](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L127)

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

Defined in: [system/core/common/src/types/data.ts:333](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L333)

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

Defined in: [system/core/common/src/types/data.ts:361](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L361)

___

### TCommonComponentProps

Ƭ **TCommonComponentProps**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`data`? | *TProduct* \| *TPost* \| *any* |

Defined in: [system/core/common/src/types/blocks.ts:75](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L75)

___

### TContentComponentProps

Ƭ **TContentComponentProps**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`children`? | React.ReactNode |
`config`? | *TCromwellBlockData* |
`id` | *string* |

Defined in: [system/core/common/src/types/blocks.ts:69](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L69)

___

### TCreateUser

Ƭ **TCreateUser**: *Omit*<TUser, TDBAuxiliaryColumns\> & { `password?`: *string*  }

Defined in: [system/core/common/src/types/entities.ts:182](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L182)

___

### TCromwellBlock

Ƭ **TCromwellBlock**<TContentBlock\>: *React.Component*<TCromwellBlockProps<TContentBlock\>\> & { `addDidUpdateListener`: (`id`: *string*, `func`: () => *void*) => *void* ; `consumerRender`: (`jsxParentId?`: *string*) => JSX.Element \| *null* ; `contentRender`: (`getContent?`: *TBlockContentProvider*[*getter*] \| *null*) => React.ReactNode \| *null* ; `getBlockRef`: () => *React.RefObject*<HTMLDivElement\> ; `getContentInstance`: () => React.Component & TContentBlock \| *undefined* ; `getData`: () => *TCromwellBlockData* \| *undefined* ; `getDefaultContent`: () => React.ReactNode \| *null* ; `movedCompForceUpdate?`: () => *void* ; `notifyChildRegistered`: (`childInst`: *TCromwellBlock*<any\>) => *void* ; `rerender`: () => *Promise*<void\> \| *void* ; `setContentInstance`: (`contentInstance`: React.Component & TContentBlock) => *void*  }

#### Type parameters:

Name | Default |
:------ | :------ |
`TContentBlock` | React.Component |

Defined in: [system/core/common/src/types/blocks.ts:37](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L37)

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

Defined in: [system/core/common/src/types/blocks.ts:81](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L81)

___

### TCromwellBlockProps

Ƭ **TCromwellBlockProps**<TContentBlock\>: { `blockRef?`: <T\>(`block`: T) => *void* ; `className?`: *string* ; `content?`: (`data`: *TCromwellBlockData* \| *undefined*, `blockRef`: *React.RefObject*<HTMLDivElement\>, `setContentInstance`: *TCromwellBlock*<TContentBlock\>[*setContentInstance*]) => React.ReactNode ; `id`: *string* ; `jsxParentId?`: *string* ; `onClick?`: (`event`: *React.MouseEvent*<HTMLDivElement, MouseEvent\>) => *any* ; `type?`: *TCromwellBlockType*  } & *TCromwellBlockData*

#### Type parameters:

Name | Default |
:------ | :------ |
`TContentBlock` | React.Component |

Defined in: [system/core/common/src/types/blocks.ts:56](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L56)

___

### TCromwellBlockType

Ƭ **TCromwellBlockType**: *container* \| *plugin* \| *text* \| *HTML* \| *image* \| *gallery* \| *list* \| *link*

Defined in: [system/core/common/src/types/blocks.ts:79](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L79)

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

Defined in: [system/core/common/src/types/data.ts:213](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L213)

___

### TCromwellNotify

Ƭ **TCromwellNotify**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`error`? | (`message`: *string*, `options?`: *any*) => *void* |
`info`? | (`message`: *string*, `options?`: *any*) => *void* |
`success`? | (`message`: *string*, `options?`: *any*) => *void* |
`warning`? | (`message`: *string*, `options?`: *any*) => *void* |

Defined in: [system/core/common/src/types/data.ts:260](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L260)

___

### TCromwellPage

Ƭ **TCromwellPage**<Props\>: *NextPage*<Props & *TCromwellPageCoreProps*\>

#### Type parameters:

Name | Default |
:------ | :------ |
`Props` | *any* \| *undefined* |

Defined in: [system/core/common/src/types/blocks.ts:19](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L19)

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

Defined in: [system/core/common/src/types/blocks.ts:21](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L21)

___

### TCromwellStore

Ƭ **TCromwellStore**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`apiClients`? | *object* | - |
`apiClients.graphQLClient`? | *any* | - |
`apiClients.restAPIClient`? | *any* | - |
`blockInstances`? | *Record*<string, TCromwellBlock \| undefined\> | { [CromwellBlockId]: Instance}   |
`cmsSettings`? | *TCmsSettings* | - |
`components`? | *Record*<string, React.ComponentType<*TCommonComponentProps* & { [x: string]: *any*;  }\>\> | { [ComponentName]: (Class/function) }   |
`cstore`? | *any* | - |
`currency`? | *string* | - |
`dbType`? | *string* | - |
`environment`? | *object* | - |
`environment.isAdminPanel`? | *boolean* | - |
`environment.logLevel`? | *TLogLevel* | - |
`environment.mode`? | *dev* \| *prod* | - |
`forceUpdatePage`? | () => *void* | - |
`fsRequire`? | (`path`: *string*) => *Promise*<any\> | - |
`nodeModules`? | *TCromwellNodeModules* | - |
`notifier`? | *TCromwellNotify* | - |
`pageConfig`? | *TPageConfig* | - |
`pagesInfo`? | *TPageInfo*[] | - |
`palette`? | *TPalette* | - |
`plugins`? | *Record*<string, { `code?`: *string* ; `component?`: *any* ; `data?`: *any* ; `settings?`: *any*  }\> | - |
`storeChangeCallbacks`? | *Record*<string, (`prop`: *any*) => *any*[]\> | - |
`themeCustomConfig`? | *Record*<string, any\> | - |
`userInfo`? | *TUser* | - |
`webSocketClient`? | *any* | - |

Defined in: [system/core/common/src/types/data.ts:6](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L6)

___

### TCromwellaConfig

Ƭ **TCromwellaConfig**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`frontendDependencies`? | (*string* \| *TFrontendDependency*)[] |
`packages` | *string*[] |

Defined in: [system/core/common/src/types/data.ts:298](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L298)

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

Defined in: [system/core/common/src/types/entities.ts:437](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L437)

___

### TDBEntity

Ƭ **TDBEntity**: keyof { `Attribute`: *any* ; `CMS`: *any* ; `Generic`: *any* ; `Order`: *any* ; `Plugin`: *any* ; `Post`: *any* ; `PostComment`: *any* ; `Product`: *any* ; `ProductCategory`: *any* ; `ProductReview`: *any* ; `Tag`: *any* ; `Theme`: *any* ; `User`: *any*  }

Defined in: [system/core/common/src/types/data.ts:55](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L55)

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

Defined in: [system/core/common/src/types/blocks.ts:51](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L51)

___

### TDefaultPageName

Ƭ **TDefaultPageName**: *index* \| *category* \| *product* \| *post* \| *tag* \| *pages* \| *account* \| *checkout* \| *blog*

Defined in: [system/core/common/src/types/data.ts:161](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L161)

___

### TDeleteManyInput

Ƭ **TDeleteManyInput**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`all`? | *boolean* |
`ids` | *string*[] |

Defined in: [system/core/common/src/types/entities.ts:448](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L448)

___

### TExternal

Ƭ **TExternal**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`importName`? | *string* |
`moduleName`? | *string* |
`usedName` | *string* |

Defined in: [system/core/common/src/types/data.ts:314](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L314)

___

### TFilteredProductList

Ƭ **TFilteredProductList**: *TPagedList*<TProduct\> & { `filterMeta`: *TProductFilterMeta*  }

Defined in: [system/core/common/src/types/entities.ts:108](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L108)

___

### TFrontendBundle

Ƭ **TFrontendBundle**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`cjsPath`? | *string* |
`meta`? | *TScriptMetaInfo* |
`source`? | *string* |

Defined in: [system/core/common/src/types/data.ts:247](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L247)

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

Defined in: [system/core/common/src/types/data.ts:303](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L303)

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

Defined in: [system/core/common/src/types/data.ts:438](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L438)

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

Defined in: [system/core/common/src/types/blocks.ts:184](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L184)

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

Defined in: [system/core/common/src/types/blocks.ts:14](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L14)

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

Defined in: [system/core/common/src/types/data.ts:73](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L73)

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

Defined in: [system/core/common/src/types/blocks.ts:176](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/blocks.ts#L176)

___

### TLogLevel

Ƭ **TLogLevel**: *none* \| *errors-only* \| *errors-warnings* \| *minimal* \| *detailed* \| *all*

Defined in: [system/core/common/src/types/data.ts:257](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L257)

___

### TModuleConfig

Ƭ **TModuleConfig**: *TThemeConfig* & *TPluginConfig*

Defined in: [system/core/common/src/types/data.ts:211](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L211)

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

Defined in: [system/core/common/src/types/data.ts:381](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L381)

___

### TOrder

Ƭ **TOrder**: TOrderCore & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:279](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L279)

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

Defined in: [system/core/common/src/types/entities.ts:296](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L296)

___

### TOrderInput

Ƭ **TOrderInput**: TOrderCore & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:281](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L281)

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

Defined in: [system/core/common/src/types/data.ts:277](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L277)

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

Defined in: [system/core/common/src/types/data.ts:267](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L267)

___

### TPageConfig

Ƭ **TPageConfig**: *TPageInfo* & { `adminPanelProps?`: *any* ; `footerHtml?`: *string* ; `headHtml?`: *string* ; `modifications`: *TCromwellBlockData*[] ; `pageCustomConfig?`: *Record*<string, any\>  }

Defined in: [system/core/common/src/types/data.ts:191](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L191)

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

Defined in: [system/core/common/src/types/data.ts:168](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L168)

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

Defined in: [system/core/common/src/types/data.ts:345](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L345)

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

Defined in: [system/core/common/src/types/data.ts:85](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L85)

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

Defined in: [system/core/common/src/types/data.ts:97](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L97)

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

Defined in: [system/core/common/src/types/data.ts:90](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L90)

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

Defined in: [system/core/common/src/types/data.ts:233](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L233)

___

### TPalette

Ƭ **TPalette**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`primaryColor`? | *string* |
`secondaryColor`? | *string* |

Defined in: [system/core/common/src/types/data.ts:163](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L163)

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

Defined in: [system/core/common/src/types/data.ts:201](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L201)

___

### TPluginEntity

Ƭ **TPluginEntity**: TPluginEntityCore & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:356](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L356)

___

### TPluginEntityInput

Ƭ **TPluginEntityInput**: TPluginEntityCore & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:358](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L358)

___

### TPluginInfo

Ƭ **TPluginInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`name` | *string* |

Defined in: [system/core/common/src/types/data.ts:253](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L253)

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

Defined in: [system/core/common/src/types/data.ts:433](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L433)

___

### TPostComment

Ƭ **TPostComment**: TPostCommentCore & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:318](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L318)

___

### TPostCommentInput

Ƭ **TPostCommentInput**: TPostCommentCore & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:320](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L320)

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

Defined in: [system/core/common/src/types/entities.ts:148](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L148)

___

### TPostInput

Ƭ **TPostInput**: *Omit*<TPost, TDBAuxiliaryColumns \| *author* \| *tags*\> & { `authorId`: *string* ; `tagIds?`: *string*[] \| *null*  }

Defined in: [system/core/common/src/types/entities.ts:143](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L143)

___

### TProductCategory

Ƭ **TProductCategory**: TProductCategoryCore & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:44](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L44)

___

### TProductCategoryFilter

Ƭ **TProductCategoryFilter**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`nameSearch`? | *string* |

Defined in: [system/core/common/src/types/entities.ts:50](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L50)

___

### TProductCategoryInput

Ƭ **TProductCategoryInput**: *TBasePageEntityInput* & *Omit*<TProductCategoryCore, *children* \| *parent* \| *products*\> & { `parentId?`: *string*  }

Defined in: [system/core/common/src/types/entities.ts:46](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L46)

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

Defined in: [system/core/common/src/types/entities.ts:97](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L97)

___

### TProductFilterAttribute

Ƭ **TProductFilterAttribute**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`key` | *string* |
`values` | *string*[] |

Defined in: [system/core/common/src/types/entities.ts:103](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L103)

___

### TProductFilterMeta

Ƭ **TProductFilterMeta**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`maxPrice`? | *number* |
`minPrice`? | *number* |

Defined in: [system/core/common/src/types/entities.ts:112](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L112)

___

### TProductInput

Ƭ **TProductInput**: *Omit*<TProduct, TDBAuxiliaryColumns \| *categories* \| *rating* \| *reviews*\> & { `categoryIds?`: *string*[]  }

Defined in: [system/core/common/src/types/entities.ts:93](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L93)

___

### TProductRating

Ƭ **TProductRating**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`average`? | *number* |
`reviewsNumber`? | *number* |

Defined in: [system/core/common/src/types/entities.ts:86](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L86)

___

### TProductReview

Ƭ **TProductReview**: TProductReviewCore & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:248](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L248)

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

Defined in: [system/core/common/src/types/entities.ts:252](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L252)

___

### TProductReviewInput

Ƭ **TProductReviewInput**: TProductReviewCore & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:250](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L250)

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

Defined in: [system/core/common/src/types/data.ts:129](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L129)

___

### TSalePerDay

Ƭ **TSalePerDay**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`date` | Date |
`orders` | *number* |
`salesValue` | *number* |

Defined in: [system/core/common/src/types/data.ts:355](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L355)

___

### TScriptMetaInfo

Ƭ **TScriptMetaInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`externalDependencies` | *Record*<string, string[]\> |
`import`? | *chunks* \| *lib* |
`name` | *string* |

Defined in: [system/core/common/src/types/data.ts:226](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L226)

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

Defined in: [system/core/common/src/types/entities.ts:283](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L283)

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

Defined in: [system/core/common/src/types/entities.ts:427](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L427)

___

### TStoreListItem

Ƭ **TStoreListItem**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`amount`? | *number* |
`pickedAttributes`? | *Record*<string, string[]\> |
`product`? | *TProduct* |

Defined in: [system/core/common/src/types/data.ts:327](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L327)

___

### TTagInput

Ƭ **TTagInput**: *Omit*<TTag, TDBAuxiliaryColumns\>

Defined in: [system/core/common/src/types/entities.ts:163](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L163)

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

Defined in: [system/core/common/src/types/data.ts:138](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L138)

___

### TThemeEntity

Ƭ **TThemeEntity**: TThemeEntityCore & *TBasePageEntity*

Defined in: [system/core/common/src/types/entities.ts:337](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L337)

___

### TThemeEntityInput

Ƭ **TThemeEntityInput**: TThemeEntityCore & *TBasePageEntityInput*

Defined in: [system/core/common/src/types/entities.ts:339](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L339)

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

Defined in: [system/core/common/src/types/data.ts:369](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/data.ts#L369)

___

### TUpdateUser

Ƭ **TUpdateUser**: *Omit*<TUser, TDBAuxiliaryColumns\>

Defined in: [system/core/common/src/types/entities.ts:186](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L186)

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

Defined in: [system/core/common/src/types/entities.ts:188](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L188)

___

### TUserRole

Ƭ **TUserRole**: *administrator* \| *author* \| *customer* \| *guest*

Defined in: [system/core/common/src/types/entities.ts:179](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/types/entities.ts#L179)

## Variables

### GraphQLPaths

• `Const` **GraphQLPaths**: { [K in Exclude<TDBEntity, "Theme" \| "Plugin" \| "PostComment" \| "CMS"\>]: TGraphQLNode}

Defined in: [system/core/common/src/constants.ts:17](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L17)

___

### apiV1BaseRoute

• `Const` **apiV1BaseRoute**: *api/v1*= 'api/v1'

Defined in: [system/core/common/src/constants.ts:119](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L119)

___

### currentApiVersion

• `Const` **currentApiVersion**: *1.0.0*= '1.0.0'

Defined in: [system/core/common/src/constants.ts:118](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L118)

___

### genericPageName

• `Const` **genericPageName**: *pages/[slug]*= 'pages/[slug]'

Defined in: [system/core/common/src/constants.ts:190](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L190)

___

### logLevels

• `Const` **logLevels**: *string*[]

Defined in: [system/core/common/src/constants.ts:171](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L171)

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

Defined in: [system/core/common/src/constants.ts:151](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L151)

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

Defined in: [system/core/common/src/GlobalStore.ts:108](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L108)

___

### getCmsSettings

▸ `Const`**getCmsSettings**(): *undefined* \| *TCmsSettings*

**Returns:** *undefined* \| *TCmsSettings*

Defined in: [system/core/common/src/GlobalStore.ts:69](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L69)

___

### getCommonComponent

▸ `Const`**getCommonComponent**(`componentName`: *string*): *undefined* \| *ComponentClass*<*TCommonComponentProps* & *Record*<string, any\>, any\> \| *FunctionComponent*<*TCommonComponentProps* & *Record*<string, any\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`componentName` | *string* |

**Returns:** *undefined* \| *ComponentClass*<*TCommonComponentProps* & *Record*<string, any\>, any\> \| *FunctionComponent*<*TCommonComponentProps* & *Record*<string, any\>\>

Defined in: [system/core/common/src/GlobalStore.ts:93](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L93)

___

### getPageCustomConfig

▸ `Const`**getPageCustomConfig**(): *undefined* \| *Record*<string, any\>

**Returns:** *undefined* \| *Record*<string, any\>

Defined in: [system/core/common/src/GlobalStore.ts:64](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L64)

___

### getRandStr

▸ `Const`**getRandStr**(`lenght?`: *number*): *string*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`lenght` | *number* | 12 |

**Returns:** *string*

Defined in: [system/core/common/src/constants.ts:185](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L185)

___

### getStore

▸ `Const`**getStore**(): *TCromwellStore*

**Returns:** *TCromwellStore*

Defined in: [system/core/common/src/GlobalStore.ts:18](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L18)

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

Defined in: [system/core/common/src/GlobalStore.ts:27](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L27)

___

### getThemeCustomConfig

▸ `Const`**getThemeCustomConfig**(): *undefined* \| *Record*<string, any\>

**Returns:** *undefined* \| *Record*<string, any\>

Defined in: [system/core/common/src/GlobalStore.ts:74](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L74)

___

### getThemeCustomConfigProp

▸ `Const`**getThemeCustomConfigProp**(`propPath`: *string*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`propPath` | *string* |

**Returns:** *any*

Defined in: [system/core/common/src/GlobalStore.ts:78](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L78)

___

### isServer

▸ `Const`**isServer**(): *boolean*

**Returns:** *boolean*

Defined in: [system/core/common/src/constants.ts:116](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L116)

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

Defined in: [system/core/common/src/constants.ts:181](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L181)

___

### logLevelMoreThan

▸ `Const`**logLevelMoreThan**(`level`: *TLogLevel*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`level` | *TLogLevel* |

**Returns:** *boolean*

Defined in: [system/core/common/src/constants.ts:173](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L173)

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

Defined in: [system/core/common/src/GlobalStore.ts:42](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L42)

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

Defined in: [system/core/common/src/GlobalStore.ts:56](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L56)

___

### saveCommonComponent

▸ `Const`**saveCommonComponent**(`componentName`: *string*, `component`: *ComponentType*<TCommonComponentProps\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`componentName` | *string* |
`component` | *ComponentType*<TCommonComponentProps\> |

**Returns:** *void*

Defined in: [system/core/common/src/GlobalStore.ts:99](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L99)

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

Defined in: [system/core/common/src/GlobalStore.ts:31](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/GlobalStore.ts#L31)

___

### sleep

▸ `Const`**sleep**(`time`: *number*): *Promise*<unknown\>

#### Parameters:

Name | Type |
:------ | :------ |
`time` | *number* |

**Returns:** *Promise*<unknown\>

Defined in: [system/core/common/src/constants.ts:192](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/common/src/constants.ts#L192)
