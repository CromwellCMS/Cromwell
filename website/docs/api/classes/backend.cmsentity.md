[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / CmsEntity

# Class: CmsEntity

[backend](../modules/backend.md).CmsEntity

## Hierarchy

- [`BasePageEntity`](backend.BasePageEntity.md)

  ↳ **`CmsEntity`**

## Implements

- `TCmsEntity`

## Table of contents

### Constructors

- [constructor](backend.CmsEntity.md#constructor)

### Properties

- [createDate](backend.CmsEntity.md#createdate)
- [id](backend.CmsEntity.md#id)
- [isEnabled](backend.CmsEntity.md#isenabled)
- [pageDescription](backend.CmsEntity.md#pagedescription)
- [pageTitle](backend.CmsEntity.md#pagetitle)
- [slug](backend.CmsEntity.md#slug)
- [updateDate](backend.CmsEntity.md#updatedate)

### Accessors

- [adminSettings](backend.CmsEntity.md#adminsettings)
- [internalSettings](backend.CmsEntity.md#internalsettings)
- [publicSettings](backend.CmsEntity.md#publicsettings)

## Constructors

### constructor

• **new CmsEntity**()

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[constructor](backend.BasePageEntity.md#constructor)

## Properties

### createDate

• **createDate**: `Date`

#### Implementation of

TCmsEntity.createDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[createDate](backend.BasePageEntity.md#createdate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L27)

___

### id

• **id**: `string`

#### Implementation of

TCmsEntity.id

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[id](backend.BasePageEntity.md#id)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L11)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TCmsEntity.isEnabled

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[isEnabled](backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L35)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TCmsEntity.pageDescription

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageDescription](backend.BasePageEntity.md#pagedescription)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L23)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TCmsEntity.pageTitle

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageTitle](backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L19)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TCmsEntity.slug

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[slug](backend.BasePageEntity.md#slug)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L15)

___

### updateDate

• **updateDate**: `Date`

#### Implementation of

TCmsEntity.updateDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[updateDate](backend.BasePageEntity.md#updatedate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:31](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L31)

## Accessors

### adminSettings

• `get` **adminSettings**(): `undefined` \| `TCmsAdminSettings`

#### Returns

`undefined` \| `TCmsAdminSettings`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:19](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L19)

• `set` **adminSettings**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `undefined` \| `TCmsAdminSettings` |

#### Returns

`void`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L22)

___

### internalSettings

• `get` **internalSettings**(): `undefined` \| `TCmsInternalSettings`

#### Returns

`undefined` \| `TCmsInternalSettings`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:29](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L29)

• `set` **internalSettings**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `undefined` \| `TCmsInternalSettings` |

#### Returns

`void`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:32](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L32)

___

### publicSettings

• `get` **publicSettings**(): `undefined` \| `TCmsPublicSettings`

#### Returns

`undefined` \| `TCmsPublicSettings`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L9)

• `set` **publicSettings**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `undefined` \| `TCmsPublicSettings` |

#### Returns

`void`

#### Defined in

[system/core/backend/src/models/entities/cms.entity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/cms.entity.ts#L12)
