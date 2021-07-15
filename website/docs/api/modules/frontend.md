[@cromwell/root](../README.md) / [Exports](../modules.md) / frontend

# Module: frontend

CromwellCMS Frontend SDK

## Table of contents

### Classes

- [CContainer](../classes/frontend.ccontainer.md)
- [CGallery](../classes/frontend.cgallery.md)
- [CGraphQLClient](../classes/frontend.cgraphqlclient.md)
- [CHTML](../classes/frontend.chtml.md)
- [CImage](../classes/frontend.cimage.md)
- [CList](../classes/frontend.clist.md)
- [CPlugin](../classes/frontend.cplugin.md)
- [CRestAPIClient](../classes/frontend.crestapiclient.md)
- [CStore](../classes/frontend.cstore.md)
- [CText](../classes/frontend.ctext.md)
- [CentralServerClient](../classes/frontend.centralserverclient.md)
- [CromwellBlock](../classes/frontend.cromwellblock.md)
- [WidgetErrorBoundary](../classes/frontend.widgeterrorboundary.md)

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
- [TElements](frontend.md#telements)
- [TErrorInfo](frontend.md#terrorinfo)
- [TItemComponentProps](frontend.md#titemcomponentprops)
- [TListenerType](frontend.md#tlistenertype)
- [TPaginationProps](frontend.md#tpaginationprops)
- [TPluginsModifications](frontend.md#tpluginsmodifications)
- [TRequestOptions](frontend.md#trequestoptions)
- [WidgetNames](frontend.md#widgetnames)
- [WidgetTypes](frontend.md#widgettypes)
- [Widget\_DashboardProps](frontend.md#widget_dashboardprops)
- [Widget\_EntityActions](frontend.md#widget_entityactions)
- [Widget\_PostActions](frontend.md#widget_postactions)

### Variables

- [BlockContentConsumer](frontend.md#blockcontentconsumer)
- [BlockContentProvider](frontend.md#blockcontentprovider)
- [CromwellBlockCSSclass](frontend.md#cromwellblockcssclass)
- [pageRootContainerId](frontend.md#pagerootcontainerid)
- [useRouter](frontend.md#userouter)

### Functions

- [AdminPanelWidgetPlace](frontend.md#adminpanelwidgetplace)
- [Link](frontend.md#link)
- [LoadBox](frontend.md#loadbox)
- [ProductAttributes](frontend.md#productattributes)
- [awaitImporter](frontend.md#awaitimporter)
- [blockTypeToClassname](frontend.md#blocktypetoclassname)
- [cromwellBlockPluginNameToClassname](frontend.md#cromwellblockpluginnametoclassname)
- [cromwellBlockTypeFromClassname](frontend.md#cromwellblocktypefromclassname)
- [cromwellIdFromHTML](frontend.md#cromwellidfromhtml)
- [cromwellIdToHTML](frontend.md#cromwellidtohtml)
- [dynamicLoader](frontend.md#dynamicloader)
- [fetch](frontend.md#fetch)
- [getBlockById](frontend.md#getblockbyid)
- [getBlockData](frontend.md#getblockdata)
- [getBlockDataById](frontend.md#getblockdatabyid)
- [getBlockElementById](frontend.md#getblockelementbyid)
- [getCStore](frontend.md#getcstore)
- [getCentralServerClient](frontend.md#getcentralserverclient)
- [getGraphQLClient](frontend.md#getgraphqlclient)
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

Ƭ **CContainerProps**: { `children?`: React.ReactNode  } & TCromwellBlockProps

Defined in: [system/core/frontend/src/components/CContainer/CContainer.tsx:6](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CContainer/CContainer.tsx#L6)

___

### OperationResult

Ƭ **OperationResult**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`code` | *number* |
`message`? | *string* |
`success` | *boolean* |

Defined in: [system/core/frontend/src/CStore.ts:22](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/CStore.ts#L22)

___

### TApiClient

Ƭ **TApiClient**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`getAttributes` | () => *Promise*<TAttribute[] \| undefined\> |
`getProductById` | (`id`: *string*) => *Promise*<TProduct \| undefined\> |

Defined in: [system/core/frontend/src/CStore.ts:17](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/CStore.ts#L17)

___

### TCGalleryProps

Ƭ **TCGalleryProps**: { `className?`: *string* ; `shouldComponentUpdate?`: *boolean*  } & TCromwellBlockProps

Defined in: [system/core/frontend/src/components/CGallery/CGallery.tsx:26](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CGallery/CGallery.tsx#L26)

___

### TCGraphQLClient

Ƭ **TCGraphQLClient**: [*CGraphQLClient*](../classes/frontend.cgraphqlclient.md)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:976](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L976)

Defined in: [system/core/frontend/src/index.ts:30](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L30)

___

### TCList

Ƭ **TCList**<DataType, ListItemProps\>: *object*

Public API of CList instance

#### Type parameters:

Name | Default |
:------ | :------ |
`DataType` | *any* |
`ListItemProps` | *any* |

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`addListener` | (`type`: [*TListenerType*](frontend.md#tlistenertype), `cb`: () => *void*) => *void* | event listeners   |
`clearState` | () => *void* | Clear all internal data about pages and cache, set current pageNumber = 1   |
`getPagedParams` | () => *TPagedParams*<DataType\> | Get currently used params in "loader" prop   |
`getProps` | () => [*TCListProps*](frontend.md#tclistprops)<DataType, ListItemProps\> | Get React component props.   |
`getScrollboxEl` | () => HTMLDivElement \| *null* | Get scrollbox wrapper DOM element   |
`init` | () => *void* | Re-init component, parse first batch with metainfo, create pagination info   |
`openPage` | (`pageNumber`: *number*) => *void* | Navigate to specified page   |
`setPagedParams` | (`val`: *TPagedParams*<DataType\>) => *void* | Set additional params to use in "loader" prop.   |
`setProps` | (`props`: [*TCListProps*](frontend.md#tclistprops)<DataType, ListItemProps\> \| *null*) => *void* | Replace props. Will use them in any render after instead of React props. Behavior can be reset by setting null   |
`updateData` | () => *Promise*<void\> | Clear state/data and request new from loader   |

Defined in: [system/core/frontend/src/components/CList/types.ts:104](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CList/types.ts#L104)

Defined in: [system/core/frontend/src/index.ts:9](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L9)

___

### TCListProps

Ƭ **TCListProps**<DataType, ListItemProps\>: *object*

#### Type parameters:

Name |
:------ |
`DataType` |
`ListItemProps` |

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`ListItem` | *React.ComponentType*<[*TItemComponentProps*](frontend.md#titemcomponentprops)<DataType, ListItemProps\>\> | Component that will display items   |
`className`? | *string* | HTML Class attribute for wrapper container   |
`cssClasses`? | [*TCssClasses*](frontend.md#tcssclasses) | - |
`dataList`? | DataType[] | Array of data to create components for each piece and virtualize. Won't work with "loader" prop   |
`disableCaching`? | *boolean* | Disable caching of loaded pages from "loader" prop when open a new page by pagination. Caching is working by default   |
`elements`? | [*TElements*](frontend.md#telements) | - |
`firstBatch`? | *TPagedList*<DataType\> | First batch / page. Can be used with "loader". Supposed to be used in SSR to prerender page   |
`id` | *string* | CromwellBlock id   |
`isLoading`? | *boolean* | Force to show preloader instead of a list   |
`listItemProps`? | ListItemProps | Prop object to pass for each component in a list   |
`loader`? | (`params`: *TPagedParams*<DataType\>) => *Promise*<TPagedList<DataType\> \| DataType[] \| undefined \| *null*\> \| *undefined* \| *null* | Loader function that will be called to load more data during scroll Needed if dataList wasn't provided. Doesn't work with dataLst. If returned data is TPagedList, then will use pagination. If returned data is an array, then it won't be called anymore   |
`maxDomPages`? | *number* | Max pages to render at screen. 10 by default   |
`minRangeToLoad`? | *number* | Threshold in px where automatically request next or prev page. 200 by default. Use with useAutoLoading   |
`noDataLabel`? | *string* | Label to show when data array is empty. "No data" by default   |
`pageSize`? | *number* | Page size to first use in TPagedParams of "loader". After first batch recieved will use pageSize from pagedMeta if pagedMeta has it   |
`paginationButtonsNum`? | *number* | Max number of page links to display. 10 by default   |
`pathname`? | *string* | window.location.pathname for SSR to prerender pagination links   |
`scrollContainerSelector`? | *string* | When useShowMoreButton and usePagination enabled CList needs to know container that scrolls pages to define current page during scrolling   |
`useAutoLoading`? | *boolean* | Auto load more pages when scroll reached end of start in minRangeToLoad (px)   |
`usePagination`? | *boolean* | Display pagination   |
`useQueryPagination`? | *boolean* | Parse and set pageNumber in url as query param   |
`useShowMoreButton`? | *boolean* | If useAutoLoading disabled can show button to load next page in the same container   |

Defined in: [system/core/frontend/src/components/CList/types.ts:33](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CList/types.ts#L33)

Defined in: [system/core/frontend/src/index.ts:9](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L9)

___

### TCRestAPIClient

Ƭ **TCRestAPIClient**: *typeof* [*CRestAPIClient*](../classes/frontend.crestapiclient.md)

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:732](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L732)

Defined in: [system/core/frontend/src/index.ts:31](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L31)

___

### TCssClasses

Ƭ **TCssClasses**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`page`? | *string* |
`pagination`? | *string* |
`paginationActiveLink`? | *string* |
`paginationArrowLink`? | *string* |
`paginationDisabledLink`? | *string* |
`paginationLink`? | *string* |
`scrollBox`? | *string* |

Defined in: [system/core/frontend/src/components/CList/types.ts:4](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CList/types.ts#L4)

___

### TElements

Ƭ **TElements**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`arrowFirst`? | React.ReactNode | - |
`arrowLast`? | React.ReactNode | - |
`arrowLeft`? | React.ReactNode | - |
`arrowRight`? | React.ReactNode | - |
`pagination`? | *React.ComponentType*<[*TPaginationProps*](frontend.md#tpaginationprops)\> | - |
`preloader`? | React.ReactNode | Preloader to show during first data request   |
`showMore`? | *React.ComponentType*<{ `onClick`: () => *void*  }\> | - |

Defined in: [system/core/frontend/src/components/CList/types.ts:20](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CList/types.ts#L20)

___

### TErrorInfo

Ƭ **TErrorInfo**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`disableLog`? | *boolean* |
`message` | *string* |
`route` | *string* |
`statusCode` | *number* |

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:32](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L32)

Defined in: [system/core/frontend/src/index.ts:31](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L31)

___

### TItemComponentProps

Ƭ **TItemComponentProps**<DataType, ListItemProps\>: *object*

#### Type parameters:

Name |
:------ |
`DataType` |
`ListItemProps` |

#### Type declaration:

Name | Type |
:------ | :------ |
`data`? | DataType |
`listItemProps`? | ListItemProps |

Defined in: [system/core/frontend/src/components/CList/types.ts:130](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CList/types.ts#L130)

Defined in: [system/core/frontend/src/index.ts:9](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L9)

___

### TListenerType

Ƭ **TListenerType**: *componentDidUpdate*

Defined in: [system/core/frontend/src/components/CList/types.ts:128](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CList/types.ts#L128)

___

### TPaginationProps

Ƭ **TPaginationProps**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`count` | *number* |
`onChange` | (`page`: *number*) => *void* |
`page` | *number* |

Defined in: [system/core/frontend/src/components/CList/types.ts:14](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/CList/types.ts#L14)

Defined in: [system/core/frontend/src/index.ts:9](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L9)

___

### TPluginsModifications

Ƭ **TPluginsModifications**: TPluginConfig & { [x: string]: *any*;  }

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:30](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L30)

Defined in: [system/core/frontend/src/index.ts:31](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L31)

___

### TRequestOptions

Ƭ **TRequestOptions**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`disableLog`? | *boolean* | Disable error logging   |
`input`? | *any* | Body for 'post' and 'put' requests   |
`method`? | *string* | HTTP method: 'get', 'post', 'put', etc.   |

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:39](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L39)

Defined in: [system/core/frontend/src/index.ts:31](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L31)

___

### WidgetNames

Ƭ **WidgetNames**: keyof *WidgetTypes*

Defined in: [system/core/frontend/src/widget-types.ts:15](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/widget-types.ts#L15)

___

### WidgetTypes

Ƭ **WidgetTypes**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`CategoryActions` | *Widget\_EntityActions*<TProductCategory\> |
`Dashboard` | *Widget\_DashboardProps* |
`OrderActions` | *Widget\_EntityActions*<TOrder\> |
`PluginSettings` | TPluginSettingsProps |
`PostActions` | *Widget\_PostActions* |
`ProductActions` | *Widget\_EntityActions*<TProduct\> |
`TagActions` | *Widget\_EntityActions*<TTag\> |

Defined in: [system/core/frontend/src/widget-types.ts:5](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/widget-types.ts#L5)

___

### Widget\_DashboardProps

Ƭ **Widget\_DashboardProps**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`setSize` | (`pluginName`: *string*, `layouts`: { `lg`: { `h?`: *number* ; `w?`: *number* ; `x?`: *number* ; `y?`: *number*  } ; `md`: { `h?`: *number* ; `w?`: *number* ; `x?`: *number* ; `y?`: *number*  } ; `sm`: { `h?`: *number* ; `w?`: *number* ; `x?`: *number* ; `y?`: *number*  } ; `xs`: { `h?`: *number* ; `w?`: *number* ; `x?`: *number* ; `y?`: *number*  } ; `xxs`: { `h?`: *number* ; `w?`: *number* ; `x?`: *number* ; `y?`: *number*  }  }) => *any* |
`stats` | TCmsStats \| *undefined* |

Defined in: [system/core/frontend/src/widget-types.ts:17](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/widget-types.ts#L17)

___

### Widget\_EntityActions

Ƭ **Widget\_EntityActions**<T\>: *object*

#### Type parameters:

Name |
:------ |
`T` |

#### Type declaration:

Name | Type |
:------ | :------ |
`data` | T |
`setData` | (`data`: T) => *any* |

Defined in: [system/core/frontend/src/widget-types.ts:28](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/widget-types.ts#L28)

___

### Widget\_PostActions

Ƭ **Widget\_PostActions**: *Widget\_EntityActions*<TPost\> & { `quillInstance`: *any*  }

Defined in: [system/core/frontend/src/widget-types.ts:33](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/widget-types.ts#L33)

## Variables

### BlockContentConsumer

• **BlockContentConsumer**: *Consumer*<*null* \| TBlockContentProvider\>

___

### BlockContentProvider

• **BlockContentProvider**: *Provider*<*null* \| TBlockContentProvider\>

Defined in: [system/core/frontend/src/index.ts:22](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L22)

___

### CromwellBlockCSSclass

• `Const` **CromwellBlockCSSclass**: *CB*= 'CB'

Defined in: [system/core/frontend/src/constants.ts:6](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L6)

Defined in: [system/core/frontend/src/index.ts:28](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L28)

___

### pageRootContainerId

• `Const` **pageRootContainerId**: *root*= 'root'

Defined in: [system/core/frontend/src/constants.ts:54](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L54)

Defined in: [system/core/frontend/src/index.ts:26](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L26)

___

### useRouter

• `Const` **useRouter**: *typeof* nextRouter.useRouter \| *undefined*

Defined in: [system/core/frontend/src/index.ts:45](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/index.ts#L45)

## Functions

### AdminPanelWidgetPlace

▸ `Const`**AdminPanelWidgetPlace**<T\>(`props`: { `pluginName?`: *undefined* \| *string* ; `widgetName`: T ; `widgetProps`: *WidgetTypes*[T]  }): *null* \| *Element*

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`props` | *object* |
`props.pluginName?` | *undefined* \| *string* |
`props.widgetName` | T |
`props.widgetProps` | *WidgetTypes*[T] |

**Returns:** *null* \| *Element*

Defined in: [system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx:7](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx#L7)

___

### Link

▸ `Const`**Link**(`props`: TLinkProps): *Element*

#### Parameters:

Name | Type |
:------ | :------ |
`props` | TLinkProps |

**Returns:** *Element*

Defined in: [system/core/frontend/src/components/Link/Link.tsx:9](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/Link/Link.tsx#L9)

___

### LoadBox

▸ `Const`**LoadBox**(`props`: LoadBoxProps): *Element*

#### Parameters:

Name | Type |
:------ | :------ |
`props` | LoadBoxProps |

**Returns:** *Element*

Defined in: [system/core/frontend/src/components/loadBox/Loadbox.tsx:13](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/loadBox/Loadbox.tsx#L13)

___

### ProductAttributes

▸ `Const`**ProductAttributes**(`props`: { `attributes?`: *undefined* \| *TAttribute*[] ; `elements?`: *undefined* \| { `attributeTitle?`: *undefined* \| *ComponentClass*<{ `attribute?`: *undefined* \| *TAttribute*  }, any\> \| *FunctionComponent*<{ `attribute?`: *undefined* \| *TAttribute*  }\> ; `attributeValue?`: *undefined* \| *ComponentClass*<{ `attribute?`: *undefined* \| *TAttribute* ; `attributeInstance?`: *undefined* \| TAttributeInstance ; `icon?`: *undefined* \| *string* ; `isChecked`: *boolean* ; `onClick`: () => *void* ; `value`: *string*  }, any\> \| *FunctionComponent*<{ `attribute?`: *undefined* \| *TAttribute* ; `attributeInstance?`: *undefined* \| TAttributeInstance ; `icon?`: *undefined* \| *string* ; `isChecked`: *boolean* ; `onClick`: () => *void* ; `value`: *string*  }\>  } ; `onChange?`: *undefined* \| (`checkedAttrs`: *Record*<string, string[]\>, `modifiedProduct`: *TProduct*) => *void* ; `product`: *TProduct*  }): *Element*

Displays product's attributes

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`props` | *object* | - |
`props.attributes?` | *undefined* \| *TAttribute*[] | All available attributes   |
`props.elements?` | *undefined* \| { `attributeTitle?`: *undefined* \| *ComponentClass*<{ `attribute?`: *undefined* \| *TAttribute*  }, any\> \| *FunctionComponent*<{ `attribute?`: *undefined* \| *TAttribute*  }\> ; `attributeValue?`: *undefined* \| *ComponentClass*<{ `attribute?`: *undefined* \| *TAttribute* ; `attributeInstance?`: *undefined* \| TAttributeInstance ; `icon?`: *undefined* \| *string* ; `isChecked`: *boolean* ; `onClick`: () => *void* ; `value`: *string*  }, any\> \| *FunctionComponent*<{ `attribute?`: *undefined* \| *TAttribute* ; `attributeInstance?`: *undefined* \| TAttributeInstance ; `icon?`: *undefined* \| *string* ; `isChecked`: *boolean* ; `onClick`: () => *void* ; `value`: *string*  }\>  } | UI elements to replace default ones   |
`props.onChange?` | *undefined* \| (`checkedAttrs`: *Record*<string, string[]\>, `modifiedProduct`: *TProduct*) => *void* | Called when user picks any attribute, if picked value has productVariant, it applies modifications to "product" prop and calls this method. If value has no productVariant, then original product will be returned   |
`props.product` | *TProduct* | Unmodified instance of Product   |

**Returns:** *Element*

Defined in: [system/core/frontend/src/components/ProductAttributes/ProductAttributes.tsx:11](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/ProductAttributes/ProductAttributes.tsx#L11)

___

### awaitImporter

▸ `Const`**awaitImporter**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [system/core/frontend/src/constants.ts:56](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L56)

___

### blockTypeToClassname

▸ `Const`**blockTypeToClassname**(`type`: TCromwellBlockType): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`type` | TCromwellBlockType |

**Returns:** *string*

Defined in: [system/core/frontend/src/constants.ts:9](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L9)

___

### cromwellBlockPluginNameToClassname

▸ `Const`**cromwellBlockPluginNameToClassname**(`name`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *string*

Defined in: [system/core/frontend/src/constants.ts:17](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L17)

___

### cromwellBlockTypeFromClassname

▸ `Const`**cromwellBlockTypeFromClassname**(`classname`: *string*): *null* \| *text* \| *image* \| *plugin* \| *container* \| *HTML* \| *gallery* \| *list* \| *link*

#### Parameters:

Name | Type |
:------ | :------ |
`classname` | *string* |

**Returns:** *null* \| *text* \| *image* \| *plugin* \| *container* \| *HTML* \| *gallery* \| *list* \| *link*

Defined in: [system/core/frontend/src/constants.ts:10](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L10)

___

### cromwellIdFromHTML

▸ `Const`**cromwellIdFromHTML**(`htmlId`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`htmlId` | *string* |

**Returns:** *string*

Defined in: [system/core/frontend/src/constants.ts:8](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L8)

___

### cromwellIdToHTML

▸ `Const`**cromwellIdToHTML**(`id`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** *string*

Defined in: [system/core/frontend/src/constants.ts:7](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L7)

___

### dynamicLoader

▸ `Const`**dynamicLoader**(`func`: () => *Promise*<ComponentType<{}\>\>, `options?`: *any*): *ComponentType*<{}\>

#### Parameters:

Name | Type |
:------ | :------ |
`func` | () => *Promise*<ComponentType<{}\>\> |
`options?` | *any* |

**Returns:** *ComponentType*<{}\>

Defined in: [system/core/frontend/src/constants.ts:52](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L52)

___

### fetch

▸ `Const`**fetch**(...`args`: *any*[]): *any*

Isomorphic fetch

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *any*

Defined in: [system/core/frontend/src/helpers/isomorphicFetch.ts:7](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/helpers/isomorphicFetch.ts#L7)

___

### getBlockById

▸ `Const`**getBlockById**(`blockId?`: *string*): *undefined* \| *null* \| *TCromwellBlock*<Component<{}, {}, any\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`blockId?` | *string* |

**Returns:** *undefined* \| *null* \| *TCromwellBlock*<Component<{}, {}, any\>\>

Defined in: [system/core/frontend/src/constants.ts:19](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L19)

___

### getBlockData

▸ `Const`**getBlockData**(`block`: Node \| ParentNode \| Element \| HTMLElement): *undefined* \| TCromwellBlockData

#### Parameters:

Name | Type |
:------ | :------ |
`block` | Node \| ParentNode \| Element \| HTMLElement |

**Returns:** *undefined* \| TCromwellBlockData

Defined in: [system/core/frontend/src/constants.ts:33](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L33)

___

### getBlockDataById

▸ `Const`**getBlockDataById**(`blockId`: *string*): *undefined* \| TCromwellBlockData

#### Parameters:

Name | Type |
:------ | :------ |
`blockId` | *string* |

**Returns:** *undefined* \| TCromwellBlockData

Defined in: [system/core/frontend/src/constants.ts:26](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L26)

___

### getBlockElementById

▸ `Const`**getBlockElementById**(`id?`: *string*): *undefined* \| *null* \| HTMLElement

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** *undefined* \| *null* \| HTMLElement

Defined in: [system/core/frontend/src/constants.ts:38](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L38)

___

### getCStore

▸ `Const`**getCStore**(`local?`: *boolean*, `apiClient?`: [*TApiClient*](frontend.md#tapiclient)): [*CStore*](../classes/frontend.cstore.md)

Get CStore instance from global store (singleton)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`local?` | *boolean* | if true, create and return a new instance, false by default   |
`apiClient?` | [*TApiClient*](frontend.md#tapiclient) | provide custom apiClient instance   |

**Returns:** [*CStore*](../classes/frontend.cstore.md)

Defined in: [system/core/frontend/src/CStore.ts:571](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/CStore.ts#L571)

___

### getCentralServerClient

▸ `Const`**getCentralServerClient**(): [*CentralServerClient*](../classes/frontend.centralserverclient.md)

Get CentralServerClient instance from global store (singleton)

**Returns:** [*CentralServerClient*](../classes/frontend.centralserverclient.md)

Defined in: [system/core/frontend/src/api/CentralServerClient.ts:157](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CentralServerClient.ts#L157)

___

### getGraphQLClient

▸ `Const`**getGraphQLClient**(`fetch?`: *any*): [*CGraphQLClient*](../classes/frontend.cgraphqlclient.md)

Get CGraphQLClient instance from global store (singleton)

#### Parameters:

Name | Type |
:------ | :------ |
`fetch?` | *any* |

**Returns:** [*CGraphQLClient*](../classes/frontend.cgraphqlclient.md)

Defined in: [system/core/frontend/src/api/CGraphQLClient.ts:981](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CGraphQLClient.ts#L981)

___

### getNamedWidgetForPlace

▸ `Const`**getNamedWidgetForPlace**<T\>(`widgetName`: T, `widgetProps`: *WidgetTypes*[T], `pluginName`: *string*): *null* \| *Element*

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`widgetName` | T |
`widgetProps` | *WidgetTypes*[T] |
`pluginName` | *string* |

**Returns:** *null* \| *Element*

Defined in: [system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx:30](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx#L30)

___

### getPluginStaticUrl

▸ `Const`**getPluginStaticUrl**(`pluginName`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`pluginName` | *string* |

**Returns:** *string*

Defined in: [system/core/frontend/src/helpers/contentGetters.ts:2](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/helpers/contentGetters.ts#L2)

___

### getRestAPIClient

▸ `Const`**getRestAPIClient**(): [*CRestAPIClient*](../classes/frontend.crestapiclient.md)

Get CRestAPIClient instance from global store (singleton)

**Returns:** [*CRestAPIClient*](../classes/frontend.crestapiclient.md)

Defined in: [system/core/frontend/src/api/CRestAPIClient.ts:721](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/api/CRestAPIClient.ts#L721)

___

### getWidgets

▸ `Const`**getWidgets**<T\>(`widgetName`: T): *Record*<string, ComponentType<*WidgetTypes*[T]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`widgetName` | T |

**Returns:** *Record*<string, ComponentType<*WidgetTypes*[T]\>\>

Defined in: [system/core/frontend/src/helpers/registerWidget.ts:32](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/helpers/registerWidget.ts#L32)

___

### getWidgetsForPlace

▸ `Const`**getWidgetsForPlace**<T\>(`widgetName`: T, `widgetProps`: *WidgetTypes*[T]): (*null* \| *Element*)[]

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`widgetName` | T |
`widgetProps` | *WidgetTypes*[T] |

**Returns:** (*null* \| *Element*)[]

Defined in: [system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx:41](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/components/AdminPanelWidget/AdminPanelWidgetPlace.tsx#L41)

___

### iconFromPath

▸ `Const`**iconFromPath**(`path`: *any*): *ComponentType*<SVGProps<SVGSVGElement\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`path` | *any* |

**Returns:** *ComponentType*<SVGProps<SVGSVGElement\>\>

Defined in: [system/core/frontend/src/helpers/iconFromPath.tsx:3](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/helpers/iconFromPath.tsx#L3)

___

### isAdminPanel

▸ `Const`**isAdminPanel**(): *boolean*

**Returns:** *boolean*

Defined in: [system/core/frontend/src/constants.ts:45](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/constants.ts#L45)

___

### loadFrontendBundle

▸ `Const`**loadFrontendBundle**(`bundleName`: *string*, `loader`: () => *Promise*<undefined \| *null* \| TFrontendBundle\>, `loadable?`: (`func`: () => *Promise*<ComponentType<{}\>\>, `options?`: *any*) => *ComponentType*<{}\>, `fallbackComponent?`: *ComponentClass*<{}, any\> \| *FunctionComponent*<{}\>, `dynamicLoaderProps?`: *Record*<string, any\>): *ComponentType*<{}\>

#### Parameters:

Name | Type |
:------ | :------ |
`bundleName` | *string* |
`loader` | () => *Promise*<undefined \| *null* \| TFrontendBundle\> |
`loadable?` | (`func`: () => *Promise*<ComponentType<{}\>\>, `options?`: *any*) => *ComponentType*<{}\> |
`fallbackComponent?` | *ComponentClass*<{}, any\> \| *FunctionComponent*<{}\> |
`dynamicLoaderProps?` | *Record*<string, any\> |

**Returns:** *ComponentType*<{}\>

Defined in: [system/core/frontend/src/helpers/loadFrontendBundle.ts:6](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/helpers/loadFrontendBundle.ts#L6)

___

### onWidgetRegister

▸ `Const`**onWidgetRegister**<T\>(`widgetName`: T, `callback`: (`pluginName`: *string*, `component`: *ComponentType*<*WidgetTypes*[T]\>) => *any*): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`widgetName` | T |
`callback` | (`pluginName`: *string*, `component`: *ComponentType*<*WidgetTypes*[T]\>) => *any* |

**Returns:** *void*

Defined in: [system/core/frontend/src/helpers/registerWidget.ts:26](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/helpers/registerWidget.ts#L26)

___

### registerWidget

▸ `Const`**registerWidget**<T\>(`options`: { `component`: *ComponentType*<*WidgetTypes*[T]\> ; `pluginName`: *string* ; `widgetName`: T  }): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | keyof *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *object* |
`options.component` | *ComponentType*<*WidgetTypes*[T]\> |
`options.pluginName` | *string* |
`options.widgetName` | T |

**Returns:** *void*

Defined in: [system/core/frontend/src/helpers/registerWidget.ts:6](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/helpers/registerWidget.ts#L6)

___

### useForceUpdate

▸ **useForceUpdate**(): *function*

**Returns:** () => *void*

Defined in: [system/core/frontend/src/helpers/forceUpdate.ts:3](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/frontend/src/helpers/forceUpdate.ts#L3)
