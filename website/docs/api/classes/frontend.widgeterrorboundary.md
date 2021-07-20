[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / WidgetErrorBoundary

# Class: WidgetErrorBoundary

[frontend](../modules/frontend.md).WidgetErrorBoundary

## Hierarchy

* *Component*<{ `widgetName`: *string*  }, { `errorMessage`: *string* ; `hasError`: *boolean*  }\>

  ↳ **WidgetErrorBoundary**

## Table of contents

### Constructors

- [constructor](frontend.widgeterrorboundary.md#constructor)

### Methods

- [componentDidCatch](frontend.widgeterrorboundary.md#componentdidcatch)
- [render](frontend.widgeterrorboundary.md#render)
- [getDerivedStateFromError](frontend.widgeterrorboundary.md#getderivedstatefromerror)

## Constructors

### constructor

\+ **new WidgetErrorBoundary**(`props`: *any*): [*WidgetErrorBoundary*](frontend.widgeterrorboundary.md)

#### Parameters:

Name | Type |
:------ | :------ |
`props` | *any* |

**Returns:** [*WidgetErrorBoundary*](frontend.widgeterrorboundary.md)

Defined in: [system/core/frontend/src/components/AdminPanelWidget/WidgetErrorBoundary.tsx:6](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/frontend/src/components/AdminPanelWidget/WidgetErrorBoundary.tsx#L6)

## Methods

### componentDidCatch

▸ **componentDidCatch**(`error`: *any*, `errorInfo`: *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`error` | *any* |
`errorInfo` | *any* |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/AdminPanelWidget/WidgetErrorBoundary.tsx:16](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/frontend/src/components/AdminPanelWidget/WidgetErrorBoundary.tsx#L16)

___

### render

▸ **render**(): ReactNode

**Returns:** ReactNode

Defined in: [system/core/frontend/src/components/AdminPanelWidget/WidgetErrorBoundary.tsx:20](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/frontend/src/components/AdminPanelWidget/WidgetErrorBoundary.tsx#L20)

___

### getDerivedStateFromError

▸ `Static`**getDerivedStateFromError**(`error`: *any*): *object*

#### Parameters:

Name | Type |
:------ | :------ |
`error` | *any* |

**Returns:** *object*

Name | Type |
:------ | :------ |
`errorMessage` | *string* |
`hasError` | *boolean* |

Defined in: [system/core/frontend/src/components/AdminPanelWidget/WidgetErrorBoundary.tsx:12](https://github.com/CromwellCMS/Cromwell/blob/ccdbdd0/system/core/frontend/src/components/AdminPanelWidget/WidgetErrorBoundary.tsx#L12)
