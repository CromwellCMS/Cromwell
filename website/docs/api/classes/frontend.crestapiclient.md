[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CRestAPIClient

# Class: CRestAPIClient

[frontend](../modules/frontend.md).CRestAPIClient

CRestAPIClient - CromwellCMS REST API Client

## Table of contents

### Constructors

- [constructor](frontend.crestapiclient.md#constructor)

### Methods

- [activatePlugin](frontend.crestapiclient.md#activateplugin)
- [activateTheme](frontend.crestapiclient.md#activatetheme)
- [changeTheme](frontend.crestapiclient.md#changetheme)
- [createPublicDir](frontend.crestapiclient.md#createpublicdir)
- [delete](frontend.crestapiclient.md#delete)
- [deletePage](frontend.crestapiclient.md#deletepage)
- [deletePlugin](frontend.crestapiclient.md#deleteplugin)
- [deleteTheme](frontend.crestapiclient.md#deletetheme)
- [exportDB](frontend.crestapiclient.md#exportdb)
- [fetch](frontend.crestapiclient.md#fetch)
- [forgotPassword](frontend.crestapiclient.md#forgotpassword)
- [get](frontend.crestapiclient.md#get)
- [getAdminCmsSettings](frontend.crestapiclient.md#getadmincmssettings)
- [getBaseUrl](frontend.crestapiclient.md#getbaseurl)
- [getCmsSettings](frontend.crestapiclient.md#getcmssettings)
- [getCmsSettingsAndSave](frontend.crestapiclient.md#getcmssettingsandsave)
- [getCmsStats](frontend.crestapiclient.md#getcmsstats)
- [getCmsStatus](frontend.crestapiclient.md#getcmsstatus)
- [getOrderTotal](frontend.crestapiclient.md#getordertotal)
- [getPageConfig](frontend.crestapiclient.md#getpageconfig)
- [getPageConfigs](frontend.crestapiclient.md#getpageconfigs)
- [getPagesInfo](frontend.crestapiclient.md#getpagesinfo)
- [getPluginAdminBundle](frontend.crestapiclient.md#getpluginadminbundle)
- [getPluginFrontendBundle](frontend.crestapiclient.md#getpluginfrontendbundle)
- [getPluginList](frontend.crestapiclient.md#getpluginlist)
- [getPluginNames](frontend.crestapiclient.md#getpluginnames)
- [getPluginSettings](frontend.crestapiclient.md#getpluginsettings)
- [getPluginUpdate](frontend.crestapiclient.md#getpluginupdate)
- [getPluginsAtPage](frontend.crestapiclient.md#getpluginsatpage)
- [getThemeConfig](frontend.crestapiclient.md#getthemeconfig)
- [getThemeInfo](frontend.crestapiclient.md#getthemeinfo)
- [getThemePageBundle](frontend.crestapiclient.md#getthemepagebundle)
- [getThemeUpdate](frontend.crestapiclient.md#getthemeupdate)
- [getThemesInfo](frontend.crestapiclient.md#getthemesinfo)
- [getUserInfo](frontend.crestapiclient.md#getuserinfo)
- [importDB](frontend.crestapiclient.md#importdb)
- [installPlugin](frontend.crestapiclient.md#installplugin)
- [installTheme](frontend.crestapiclient.md#installtheme)
- [launchCmsUpdate](frontend.crestapiclient.md#launchcmsupdate)
- [logOut](frontend.crestapiclient.md#logout)
- [login](frontend.crestapiclient.md#login)
- [onError](frontend.crestapiclient.md#onerror)
- [onUnauthorized](frontend.crestapiclient.md#onunauthorized)
- [placeOrder](frontend.crestapiclient.md#placeorder)
- [placeProductReview](frontend.crestapiclient.md#placeproductreview)
- [post](frontend.crestapiclient.md#post)
- [put](frontend.crestapiclient.md#put)
- [readPublicDir](frontend.crestapiclient.md#readpublicdir)
- [removeOnError](frontend.crestapiclient.md#removeonerror)
- [removeOnUnauthorized](frontend.crestapiclient.md#removeonunauthorized)
- [removePublicDir](frontend.crestapiclient.md#removepublicdir)
- [resetPage](frontend.crestapiclient.md#resetpage)
- [resetPassword](frontend.crestapiclient.md#resetpassword)
- [savePageConfig](frontend.crestapiclient.md#savepageconfig)
- [savePluginSettings](frontend.crestapiclient.md#savepluginsettings)
- [signUp](frontend.crestapiclient.md#signup)
- [updateCmsConfig](frontend.crestapiclient.md#updatecmsconfig)
- [updatePlugin](frontend.crestapiclient.md#updateplugin)
- [updateTheme](frontend.crestapiclient.md#updatetheme)
- [uploadPublicFiles](frontend.crestapiclient.md#uploadpublicfiles)

## Constructors

### constructor

\+ **new CRestAPIClient**(): [*CRestAPIClient*](frontend.crestapiclient.md)

**Returns:** [*CRestAPIClient*](frontend.crestapiclient.md)

## Methods

### activatePlugin

▸ **activatePlugin**(`pluginName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<boolean\>

Active disabled Plugin

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`pluginName` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:391](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L391)

___

### activateTheme

▸ **activateTheme**(`themeName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<boolean\>

Active disabled Theme

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`themeName` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:382](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L382)

___

### changeTheme

▸ **changeTheme**(`themeName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<boolean\>

Set active Theme

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`themeName` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:400](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L400)

___

### createPublicDir

▸ **createPublicDir**(`dirName`: *string*, `inPath?`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| *null* \| string[]\>

Crates a public directory by specified path

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`dirName` | *string* |
`inPath?` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| *null* \| string[]\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:319](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L319)

___

### delete

▸ **delete**<T\>(`route`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| T\>

Makes DELETE request to specified route

**`auth`** no

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`route` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| T\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:167](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L167)

___

### deletePage

▸ **deletePage**(`pageRoute`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Delete generic page of currently active Theme

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`pageRoute` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:563](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L563)

___

### deletePlugin

▸ **deletePlugin**(`pluginName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Delete (uninstall) Plugin

**`auth`** admin

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pluginName` | *string* | npm package name of Plugin   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:673](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L673)

___

### deleteTheme

▸ **deleteTheme**(`themeName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Delete (uninstall) Theme

**`auth`** admin

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`themeName` | *string* | npm package name of a Theme   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:538](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L538)

___

### exportDB

▸ **exportDB**(`tables?`: (*Attribute* \| *Plugin* \| *Theme* \| *Post* \| *PostComment* \| *Tag* \| *Product* \| *ProductCategory* \| *ProductReview* \| *Order* \| *User* \| *Generic* \| *CMS*)[], `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<void\>

Export database into Excel (.xlsx) file.

**`auth`** admin

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`tables?` | (*Attribute* \| *Plugin* \| *Theme* \| *Post* \| *PostComment* \| *Tag* \| *Product* \| *ProductCategory* \| *ProductReview* \| *Order* \| *User* \| *Generic* \| *CMS*)[] | specify tables to export or export all if not provided    |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<void\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:458](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L458)

___

### fetch

▸ **fetch**<T\>(`route`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| T\>

Make a custom request to a specified route

**`auth`** no

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`route` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| T\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:113](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L113)

___

### forgotPassword

▸ **forgotPassword**(`credentials`: { `email`: *string*  }, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Initiate reset password transaction. Will send a code to user's email

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`credentials` | *object* |
`credentials.email` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:228](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L228)

___

### get

▸ **get**<T\>(`route`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| T\>

Makes GET request to specified route

**`auth`** no

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`route` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| T\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:147](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L147)

___

### getAdminCmsSettings

▸ **getAdminCmsSettings**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TCmsSettings\>

Get admin CMS settings

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TCmsSettings\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:291](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L291)

___

### getBaseUrl

▸ **getBaseUrl**(): *string*

**Returns:** *string*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:64](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L64)

___

### getCmsSettings

▸ **getCmsSettings**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TCmsSettings\>

Get public CMS settings

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TCmsSettings\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:283](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L283)

___

### getCmsSettingsAndSave

▸ **getCmsSettingsAndSave**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TCmsSettings\>

Get public CMS settings and save into the store

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TCmsSettings\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:299](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L299)

___

### getCmsStats

▸ **getCmsStats**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TCmsStats\>

Get CMS recent statistics, for Admin panel home page

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TCmsStats\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:433](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L433)

___

### getCmsStatus

▸ **getCmsStatus**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TCmsStatus\>

Get CMS updates info

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TCmsStatus\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:441](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L441)

___

### getOrderTotal

▸ **getOrderTotal**(`input`: TServerCreateOrder, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TOrder\>

Calculate total price of a cart

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TServerCreateOrder |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TOrder\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:409](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L409)

___

### getPageConfig

▸ **getPageConfig**(`pageRoute`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TPageConfig\>

Get page config by page route of currently active Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`pageRoute` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TPageConfig\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:546](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L546)

___

### getPageConfigs

▸ **getPageConfigs**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TPageConfig[]\>

Get all page config of currently active Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TPageConfig[]\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:603](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L603)

___

### getPagesInfo

▸ **getPagesInfo**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TPageInfo[]\>

Get all pages info of currently active Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TPageInfo[]\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:595](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L595)

___

### getPluginAdminBundle

▸ **getPluginAdminBundle**(`pluginName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TFrontendBundle\>

Get admin panel bundle of Plugin

**`auth`** no

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pluginName` | *string* | npm package name of Plugin   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<undefined \| TFrontendBundle\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:710](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L710)

___

### getPluginFrontendBundle

▸ **getPluginFrontendBundle**(`pluginName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TFrontendBundle\>

Get frontend bundle of Plugin

**`auth`** no

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pluginName` | *string* | npm package name of Plugin   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<undefined \| TFrontendBundle\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:701](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L701)

___

### getPluginList

▸ **getPluginList**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TPackageCromwellConfig[]\>

List all installed Plugins

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TPackageCromwellConfig[]\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:361](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L361)

___

### getPluginNames

▸ **getPluginNames**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| string[]\>

Get all used Plugins in currently active Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| string[]\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:587](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L587)

___

### getPluginSettings

▸ **getPluginSettings**(`pluginName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<any\>

Get settings of Plugin

**`auth`** no

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pluginName` | *string* | npm package name of Plugin   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:682](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L682)

___

### getPluginUpdate

▸ **getPluginUpdate**(`pluginName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TCCSVersion\>

Get available update info for Plugin

**`auth`** admin

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pluginName` | *string* | npm package name of Plugin   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<undefined \| TCCSVersion\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:646](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L646)

___

### getPluginsAtPage

▸ **getPluginsAtPage**(`pageRoute`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| Record<string, [*TPluginsModifications*](../modules/frontend.md#tpluginsmodifications)\>\>

Get all used Plugins at specified page of currently active Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`pageRoute` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| Record<string, [*TPluginsModifications*](../modules/frontend.md#tpluginsmodifications)\>\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:579](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L579)

___

### getThemeConfig

▸ **getThemeConfig**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TThemeConfig\>

Get theme config of currently active Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TThemeConfig\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:619](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L619)

___

### getThemeInfo

▸ **getThemeInfo**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TPackageCromwellConfig\>

Get theme info of currently active Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TPackageCromwellConfig\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:611](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L611)

___

### getThemePageBundle

▸ **getThemePageBundle**(`pageRoute`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TFrontendBundle\>

Get Admin panel page bundle by specified route of currently active Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`pageRoute` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TFrontendBundle\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:632](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L632)

___

### getThemeUpdate

▸ **getThemeUpdate**(`themeName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TCCSVersion\>

Check if Theme has available update

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`themeName` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TCCSVersion\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:512](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L512)

___

### getThemesInfo

▸ **getThemesInfo**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TPackageCromwellConfig[]\>

Get info about currently used Theme

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TPackageCromwellConfig[]\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:353](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L353)

___

### getUserInfo

▸ **getUserInfo**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TUser\>

Returns currently logged user profile

**`auth`** any

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TUser\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:212](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L212)

___

### importDB

▸ **importDB**(`files`: File[], `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| *null* \| boolean\>

Import database from Excel (.xlsx) file/files

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`files` | File[] |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| *null* \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:484](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L484)

___

### installPlugin

▸ **installPlugin**(`pluginName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Install a new Plugin

**`auth`** admin

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pluginName` | *string* | npm package name of Plugin   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:664](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L664)

___

### installTheme

▸ **installTheme**(`themeName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Install a new Theme

**`auth`** admin

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`themeName` | *string* | npm package name of a Theme   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:529](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L529)

___

### launchCmsUpdate

▸ **launchCmsUpdate**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Launch CMS update

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:449](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L449)

___

### logOut

▸ **logOut**(`options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<unknown\>

Logs user out via cookies

**`auth`** any

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<unknown\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:203](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L203)

___

### login

▸ **login**(`credentials`: { `email`: *string* ; `password`: *string*  }, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TUser\>

Logs user in via cookies

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`credentials` | *object* |
`credentials.email` | *string* |
`credentials.password` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TUser\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:192](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L192)

___

### onError

▸ **onError**(`cb`: (`info`: [*TErrorInfo*](../modules/frontend.md#terrorinfo)) => *any*, `id?`: *string*): *void*

Add on error callback. Triggers if any of methods of this
client get any type of error

#### Parameters:

Name | Type |
:------ | :------ |
`cb` | (`info`: [*TErrorInfo*](../modules/frontend.md#terrorinfo)) => *any* |
`id?` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:264](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L264)

___

### onUnauthorized

▸ **onUnauthorized**(`callback`: (`route`: *string*) => *any*, `id?`: *string*): *void*

Add on unauthorized error callback. Triggers if any of methods of this
client get unauthorized error

#### Parameters:

Name | Type |
:------ | :------ |
`callback` | (`route`: *string*) => *any* |
`id?` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:248](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L248)

___

### placeOrder

▸ **placeOrder**(`input`: TServerCreateOrder, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TOrder\>

Place a new order in the store

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TServerCreateOrder |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TOrder\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:417](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L417)

___

### placeProductReview

▸ **placeProductReview**(`input`: TProductReviewInput, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TProductReview\>

Place a review about some product

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TProductReviewInput |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TProductReview\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:425](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L425)

___

### post

▸ **post**<T\>(`route`: *string*, `input?`: *any*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| T\>

Makes POST request to specified route

**`auth`** no

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`route` | *string* |
`input?` | *any* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| T\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:155](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L155)

___

### put

▸ **put**<T\>(`route`: *string*, `input?`: *any*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| T\>

Makes PUT request to specified route

**`auth`** no

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`route` | *string* |
`input?` | *any* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| T\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:178](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L178)

___

### readPublicDir

▸ **readPublicDir**(`path?`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| *null* \| string[]\>

List files in a public directory by specified path

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`path?` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| *null* \| string[]\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:311](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L311)

___

### removeOnError

▸ **removeOnError**(`id`: *string*): *void*

Remove on error callback

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:272](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L272)

___

### removeOnUnauthorized

▸ **removeOnUnauthorized**(`id`: *string*): *void*

Remove on unauthorized error callback

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:256](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L256)

___

### removePublicDir

▸ **removePublicDir**(`dirName`: *string*, `inPath?`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| *null* \| string[]\>

Removes a public directory by specified path

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`dirName` | *string* |
`inPath?` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| *null* \| string[]\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:327](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L327)

___

### resetPage

▸ **resetPage**(`pageRoute`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Remove all user's modifications for specified page of currently active Theme

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`pageRoute` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:571](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L571)

___

### resetPassword

▸ **resetPassword**(`credentials`: { `code`: *string* ; `email`: *string* ; `newPassword`: *string*  }, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Finish reset password transaction. Set a new password

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`credentials` | *object* |
`credentials.code` | *string* |
`credentials.email` | *string* |
`credentials.newPassword` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:236](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L236)

___

### savePageConfig

▸ **savePageConfig**(`config`: TPageConfig, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<boolean\>

Update page config by page route of currently active Theme

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`config` | TPageConfig |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:554](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L554)

___

### savePluginSettings

▸ **savePluginSettings**(`pluginName`: *string*, `settings`: *any*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<boolean\>

Save settings for Plugin

**`auth`** admin

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pluginName` | *string* | npm package name of Plugin   |
`settings` | *any* | - |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:691](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L691)

___

### signUp

▸ **signUp**(`credentials`: TCreateUser, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TUser\>

Sign up a new user

**`auth`** no

#### Parameters:

Name | Type |
:------ | :------ |
`credentials` | TCreateUser |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TUser\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:220](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L220)

___

### updateCmsConfig

▸ **updateCmsConfig**(`input`: TCmsEntityInput, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| TCmsSettings\>

Update CMS config

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`input` | TCmsEntityInput |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| TCmsSettings\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:374](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L374)

___

### updatePlugin

▸ **updatePlugin**(`pluginName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Launch Plugin update

**`auth`** admin

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pluginName` | *string* | npm package name of Plugin   |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) | - |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:655](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L655)

___

### updateTheme

▸ **updateTheme**(`themeName`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| boolean\>

Launch Theme update

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`themeName` | *string* |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:520](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L520)

___

### uploadPublicFiles

▸ **uploadPublicFiles**(`inPath`: *string*, `files`: File[], `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| *null* \| boolean\>

Upload files in specified public directory

**`auth`** admin

#### Parameters:

Name | Type |
:------ | :------ |
`inPath` | *string* |
`files` | File[] |
`options?` | [*TRequestOptions*](../modules/frontend.md#trequestoptions) |

**Returns:** *Promise*<undefined \| *null* \| boolean\>

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:335](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L335)
