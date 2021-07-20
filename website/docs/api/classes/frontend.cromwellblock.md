[@cromwell/root](../README.md) / [Exports](../modules.md) / [frontend](../modules/frontend.md) / CromwellBlock

# Class: CromwellBlock<TContentBlock\>

[frontend](../modules/frontend.md).CromwellBlock

## Type parameters

Name | Default |
:------ | :------ |
`TContentBlock` | React.Component |

## Hierarchy

* *Component*<TCromwellBlockProps<TContentBlock\>\>

  ↳ **CromwellBlock**

## Implements

* *TCromwellBlock*<TContentBlock\>

## Table of contents

### Constructors

- [constructor](frontend.cromwellblock.md#constructor)

### Properties

- [movedCompForceUpdate](frontend.cromwellblock.md#movedcompforceupdate)

### Methods

- [addDidUpdateListener](frontend.cromwellblock.md#adddidupdatelistener)
- [componentDidMount](frontend.cromwellblock.md#componentdidmount)
- [componentDidUpdate](frontend.cromwellblock.md#componentdidupdate)
- [componentWillUnmount](frontend.cromwellblock.md#componentwillunmount)
- [consumerRender](frontend.cromwellblock.md#consumerrender)
- [contentRender](frontend.cromwellblock.md#contentrender)
- [getBlockInstance](frontend.cromwellblock.md#getblockinstance)
- [getBlockRef](frontend.cromwellblock.md#getblockref)
- [getChildBlocks](frontend.cromwellblock.md#getchildblocks)
- [getContentInstance](frontend.cromwellblock.md#getcontentinstance)
- [getData](frontend.cromwellblock.md#getdata)
- [getDefaultContent](frontend.cromwellblock.md#getdefaultcontent)
- [notifyChildRegistered](frontend.cromwellblock.md#notifychildregistered)
- [render](frontend.cromwellblock.md#render)
- [rerender](frontend.cromwellblock.md#rerender)
- [setContentInstance](frontend.cromwellblock.md#setcontentinstance)

## Constructors

### constructor

\+ **new CromwellBlock**<TContentBlock\>(`props`: *TCromwellBlockProps*<TContentBlock\>): [*CromwellBlock*](frontend.cromwellblock.md)<TContentBlock\>

#### Type parameters:

Name | Default |
:------ | :------ |
`TContentBlock` | *Component*<{}, {}, any\> |

#### Parameters:

Name | Type |
:------ | :------ |
`props` | *TCromwellBlockProps*<TContentBlock\> |

**Returns:** [*CromwellBlock*](frontend.cromwellblock.md)<TContentBlock\>

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:58](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L58)

## Properties

### movedCompForceUpdate

• `Optional` **movedCompForceUpdate**: *undefined* \| () => *void*

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:45](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L45)

## Methods

### addDidUpdateListener

▸ **addDidUpdateListener**(`id`: *string*, `func`: () => *void*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`func` | () => *void* |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:119](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L119)

___

### componentDidMount

▸ **componentDidMount**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:80](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L80)

___

### componentDidUpdate

▸ **componentDidUpdate**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:85](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L85)

___

### componentWillUnmount

▸ **componentWillUnmount**(): *void*

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:90](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L90)

___

### consumerRender

▸ **consumerRender**(): *null* \| *Element*

**Returns:** *null* \| *Element*

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:368](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L368)

___

### contentRender

▸ **contentRender**(`getContent?`: *null* \| (`block`: *TCromwellBlock*<Component<{}, {}, any\>\>) => ReactNode, `className?`: *string*): ReactNode

#### Parameters:

Name | Type |
:------ | :------ |
`getContent?` | *null* \| (`block`: *TCromwellBlock*<Component<{}, {}, any\>\>) => ReactNode |
`className?` | *string* |

**Returns:** ReactNode

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:292](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L292)

___

### getBlockInstance

▸ **getBlockInstance**(`id`: *string*): *undefined* \| *TCromwellBlock*<Component<{}, {}, any\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *undefined* \| *TCromwellBlock*<Component<{}, {}, any\>\>

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:58](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L58)

___

### getBlockRef

▸ **getBlockRef**(): *RefObject*<HTMLDivElement\>

**Returns:** *RefObject*<HTMLDivElement\>

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:55](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L55)

___

### getChildBlocks

▸ **getChildBlocks**(): ReactNode[]

**Returns:** ReactNode[]

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:228](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L228)

___

### getContentInstance

▸ **getContentInstance**(): *Component*<{}, {}, any\> & TContentBlock

**Returns:** *Component*<{}, {}, any\> & TContentBlock

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:56](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L56)

___

### getData

▸ **getData**(): { `blockRef?`: *undefined* \| <T\>(`block`: T) => *void* ; `className?`: *undefined* \| *string* ; `content?`: *undefined* \| (`data`: *undefined* \| TCromwellBlockData, `blockRef`: *RefObject*<HTMLDivElement\>, `setContentInstance`: (`contentInstance`: *Component*<{}, {}, any\> & TContentBlock) => *void*) => ReactNode ; `editorStyles?`: *undefined* \| { `align?`: *undefined* \| *left* \| *right* \| *center* ; `maxWidth?`: *undefined* \| *number* ; `offsetBottom?`: *undefined* \| *number* ; `offsetLeft?`: *undefined* \| *number* ; `offsetRight?`: *undefined* \| *number* ; `offsetTop?`: *undefined* \| *number*  } ; `gallery?`: *undefined* \| TGallerySettings ; `global?`: *undefined* \| *boolean* ; `html?`: *undefined* \| { `innerHTML?`: *undefined* \| *string*  } ; `id`: *string* ; `image?`: *undefined* \| { `alt?`: *undefined* \| *string* ; `height?`: *undefined* \| *number* ; `link?`: *undefined* \| *string* ; `objectFit?`: *undefined* \| *contain* \| *cover* ; `src?`: *undefined* \| *string* ; `width?`: *undefined* \| *number* ; `withEffect?`: *undefined* \| *boolean*  } ; `index?`: *undefined* \| *number* ; `isConstant?`: *undefined* \| *boolean* ; `isDeleted?`: *undefined* \| *boolean* ; `isVirtual?`: *undefined* \| *boolean* ; `jsxParentId?`: *undefined* \| *string* ; `link?`: *undefined* \| { `href?`: *undefined* \| *string* ; `text?`: *undefined* \| *string*  } ; `onClick?`: *undefined* \| (`event`: *MouseEvent*<HTMLDivElement, MouseEvent\>) => *any* ; `parentId?`: *undefined* \| *string* ; `plugin?`: *undefined* \| { `pluginName?`: *undefined* \| *string* ; `settings?`: *undefined* \| *Record*<string, any\>  } ; `style?`: *undefined* \| *string* \| *CSSProperties* ; `text?`: *undefined* \| { `content?`: *undefined* \| *string* ; `href?`: *undefined* \| *string* ; `textElementType?`: *undefined* \| *object* \| *time* \| *title* \| *address* \| *link* \| *style* \| *html* \| *a* \| *abbr* \| *area* \| *article* \| *aside* \| *audio* \| *b* \| *base* \| *bdi* \| *bdo* \| *big* \| *blockquote* \| *body* \| *br* \| *button* \| *canvas* \| *caption* \| *cite* \| *code* \| *col* \| *colgroup* \| *data* \| *datalist* \| *dd* \| *del* \| *details* \| *dfn* \| *dialog* \| *div* \| *dl* \| *dt* \| *em* \| *embed* \| *fieldset* \| *figcaption* \| *figure* \| *footer* \| *form* \| *h1* \| *h2* \| *h3* \| *h4* \| *h5* \| *h6* \| *head* \| *header* \| *hgroup* \| *hr* \| *i* \| *iframe* \| *img* \| *input* \| *ins* \| *kbd* \| *keygen* \| *label* \| *legend* \| *li* \| *main* \| *map* \| *mark* \| *menu* \| *menuitem* \| *meta* \| *meter* \| *nav* \| *noscript* \| *ol* \| *optgroup* \| *option* \| *output* \| *p* \| *param* \| *picture* \| *pre* \| *progress* \| *q* \| *rp* \| *rt* \| *ruby* \| *s* \| *samp* \| *slot* \| *script* \| *section* \| *select* \| *small* \| *source* \| *span* \| *strong* \| *sub* \| *summary* \| *sup* \| *table* \| *template* \| *tbody* \| *td* \| *textarea* \| *tfoot* \| *th* \| *thead* \| *tr* \| *track* \| *u* \| *ul* \| *var* \| *video* \| *wbr* \| *webview*  } ; `type?`: *undefined* \| *text* \| *image* \| *plugin* \| *container* \| *HTML* \| *gallery* \| *list* \| *link*  } & TCromwellBlockData

**Returns:** { `blockRef?`: *undefined* \| <T\>(`block`: T) => *void* ; `className?`: *undefined* \| *string* ; `content?`: *undefined* \| (`data`: *undefined* \| TCromwellBlockData, `blockRef`: *RefObject*<HTMLDivElement\>, `setContentInstance`: (`contentInstance`: *Component*<{}, {}, any\> & TContentBlock) => *void*) => ReactNode ; `editorStyles?`: *undefined* \| { `align?`: *undefined* \| *left* \| *right* \| *center* ; `maxWidth?`: *undefined* \| *number* ; `offsetBottom?`: *undefined* \| *number* ; `offsetLeft?`: *undefined* \| *number* ; `offsetRight?`: *undefined* \| *number* ; `offsetTop?`: *undefined* \| *number*  } ; `gallery?`: *undefined* \| TGallerySettings ; `global?`: *undefined* \| *boolean* ; `html?`: *undefined* \| { `innerHTML?`: *undefined* \| *string*  } ; `id`: *string* ; `image?`: *undefined* \| { `alt?`: *undefined* \| *string* ; `height?`: *undefined* \| *number* ; `link?`: *undefined* \| *string* ; `objectFit?`: *undefined* \| *contain* \| *cover* ; `src?`: *undefined* \| *string* ; `width?`: *undefined* \| *number* ; `withEffect?`: *undefined* \| *boolean*  } ; `index?`: *undefined* \| *number* ; `isConstant?`: *undefined* \| *boolean* ; `isDeleted?`: *undefined* \| *boolean* ; `isVirtual?`: *undefined* \| *boolean* ; `jsxParentId?`: *undefined* \| *string* ; `link?`: *undefined* \| { `href?`: *undefined* \| *string* ; `text?`: *undefined* \| *string*  } ; `onClick?`: *undefined* \| (`event`: *MouseEvent*<HTMLDivElement, MouseEvent\>) => *any* ; `parentId?`: *undefined* \| *string* ; `plugin?`: *undefined* \| { `pluginName?`: *undefined* \| *string* ; `settings?`: *undefined* \| *Record*<string, any\>  } ; `style?`: *undefined* \| *string* \| *CSSProperties* ; `text?`: *undefined* \| { `content?`: *undefined* \| *string* ; `href?`: *undefined* \| *string* ; `textElementType?`: *undefined* \| *object* \| *time* \| *title* \| *address* \| *link* \| *style* \| *html* \| *a* \| *abbr* \| *area* \| *article* \| *aside* \| *audio* \| *b* \| *base* \| *bdi* \| *bdo* \| *big* \| *blockquote* \| *body* \| *br* \| *button* \| *canvas* \| *caption* \| *cite* \| *code* \| *col* \| *colgroup* \| *data* \| *datalist* \| *dd* \| *del* \| *details* \| *dfn* \| *dialog* \| *div* \| *dl* \| *dt* \| *em* \| *embed* \| *fieldset* \| *figcaption* \| *figure* \| *footer* \| *form* \| *h1* \| *h2* \| *h3* \| *h4* \| *h5* \| *h6* \| *head* \| *header* \| *hgroup* \| *hr* \| *i* \| *iframe* \| *img* \| *input* \| *ins* \| *kbd* \| *keygen* \| *label* \| *legend* \| *li* \| *main* \| *map* \| *mark* \| *menu* \| *menuitem* \| *meta* \| *meter* \| *nav* \| *noscript* \| *ol* \| *optgroup* \| *option* \| *output* \| *p* \| *param* \| *picture* \| *pre* \| *progress* \| *q* \| *rp* \| *rt* \| *ruby* \| *s* \| *samp* \| *slot* \| *script* \| *section* \| *select* \| *small* \| *source* \| *span* \| *strong* \| *sub* \| *summary* \| *sup* \| *table* \| *template* \| *tbody* \| *td* \| *textarea* \| *tfoot* \| *th* \| *thead* \| *tr* \| *track* \| *u* \| *ul* \| *var* \| *video* \| *wbr* \| *webview*  } ; `type?`: *undefined* \| *text* \| *image* \| *plugin* \| *container* \| *HTML* \| *gallery* \| *list* \| *link*  } & TCromwellBlockData

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:49](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L49)

___

### getDefaultContent

▸ **getDefaultContent**(): ReactNode

**Returns:** ReactNode

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:271](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L271)

___

### notifyChildRegistered

▸ **notifyChildRegistered**(`inst`: *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`inst` | *any* |

**Returns:** *void*

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:216](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L216)

___

### render

▸ **render**(): ReactNode

**Returns:** ReactNode

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:377](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L377)

___

### rerender

▸ **rerender**(): *undefined* \| *Promise*<void\>

**Returns:** *undefined* \| *Promise*<void\>

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:123](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L123)

___

### setContentInstance

▸ **setContentInstance**(`contentInstance`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`contentInstance` | *any* |

**Returns:** *any*

Defined in: [system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx:57](https://github.com/CromwellCMS/Cromwell/blob/b0001b2/system/core/frontend/src/components/CromwellBlock/CromwellBlock.tsx#L57)
