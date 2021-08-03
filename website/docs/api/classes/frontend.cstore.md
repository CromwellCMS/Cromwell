[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CStore

# Class: CStore

[frontend](../modules/frontend.md).CStore

CStore - CromwellCMS Online Store module. Helps to manage shopping cart, convert currency.

## Table of contents

### Constructors

- [constructor](frontend.CStore.md#constructor)

### Methods

- [addToCart](frontend.CStore.md#addtocart)
- [addToCompare](frontend.CStore.md#addtocompare)
- [addToWatchedItems](frontend.CStore.md#addtowatcheditems)
- [addToWishlist](frontend.CStore.md#addtowishlist)
- [applyProductVariants](frontend.CStore.md#applyproductvariants)
- [clearCart](frontend.CStore.md#clearcart)
- [clearComparisionList](frontend.CStore.md#clearcomparisionlist)
- [clearWatchedItems](frontend.CStore.md#clearwatcheditems)
- [clearWishlist](frontend.CStore.md#clearwishlist)
- [convertPrice](frontend.CStore.md#convertprice)
- [getActiveCurrencySymbol](frontend.CStore.md#getactivecurrencysymbol)
- [getActiveCurrencyTag](frontend.CStore.md#getactivecurrencytag)
- [getCart](frontend.CStore.md#getcart)
- [getCartTotal](frontend.CStore.md#getcarttotal)
- [getCompare](frontend.CStore.md#getcompare)
- [getDefaultCurrencyTag](frontend.CStore.md#getdefaultcurrencytag)
- [getPrice](frontend.CStore.md#getprice)
- [getPriceWithCurrency](frontend.CStore.md#getpricewithcurrency)
- [getWatchedItems](frontend.CStore.md#getwatcheditems)
- [getWishlist](frontend.CStore.md#getwishlist)
- [hasSameQntInCart](frontend.CStore.md#hassameqntincart)
- [isInCart](frontend.CStore.md#isincart)
- [isInCompare](frontend.CStore.md#isincompare)
- [isInWatchedItems](frontend.CStore.md#isinwatcheditems)
- [isInWishlist](frontend.CStore.md#isinwishlist)
- [onCartUpdate](frontend.CStore.md#oncartupdate)
- [onCompareUpdate](frontend.CStore.md#oncompareupdate)
- [onWatchedItemsUpdate](frontend.CStore.md#onwatcheditemsupdate)
- [onWishlistUpdate](frontend.CStore.md#onwishlistupdate)
- [removeFromCart](frontend.CStore.md#removefromcart)
- [removeFromCompare](frontend.CStore.md#removefromcompare)
- [removeFromWishlist](frontend.CStore.md#removefromwishlist)
- [removeOnCartUpdate](frontend.CStore.md#removeoncartupdate)
- [removeOnCompareUpdate](frontend.CStore.md#removeoncompareupdate)
- [removeOnWatchedItemsUpdate](frontend.CStore.md#removeonwatcheditemsupdate)
- [removeOnWishlistUpdate](frontend.CStore.md#removeonwishlistupdate)
- [saveCart](frontend.CStore.md#savecart)
- [saveWatchedItems](frontend.CStore.md#savewatcheditems)
- [setActiveCurrency](frontend.CStore.md#setactivecurrency)
- [updateCart](frontend.CStore.md#updatecart)
- [updateComparisonList](frontend.CStore.md#updatecomparisonlist)
- [updateQntInCart](frontend.CStore.md#updateqntincart)
- [updateWatchedItems](frontend.CStore.md#updatewatcheditems)
- [updateWishlist](frontend.CStore.md#updatewishlist)

## Constructors

### constructor

• **new CStore**(`local?`, `apiClient?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `local?` | `boolean` |
| `apiClient?` | [`TApiClient`](../modules/frontend.md#tapiclient) |

#### Defined in

[system/core/frontend/src/CStore.ts:43](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L43)

## Methods

### addToCart

▸ **addToCart**(`product`, `attributes?`): [`OperationResult`](../modules/frontend.md#operationresult) & { `missingAttributes?`: `TAttribute`[]  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | `TStoreListItem` |
| `attributes?` | `TAttribute`[] |

#### Returns

[`OperationResult`](../modules/frontend.md#operationresult) & { `missingAttributes?`: `TAttribute`[]  }

#### Defined in

[system/core/frontend/src/CStore.ts:201](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L201)

___

### addToCompare

▸ **addToCompare**(`product`): [`OperationResult`](../modules/frontend.md#operationresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | `TStoreListItem` |

#### Returns

[`OperationResult`](../modules/frontend.md#operationresult)

#### Defined in

[system/core/frontend/src/CStore.ts:295](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L295)

___

### addToWatchedItems

▸ **addToWatchedItems**(`item`): [`OperationResult`](../modules/frontend.md#operationresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TStoreListItem` |

#### Returns

[`OperationResult`](../modules/frontend.md#operationresult)

#### Defined in

[system/core/frontend/src/CStore.ts:325](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L325)

___

### addToWishlist

▸ **addToWishlist**(`product`): [`OperationResult`](../modules/frontend.md#operationresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | `TStoreListItem` |

#### Returns

[`OperationResult`](../modules/frontend.md#operationresult)

#### Defined in

[system/core/frontend/src/CStore.ts:269](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L269)

___

### applyProductVariants

▸ **applyProductVariants**(`product`, `checkedAttrs?`, `attributes?`): `TProduct`

Applies all ProductVariants from values of checked attributes

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | `TProduct` |
| `checkedAttrs?` | `Record`<`string`, `string`[]\> |
| `attributes?` | `TAttribute`[] |

#### Returns

`TProduct`

#### Defined in

[system/core/frontend/src/CStore.ts:466](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L466)

___

### clearCart

▸ **clearCart**(): `void`

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:425](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L425)

___

### clearComparisionList

▸ **clearComparisionList**(): `void`

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:433](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L433)

___

### clearWatchedItems

▸ **clearWatchedItems**(): `void`

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:437](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L437)

___

### clearWishlist

▸ **clearWishlist**(): `void`

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:429](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L429)

___

### convertPrice

▸ **convertPrice**(`price`, `from`, `to`): `string` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `price` | `string` \| `number` |
| `from` | `string` |
| `to` | `string` |

#### Returns

`string` \| `number`

#### Defined in

[system/core/frontend/src/CStore.ts:543](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L543)

___

### getActiveCurrencySymbol

▸ **getActiveCurrencySymbol**(): `string`

#### Returns

`string`

#### Defined in

[system/core/frontend/src/CStore.ts:572](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L572)

___

### getActiveCurrencyTag

▸ **getActiveCurrencyTag**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/frontend/src/CStore.ts:557](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L557)

___

### getCart

▸ **getCart**(): `TStoreListItem`[]

#### Returns

`TStoreListItem`[]

#### Defined in

[system/core/frontend/src/CStore.ts:179](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L179)

___

### getCartTotal

▸ **getCartTotal**(`customCart?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `customCart?` | `TStoreListItem`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `amount` | `number` |
| `total` | `number` |
| `totalOld` | `number` |

#### Defined in

[system/core/frontend/src/CStore.ts:442](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L442)

___

### getCompare

▸ **getCompare**(): `TStoreListItem`[]

#### Returns

`TStoreListItem`[]

#### Defined in

[system/core/frontend/src/CStore.ts:286](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L286)

___

### getDefaultCurrencyTag

▸ **getDefaultCurrencyTag**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[system/core/frontend/src/CStore.ts:503](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L503)

___

### getPrice

▸ **getPrice**(`price`): `string`

Returns string of a price converted to active currency

#### Parameters

| Name | Type |
| :------ | :------ |
| `price` | `any` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/CStore.ts:514](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L514)

___

### getPriceWithCurrency

▸ **getPriceWithCurrency**(`price`): `string`

Returns merged price with sign of active (picked by user or default) currency

#### Parameters

| Name | Type |
| :------ | :------ |
| `price` | `any` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/CStore.ts:529](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L529)

___

### getWatchedItems

▸ **getWatchedItems**(): `TStoreListItem`[]

#### Returns

`TStoreListItem`[]

#### Defined in

[system/core/frontend/src/CStore.ts:312](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L312)

___

### getWishlist

▸ **getWishlist**(): `TStoreListItem`[]

#### Returns

`TStoreListItem`[]

#### Defined in

[system/core/frontend/src/CStore.ts:260](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L260)

___

### hasSameQntInCart

▸ **hasSameQntInCart**(`item`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TStoreListItem` |

#### Returns

`boolean`

#### Defined in

[system/core/frontend/src/CStore.ts:192](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L192)

___

### isInCart

▸ **isInCart**(`item`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TStoreListItem` |

#### Returns

`boolean`

#### Defined in

[system/core/frontend/src/CStore.ts:187](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L187)

___

### isInCompare

▸ **isInCompare**(`item`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TStoreListItem` |

#### Returns

`boolean`

#### Defined in

[system/core/frontend/src/CStore.ts:290](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L290)

___

### isInWatchedItems

▸ **isInWatchedItems**(`item`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TStoreListItem` |

#### Returns

`boolean`

#### Defined in

[system/core/frontend/src/CStore.ts:320](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L320)

___

### isInWishlist

▸ **isInWishlist**(`item`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TStoreListItem` |

#### Returns

`boolean`

#### Defined in

[system/core/frontend/src/CStore.ts:264](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L264)

___

### onCartUpdate

▸ **onCartUpdate**(`cb`, `id?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`cart`: `TStoreListItem`[]) => `any` |
| `id?` | `string` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/CStore.ts:250](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L250)

___

### onCompareUpdate

▸ **onCompareUpdate**(`cb`, `id?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`cart`: `TStoreListItem`[]) => `any` |
| `id?` | `string` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/CStore.ts:303](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L303)

___

### onWatchedItemsUpdate

▸ **onWatchedItemsUpdate**(`cb`, `id?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`cart`: `TStoreListItem`[]) => `any` |
| `id?` | `string` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/CStore.ts:329](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L329)

___

### onWishlistUpdate

▸ **onWishlistUpdate**(`cb`, `id?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`cart`: `TStoreListItem`[]) => `any` |
| `id?` | `string` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/CStore.ts:277](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L277)

___

### removeFromCart

▸ **removeFromCart**(`product`): [`OperationResult`](../modules/frontend.md#operationresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | `TStoreListItem` |

#### Returns

[`OperationResult`](../modules/frontend.md#operationresult)

#### Defined in

[system/core/frontend/src/CStore.ts:246](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L246)

___

### removeFromCompare

▸ **removeFromCompare**(`product`): [`OperationResult`](../modules/frontend.md#operationresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | `TStoreListItem` |

#### Returns

[`OperationResult`](../modules/frontend.md#operationresult)

#### Defined in

[system/core/frontend/src/CStore.ts:299](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L299)

___

### removeFromWishlist

▸ **removeFromWishlist**(`product`): [`OperationResult`](../modules/frontend.md#operationresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | `TStoreListItem` |

#### Returns

[`OperationResult`](../modules/frontend.md#operationresult)

#### Defined in

[system/core/frontend/src/CStore.ts:273](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L273)

___

### removeOnCartUpdate

▸ **removeOnCartUpdate**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:254](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L254)

___

### removeOnCompareUpdate

▸ **removeOnCompareUpdate**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:307](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L307)

___

### removeOnWatchedItemsUpdate

▸ **removeOnWatchedItemsUpdate**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:333](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L333)

___

### removeOnWishlistUpdate

▸ **removeOnWishlistUpdate**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:281](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L281)

___

### saveCart

▸ **saveCart**(`cart`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `TStoreListItem`[] |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:183](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L183)

___

### saveWatchedItems

▸ **saveWatchedItems**(`items`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | `TStoreListItem`[] |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:316](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L316)

___

### setActiveCurrency

▸ **setActiveCurrency**(`currency`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `currency` | `string` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:579](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L579)

___

### updateCart

▸ **updateCart**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/frontend/src/CStore.ts:408](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L408)

___

### updateComparisonList

▸ **updateComparisonList**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/frontend/src/CStore.ts:416](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L416)

___

### updateQntInCart

▸ **updateQntInCart**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TStoreListItem` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/CStore.ts:233](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L233)

___

### updateWatchedItems

▸ **updateWatchedItems**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/frontend/src/CStore.ts:420](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L420)

___

### updateWishlist

▸ **updateWishlist**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/frontend/src/CStore.ts:412](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L412)
