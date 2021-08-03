[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CList

# Class: CList<DataType, ListItemProps\>

[frontend](../modules/frontend.md).CList

## Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | `DataType` |
| `ListItemProps` | `any` |

## Hierarchy

- `PureComponent`<[`TCListProps`](../modules/frontend.md#tclistprops)<`DataType`, `ListItemProps`\> & `TCromwellBlockProps`<[`TCList`](../modules/frontend.md#tclist)\>\>

  ↳ **`CList`**

## Implements

- [`TCList`](../modules/frontend.md#tclist)<`DataType`, `ListItemProps`\>

## Table of contents

### Constructors

- [constructor](frontend.CList.md#constructor)

### Methods

- [addListener](frontend.CList.md#addlistener)
- [clearState](frontend.CList.md#clearstate)
- [componentDidUpdate](frontend.CList.md#componentdidupdate)
- [componentWillUnmount](frontend.CList.md#componentwillunmount)
- [getPagedParams](frontend.CList.md#getpagedparams)
- [getProps](frontend.CList.md#getprops)
- [getScrollboxEl](frontend.CList.md#getscrollboxel)
- [init](frontend.CList.md#init)
- [onPageScrolled](frontend.CList.md#onpagescrolled)
- [openPage](frontend.CList.md#openpage)
- [render](frontend.CList.md#render)
- [setOverlay](frontend.CList.md#setoverlay)
- [setPagedParams](frontend.CList.md#setpagedparams)
- [setProps](frontend.CList.md#setprops)
- [updateData](frontend.CList.md#updatedata)

## Constructors

### constructor

• **new CList**<`DataType`, `ListItemProps`\>(`props`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | `DataType` |
| `ListItemProps` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TCListProps`](../modules/frontend.md#tclistprops)<`DataType`, `ListItemProps`\> |

#### Overrides

React.PureComponent&lt;TCListProps&lt;DataType, ListItemProps\&gt; &amp; TCromwellBlockProps&lt;TCList\&gt;\&gt;.constructor

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:55](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L55)

## Methods

### addListener

▸ **addListener**(`type`, `cb`, `id?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"componentDidUpdate"`` |
| `cb` | () => `void` |
| `id?` | `string` |

#### Returns

`void`

#### Implementation of

TCList.addListener

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:93](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L93)

___

### clearState

▸ **clearState**(): `void`

#### Returns

`void`

#### Implementation of

TCList.clearState

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:266](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L266)

___

### componentDidUpdate

▸ **componentDidUpdate**(): `void`

#### Returns

`void`

#### Overrides

React.PureComponent.componentDidUpdate

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:69](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L69)

___

### componentWillUnmount

▸ **componentWillUnmount**(): `void`

#### Returns

`void`

#### Overrides

React.PureComponent.componentWillUnmount

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:89](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L89)

___

### getPagedParams

▸ **getPagedParams**(): `TPagedParams`<`DataType`\>

#### Returns

`TPagedParams`<`DataType`\>

#### Implementation of

TCList.getPagedParams

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:496](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L496)

___

### getProps

▸ **getProps**(): [`TCListProps`](../modules/frontend.md#tclistprops)<`DataType`, `ListItemProps`\>

#### Returns

[`TCListProps`](../modules/frontend.md#tclistprops)<`DataType`, `ListItemProps`\>

#### Implementation of

TCList.getProps

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:60](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L60)

___

### getScrollboxEl

▸ **getScrollboxEl**(): ``null`` \| `HTMLDivElement`

#### Returns

``null`` \| `HTMLDivElement`

#### Implementation of

TCList.getScrollboxEl

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:457](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L457)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Implementation of

TCList.init

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:109](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L109)

___

### onPageScrolled

▸ **onPageScrolled**(`pageNumber`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageNumber` | `number` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:282](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L282)

___

### openPage

▸ **openPage**(`pageNumber`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageNumber` | `number` |

#### Returns

`Promise`<`void`\>

#### Implementation of

TCList.openPage

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:292](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L292)

___

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

React.PureComponent.render

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:499](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L499)

___

### setOverlay

▸ **setOverlay**(`isLoading`, `force?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `isLoading` | `boolean` |
| `force?` | `boolean` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:394](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L394)

___

### setPagedParams

▸ **setPagedParams**(`val`): `TPagedParams`<`DataType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `TPagedParams`<`DataType`\> |

#### Returns

`TPagedParams`<`DataType`\>

#### Implementation of

TCList.setPagedParams

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:497](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L497)

___

### setProps

▸ **setProps**(`props`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | ``null`` \| [`TCListProps`](../modules/frontend.md#tclistprops)<`DataType`, `ListItemProps`\> |

#### Returns

`void`

#### Implementation of

TCList.setProps

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:65](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L65)

___

### updateData

▸ **updateData**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

TCList.updateData

#### Defined in

[system/core/frontend/src/components/CList/CList.tsx:134](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/CList.tsx#L134)
