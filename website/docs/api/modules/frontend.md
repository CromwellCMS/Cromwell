[@cromwell/root](../README.md) / [Exports](../modules.md) / frontend

# Module: frontend

CromwellCMS Frontend SDK

Exports Blocks, React components, API clients and frontend helpers. 

### Install
```
npm i @cromwell/core-frontend
```

### Use
Example of usage
```ts
import { getGraphQLClient } from '@cromwell/core-frontend';

const products = await getGraphQLClient().getProducts();
```

## Table of contents

### Classes

- [CContainer](../classes/frontend.CContainer.md)
- [CGallery](../classes/frontend.CGallery.md)
- [CGraphQLClient](../classes/frontend.CGraphQLClient.md)
- [CHTML](../classes/frontend.CHTML.md)
- [CImage](../classes/frontend.CImage.md)
- [CList](../classes/frontend.CList.md)
- [CPlugin](../classes/frontend.CPlugin.md)
- [CRestAPIClient](../classes/frontend.CRestAPIClient.md)
- [CStore](../classes/frontend.CStore.md)
- [CText](../classes/frontend.CText.md)
- [CentralServerClient](../classes/frontend.CentralServerClient.md)
- [Importer](../classes/frontend.Importer.md)

### Type aliases

- [CContainerProps](frontend.md#ccontainerprops)
- [OperationResult](frontend.md#operationresult)
- [TApiClient](frontend.md#tapiclient)
- [TCGalleryProps](frontend.md#tcgalleryprops)
- [TCGraphQLClient](frontend.md#tcgraphqlclient)
- [TCList](frontend.md#tclist)
- [TCListProps](frontend.md#tclistprops)
- [TCRestAPIClient](frontend.md#tcrestapiclient)
- [TCssClasses](frontend.md#tcssclasses)
- [TDynamicLoader](frontend.md#tdynamicloader)
- [TElements](frontend.md#telements)
- [TErrorInfo](frontend.md#terrorinfo)
- [TGraphQLErrorInfo](frontend.md#tgraphqlerrorinfo)
- [TItemComponentProps](frontend.md#titemcomponentprops)
- [TListenerType](frontend.md#tlistenertype)
- [TPaginationProps](frontend.md#tpaginationprops)
- [TRequestOptions](frontend.md#trequestoptions)
- [WidgetNames](frontend.md#widgetnames)
- [WidgetTypes](frontend.md#widgettypes)
- [Widget\_DashboardProps](frontend.md#widget_dashboardprops)
- [Widget\_EntityActions](frontend.md#widget_entityactions)
- [Widget\_PostActions](frontend.md#widget_postactions)

### Variables

- [BlockContentConsumer](frontend.md#blockcontentconsumer)
- [BlockContentProvider](frontend.md#blockcontentprovider)
- [blockCssClass](frontend.md#blockcssclass)
- [pageRootContainerId](frontend.md#pagerootcontainerid)

### Functions

- [AdminPanelWidgetPlace](frontend.md#adminpanelwidgetplace)
- [Link](frontend.md#link)
- [LoadBox](frontend.md#loadbox)
- [ProductAttributes](frontend.md#productattributes)
- [awaitImporter](frontend.md#awaitimporter)
- [fetch](frontend.md#fetch)
- [getBlockById](frontend.md#getblockbyid)
- [getBlockData](frontend.md#getblockdata)
- [getBlockDataById](frontend.md#getblockdatabyid)
- [getBlockElementById](frontend.md#getblockelementbyid)
- [getBlockHtmlId](frontend.md#getblockhtmlid)
- [getBlockHtmlType](frontend.md#getblockhtmltype)
- [getBlockIdFromHtml](frontend.md#getblockidfromhtml)
- [getBlockTypeFromHtml](frontend.md#getblocktypefromhtml)
- [getCStore](frontend.md#getcstore)
- [getCentralServerClient](frontend.md#getcentralserverclient)
- [getDynamicLoader](frontend.md#getdynamicloader)
- [getGraphQLClient](frontend.md#getgraphqlclient)
- [getGraphQLErrorInfo](frontend.md#getgraphqlerrorinfo)
- [getHtmlPluginBlockName](frontend.md#gethtmlpluginblockname)
- [getLoadableFrontendBundle](frontend.md#getloadablefrontendbundle)
- [getModuleImporter](frontend.md#getmoduleimporter)
- [getNamedWidgetForPlace](frontend.md#getnamedwidgetforplace)
- [getPluginStaticUrl](frontend.md#getpluginstaticurl)
- [getRestAPIClient](frontend.md#getrestapiclient)
- [getWidgets](frontend.md#getwidgets)
- [getWidgetsForPlace](frontend.md#getwidgetsforplace)
- [iconFromPath](frontend.md#iconfrompath)
- [isAdminPanel](frontend.md#isadminpanel)
- [loadFrontendBundle](frontend.md#loadfrontendbundle)
- [onWidgetRegister](frontend.md#onwidgetregister)
- [registerWidget](frontend.md#registerwidget)
- [useForceUpdate](frontend.md#useforceupdate)

## Type aliases

### CContainerProps

Ƭ **CContainerProps**: { `children?`: `React.ReactNode`  } & `TCromwellBlockProps`

#### Defined in

[system/core/frontend/src/components/CContainer/CContainer.tsx:6](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CContainer/CContainer.tsx#L6)

___

### OperationResult

Ƭ **OperationResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `message?` | `string` |
| `success` | `boolean` |

#### Defined in

[system/core/frontend/src/CStore.ts:22](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L22)

___

### TApiClient

Ƭ **TApiClient**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getAttributes` | () => `Promise`<`undefined` \| `TAttribute`[]\> |
| `getProductById` | (`id`: `string`) => `Promise`<`undefined` \| `TProduct`\> |

#### Defined in

[system/core/frontend/src/CStore.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L17)

___

### TCGalleryProps

Ƭ **TCGalleryProps**: { `className?`: `string` ; `shouldComponentUpdate?`: `boolean`  } & `TCromwellBlockProps`

#### Defined in

[system/core/frontend/src/components/CGallery/CGallery.tsx:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CGallery/CGallery.tsx#L26)

___

### TCGraphQLClient

Ƭ **TCGraphQLClient**: [`CGraphQLClient`](../classes/frontend.CGraphQLClient.md)

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:1024](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L1024)

___

### TCList

Ƭ **TCList**<`DataType`, `ListItemProps`\>: `Object`

Public API of CList instance

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | `any` |
| `ListItemProps` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addListener` | (`type`: ``"componentDidUpdate"``, `cb`: () => `void`) => `void` |
| `clearState` | () => `void` |
| `getPagedParams` | () => `TPagedParams`<`DataType`\> |
| `getProps` | () => [`TCListProps`](frontend.md#tclistprops)<`DataType`, `ListItemProps`\> |
| `getScrollboxEl` | () => ``null`` \| `HTMLDivElement` |
| `init` | () => `void` |
| `openPage` | (`pageNumber`: `number`) => `void` |
| `setPagedParams` | (`val`: `TPagedParams`<`DataType`\>) => `void` |
| `setProps` | (`props`: ``null`` \| [`TCListProps`](frontend.md#tclistprops)<`DataType`, `ListItemProps`\>) => `void` |
| `updateData` | () => `Promise`<`void`\> |

#### Defined in

[system/core/frontend/src/components/CList/types.ts:104](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/types.ts#L104)

___

### TCListProps

Ƭ **TCListProps**<`DataType`, `ListItemProps`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `DataType` |
| `ListItemProps` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `ListItem` | `React.ComponentType`<[`TItemComponentProps`](frontend.md#titemcomponentprops)<`DataType`, `ListItemProps`\>\> | Component that will display items |
| `className?` | `string` | HTML Class attribute for wrapper container |
| `cssClasses?` | [`TCssClasses`](frontend.md#tcssclasses) | - |
| `dataList?` | `DataType`[] | Array of data to create components for each piece and virtualize. Won't work with "loader" prop |
| `disableCaching?` | `boolean` | Disable caching of loaded pages from "loader" prop when open a new page by pagination. Caching is working by default |
| `elements?` | [`TElements`](frontend.md#telements) | - |
| `firstBatch?` | `TPagedList`<`DataType`\> | First batch / page. Can be used with "loader". Supposed to be used in SSR to prerender page |
| `id` | `string` | CromwellBlock id |
| `isLoading?` | `boolean` | Force to show preloader instead of a list |
| `listItemProps?` | `ListItemProps` | Prop object to pass for each component in a list |
| `maxDomPages?` | `number` | Max pages to render at screen. 10 by default |
| `minRangeToLoad?` | `number` | Threshold in px where automatically request next or prev page. 200 by default. Use with useAutoLoading |
| `noDataLabel?` | `string` | Label to show when data array is empty. "No data" by default |
| `pageSize?` | `number` | Page size to first use in TPagedParams of "loader". After first batch recieved will use pageSize from pagedMeta if pagedMeta has it |
| `paginationButtonsNum?` | `number` | Max number of page links to display. 10 by default |
| `pathname?` | `string` | window.location.pathname for SSR to prerender pagination links |
| `scrollContainerSelector?` | `string` | When useShowMoreButton and usePagination enabled CList needs to know container that scrolls pages to define current page during scrolling |
| `useAutoLoading?` | `boolean` | Auto load more pages when scroll reached end of start in minRangeToLoad (px) |
| `usePagination?` | `boolean` | Display pagination |
| `useQueryPagination?` | `boolean` | Parse and set pageNumber in url as query param |
| `useShowMoreButton?` | `boolean` | If useAutoLoading disabled can show button to load next page in the same container |
| `loader?` | (`params`: `TPagedParams`<`DataType`\>) => `undefined` \| ``null`` \| `Promise`<`undefined` \| ``null`` \| `TPagedList`<`DataType`\> \| `DataType`[]\> | - |

#### Defined in

[system/core/frontend/src/components/CList/types.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/types.ts#L33)

___

### TCRestAPIClient

Ƭ **TCRestAPIClient**: typeof [`CRestAPIClient`](../classes/frontend.CRestAPIClient.md)

#### Defined in

[system/core/frontend/src/api/CRestAPIClient.ts:793](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L793)

___

### TCssClasses

Ƭ **TCssClasses**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `page?` | `string` |
| `pagination?` | `string` |
| `paginationActiveLink?` | `string` |
| `paginationArrowLink?` | `string` |
| `paginationDisabledLink?` | `string` |
| `paginationLink?` | `string` |
| `scrollBox?` | `string` |

#### Defined in

[system/core/frontend/src/components/CList/types.ts:4](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/types.ts#L4)

___

### TDynamicLoader

Ƭ **TDynamicLoader**: (`func`: () => `Promise`<`ComponentType`\>, `options?`: `any`) => `ComponentType`

#### Type declaration

▸ (`func`, `options?`): `ComponentType`

##### Parameters

| Name | Type |
| :------ | :------ |
| `func` | () => `Promise`<`ComponentType`\> |
| `options?` | `any` |

##### Returns

`ComponentType`

#### Defined in

[system/core/frontend/src/constants.ts:58](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L58)

___

### TElements

Ƭ **TElements**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `arrowFirst?` | `React.ReactNode` | - |
| `arrowLast?` | `React.ReactNode` | - |
| `arrowLeft?` | `React.ReactNode` | - |
| `arrowRight?` | `React.ReactNode` | - |
| `pagination?` | `React.ComponentType`<[`TPaginationProps`](frontend.md#tpaginationprops)\> | - |
| `preloader?` | `React.ReactNode` | Preloader to show during first data request |
| `showMore?` | `React.ComponentType`<`Object`\> | - |

#### Defined in

[system/core/frontend/src/components/CList/types.ts:20](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/types.ts#L20)

___

### TErrorInfo

Ƭ **TErrorInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `disableLog?` | `boolean` |
| `message` | `string` |
| `route` | `string` |
| `statusCode` | `number` |

#### Defined in

[system/core/frontend/src/api/CRestAPIClient.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L28)

___

### TGraphQLErrorInfo

Ƭ **TGraphQLErrorInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `extraInfo` | `any` |
| `graphQLErrors` | `any` |
| `message` | `string` |
| `networkError` | `any` |

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:51](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L51)

___

### TItemComponentProps

Ƭ **TItemComponentProps**<`DataType`, `ListItemProps`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `DataType` |
| `ListItemProps` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `DataType` |
| `listItemProps?` | `ListItemProps` |

#### Defined in

[system/core/frontend/src/components/CList/types.ts:130](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/types.ts#L130)

___

### TListenerType

Ƭ **TListenerType**: ``"componentDidUpdate"``

#### Defined in

[system/core/frontend/src/components/CList/types.ts:128](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/types.ts#L128)

___

### TPaginationProps

Ƭ **TPaginationProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `count` | `number` |
| `page` | `number` |
| `onChange` | (`page`: `number`) => `void` |

#### Defined in

[system/core/frontend/src/components/CList/types.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/CList/types.ts#L14)

___

### TRequestOptions

Ƭ **TRequestOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `disableLog?` | `boolean` | Disable error logging |
| `headers?` | `Record`<`string`, `string`\> | Add headers |
| `input?` | `any` | Body for 'post' and 'put' requests |
| `method?` | `string` | HTTP method: 'get', 'post', 'put', etc. |

#### Defined in

[system/core/frontend/src/api/CRestAPIClient.ts:35](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L35)

___

### WidgetNames

Ƭ **WidgetNames**: keyof [`WidgetTypes`](frontend.md#widgettypes)

#### Defined in

[system/core/frontend/src/widget-types.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/widget-types.ts#L15)

___

### WidgetTypes

Ƭ **WidgetTypes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CategoryActions` | [`Widget_EntityActions`](frontend.md#widget_entityactions)<`TProductCategory`\> |
| `Dashboard` | [`Widget_DashboardProps`](frontend.md#widget_dashboardprops) |
| `OrderActions` | [`Widget_EntityActions`](frontend.md#widget_entityactions)<`TOrder`\> |
| `PluginSettings` | `TPluginSettingsProps` |
| `PostActions` | [`Widget_PostActions`](frontend.md#widget_postactions) |
| `ProductActions` | [`Widget_EntityActions`](frontend.md#widget_entityactions)<`TProduct`\> |
| `TagActions` | [`Widget_EntityActions`](frontend.md#widget_entityactions)<`TTag`\> |

#### Defined in

[system/core/frontend/src/widget-types.ts:5](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/widget-types.ts#L5)

___

### Widget\_DashboardProps

Ƭ **Widget\_DashboardProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `stats` | `TCmsStats` \| `undefined` |
| `setSize` | (`pluginName`: `string`, `layouts`: { `lg`: { `h?`: `number` ; `w?`: `number` ; `x?`: `number` ; `y?`: `number`  } ; `md`: { `h?`: `number` ; `w?`: `number` ; `x?`: `number` ; `y?`: `number`  } ; `sm`: { `h?`: `number` ; `w?`: `number` ; `x?`: `number` ; `y?`: `number`  } ; `xs`: { `h?`: `number` ; `w?`: `number` ; `x?`: `number` ; `y?`: `number`  } ; `xxs`: { `h?`: `number` ; `w?`: `number` ; `x?`: `number` ; `y?`: `number`  }  }) => `any` |

#### Defined in

[system/core/frontend/src/widget-types.ts:17](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/widget-types.ts#L17)

___

### Widget\_EntityActions

Ƭ **Widget\_EntityActions**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `T` |
| `setData` | (`data`: `T`) => `any` |

#### Defined in

[system/core/frontend/src/widget-types.ts:28](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/widget-types.ts#L28)

___

### Widget\_PostActions

Ƭ **Widget\_PostActions**: [`Widget_EntityActions`](frontend.md#widget_entityactions)<`TPost`\> & { `quillInstance`: `any`  }

#### Defined in

[system/core/frontend/src/widget-types.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/widget-types.ts#L33)

## Variables

### BlockContentConsumer

• **BlockContentConsumer**: `Consumer`<``null`` \| `TBlockContentProvider`\>

___

### BlockContentProvider

• **BlockContentProvider**: `Provider`<``null`` \| `TBlockContentProvider`\>

___

### blockCssClass

• `Const` **blockCssClass**: ``"CB"``

#### Defined in

[system/core/frontend/src/constants.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L12)

___

### pageRootContainerId

• `Const` **pageRootContainerId**: ``"root"``

#### Defined in

[system/core/frontend/src/constants.ts:62](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L62)

## Functions

### AdminPanelWidgetPlace

▸ `Const` **AdminPanelWidgetPlace**<`T`\>(`props`): ``null`` \| `Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`WidgetTypes`](frontend.md#widgettypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Object` |
| `props.pluginName?` | `string` |
| `props.widgetName` | `T` |
| `props.widgetProps` | [`WidgetTypes`](frontend.md#widgettypes)[`T`] |

#### Returns

``null`` \| `Element`

#### Defined in

[system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx#L7)

___

### Link

▸ `Const` **Link**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `TLinkProps` |

#### Returns

`Element`

#### Defined in

[system/core/frontend/src/components/Link/Link.tsx:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/Link/Link.tsx#L10)

___

### LoadBox

▸ `Const` **LoadBox**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `LoadBoxProps` |

#### Returns

`Element`

#### Defined in

[system/core/frontend/src/components/loadBox/Loadbox.tsx:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/loadBox/Loadbox.tsx#L13)

___

### ProductAttributes

▸ `Const` **ProductAttributes**(`props`): `Element`

Displays product's attributes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.attributes?` | `TAttribute`[] | All available attributes |
| `props.elements?` | `Object` | UI elements to replace default ones |
| `props.elements.attributeTitle?` | `ComponentType`<`Object`\> | - |
| `props.elements.attributeValue?` | `ComponentType`<`Object`\> | Component for a value of an attribute. Must implement onClick prop |
| `props.product` | `TProduct` | Unmodified instance of Product |
| `props.onChange?` | (`checkedAttrs`: `Record`<`string`, `string`[]\>, `modifiedProduct`: `TProduct`) => `void` | - |

#### Returns

`Element`

#### Defined in

[system/core/frontend/src/components/ProductAttributes/ProductAttributes.tsx:11](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/ProductAttributes/ProductAttributes.tsx#L11)

___

### awaitImporter

▸ `Const` **awaitImporter**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[system/core/frontend/src/constants.ts:64](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L64)

___

### fetch

▸ `Const` **fetch**(...`args`): `any`

Isomorphic fetch

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`any`

#### Defined in

[system/core/frontend/src/helpers/isomorphicFetch.ts:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/isomorphicFetch.ts#L7)

___

### getBlockById

▸ `Const` **getBlockById**(`blockId?`): `undefined` \| ``null`` \| `TCromwellBlock`<`Component`<`Object`, `Object`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId?` | `string` |

#### Returns

`undefined` \| ``null`` \| `TCromwellBlock`<`Component`<`Object`, `Object`, `any`\>\>

#### Defined in

[system/core/frontend/src/constants.ts:25](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L25)

___

### getBlockData

▸ `Const` **getBlockData**(`block`): `undefined` \| `TCromwellBlockData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Node` \| `ParentNode` \| `Element` \| `HTMLElement` |

#### Returns

`undefined` \| `TCromwellBlockData`

#### Defined in

[system/core/frontend/src/constants.ts:39](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L39)

___

### getBlockDataById

▸ `Const` **getBlockDataById**(`blockId`): `undefined` \| `TCromwellBlockData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `string` |

#### Returns

`undefined` \| `TCromwellBlockData`

#### Defined in

[system/core/frontend/src/constants.ts:32](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L32)

___

### getBlockElementById

▸ `Const` **getBlockElementById**(`id?`): `undefined` \| ``null`` \| `HTMLElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id?` | `string` |

#### Returns

`undefined` \| ``null`` \| `HTMLElement`

#### Defined in

[system/core/frontend/src/constants.ts:44](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L44)

___

### getBlockHtmlId

▸ `Const` **getBlockHtmlId**(`id`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/constants.ts:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L13)

___

### getBlockHtmlType

▸ `Const` **getBlockHtmlType**(`type`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `TCromwellBlockType` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/constants.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L15)

___

### getBlockIdFromHtml

▸ `Const` **getBlockIdFromHtml**(`htmlId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `htmlId` | `string` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/constants.ts:14](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L14)

___

### getBlockTypeFromHtml

▸ `Const` **getBlockTypeFromHtml**(`className`): ``null`` \| `TCromwellBlockType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `string` |

#### Returns

``null`` \| `TCromwellBlockType`

#### Defined in

[system/core/frontend/src/constants.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L16)

___

### getCStore

▸ `Const` **getCStore**(`local?`, `apiClient?`): [`CStore`](../classes/frontend.CStore.md)

Get CStore instance from global store (singleton)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `local?` | `boolean` | if true, create and return a new instance, false by default |
| `apiClient?` | [`TApiClient`](frontend.md#tapiclient) | provide custom apiClient instance |

#### Returns

[`CStore`](../classes/frontend.CStore.md)

#### Defined in

[system/core/frontend/src/CStore.ts:601](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/CStore.ts#L601)

___

### getCentralServerClient

▸ `Const` **getCentralServerClient**(): [`CentralServerClient`](../classes/frontend.CentralServerClient.md)

Get CentralServerClient instance from global store (singleton)

#### Returns

[`CentralServerClient`](../classes/frontend.CentralServerClient.md)

#### Defined in

[system/core/frontend/src/api/CentralServerClient.ts:200](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CentralServerClient.ts#L200)

___

### getDynamicLoader

▸ `Const` **getDynamicLoader**(): [`TDynamicLoader`](frontend.md#tdynamicloader)

#### Returns

[`TDynamicLoader`](frontend.md#tdynamicloader)

#### Defined in

[system/core/frontend/src/constants.ts:59](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L59)

___

### getGraphQLClient

▸ `Const` **getGraphQLClient**(`fetch?`): [`CGraphQLClient`](../classes/frontend.CGraphQLClient.md)

Get CGraphQLClient instance from global store (singleton)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fetch?` | `any` |

#### Returns

[`CGraphQLClient`](../classes/frontend.CGraphQLClient.md)

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:1029](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L1029)

___

### getGraphQLErrorInfo

▸ `Const` **getGraphQLErrorInfo**(`error`): [`TGraphQLErrorInfo`](frontend.md#tgraphqlerrorinfo)

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |

#### Returns

[`TGraphQLErrorInfo`](frontend.md#tgraphqlerrorinfo)

#### Defined in

[system/core/frontend/src/api/CGraphQLClient.ts:58](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CGraphQLClient.ts#L58)

___

### getHtmlPluginBlockName

▸ `Const` **getHtmlPluginBlockName**(`name`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/constants.ts:23](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L23)

___

### getLoadableFrontendBundle

▸ `Const` **getLoadableFrontendBundle**(`bundleName`, `loader`, `loadable?`, `fallbackComponent?`, `dynamicLoaderProps?`): `ComponentType`<`Object`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleName` | `string` |
| `loader` | () => `Promise`<`undefined` \| ``null`` \| `TFrontendBundle`\> |
| `loadable?` | [`TDynamicLoader`](frontend.md#tdynamicloader) |
| `fallbackComponent?` | `ComponentType`<`Object`\> |
| `dynamicLoaderProps?` | `Record`<`string`, `any`\> |

#### Returns

`ComponentType`<`Object`\>

#### Defined in

[system/core/frontend/src/helpers/loadFrontendBundle.ts:86](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/loadFrontendBundle.ts#L86)

___

### getModuleImporter

▸ `Const` **getModuleImporter**(`serverPublicDir?`, `serverSide?`): [`Importer`](../classes/frontend.Importer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `serverPublicDir?` | `string` |
| `serverSide?` | `boolean` |

#### Returns

[`Importer`](../classes/frontend.Importer.md)

#### Defined in

[system/core/frontend/src/helpers/importer.ts:451](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/importer.ts#L451)

___

### getNamedWidgetForPlace

▸ `Const` **getNamedWidgetForPlace**<`T`\>(`widgetName`, `widgetProps`, `pluginName`): ``null`` \| `Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`WidgetTypes`](frontend.md#widgettypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `widgetName` | `T` |
| `widgetProps` | [`WidgetTypes`](frontend.md#widgettypes)[`T`] |
| `pluginName` | `string` |

#### Returns

``null`` \| `Element`

#### Defined in

[system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx:30](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx#L30)

___

### getPluginStaticUrl

▸ `Const` **getPluginStaticUrl**(`pluginName`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName` | `string` |

#### Returns

`string`

#### Defined in

[system/core/frontend/src/helpers/contentGetters.ts:2](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/contentGetters.ts#L2)

___

### getRestAPIClient

▸ `Const` **getRestAPIClient**(): [`CRestAPIClient`](../classes/frontend.CRestAPIClient.md)

Get CRestAPIClient instance from global store (singleton)

#### Returns

[`CRestAPIClient`](../classes/frontend.CRestAPIClient.md)

#### Defined in

[system/core/frontend/src/api/CRestAPIClient.ts:782](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/api/CRestAPIClient.ts#L782)

___

### getWidgets

▸ `Const` **getWidgets**<`T`\>(`widgetName`): `Record`<`string`, `ComponentType`<[`WidgetTypes`](frontend.md#widgettypes)[`T`]\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`WidgetTypes`](frontend.md#widgettypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `widgetName` | `T` |

#### Returns

`Record`<`string`, `ComponentType`<[`WidgetTypes`](frontend.md#widgettypes)[`T`]\>\>

#### Defined in

[system/core/frontend/src/helpers/registerWidget.ts:32](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/registerWidget.ts#L32)

___

### getWidgetsForPlace

▸ `Const` **getWidgetsForPlace**<`T`\>(`widgetName`, `widgetProps`): (``null`` \| `Element`)[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`WidgetTypes`](frontend.md#widgettypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `widgetName` | `T` |
| `widgetProps` | [`WidgetTypes`](frontend.md#widgettypes)[`T`] |

#### Returns

(``null`` \| `Element`)[]

#### Defined in

[system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx:41](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx#L41)

___

### iconFromPath

▸ `Const` **iconFromPath**(`path`): `ComponentType`<`SVGProps`<`SVGSVGElement`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `any` |

#### Returns

`ComponentType`<`SVGProps`<`SVGSVGElement`\>\>

#### Defined in

[system/core/frontend/src/helpers/iconFromPath.tsx:3](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/iconFromPath.tsx#L3)

___

### isAdminPanel

▸ `Const` **isAdminPanel**(): `boolean`

#### Returns

`boolean`

#### Defined in

[system/core/frontend/src/constants.ts:51](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/constants.ts#L51)

___

### loadFrontendBundle

▸ `Const` **loadFrontendBundle**(`bundleName`, `loader`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleName` | `string` |
| `loader` | () => `Promise`<`undefined` \| ``null`` \| `TFrontendBundle`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[system/core/frontend/src/helpers/loadFrontendBundle.ts:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/loadFrontendBundle.ts#L10)

___

### onWidgetRegister

▸ `Const` **onWidgetRegister**<`T`\>(`widgetName`, `callback`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`WidgetTypes`](frontend.md#widgettypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `widgetName` | `T` |
| `callback` | (`pluginName`: `string`, `component`: `ComponentType`<[`WidgetTypes`](frontend.md#widgettypes)[`T`]\>) => `any` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/helpers/registerWidget.ts:26](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/registerWidget.ts#L26)

___

### registerWidget

▸ `Const` **registerWidget**<`T`\>(`options`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`WidgetTypes`](frontend.md#widgettypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.component` | `ComponentType`<[`WidgetTypes`](frontend.md#widgettypes)[`T`]\> |
| `options.pluginName` | `string` |
| `options.widgetName` | `T` |

#### Returns

`void`

#### Defined in

[system/core/frontend/src/helpers/registerWidget.ts:6](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/registerWidget.ts#L6)

___

### useForceUpdate

▸ **useForceUpdate**(): () => `void`

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[system/core/frontend/src/helpers/forceUpdate.ts:3](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/frontend/src/helpers/forceUpdate.ts#L3)
