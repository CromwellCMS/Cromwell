[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CentralServerClient

# Class: CentralServerClient

[frontend](../modules/frontend.md).CentralServerClient

CentralServerClient - CromwellCMS Central Server API Client
CromwellCMS Central Server is official server at ...
API used to check local CMS updates.

## Table of contents

### Constructors

- [constructor](#constructor)

### Methods

- [checkCmsUpdate](#checkcmsupdate)
- [checkPluginUpdate](#checkpluginupdate)
- [checkThemeUpdate](#checkthemeupdate)
- [fetch](#fetch)
- [get](#get)
- [getAllCmsVersions](#getallcmsversions)
- [getBaseUrl](#getbaseurl)
- [getCmsFullInfo](#getcmsfullinfo)
- [getCmsInfo](#getcmsinfo)
- [getFrontendDependenciesBindings](#getfrontenddependenciesbindings)
- [getFrontendDependenciesList](#getfrontenddependencieslist)
- [getPluginAllVersions](#getpluginallversions)
- [getPluginFullInfo](#getpluginfullinfo)
- [getPluginInfo](#getplugininfo)
- [getPluginList](#getpluginlist)
- [getThemeAllVersions](#getthemeallversions)
- [getThemeFullInfo](#getthemefullinfo)
- [getThemeInfo](#getthemeinfo)
- [getThemeList](#getthemelist)
- [getVersionByPackage](#getversionbypackage)
- [makeRequestToGitHub](#makerequesttogithub)
- [post](#post)

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

[system/core/frontend/src/api/CentralServerClient.ts:168](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L168)

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

[system/core/frontend/src/api/CentralServerClient.ts:198](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L198)

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

### getFrontendDependenciesBindings

▸ **getFrontendDependenciesBindings**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:126](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L126)

___

### getFrontendDependenciesList

▸ **getFrontendDependenciesList**(`version`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:135](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L135)

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

[system/core/frontend/src/api/CentralServerClient.ts:164](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L164)

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

[system/core/frontend/src/api/CentralServerClient.ts:160](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L160)

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

[system/core/frontend/src/api/CentralServerClient.ts:147](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L147)

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

[system/core/frontend/src/api/CentralServerClient.ts:151](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L151)

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

[system/core/frontend/src/api/CentralServerClient.ts:194](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L194)

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

[system/core/frontend/src/api/CentralServerClient.ts:190](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L190)

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

[system/core/frontend/src/api/CentralServerClient.ts:177](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L177)

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

[system/core/frontend/src/api/CentralServerClient.ts:181](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L181)

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
