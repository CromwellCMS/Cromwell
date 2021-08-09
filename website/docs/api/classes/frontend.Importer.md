[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / Importer

# Class: Importer

[frontend](../modules/frontend.md).Importer

Bundled node modules (Frontend dependencies) loading script

## Implements

- `Required`<`TCromwellNodeModules`\>

## Table of contents

### Constructors

- [constructor](frontend.Importer.md#constructor)

### Properties

- [canShowInfo](frontend.Importer.md#canshowinfo)
- [hasBeenExecuted](frontend.Importer.md#hasbeenexecuted)
- [importStatuses](frontend.Importer.md#importstatuses)
- [imports](frontend.Importer.md#imports)
- [moduleExternals](frontend.Importer.md#moduleexternals)
- [modules](frontend.Importer.md#modules)
- [prefix](frontend.Importer.md#prefix)
- [scriptStatuses](frontend.Importer.md#scriptstatuses)

### Methods

- [importModule](frontend.Importer.md#importmodule)
- [importScriptExternals](frontend.Importer.md#importscriptexternals)
- [setIsServerSide](frontend.Importer.md#setisserverside)
- [setPrefix](frontend.Importer.md#setprefix)
- [setServerPublicDir](frontend.Importer.md#setserverpublicdir)

## Constructors

### constructor

• **new Importer**()

#### Defined in

[system/core/frontend/src/helpers/importer.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L35)

## Properties

### canShowInfo

• **canShowInfo**: `boolean` = `false`

#### Defined in

[system/core/frontend/src/helpers/importer.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L25)

___

### hasBeenExecuted

• **hasBeenExecuted**: `boolean` = `false`

#### Implementation of

Required.hasBeenExecuted

#### Defined in

[system/core/frontend/src/helpers/importer.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L27)

___

### importStatuses

• **importStatuses**: `Object` = `{}`

#### Implementation of

Required.importStatuses

#### Defined in

[system/core/frontend/src/helpers/importer.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L20)

___

### imports

• **imports**: `Object` = `{}`

#### Implementation of

Required.imports

#### Defined in

[system/core/frontend/src/helpers/importer.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L21)

___

### moduleExternals

• **moduleExternals**: `Object` = `{}`

#### Implementation of

Required.moduleExternals

#### Defined in

[system/core/frontend/src/helpers/importer.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L22)

___

### modules

• **modules**: `Record`<`string`, `any`\>

#### Implementation of

Required.modules

#### Defined in

[system/core/frontend/src/helpers/importer.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L24)

___

### prefix

• **prefix**: `string`

#### Implementation of

Required.prefix

#### Defined in

[system/core/frontend/src/helpers/importer.ts:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L26)

___

### scriptStatuses

• **scriptStatuses**: `Object` = `{}`

#### Implementation of

Required.scriptStatuses

#### Defined in

[system/core/frontend/src/helpers/importer.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L23)

## Methods

### importModule

▸ **importModule**(`moduleName`, `namedExports?`): `boolean` \| `Promise`<`boolean`\>

Import single module with its dependencies

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `any` |
| `namedExports` | `string`[] |

#### Returns

`boolean` \| `Promise`<`boolean`\>

#### Implementation of

Required.importModule

#### Defined in

[system/core/frontend/src/helpers/importer.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L86)

___

### importScriptExternals

▸ **importScriptExternals**(`metaInfo`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `metaInfo` | `undefined` \| `TScriptMetaInfo` |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

Required.importScriptExternals

#### Defined in

[system/core/frontend/src/helpers/importer.ts:389](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L389)

___

### setIsServerSide

▸ **setIsServerSide**(`isServerSide`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `isServerSide` | `any` |

#### Returns

`any`

#### Defined in

[system/core/frontend/src/helpers/importer.ts:78](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L78)

___

### setPrefix

▸ **setPrefix**(`prefix`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix` | `any` |

#### Returns

`any`

#### Implementation of

Required.setPrefix

#### Defined in

[system/core/frontend/src/helpers/importer.ts:76](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L76)

___

### setServerPublicDir

▸ **setServerPublicDir**(`dir`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | `any` |

#### Returns

`any`

#### Defined in

[system/core/frontend/src/helpers/importer.ts:77](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L77)
