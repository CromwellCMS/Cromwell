[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / PagedParamsInput

# Class: PagedParamsInput<T\>

[backend](../modules/backend.md).PagedParamsInput

## Type parameters

| Name |
| :------ |
| `T` |

## Implements

- `TPagedParams`<`T`\>

## Table of contents

### Constructors

- [constructor](backend.PagedParamsInput.md#constructor)

### Properties

- [order](backend.PagedParamsInput.md#order)
- [orderBy](backend.PagedParamsInput.md#orderby)
- [pageNumber](backend.PagedParamsInput.md#pagenumber)
- [pageSize](backend.PagedParamsInput.md#pagesize)

## Constructors

### constructor

• **new PagedParamsInput**<`T`\>()

#### Type parameters

| Name |
| :------ |
| `T` |

## Properties

### order

• **order**: ``"ASC"`` \| ``"DESC"``

#### Implementation of

TPagedParams.order

#### Defined in

[system/core/backend/src/models/inputs/paged-params.input.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/paged-params.input.ts#L17)

___

### orderBy

• **orderBy**: keyof `T`

#### Implementation of

TPagedParams.orderBy

#### Defined in

[system/core/backend/src/models/inputs/paged-params.input.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/paged-params.input.ts#L14)

___

### pageNumber

• **pageNumber**: `number`

#### Implementation of

TPagedParams.pageNumber

#### Defined in

[system/core/backend/src/models/inputs/paged-params.input.ts:8](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/paged-params.input.ts#L8)

___

### pageSize

• **pageSize**: `number`

#### Implementation of

TPagedParams.pageSize

#### Defined in

[system/core/backend/src/models/inputs/paged-params.input.ts:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/paged-params.input.ts#L11)
