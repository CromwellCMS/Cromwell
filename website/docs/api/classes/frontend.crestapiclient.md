[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CRestAPIClient

# Class: CRestAPIClient

[frontend](../modules/frontend.md).CRestAPIClient

CRestAPIClient - CromwellCMS REST API Client

## Table of contents

### Methods

- [activatePlugin](frontend.CRestAPIClient.md#activateplugin)
- [activateTheme](frontend.CRestAPIClient.md#activatetheme)
- [changeTheme](frontend.CRestAPIClient.md#changetheme)
- [createPaymentSession](frontend.CRestAPIClient.md#createpaymentsession)
- [createPublicDir](frontend.CRestAPIClient.md#createpublicdir)
- [delete](frontend.CRestAPIClient.md#delete)
- [deletePage](frontend.CRestAPIClient.md#deletepage)
- [deletePlugin](frontend.CRestAPIClient.md#deleteplugin)
- [deleteTheme](frontend.CRestAPIClient.md#deletetheme)
- [exportDB](frontend.CRestAPIClient.md#exportdb)
- [fetch](frontend.CRestAPIClient.md#fetch)
- [forgotPassword](frontend.CRestAPIClient.md#forgotpassword)
- [get](frontend.CRestAPIClient.md#get)
- [getAdminCmsSettings](frontend.CRestAPIClient.md#getadmincmssettings)
- [getBaseUrl](frontend.CRestAPIClient.md#getbaseurl)
- [getCmsSettings](frontend.CRestAPIClient.md#getcmssettings)
- [getCmsSettingsAndSave](frontend.CRestAPIClient.md#getcmssettingsandsave)
- [getCmsStats](frontend.CRestAPIClient.md#getcmsstats)
- [getCmsStatus](frontend.CRestAPIClient.md#getcmsstatus)
- [getOrderTotal](frontend.CRestAPIClient.md#getordertotal)
- [getPageConfig](frontend.CRestAPIClient.md#getpageconfig)
- [getPageConfigs](frontend.CRestAPIClient.md#getpageconfigs)
- [getPagesInfo](frontend.CRestAPIClient.md#getpagesinfo)
- [getPluginAdminBundle](frontend.CRestAPIClient.md#getpluginadminbundle)
- [getPluginFrontendBundle](frontend.CRestAPIClient.md#getpluginfrontendbundle)
- [getPluginList](frontend.CRestAPIClient.md#getpluginlist)
- [getPluginNames](frontend.CRestAPIClient.md#getpluginnames)
- [getPluginSettings](frontend.CRestAPIClient.md#getpluginsettings)
- [getPluginUpdate](frontend.CRestAPIClient.md#getpluginupdate)
- [getPluginsAtPage](frontend.CRestAPIClient.md#getpluginsatpage)
- [getThemeConfig](frontend.CRestAPIClient.md#getthemeconfig)
- [getThemeInfo](frontend.CRestAPIClient.md#getthemeinfo)
- [getThemePageBundle](frontend.CRestAPIClient.md#getthemepagebundle)
- [getThemeUpdate](frontend.CRestAPIClient.md#getthemeupdate)
- [getThemesInfo](frontend.CRestAPIClient.md#getthemesinfo)
- [getUserInfo](frontend.CRestAPIClient.md#getuserinfo)
- [importDB](frontend.CRestAPIClient.md#importdb)
- [installPlugin](frontend.CRestAPIClient.md#installplugin)
- [installTheme](frontend.CRestAPIClient.md#installtheme)
- [launchCmsUpdate](frontend.CRestAPIClient.md#launchcmsupdate)
- [logOut](frontend.CRestAPIClient.md#logout)
- [login](frontend.CRestAPIClient.md#login)
- [onError](frontend.CRestAPIClient.md#onerror)
- [onUnauthorized](frontend.CRestAPIClient.md#onunauthorized)
- [placeOrder](frontend.CRestAPIClient.md#placeorder)
- [placeProductReview](frontend.CRestAPIClient.md#placeproductreview)
- [post](frontend.CRestAPIClient.md#post)
- [put](frontend.CRestAPIClient.md#put)
- [readPublicDir](frontend.CRestAPIClient.md#readpublicdir)
- [removeOnError](frontend.CRestAPIClient.md#removeonerror)
- [removeOnUnauthorized](frontend.CRestAPIClient.md#removeonunauthorized)
- [removePublicDir](frontend.CRestAPIClient.md#removepublicdir)
- [resetPage](frontend.CRestAPIClient.md#resetpage)
- [resetPassword](frontend.CRestAPIClient.md#resetpassword)
- [saveCmsSettings](frontend.CRestAPIClient.md#savecmssettings)
- [savePageConfig](frontend.CRestAPIClient.md#savepageconfig)
- [savePluginSettings](frontend.CRestAPIClient.md#savepluginsettings)
- [signUp](frontend.CRestAPIClient.md#signup)
- [updatePlugin](frontend.CRestAPIClient.md#updateplugin)
- [updateTheme](frontend.CRestAPIClient.md#updatetheme)
- [uploadPublicFiles](frontend.CRestAPIClient.md#uploadpublicfiles)

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

[system/core/frontend/src/api/CRestAPIClient.ts:432](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L432)

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

[system/core/frontend/src/api/CRestAPIClient.ts:423](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L423)

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

[system/core/frontend/src/api/CRestAPIClient.ts:441](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L441)

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

[system/core/frontend/src/api/CRestAPIClient.ts:458](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L458)

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

[system/core/frontend/src/api/CRestAPIClient.ts:368](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L368)

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

[system/core/frontend/src/api/CRestAPIClient.ts:208](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L208)

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

[system/core/frontend/src/api/CRestAPIClient.ts:612](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L612)

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

[system/core/frontend/src/api/CRestAPIClient.ts:734](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L734)

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

[system/core/frontend/src/api/CRestAPIClient.ts:587](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L587)

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

[system/core/frontend/src/api/CRestAPIClient.ts:507](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L507)

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

[system/core/frontend/src/api/CRestAPIClient.ts:149](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L149)

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

[system/core/frontend/src/api/CRestAPIClient.ts:269](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L269)

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

[system/core/frontend/src/api/CRestAPIClient.ts:188](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L188)

___

### getAdminCmsSettings

▸ **getAdminCmsSettings**(`options?`): `Promise`<`TCmsConfig` & `TCmsPublicSettings` & `TCmsAdminSettings` & `TCmsInternalSettings` & { `cmsInfo?`: `TCmsInfo`  }\>

Get admin CMS settings

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`TCmsConfig` & `TCmsPublicSettings` & `TCmsAdminSettings` & `TCmsInternalSettings` & { `cmsInfo?`: `TCmsInfo`  }\>

#### Defined in

[system/core/frontend/src/api/CRestAPIClient.ts:332](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L332)

___

### getBaseUrl

▸ **getBaseUrl**(): `string`

#### Returns

`string`

#### Defined in

[system/core/frontend/src/api/CRestAPIClient.ts:64](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L64)

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

[system/core/frontend/src/api/CRestAPIClient.ts:324](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L324)

___

### getCmsSettingsAndSave

▸ **getCmsSettingsAndSave**(`options?`): `Promise`<`undefined` \| `TCmsSettings`\>

Get public CMS settings and save into the store

**`auth`** no

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TCmsSettings`\>

#### Defined in

[system/core/frontend/src/api/CRestAPIClient.ts:340](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L340)

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

[system/core/frontend/src/api/CRestAPIClient.ts:482](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L482)

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

[system/core/frontend/src/api/CRestAPIClient.ts:490](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L490)

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

[system/core/frontend/src/api/CRestAPIClient.ts:450](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L450)

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

[system/core/frontend/src/api/CRestAPIClient.ts:595](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L595)

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

[system/core/frontend/src/api/CRestAPIClient.ts:656](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L656)

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

[system/core/frontend/src/api/CRestAPIClient.ts:648](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L648)

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

[system/core/frontend/src/api/CRestAPIClient.ts:771](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L771)

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

[system/core/frontend/src/api/CRestAPIClient.ts:762](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L762)

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

[system/core/frontend/src/api/CRestAPIClient.ts:410](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L410)

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

[system/core/frontend/src/api/CRestAPIClient.ts:640](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L640)

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

[system/core/frontend/src/api/CRestAPIClient.ts:743](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L743)

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

[system/core/frontend/src/api/CRestAPIClient.ts:707](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L707)

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

[system/core/frontend/src/api/CRestAPIClient.ts:628](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L628)

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

[system/core/frontend/src/api/CRestAPIClient.ts:672](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L672)

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

[system/core/frontend/src/api/CRestAPIClient.ts:664](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L664)

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

[system/core/frontend/src/api/CRestAPIClient.ts:685](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L685)

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

[system/core/frontend/src/api/CRestAPIClient.ts:561](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L561)

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

[system/core/frontend/src/api/CRestAPIClient.ts:402](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L402)

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

[system/core/frontend/src/api/CRestAPIClient.ts:253](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L253)

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

[system/core/frontend/src/api/CRestAPIClient.ts:533](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L533)

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

[system/core/frontend/src/api/CRestAPIClient.ts:725](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L725)

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

[system/core/frontend/src/api/CRestAPIClient.ts:578](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L578)

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

[system/core/frontend/src/api/CRestAPIClient.ts:498](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L498)

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

[system/core/frontend/src/api/CRestAPIClient.ts:244](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L244)

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

[system/core/frontend/src/api/CRestAPIClient.ts:233](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L233)

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

[system/core/frontend/src/api/CRestAPIClient.ts:305](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L305)

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

[system/core/frontend/src/api/CRestAPIClient.ts:289](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L289)

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

[system/core/frontend/src/api/CRestAPIClient.ts:466](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L466)

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

[system/core/frontend/src/api/CRestAPIClient.ts:474](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L474)

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

[system/core/frontend/src/api/CRestAPIClient.ts:196](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L196)

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

[system/core/frontend/src/api/CRestAPIClient.ts:219](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L219)

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

[system/core/frontend/src/api/CRestAPIClient.ts:360](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L360)

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

[system/core/frontend/src/api/CRestAPIClient.ts:313](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L313)

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

[system/core/frontend/src/api/CRestAPIClient.ts:297](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L297)

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

[system/core/frontend/src/api/CRestAPIClient.ts:376](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L376)

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

[system/core/frontend/src/api/CRestAPIClient.ts:620](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L620)

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

[system/core/frontend/src/api/CRestAPIClient.ts:277](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L277)

___

### saveCmsSettings

▸ **saveCmsSettings**(`input`, `options?`): `Promise`<`undefined` \| `TCmsSettings`\>

Update CMS settings

**`auth`** admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TCmsSettings` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `TCmsSettings`\>

#### Defined in

[system/core/frontend/src/api/CRestAPIClient.ts:352](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L352)

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

[system/core/frontend/src/api/CRestAPIClient.ts:603](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L603)

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

[system/core/frontend/src/api/CRestAPIClient.ts:752](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L752)

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

[system/core/frontend/src/api/CRestAPIClient.ts:261](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L261)

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

[system/core/frontend/src/api/CRestAPIClient.ts:716](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L716)

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

[system/core/frontend/src/api/CRestAPIClient.ts:569](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L569)

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

[system/core/frontend/src/api/CRestAPIClient.ts:384](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L384)
