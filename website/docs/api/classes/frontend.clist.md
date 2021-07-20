[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CList

# Class: CList<DataType, ListItemProps\>

[frontend](../modules/frontend.md).CList

## Type parameters

Name | Default |
:------ | :------ |
`DataType` | - |
`ListItemProps` | *any* |

## Hierarchy

* *PureComponent*<[*TCListProps*](../modules/frontend.md#tclistprops)<DataType, ListItemProps\> & TCromwellBlockProps\>

  ↳ **CList**

## Implements

* [*TCList*](../modules/frontend.md#tclist)<DataType, ListItemProps\>

## Table of contents

### Constructors

- [constructor](frontend.clist.md#constructor)

### Accessors

- [currentPageNum](frontend.clist.md#currentpagenum)
- [pageSize](frontend.clist.md#pagesize)

### Methods

- [addListener](frontend.clist.md#addlistener)
- [clearState](frontend.clist.md#clearstate)
- [componentDidUpdate](frontend.clist.md#componentdidupdate)
- [componentWillUnmount](frontend.clist.md#componentwillunmount)
- [getPagedParams](frontend.clist.md#getpagedparams)
- [getProps](frontend.clist.md#getprops)
- [getScrollboxEl](frontend.clist.md#getscrollboxel)
- [init](frontend.clist.md#init)
- [onPageScrolled](frontend.clist.md#onpagescrolled)
- [openPage](frontend.clist.md#openpage)
- [render](frontend.clist.md#render)
- [setOverlay](frontend.clist.md#setoverlay)
- [setPagedParams](frontend.clist.md#setpagedparams)
- [setProps](frontend.clist.md#setprops)
- [updateData](frontend.clist.md#updatedata)

## Constructors

### constructor

\+ **new CList**<DataType, ListItemProps\>(`props`: [*TCListProps*](../modules/frontend.md#tclistprops)<DataType, ListItemProps\>): [*CList*](frontend.clist.md)<DataType, ListItemProps\>

#### Type parameters:

Name | Default |
:------ | :------ |
`DataType` | - |
`ListItemProps` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`props` | [*TCListProps*](../modules/frontend.md#tclistprops)<DataType, ListItemProps\> |

**Returns:** [*CList*](frontend.clist.md)<DataType, ListItemProps\>

Defined in: [system/core/frontend/src/components/CList/CList.tsx:54](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L54)

## Accessors

### currentPageNum

• get **currentPageNum**(): *number*

**Returns:** *number*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:26](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L26)

• set **currentPageNum**(`val`: *number*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`val` | *number* |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:29](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L29)

___

### pageSize

• get **pageSize**(): *undefined* \| *number*

**Returns:** *undefined* \| *number*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:32](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L32)

• set **pageSize**(`val`: *undefined* \| *number*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`val` | *undefined* \| *number* |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:35](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L35)

## Methods

### addListener

▸ **addListener**(`type`: *componentDidUpdate*, `cb`: () => *void*, `id?`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`type` | *componentDidUpdate* |
`cb` | () => *void* |
`id?` | *string* |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:97](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L97)

___

### clearState

▸ **clearState**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:274](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L274)

___

### componentDidUpdate

▸ **componentDidUpdate**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:73](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L73)

___

### componentWillUnmount

▸ **componentWillUnmount**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:93](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L93)

___

### getPagedParams

▸ **getPagedParams**(): *TPagedParams*<DataType\>

**Returns:** *TPagedParams*<DataType\>

Defined in: [system/core/frontend/src/components/CList/CList.tsx:494](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L494)

___

### getProps

▸ **getProps**(): [*TCListProps*](../modules/frontend.md#tclistprops)<DataType, ListItemProps\>

**Returns:** [*TCListProps*](../modules/frontend.md#tclistprops)<DataType, ListItemProps\>

Defined in: [system/core/frontend/src/components/CList/CList.tsx:64](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L64)

___

### getScrollboxEl

▸ **getScrollboxEl**(): *null* \| HTMLDivElement

**Returns:** *null* \| HTMLDivElement

Defined in: [system/core/frontend/src/components/CList/CList.tsx:464](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L464)

___

### init

▸ **init**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:113](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L113)

___

### onPageScrolled

▸ **onPageScrolled**(`pageNumber`: *number*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`pageNumber` | *number* |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:290](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L290)

___

### openPage

▸ **openPage**(`pageNumber`: *number*): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`pageNumber` | *number* |

**Returns:** *Promise*<void\>

Defined in: [system/core/frontend/src/components/CList/CList.tsx:301](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L301)

___

### render

▸ **render**(): *Element*

**Returns:** *Element*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:497](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L497)

___

### setOverlay

▸ **setOverlay**(`isLoading`: *boolean*, `force?`: *boolean*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`isLoading` | *boolean* |
`force?` | *boolean* |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:403](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L403)

___

### setPagedParams

▸ **setPagedParams**(`val`: *TPagedParams*<DataType\>): *TPagedParams*<DataType\>

#### Parameters:

Name | Type |
:------ | :------ |
`val` | *TPagedParams*<DataType\> |

**Returns:** *TPagedParams*<DataType\>

Defined in: [system/core/frontend/src/components/CList/CList.tsx:495](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L495)

___

### setProps

▸ **setProps**(`props`: *null* \| [*TCListProps*](../modules/frontend.md#tclistprops)<DataType, ListItemProps\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`props` | *null* \| [*TCListProps*](../modules/frontend.md#tclistprops)<DataType, ListItemProps\> |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CList/CList.tsx:69](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L69)

___

### updateData

▸ **updateData**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [system/core/frontend/src/components/CList/CList.tsx:142](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CList/CList.tsx#L142)
