[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / Order

# Class: Order

[backend](../modules/backend.md).Order

## Hierarchy

- [`BasePageEntity`](backend.BasePageEntity.md)

  ↳ **`Order`**

## Implements

- `TOrder`

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [cart](#cart)
- [cartOldTotalPrice](#cartoldtotalprice)
- [cartTotalPrice](#carttotalprice)
- [createDate](#createdate)
- [currency](#currency)
- [customerAddress](#customeraddress)
- [customerComment](#customercomment)
- [customerEmail](#customeremail)
- [customerName](#customername)
- [customerPhone](#customerphone)
- [id](#id)
- [isEnabled](#isenabled)
- [orderTotalPrice](#ordertotalprice)
- [pageDescription](#pagedescription)
- [pageTitle](#pagetitle)
- [paymentMethod](#paymentmethod)
- [shippingMethod](#shippingmethod)
- [shippingPrice](#shippingprice)
- [slug](#slug)
- [status](#status)
- [totalQnt](#totalqnt)
- [updateDate](#updatedate)
- [userId](#userid)

## Constructors

### constructor

• **new Order**()

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[constructor](backend.BasePageEntity.md#constructor)

## Properties

### cart

• `Optional` **cart**: `string`

#### Implementation of

TOrder.cart

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L18)

___

### cartOldTotalPrice

• `Optional` **cartOldTotalPrice**: `number`

#### Implementation of

TOrder.cartOldTotalPrice

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:30](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L30)

___

### cartTotalPrice

• `Optional` **cartTotalPrice**: `number`

#### Implementation of

TOrder.cartTotalPrice

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L26)

___

### createDate

• **createDate**: `Date`

#### Implementation of

TOrder.createDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[createDate](backend.BasePageEntity.md#createdate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:29](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L29)

___

### currency

• `Optional` **currency**: `string`

#### Implementation of

TOrder.currency

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:78](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L78)

___

### customerAddress

• `Optional` **customerAddress**: `string`

#### Implementation of

TOrder.customerAddress

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:62](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L62)

___

### customerComment

• `Optional` **customerComment**: `string`

#### Implementation of

TOrder.customerComment

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:74](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L74)

___

### customerEmail

• `Optional` **customerEmail**: `string`

#### Implementation of

TOrder.customerEmail

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:58](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L58)

___

### customerName

• `Optional` **customerName**: `string`

#### Implementation of

TOrder.customerName

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:48](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L48)

___

### customerPhone

• `Optional` **customerPhone**: `string`

#### Implementation of

TOrder.customerPhone

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:53](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L53)

___

### id

• **id**: `string`

#### Implementation of

TOrder.id

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[id](backend.BasePageEntity.md#id)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L12)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TOrder.isEnabled

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[isEnabled](backend.BasePageEntity.md#isenabled)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L38)

___

### orderTotalPrice

• `Optional` **orderTotalPrice**: `number`

#### Implementation of

TOrder.orderTotalPrice

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L22)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TOrder.pageDescription

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageDescription](backend.BasePageEntity.md#pagedescription)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L24)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TOrder.pageTitle

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[pageTitle](backend.BasePageEntity.md#pagetitle)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L20)

___

### paymentMethod

• `Optional` **paymentMethod**: `string`

#### Implementation of

TOrder.paymentMethod

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:70](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L70)

___

### shippingMethod

• `Optional` **shippingMethod**: `string`

#### Implementation of

TOrder.shippingMethod

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:66](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L66)

___

### shippingPrice

• `Optional` **shippingPrice**: `number`

#### Implementation of

TOrder.shippingPrice

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L34)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TOrder.slug

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[slug](backend.BasePageEntity.md#slug)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L16)

___

### status

• `Optional` **status**: `string`

#### Implementation of

TOrder.status

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L14)

___

### totalQnt

• `Optional` **totalQnt**: `number`

#### Implementation of

TOrder.totalQnt

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L38)

___

### updateDate

• **updateDate**: `Date`

#### Implementation of

TOrder.updateDate

#### Inherited from

[BasePageEntity](backend.BasePageEntity.md).[updateDate](backend.BasePageEntity.md#updatedate)

#### Defined in

[system/core/backend/src/models/entities/base-page.entity.ts:34](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/base-page.entity.ts#L34)

___

### userId

• `Optional` **userId**: `string`

#### Implementation of

TOrder.userId

#### Defined in

[system/core/backend/src/models/entities/order.entity.ts:43](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/entities/order.entity.ts#L43)
