[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CStore

# Class: CStore

[frontend](../modules/frontend.md).CStore

CStore - CromwellCMS Online Store module. Helps to manage shopping cart, convert currency.

## Table of contents

### Constructors

- [constructor](frontend.cstore.md#constructor)

### Methods

- [addToCart](frontend.cstore.md#addtocart)
- [addToCompare](frontend.cstore.md#addtocompare)
- [addToWatchedItems](frontend.cstore.md#addtowatcheditems)
- [addToWishlist](frontend.cstore.md#addtowishlist)
- [applyProductVariants](frontend.cstore.md#applyproductvariants)
- [clearCart](frontend.cstore.md#clearcart)
- [clearComparisionList](frontend.cstore.md#clearcomparisionlist)
- [clearWatchedItems](frontend.cstore.md#clearwatcheditems)
- [clearWishlist](frontend.cstore.md#clearwishlist)
- [convertPrice](frontend.cstore.md#convertprice)
- [getActiveCurrencySymbol](frontend.cstore.md#getactivecurrencysymbol)
- [getActiveCurrencyTag](frontend.cstore.md#getactivecurrencytag)
- [getCart](frontend.cstore.md#getcart)
- [getCartTotal](frontend.cstore.md#getcarttotal)
- [getCompare](frontend.cstore.md#getcompare)
- [getPriceWithCurrency](frontend.cstore.md#getpricewithcurrency)
- [getWatchedItems](frontend.cstore.md#getwatcheditems)
- [getWishlist](frontend.cstore.md#getwishlist)
- [hasSameQntInCart](frontend.cstore.md#hassameqntincart)
- [isInCart](frontend.cstore.md#isincart)
- [isInCompare](frontend.cstore.md#isincompare)
- [isInWatchedItems](frontend.cstore.md#isinwatcheditems)
- [isInWishlist](frontend.cstore.md#isinwishlist)
- [onCartUpdate](frontend.cstore.md#oncartupdate)
- [onCompareUpdate](frontend.cstore.md#oncompareupdate)
- [onWathcedItemsUpdate](frontend.cstore.md#onwathceditemsupdate)
- [onWishlistUpdate](frontend.cstore.md#onwishlistupdate)
- [removeFromCart](frontend.cstore.md#removefromcart)
- [removeFromCompare](frontend.cstore.md#removefromcompare)
- [removeFromWishlist](frontend.cstore.md#removefromwishlist)
- [saveCart](frontend.cstore.md#savecart)
- [saveWatchedItems](frontend.cstore.md#savewatcheditems)
- [setActiveCurrency](frontend.cstore.md#setactivecurrency)
- [updateCart](frontend.cstore.md#updatecart)
- [updateComparisionList](frontend.cstore.md#updatecomparisionlist)
- [updateQntInCart](frontend.cstore.md#updateqntincart)
- [updateWatchedItems](frontend.cstore.md#updatewatcheditems)
- [updateWishlist](frontend.cstore.md#updatewishlist)

## Constructors

### constructor

\+ **new CStore**(`local?`: *boolean*, `apiClient?`: [*TApiClient*](../modules/frontend.md#tapiclient)): [*CStore*](frontend.cstore.md)

#### Parameters:

Name | Type |
:------ | :------ |
`local?` | *boolean* |
`apiClient?` | [*TApiClient*](../modules/frontend.md#tapiclient) |

**Returns:** [*CStore*](frontend.cstore.md)

Defined in: [system/core/frontend/src/CStore.ts:41](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L41)

## Methods

### addToCart

▸ **addToCart**(`product`: TStoreListItem, `attributes?`: TAttribute[]): [*OperationResult*](../modules/frontend.md#operationresult) & { `missingAttributes?`: *undefined* \| TAttribute[]  }

#### Parameters:

Name | Type |
:------ | :------ |
`product` | TStoreListItem |
`attributes?` | TAttribute[] |

**Returns:** [*OperationResult*](../modules/frontend.md#operationresult) & { `missingAttributes?`: *undefined* \| TAttribute[]  }

Defined in: [system/core/frontend/src/CStore.ts:196](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L196)

___

### addToCompare

▸ **addToCompare**(`product`: TStoreListItem): [*OperationResult*](../modules/frontend.md#operationresult)

#### Parameters:

Name | Type |
:------ | :------ |
`product` | TStoreListItem |

**Returns:** [*OperationResult*](../modules/frontend.md#operationresult)

Defined in: [system/core/frontend/src/CStore.ts:283](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L283)

___

### addToWatchedItems

▸ **addToWatchedItems**(`item`: TStoreListItem): [*OperationResult*](../modules/frontend.md#operationresult)

#### Parameters:

Name | Type |
:------ | :------ |
`item` | TStoreListItem |

**Returns:** [*OperationResult*](../modules/frontend.md#operationresult)

Defined in: [system/core/frontend/src/CStore.ts:310](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L310)

___

### addToWishlist

▸ **addToWishlist**(`product`: TStoreListItem): [*OperationResult*](../modules/frontend.md#operationresult)

#### Parameters:

Name | Type |
:------ | :------ |
`product` | TStoreListItem |

**Returns:** [*OperationResult*](../modules/frontend.md#operationresult)

Defined in: [system/core/frontend/src/CStore.ts:260](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L260)

___

### applyProductVariants

▸ **applyProductVariants**(`product`: TProduct, `checkedAttrs?`: *Record*<string, string[]\>, `attributes?`: TAttribute[]): TProduct

Applies all ProductVariants from values of checked attributes

#### Parameters:

Name | Type |
:------ | :------ |
`product` | TProduct |
`checkedAttrs?` | *Record*<string, string[]\> |
`attributes?` | TAttribute[] |

**Returns:** TProduct

Defined in: [system/core/frontend/src/CStore.ts:447](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L447)

___

### clearCart

▸ **clearCart**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/CStore.ts:406](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L406)

___

### clearComparisionList

▸ **clearComparisionList**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/CStore.ts:414](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L414)

___

### clearWatchedItems

▸ **clearWatchedItems**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/CStore.ts:418](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L418)

___

### clearWishlist

▸ **clearWishlist**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/CStore.ts:410](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L410)

___

### convertPrice

▸ **convertPrice**(`price`: *string* \| *number*, `from`: *string*, `to`: *string*): *string* \| *number*

#### Parameters:

Name | Type |
:------ | :------ |
`price` | *string* \| *number* |
`from` | *string* |
`to` | *string* |

**Returns:** *string* \| *number*

Defined in: [system/core/frontend/src/CStore.ts:513](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L513)

___

### getActiveCurrencySymbol

▸ **getActiveCurrencySymbol**(): *string*

**Returns:** *string*

Defined in: [system/core/frontend/src/CStore.ts:542](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L542)

___

### getActiveCurrencyTag

▸ **getActiveCurrencyTag**(): *undefined* \| *string*

**Returns:** *undefined* \| *string*

Defined in: [system/core/frontend/src/CStore.ts:527](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L527)

___

### getCart

▸ **getCart**(): TStoreListItem[]

**Returns:** TStoreListItem[]

Defined in: [system/core/frontend/src/CStore.ts:174](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L174)

___

### getCartTotal

▸ **getCartTotal**(): *object*

**Returns:** *object*

Name | Type |
:------ | :------ |
`amount` | *number* |
`total` | *number* |
`totalOld` | *number* |

Defined in: [system/core/frontend/src/CStore.ts:423](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L423)

___

### getCompare

▸ **getCompare**(): TStoreListItem[]

**Returns:** TStoreListItem[]

Defined in: [system/core/frontend/src/CStore.ts:274](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L274)

___

### getPriceWithCurrency

▸ **getPriceWithCurrency**(`price`: *any*): *string*

Returns merged price with sign of active (picked by user or default) currency

#### Parameters:

Name | Type |
:------ | :------ |
`price` | *any* |

**Returns:** *string*

Defined in: [system/core/frontend/src/CStore.ts:495](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L495)

___

### getWatchedItems

▸ **getWatchedItems**(): TStoreListItem[]

**Returns:** TStoreListItem[]

Defined in: [system/core/frontend/src/CStore.ts:297](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L297)

___

### getWishlist

▸ **getWishlist**(): TStoreListItem[]

**Returns:** TStoreListItem[]

Defined in: [system/core/frontend/src/CStore.ts:251](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L251)

___

### hasSameQntInCart

▸ **hasSameQntInCart**(`item`: TStoreListItem): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | TStoreListItem |

**Returns:** *boolean*

Defined in: [system/core/frontend/src/CStore.ts:187](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L187)

___

### isInCart

▸ **isInCart**(`item`: TStoreListItem): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | TStoreListItem |

**Returns:** *boolean*

Defined in: [system/core/frontend/src/CStore.ts:182](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L182)

___

### isInCompare

▸ **isInCompare**(`item`: TStoreListItem): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | TStoreListItem |

**Returns:** *boolean*

Defined in: [system/core/frontend/src/CStore.ts:278](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L278)

___

### isInWatchedItems

▸ **isInWatchedItems**(`item`: TStoreListItem): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | TStoreListItem |

**Returns:** *boolean*

Defined in: [system/core/frontend/src/CStore.ts:305](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L305)

___

### isInWishlist

▸ **isInWishlist**(`item`: TStoreListItem): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | TStoreListItem |

**Returns:** *boolean*

Defined in: [system/core/frontend/src/CStore.ts:255](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L255)

___

### onCartUpdate

▸ **onCartUpdate**(`cb`: (`cart`: TStoreListItem[]) => *any*, `id?`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`cb` | (`cart`: TStoreListItem[]) => *any* |
`id?` | *string* |

**Returns:** *string*

Defined in: [system/core/frontend/src/CStore.ts:245](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L245)

___

### onCompareUpdate

▸ **onCompareUpdate**(`cb`: (`cart`: TStoreListItem[]) => *any*, `id?`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`cb` | (`cart`: TStoreListItem[]) => *any* |
`id?` | *string* |

**Returns:** *string*

Defined in: [system/core/frontend/src/CStore.ts:291](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L291)

___

### onWathcedItemsUpdate

▸ **onWathcedItemsUpdate**(`cb`: (`cart`: TStoreListItem[]) => *any*, `id?`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`cb` | (`cart`: TStoreListItem[]) => *any* |
`id?` | *string* |

**Returns:** *string*

Defined in: [system/core/frontend/src/CStore.ts:314](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L314)

___

### onWishlistUpdate

▸ **onWishlistUpdate**(`cb`: (`cart`: TStoreListItem[]) => *any*, `id?`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`cb` | (`cart`: TStoreListItem[]) => *any* |
`id?` | *string* |

**Returns:** *string*

Defined in: [system/core/frontend/src/CStore.ts:268](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L268)

___

### removeFromCart

▸ **removeFromCart**(`product`: TStoreListItem): [*OperationResult*](../modules/frontend.md#operationresult)

#### Parameters:

Name | Type |
:------ | :------ |
`product` | TStoreListItem |

**Returns:** [*OperationResult*](../modules/frontend.md#operationresult)

Defined in: [system/core/frontend/src/CStore.ts:241](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L241)

___

### removeFromCompare

▸ **removeFromCompare**(`product`: TStoreListItem): [*OperationResult*](../modules/frontend.md#operationresult)

#### Parameters:

Name | Type |
:------ | :------ |
`product` | TStoreListItem |

**Returns:** [*OperationResult*](../modules/frontend.md#operationresult)

Defined in: [system/core/frontend/src/CStore.ts:287](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L287)

___

### removeFromWishlist

▸ **removeFromWishlist**(`product`: TStoreListItem): [*OperationResult*](../modules/frontend.md#operationresult)

#### Parameters:

Name | Type |
:------ | :------ |
`product` | TStoreListItem |

**Returns:** [*OperationResult*](../modules/frontend.md#operationresult)

Defined in: [system/core/frontend/src/CStore.ts:264](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L264)

___

### saveCart

▸ **saveCart**(`cart`: TStoreListItem[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`cart` | TStoreListItem[] |

**Returns:** *void*

Defined in: [system/core/frontend/src/CStore.ts:178](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L178)

___

### saveWatchedItems

▸ **saveWatchedItems**(`items`: TStoreListItem[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`items` | TStoreListItem[] |

**Returns:** *void*

Defined in: [system/core/frontend/src/CStore.ts:301](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L301)

___

### setActiveCurrency

▸ **setActiveCurrency**(`currency`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`currency` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/CStore.ts:549](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L549)

___

### updateCart

▸ **updateCart**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [system/core/frontend/src/CStore.ts:389](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L389)

___

### updateComparisionList

▸ **updateComparisionList**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [system/core/frontend/src/CStore.ts:397](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L397)

___

### updateQntInCart

▸ **updateQntInCart**(`item`: TStoreListItem): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | TStoreListItem |

**Returns:** *void*

Defined in: [system/core/frontend/src/CStore.ts:228](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L228)

___

### updateWatchedItems

▸ **updateWatchedItems**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [system/core/frontend/src/CStore.ts:401](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L401)

___

### updateWishlist

▸ **updateWishlist**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [system/core/frontend/src/CStore.ts:393](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/CStore.ts#L393)
