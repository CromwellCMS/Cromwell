[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CentralServerClient

# Class: CentralServerClient

[frontend](../modules/frontend.md).CentralServerClient

CentralServerClient - CromwellCMS Central Server API Client
CromwellCMS Central Server is official server at ...
API used to check local CMS updates.

## Table of contents

### Constructors

- [constructor](frontend.centralserverclient.md#constructor)

### Methods

- [checkCmsUpdate](frontend.centralserverclient.md#checkcmsupdate)
- [checkPluginUpdate](frontend.centralserverclient.md#checkpluginupdate)
- [checkThemeUpdate](frontend.centralserverclient.md#checkthemeupdate)
- [fetch](frontend.centralserverclient.md#fetch)
- [get](frontend.centralserverclient.md#get)
- [getAllCmsVersions](frontend.centralserverclient.md#getallcmsversions)
- [getBaseUrl](frontend.centralserverclient.md#getbaseurl)
- [getCmsFullInfo](frontend.centralserverclient.md#getcmsfullinfo)
- [getCmsInfo](frontend.centralserverclient.md#getcmsinfo)
- [getFrontendDependenciesList](frontend.centralserverclient.md#getfrontenddependencieslist)
- [getPluginAllVersions](frontend.centralserverclient.md#getpluginallversions)
- [getPluginFullInfo](frontend.centralserverclient.md#getpluginfullinfo)
- [getPluginInfo](frontend.centralserverclient.md#getplugininfo)
- [getPluginList](frontend.centralserverclient.md#getpluginlist)
- [getThemeAllVersions](frontend.centralserverclient.md#getthemeallversions)
- [getThemeFullInfo](frontend.centralserverclient.md#getthemefullinfo)
- [getThemeInfo](frontend.centralserverclient.md#getthemeinfo)
- [getThemeList](frontend.centralserverclient.md#getthemelist)
- [getVersionByPackage](frontend.centralserverclient.md#getversionbypackage)
- [makeRequestToGitHub](frontend.centralserverclient.md#makerequesttogithub)
- [post](frontend.centralserverclient.md#post)

## Constructors

### constructor

\+ **new CentralServerClient**(): [*CentralServerClient*](frontend.centralserverclient.md)

**Returns:** [*CentralServerClient*](frontend.centralserverclient.md)

## Methods

### checkCmsUpdate

▸ **checkCmsUpdate**(`version`: *string*, `beta?`: *boolean*): *Promise*<undefined \| TCCSVersion\>

#### Parameters:

Name | Type |
:------ | :------ |
`version` | *string* |
`beta?` | *boolean* |

**Returns:** *Promise*<undefined \| TCCSVersion\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:118](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L118)

___

### checkPluginUpdate

▸ **checkPluginUpdate**(`name`: *string*, `version`: *string*, `beta?`: *boolean*): *Promise*<undefined \| TCCSVersion\>

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |
`version` | *string* |
`beta?` | *boolean* |

**Returns:** *Promise*<undefined \| TCCSVersion\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:159](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L159)

___

### checkThemeUpdate

▸ **checkThemeUpdate**(`name`: *string*, `version`: *string*, `beta?`: *boolean*): *Promise*<undefined \| TCCSVersion\>

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |
`version` | *string* |
`beta?` | *boolean* |

**Returns:** *Promise*<undefined \| TCCSVersion\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:189](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L189)

___

### fetch

▸ **fetch**<T\>(`route`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| T\>

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

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:29](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L29)

___

### get

▸ **get**<T\>(`route`: *string*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| T\>

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

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:61](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L61)

___

### getAllCmsVersions

▸ **getAllCmsVersions**(): *Promise*<undefined \| TCCSModuleShortInfo\>

**Returns:** *Promise*<undefined \| TCCSModuleShortInfo\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:122](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L122)

___

### getBaseUrl

▸ **getBaseUrl**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:12](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L12)

___

### getCmsFullInfo

▸ **getCmsFullInfo**(): *Promise*<undefined \| TCCSModuleInfo\>

**Returns:** *Promise*<undefined \| TCCSModuleInfo\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:110](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L110)

___

### getCmsInfo

▸ **getCmsInfo**(): *Promise*<undefined \| TCCSModuleShortInfo\>

**Returns:** *Promise*<undefined \| TCCSModuleShortInfo\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:106](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L106)

___

### getFrontendDependenciesList

▸ **getFrontendDependenciesList**(): *Promise*<any\>

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:126](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L126)

___

### getPluginAllVersions

▸ **getPluginAllVersions**(`name`: *string*): *Promise*<undefined \| TCCSVersion[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *Promise*<undefined \| TCCSVersion[]\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:155](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L155)

___

### getPluginFullInfo

▸ **getPluginFullInfo**(`name`: *string*): *Promise*<undefined \| TCCSModuleInfo\>

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *Promise*<undefined \| TCCSModuleInfo\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:151](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L151)

___

### getPluginInfo

▸ **getPluginInfo**(`name`: *string*): *Promise*<undefined \| TCCSModuleShortInfo\>

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *Promise*<undefined \| TCCSModuleShortInfo\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:138](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L138)

___

### getPluginList

▸ **getPluginList**(`params?`: *TPagedParams*<TCCSModuleInfo\>, `filter?`: { `search?`: *undefined* \| *string*  }): *Promise*<undefined \| TPagedList<TCCSModuleInfo\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<TCCSModuleInfo\> |
`filter?` | *object* |
`filter.search?` | *undefined* \| *string* |

**Returns:** *Promise*<undefined \| TPagedList<TCCSModuleInfo\>\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:142](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L142)

___

### getThemeAllVersions

▸ **getThemeAllVersions**(`name`: *string*): *Promise*<undefined \| TCCSVersion[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *Promise*<undefined \| TCCSVersion[]\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:185](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L185)

___

### getThemeFullInfo

▸ **getThemeFullInfo**(`name`: *string*): *Promise*<undefined \| TCCSModuleInfo\>

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *Promise*<undefined \| TCCSModuleInfo\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:181](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L181)

___

### getThemeInfo

▸ **getThemeInfo**(`name`: *string*): *Promise*<undefined \| TCCSModuleShortInfo\>

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *Promise*<undefined \| TCCSModuleShortInfo\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:168](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L168)

___

### getThemeList

▸ **getThemeList**(`params?`: *TPagedParams*<TCCSModuleInfo\>, `filter?`: { `search?`: *undefined* \| *string*  }): *Promise*<undefined \| TPagedList<TCCSModuleInfo\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | *TPagedParams*<TCCSModuleInfo\> |
`filter?` | *object* |
`filter.search?` | *undefined* \| *string* |

**Returns:** *Promise*<undefined \| TPagedList<TCCSModuleInfo\>\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:172](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L172)

___

### getVersionByPackage

▸ **getVersionByPackage**(`packageVersion`: *string*): *Promise*<undefined \| TCCSVersion\>

#### Parameters:

Name | Type |
:------ | :------ |
`packageVersion` | *string* |

**Returns:** *Promise*<undefined \| TCCSVersion\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:114](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L114)

___

### makeRequestToGitHub

▸ **makeRequestToGitHub**(`url`: *any*): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`url` | *any* |

**Returns:** *Promise*<any\>

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:73](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L73)

___

### post

▸ **post**<T\>(`route`: *string*, `input?`: *any*, `options?`: [*TRequestOptions*](../modules/frontend.md#trequestoptions)): *Promise*<undefined \| T\>

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

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:65](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/api/CentralServerClient.ts#L65)
