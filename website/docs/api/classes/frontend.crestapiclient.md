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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:393](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L393)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:384](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L384)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:402](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L402)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:321](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L321)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:169](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L169)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:565](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L565)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:675](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L675)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:540](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L540)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:460](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L460)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:114](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L114)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:230](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L230)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:149](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L149)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:293](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L293)

___

### getBaseUrl

▸ **getBaseUrl**(): *string*

**Returns:** *string*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:64](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L64)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:285](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L285)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:301](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L301)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:435](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L435)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:443](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L443)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:411](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L411)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:548](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L548)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:605](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L605)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:597](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L597)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:712](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L712)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:703](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L703)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:363](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L363)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:589](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L589)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:684](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L684)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:648](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L648)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:581](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L581)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:621](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L621)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:613](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L613)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:634](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L634)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:514](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L514)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:355](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L355)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:214](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L214)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:486](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L486)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:666](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L666)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:531](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L531)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:451](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L451)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:205](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L205)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:194](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L194)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:266](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L266)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:250](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L250)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:419](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L419)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:427](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L427)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:157](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L157)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:180](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L180)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:313](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L313)

___

### removeOnError

▸ **removeOnError**(`id`: *string*): *void*

Remove on error callback

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:274](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L274)

___

### removeOnUnauthorized

▸ **removeOnUnauthorized**(`id`: *string*): *void*

Remove on unauthorized error callback

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:258](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L258)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:329](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L329)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:573](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L573)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:238](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L238)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:556](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L556)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:693](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L693)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:222](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L222)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:376](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L376)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:657](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L657)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:522](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L522)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:337](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CRestAPIClient.ts#L337)
