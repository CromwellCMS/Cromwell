[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CentralServerClient

# Class: CentralServerClient

[frontend](../modules/frontend.md).CentralServerClient

CentralServerClient - CromwellCMS Central Server API Client
CromwellCMS Central Server is official server at ...
API used to check local CMS updates.

## Table of contents

### Constructors

- [constructor](frontend.CentralServerClient.md#constructor)

### Methods

- [checkCmsUpdate](frontend.CentralServerClient.md#checkcmsupdate)
- [checkPluginUpdate](frontend.CentralServerClient.md#checkpluginupdate)
- [checkThemeUpdate](frontend.CentralServerClient.md#checkthemeupdate)
- [fetch](frontend.CentralServerClient.md#fetch)
- [get](frontend.CentralServerClient.md#get)
- [getAllCmsVersions](frontend.CentralServerClient.md#getallcmsversions)
- [getBaseUrl](frontend.CentralServerClient.md#getbaseurl)
- [getCmsFullInfo](frontend.CentralServerClient.md#getcmsfullinfo)
- [getCmsInfo](frontend.CentralServerClient.md#getcmsinfo)
- [getFrontendDependenciesList](frontend.CentralServerClient.md#getfrontenddependencieslist)
- [getPluginAllVersions](frontend.CentralServerClient.md#getpluginallversions)
- [getPluginFullInfo](frontend.CentralServerClient.md#getpluginfullinfo)
- [getPluginInfo](frontend.CentralServerClient.md#getplugininfo)
- [getPluginList](frontend.CentralServerClient.md#getpluginlist)
- [getThemeAllVersions](frontend.CentralServerClient.md#getthemeallversions)
- [getThemeFullInfo](frontend.CentralServerClient.md#getthemefullinfo)
- [getThemeInfo](frontend.CentralServerClient.md#getthemeinfo)
- [getThemeList](frontend.CentralServerClient.md#getthemelist)
- [getVersionByPackage](frontend.CentralServerClient.md#getversionbypackage)
- [makeRequestToGitHub](frontend.CentralServerClient.md#makerequesttogithub)
- [post](frontend.CentralServerClient.md#post)

## Constructors

### constructor

• **new CentralServerClient**()

## Methods

### checkCmsUpdate

▸ **checkCmsUpdate**(`version`, `beta?`): `Promise`<`undefined` \| `TCCSVersion`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `string` |
| `beta?` | `boolean` |

#### Returns

`Promise`<`undefined` \| `TCCSVersion`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:118](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L118)

___

### checkPluginUpdate

▸ **checkPluginUpdate**(`name`, `version`, `beta?`): `Promise`<`undefined` \| `TCCSVersion`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `string` |
| `beta?` | `boolean` |

#### Returns

`Promise`<`undefined` \| `TCCSVersion`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:159](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L159)

___

### checkThemeUpdate

▸ **checkThemeUpdate**(`name`, `version`, `beta?`): `Promise`<`undefined` \| `TCCSVersion`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `string` |
| `beta?` | `boolean` |

#### Returns

`Promise`<`undefined` \| `TCCSVersion`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:189](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L189)

___

### fetch

▸ **fetch**<`T`\>(`route`, `options?`): `Promise`<`undefined` \| `T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `T`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:29](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L29)

___

### get

▸ **get**<`T`\>(`route`, `options?`): `Promise`<`undefined` \| `T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `T`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:61](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L61)

___

### getAllCmsVersions

▸ **getAllCmsVersions**(): `Promise`<`undefined` \| `TCCSModuleShortInfo`\>

#### Returns

`Promise`<`undefined` \| `TCCSModuleShortInfo`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:122](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L122)

___

### getBaseUrl

▸ **getBaseUrl**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L12)

___

### getCmsFullInfo

▸ **getCmsFullInfo**(): `Promise`<`undefined` \| `TCCSModuleInfo`\>

#### Returns

`Promise`<`undefined` \| `TCCSModuleInfo`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:110](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L110)

___

### getCmsInfo

▸ **getCmsInfo**(): `Promise`<`undefined` \| `TCCSModuleShortInfo`\>

#### Returns

`Promise`<`undefined` \| `TCCSModuleShortInfo`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:106](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L106)

___

### getFrontendDependenciesList

▸ **getFrontendDependenciesList**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:126](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L126)

___

### getPluginAllVersions

▸ **getPluginAllVersions**(`name`): `Promise`<`undefined` \| `TCCSVersion`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`undefined` \| `TCCSVersion`[]\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:155](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L155)

___

### getPluginFullInfo

▸ **getPluginFullInfo**(`name`): `Promise`<`undefined` \| `TCCSModuleInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`undefined` \| `TCCSModuleInfo`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:151](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L151)

___

### getPluginInfo

▸ **getPluginInfo**(`name`): `Promise`<`undefined` \| `TCCSModuleShortInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`undefined` \| `TCCSModuleShortInfo`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:138](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L138)

___

### getPluginList

▸ **getPluginList**(`params?`, `filter?`): `Promise`<`undefined` \| `TPagedList`<`TCCSModuleInfo`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<`TCCSModuleInfo`\> |
| `filter?` | `Object` |
| `filter.search?` | `string` |

#### Returns

`Promise`<`undefined` \| `TPagedList`<`TCCSModuleInfo`\>\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:142](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L142)

___

### getThemeAllVersions

▸ **getThemeAllVersions**(`name`): `Promise`<`undefined` \| `TCCSVersion`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`undefined` \| `TCCSVersion`[]\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:185](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L185)

___

### getThemeFullInfo

▸ **getThemeFullInfo**(`name`): `Promise`<`undefined` \| `TCCSModuleInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`undefined` \| `TCCSModuleInfo`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:181](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L181)

___

### getThemeInfo

▸ **getThemeInfo**(`name`): `Promise`<`undefined` \| `TCCSModuleShortInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`undefined` \| `TCCSModuleShortInfo`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:168](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L168)

___

### getThemeList

▸ **getThemeList**(`params?`, `filter?`): `Promise`<`undefined` \| `TPagedList`<`TCCSModuleInfo`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `TPagedParams`<`TCCSModuleInfo`\> |
| `filter?` | `Object` |
| `filter.search?` | `string` |

#### Returns

`Promise`<`undefined` \| `TPagedList`<`TCCSModuleInfo`\>\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:172](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L172)

___

### getVersionByPackage

▸ **getVersionByPackage**(`packageVersion`): `Promise`<`undefined` \| `TCCSVersion`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `packageVersion` | `string` |

#### Returns

`Promise`<`undefined` \| `TCCSVersion`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:114](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L114)

___

### makeRequestToGitHub

▸ **makeRequestToGitHub**(`url`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:73](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L73)

___

### post

▸ **post**<`T`\>(`route`, `input?`, `options?`): `Promise`<`undefined` \| `T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |
| `input?` | `any` |
| `options?` | [`TRequestOptions`](../modules/frontend.md#trequestoptions) |

#### Returns

`Promise`<`undefined` \| `T`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:65](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L65)
