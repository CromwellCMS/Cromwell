[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CRestApiClient

# Class: CRestApiClient

[frontend](../modules/frontend.md).CRestApiClient

CRestApiClient - CromwellCMS REST API Client

## Table of contents

### Methods

- [activatePlugin](#activateplugin)
- [activateTheme](#activatetheme)
- [buildSitemap](#buildsitemap)
- [changeTheme](#changetheme)
- [createPaymentSession](#createpaymentsession)
- [createPublicDir](#createpublicdir)
- [delete](#delete)
- [deletePage](#deletepage)
- [deletePlugin](#deleteplugin)
- [deleteTheme](#deletetheme)
- [downloadPublicFile](#downloadpublicfile)
- [exportDB](#exportdb)
- [fetch](#fetch)
- [forgotPassword](#forgotpassword)
- [get](#get)
- [getAdminCmsSettings](#getadmincmssettings)
- [getBaseUrl](#getbaseurl)
- [getCmsSettings](#getcmssettings)
- [getCmsStats](#getcmsstats)
- [getCmsStatus](#getcmsstatus)
- [getOrderTotal](#getordertotal)
- [getPageConfig](#getpageconfig)
- [getPageConfigs](#getpageconfigs)
- [getPagesInfo](#getpagesinfo)
- [getPluginAdminBundle](#getpluginadminbundle)
- [getPluginFrontendBundle](#getpluginfrontendbundle)
- [getPluginList](#getpluginlist)
- [getPluginNames](#getpluginnames)
- [getPluginSettings](#getpluginsettings)
- [getPluginUpdate](#getpluginupdate)
- [getPluginsAtPage](#getpluginsatpage)
- [getThemeConfig](#getthemeconfig)
- [getThemeInfo](#getthemeinfo)
- [getThemePageBundle](#getthemepagebundle)
- [getThemeUpdate](#getthemeupdate)
- [getThemesInfo](#getthemesinfo)
- [getUserInfo](#getuserinfo)
- [importDB](#importdb)
- [installPlugin](#installplugin)
- [installTheme](#installtheme)
- [launchCmsUpdate](#launchcmsupdate)
- [logOut](#logout)
- [login](#login)
- [onError](#onerror)
- [onUnauthorized](#onunauthorized)
- [placeOrder](#placeorder)
- [placeProductReview](#placeproductreview)
- [post](#post)
- [put](#put)
- [readPublicDir](#readpublicdir)
- [removeOnError](#removeonerror)
- [removeOnUnauthorized](#removeonunauthorized)
- [removePublicDir](#removepublicdir)
- [resetPage](#resetpage)
- [resetPassword](#resetpassword)
- [saveCmsSettings](#savecmssettings)
- [savePageConfig](#savepageconfig)
- [savePluginSettings](#savepluginsettings)
- [signUp](#signup)
- [updatePlugin](#updateplugin)
- [updateTheme](#updatetheme)
- [uploadPublicFiles](#uploadpublicfiles)

## Methods

### activatePlugin

▸ **activatePlugin**(`pluginName`, `options?`): `Promise`<`boolean`\>

Active disabled Plugin

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:449

___

### activateTheme

▸ **activateTheme**(`themeName`, `options?`): `Promise`<`boolean`\>

Active disabled Theme

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeName` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:440

___

### buildSitemap

▸ **buildSitemap**(`options?`): `Promise`<`undefined` \| `TCmsSettings`\>

Build sitemap at /default_sitemap.xml

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TCmsSettings`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:573

___

### changeTheme

▸ **changeTheme**(`themeName`, `options?`): `Promise`<`boolean`\>

Set active Theme

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeName` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:458

___

### createPaymentSession

▸ **createPaymentSession**(`input`, `options?`): `Promise`<`undefined` \| `TPaymentSession`\>

Calculate total price of a cart and creates a payment session via service provider

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TPaymentSession` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TPaymentSession`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:475

___

### createPublicDir

▸ **createPublicDir**(`dirName`, `inPath?`, `options?`): `Promise`<`undefined` \| ``null`` \| `string`[]\>

Crates a public directory by specified path

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `dirName` | `string` |
| `inPath?` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| ``null`` \| `string`[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:359

___

### delete

▸ **delete**<`T`\>(`route`, `options?`): `Promise`<`T`\>

Makes DELETE request to specified route

**`auth`** no

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:207

___

### deletePage

▸ **deletePage**(`pageRoute`, `options?`): `Promise`<`undefined` \| `boolean`\>

Delete generic page of currently active Theme

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageRoute` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:637

___

### deletePlugin

▸ **deletePlugin**(`pluginName`, `options?`): `Promise`<`undefined` \| `boolean`\>

Delete (uninstall) Plugin

**`auth`** admin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginName` | `string` | npm package name of Plugin |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:759

___

### deleteTheme

▸ **deleteTheme**(`themeName`, `options?`): `Promise`<`undefined` \| `boolean`\>

Delete (uninstall) Theme

**`auth`** admin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `themeName` | `string` | npm package name of a Theme |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:612

___

### downloadPublicFile

▸ **downloadPublicFile**(`fileName`, `inPath?`, `options?`): `Promise`<`void`\>

Download a public file

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileName` | `string` |
| `inPath?` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:367

___

### exportDB

▸ **exportDB**(`tables?`, `options?`): `Promise`<`void`\>

Export database into Excel (.xlsx) file.

**`auth`** admin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tables?` | (``"Theme"`` \| ``"Plugin"`` \| ``"Attribute"`` \| ``"Post"`` \| ``"PostComment"`` \| ``"Tag"`` \| ``"Product"`` \| ``"ProductCategory"`` \| ``"ProductReview"`` \| ``"Order"`` \| ``"User"`` \| ``"Generic"`` \| ``"CMS"``)[] | specify tables to export or export all if not provided |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`void`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:524

___

### fetch

▸ **fetch**<`T`\>(`route`, `options?`): `Promise`<`T`\>

Make a custom request to a specified route

**`auth`** no

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:148

___

### forgotPassword

▸ **forgotPassword**(`credentials`, `options?`): `Promise`<`undefined` \| `boolean`\>

Initiate reset password transaction. Will send a code to user's email

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `credentials` | `Object` |
| `credentials.email` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:268

___

### get

▸ **get**<`T`\>(`route`, `options?`): `Promise`<`T`\>

Makes GET request to specified route

**`auth`** no

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:187

___

### getAdminCmsSettings

▸ **getAdminCmsSettings**(`options?`): `Promise`<`TCmsConfig` & `TCmsPublicSettings` & `TCmsAdminSettings` & `TCmsInternalSettings` & { `robotsContent?`: `string`  }\>

Get admin CMS settings

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`TCmsConfig` & `TCmsPublicSettings` & `TCmsAdminSettings` & `TCmsInternalSettings` & { `robotsContent?`: `string`  }\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:331

___

### getBaseUrl

▸ **getBaseUrl**(): `string`

#### Returns

`string`

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:63

___

### getCmsSettings

▸ **getCmsSettings**(`options?`): `Promise`<`TCmsSettings`\>

Get public CMS settings

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`TCmsSettings`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:323

___

### getCmsStats

▸ **getCmsStats**(`options?`): `Promise`<`undefined` \| `TCmsStats`\>

Get CMS recent statistics, for Admin panel home page

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TCmsStats`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:499

___

### getCmsStatus

▸ **getCmsStatus**(`options?`): `Promise`<`undefined` \| `TCmsStatus`\>

Get CMS updates info

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TCmsStatus`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:507

___

### getOrderTotal

▸ **getOrderTotal**(`input`, `options?`): `Promise`<`undefined` \| `TOrder`\>

Calculate total price of a cart

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TOrderInput` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TOrder`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:467

___

### getPageConfig

▸ **getPageConfig**(`pageRoute`, `options?`): `Promise`<`undefined` \| `TPageConfig`\>

Get page config by page route of currently active Theme

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageRoute` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TPageConfig`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:620

___

### getPageConfigs

▸ **getPageConfigs**(`options?`): `Promise`<`undefined` \| `TPageConfig`[]\>

Get all page config of currently active Theme

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TPageConfig`[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:681

___

### getPagesInfo

▸ **getPagesInfo**(`options?`): `Promise`<`undefined` \| `TPageInfo`[]\>

Get all pages info of currently active Theme

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TPageInfo`[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:673

___

### getPluginAdminBundle

▸ **getPluginAdminBundle**(`pluginName`, `options?`): `Promise`<`undefined` \| `TFrontendBundle`\>

Get admin panel bundle of Plugin

**`auth`** no

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginName` | `string` | npm package name of Plugin |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`undefined` \| `TFrontendBundle`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:796

___

### getPluginFrontendBundle

▸ **getPluginFrontendBundle**(`pluginName`, `options?`): `Promise`<`undefined` \| `TFrontendBundle`\>

Get frontend bundle of Plugin

**`auth`** no

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginName` | `string` | npm package name of Plugin |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`undefined` \| `TFrontendBundle`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:787

___

### getPluginList

▸ **getPluginList**(`options?`): `Promise`<`undefined` \| `TPackageCromwellConfig`[]\>

List all installed Plugins

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TPackageCromwellConfig`[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:425

___

### getPluginNames

▸ **getPluginNames**(`options?`): `Promise`<`undefined` \| `string`[]\>

Get all used Plugins in currently active Theme

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `string`[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:665

___

### getPluginSettings

▸ **getPluginSettings**(`pluginName`, `options?`): `Promise`<`any`\>

Get settings of Plugin

**`auth`** no

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginName` | `string` | npm package name of Plugin |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`any`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:768

___

### getPluginUpdate

▸ **getPluginUpdate**(`pluginName`, `options?`): `Promise`<`undefined` \| `TCCSVersion`\>

Get available update info for Plugin

**`auth`** admin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginName` | `string` | npm package name of Plugin |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`undefined` \| `TCCSVersion`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:732

___

### getPluginsAtPage

▸ **getPluginsAtPage**(`pageRoute`, `options?`): `Promise`<`undefined` \| { `instanceSettings`: `any` ; `pluginName`: `string` ; `version?`: `string`  }[]\>

Get all used Plugins at specified page of currently active Theme

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageRoute` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| { `instanceSettings`: `any` ; `pluginName`: `string` ; `version?`: `string`  }[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:653

___

### getThemeConfig

▸ **getThemeConfig**(`options?`): `Promise`<`undefined` \| `TThemeConfig`\>

Get theme config of currently active Theme

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TThemeConfig`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:697

___

### getThemeInfo

▸ **getThemeInfo**(`options?`): `Promise`<`undefined` \| `TPackageCromwellConfig`\>

Get theme info of currently active Theme

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TPackageCromwellConfig`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:689

___

### getThemePageBundle

▸ **getThemePageBundle**(`pageRoute`, `options?`): `Promise`<`undefined` \| `TFrontendBundle`\>

Get Admin panel page bundle by specified route of currently active Theme

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageRoute` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TFrontendBundle`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:710

___

### getThemeUpdate

▸ **getThemeUpdate**(`themeName`, `options?`): `Promise`<`undefined` \| `TCCSVersion`\>

Check if Theme has available update

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeName` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TCCSVersion`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:586

___

### getThemesInfo

▸ **getThemesInfo**(`options?`): `Promise`<`undefined` \| `TPackageCromwellConfig`[]\>

Get info about currently used Theme

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TPackageCromwellConfig`[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:417

___

### getUserInfo

▸ **getUserInfo**(`options?`): `Promise`<`undefined` \| `TUser`\>

Returns currently logged user profile

**`auth`** any

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TUser`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:252

___

### importDB

▸ **importDB**(`files`, `options?`): `Promise`<`undefined` \| ``null`` \| `boolean`\>

Import database from Excel (.xlsx) file/files

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `files` | `File`[] |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| ``null`` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:550

___

### installPlugin

▸ **installPlugin**(`pluginName`, `options?`): `Promise`<`undefined` \| `boolean`\>

Install a new Plugin

**`auth`** admin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginName` | `string` | npm package name of Plugin |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:750

___

### installTheme

▸ **installTheme**(`themeName`, `options?`): `Promise`<`undefined` \| `boolean`\>

Install a new Theme

**`auth`** admin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `themeName` | `string` | npm package name of a Theme |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:603

___

### launchCmsUpdate

▸ **launchCmsUpdate**(`options?`): `Promise`<`undefined` \| `boolean`\>

Launch CMS update

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:515

___

### logOut

▸ **logOut**(`options?`): `Promise`<`any`\>

Logs user out via cookies

**`auth`** any

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`any`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:243

___

### login

▸ **login**(`credentials`, `options?`): `Promise`<`undefined` \| `TUser`\>

Logs user in via cookies

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `credentials` | `Object` |
| `credentials.email` | `string` |
| `credentials.password` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TUser`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:232

___

### onError

▸ **onError**(`cb`, `id?`): `void`

Add on error callback. Triggers if any of methods of this
client get any type of error

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`info`: [`TErrorInfo`](../modules/frontend.md#terrorinfo)) => `any` |
| `id?` | `string` |

#### Returns

`void`

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:304

___

### onUnauthorized

▸ **onUnauthorized**(`callback`, `id?`): `void`

Add on unauthorized error callback. Triggers if any of methods of this
client get unauthorized error

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`route`: `string`) => `any` |
| `id?` | `string` |

#### Returns

`void`

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:288

___

### placeOrder

▸ **placeOrder**(`input`, `options?`): `Promise`<`undefined` \| `TOrder`\>

Place a new order in the store

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TOrderInput` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TOrder`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:483

___

### placeProductReview

▸ **placeProductReview**(`input`, `options?`): `Promise`<`undefined` \| `TProductReview`\>

Place a review about some product

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TProductReviewInput` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TProductReview`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:491

___

### post

▸ **post**<`T`\>(`route`, `input?`, `options?`): `Promise`<`T`\>

Makes POST request to specified route

**`auth`** no

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |
| `input?` | `any` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:195

___

### put

▸ **put**<`T`\>(`route`, `input?`, `options?`): `Promise`<`T`\>

Makes PUT request to specified route

**`auth`** no

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |
| `input?` | `any` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:218

___

### readPublicDir

▸ **readPublicDir**(`path?`, `options?`): `Promise`<`undefined` \| ``null`` \| `string`[]\>

List files in a public directory by specified path

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| ``null`` \| `string`[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:351

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

system/core/frontend/src/api/CRestApiClient.ts:312

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

system/core/frontend/src/api/CRestApiClient.ts:296

___

### removePublicDir

▸ **removePublicDir**(`dirName`, `inPath?`, `options?`): `Promise`<`undefined` \| ``null`` \| `string`[]\>

Removes a public directory by specified path

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `dirName` | `string` |
| `inPath?` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| ``null`` \| `string`[]\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:391

___

### resetPage

▸ **resetPage**(`pageRoute`, `options?`): `Promise`<`undefined` \| `boolean`\>

Remove all user's modifications for specified page of currently active Theme

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageRoute` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:645

___

### resetPassword

▸ **resetPassword**(`credentials`, `options?`): `Promise`<`undefined` \| `boolean`\>

Finish reset password transaction. Set a new password

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `credentials` | `Object` |
| `credentials.code` | `string` |
| `credentials.email` | `string` |
| `credentials.newPassword` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:276

___

### saveCmsSettings

▸ **saveCmsSettings**(`input`, `options?`): `Promise`<`undefined` \| `TCmsSettings`\>

Update CMS settings

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TCmsConfig` & `TCmsPublicSettings` & `TCmsAdminSettings` & `TCmsInternalSettings` & { `robotsContent?`: `string`  } |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TCmsSettings`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:341

___

### savePageConfig

▸ **savePageConfig**(`config`, `options?`): `Promise`<`boolean`\>

Update page config by page route of currently active Theme

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `TPageConfig` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:628

___

### savePluginSettings

▸ **savePluginSettings**(`pluginName`, `settings`, `options?`): `Promise`<`boolean`\>

Save settings for Plugin

**`auth`** admin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginName` | `string` | npm package name of Plugin |
| `settings` | `any` | - |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:777

___

### signUp

▸ **signUp**(`credentials`, `options?`): `Promise`<`undefined` \| `TUser`\>

Sign up a new user

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `credentials` | `TCreateUser` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TUser`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:260

___

### updatePlugin

▸ **updatePlugin**(`pluginName`, `options?`): `Promise`<`undefined` \| `boolean`\>

Launch Plugin update

**`auth`** admin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginName` | `string` | npm package name of Plugin |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) | - |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:741

___

### updateTheme

▸ **updateTheme**(`themeName`, `options?`): `Promise`<`undefined` \| `boolean`\>

Launch Theme update

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `themeName` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:594

___

### uploadPublicFiles

▸ **uploadPublicFiles**(`inPath`, `files`, `options?`): `Promise`<`undefined` \| ``null`` \| `boolean`\>

Upload files in specified public directory

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `inPath` | `string` |
| `files` | `File`[] |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| ``null`` \| `boolean`\>

#### Defined in

system/core/frontend/src/api/CRestApiClient.ts:399
