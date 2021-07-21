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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:392](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L392)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:383](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L383)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:401](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L401)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:320](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L320)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:168](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L168)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:564](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L564)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:679](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L679)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:539](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L539)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:459](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L459)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:113](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L113)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:229](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L229)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:148](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L148)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:292](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L292)

___

### getBaseUrl

▸ **getBaseUrl**(): *string*

**Returns:** *string*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:63](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L63)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:284](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L284)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:300](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L300)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:434](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L434)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:442](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L442)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:410](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L410)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:547](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L547)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:604](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L604)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:596](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L596)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:716](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L716)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:707](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L707)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:362](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L362)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:588](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L588)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:688](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L688)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:652](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L652)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:580](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L580)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:620](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L620)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:612](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L612)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:633](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L633)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:513](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L513)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:354](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L354)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:213](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L213)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:485](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L485)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:670](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L670)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:530](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L530)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:450](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L450)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:204](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L204)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:193](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L193)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:265](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L265)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:249](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L249)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:418](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L418)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:426](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L426)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:156](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L156)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:179](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L179)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:312](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L312)

___

### removeOnError

▸ **removeOnError**(`id`: *string*): *void*

Remove on error callback

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:273](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L273)

___

### removeOnUnauthorized

▸ **removeOnUnauthorized**(`id`: *string*): *void*

Remove on unauthorized error callback

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:257](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L257)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:328](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L328)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:572](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L572)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:237](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L237)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:555](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L555)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:697](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L697)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:221](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L221)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:375](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L375)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:661](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L661)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:521](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L521)

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

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:336](https://github.com/CromwellCMS/Cromwell/blob/8568c07/system/core/frontend/src/api/CRestAPIClient.ts#L336)
