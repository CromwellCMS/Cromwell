import {
  EDBEntity,
  TAttribute,
  TFilteredProductList,
  TProduct,
  TProductFilter,
} from "@cromwell/core";
import { getGraphQLClient } from "@cromwell/core-frontend";
import { Popover } from "@headlessui/react";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  TableIcon,
} from "@heroicons/react/outline";
import {
  Close as CloseIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { Drawer, IconButton, Tooltip } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import ProductFilter from "../../../../../plugins/product-filter/src/frontend/components/Filter";
import { IFrontendFilter } from "../../../../../plugins/product-filter/src/types";
import { TBreadcrumbs } from "../../components/breadcrumbs";
import EntityTable from "../../components/entity/entityTable/EntityTable";
import {
  IEntityListPage,
  TEntityPageProps,
} from "../../components/entity/types";
import { CheckboxInput } from "../../components/forms/inputs/checkboxInput";
import {
  productListInfo,
  productPageInfo,
} from "../../constants/PageInfos";
import {
  useParams,
  useLocation,
  useHistory,
} from "react-router";
import { baseEntityColumns } from "../../helpers/customEntities";
import {
  ProductTableContextProvider,
  useProductTable,
} from "../../hooks/useProducts";
import styles from "./ProductList.module.scss";
import { FixedSizeList as List } from "react-window";
// import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { InfiniteLoader } from "../../components/virtualList/infiniteLoader";

const EntityTableComp = EntityTable as React.ComponentType<
  TEntityPageProps<TProduct, TProductFilter>
>;

const titlePath = [
  { title: "Products", link: "/products/" },
];

const ProductTableHead = () => {
  const {
    getProducts,
    products,
    columns,
    table,
    condensed,
    setCondensed,
  } = useProductTable();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    allColumns,
    prepareRow,
  } = table;

  return (
    <div className="bg-white shadow-xl shadow-white w-full top-0 z-[10] sticky select-none">
      <div className="bg-white">
        <div className="bg-white flex flex-row text-xs text-left w-full py-1 gap-2">
          <Popover className="relative inline-block">
            {({ open }) => (
              <>
                <Popover.Button
                  className={`${
                    open ? "text-indigo-700" : ""
                  } font-bold flex-none`}>
                  <TableIcon className="h-5 mr-1 bottom-[1.5px] w-5 relative inline" />
                  <span className="rounded-lg bg-indigo-200 mr-1 px-1">
                    {columns.length}
                  </span>
                  Columns
                </Popover.Button>

                <Popover.Panel className="bg-white rounded-b-lg shadow-md min-w-[120px] p-2 pr-6 z-10 absolute">
                  <div className="grid gap-4 grid-cols-1">
                    {allColumns.map((col, colid) => (
                      <div className="" key={colid}>
                        <CheckboxInput
                          xs
                          label={col.Header as string}
                          value={
                            col.getToggleHiddenProps()
                              .checked
                          }
                          onChange={(nxt: boolean) => {
                            col
                              .getToggleHiddenProps()
                              .onChange({
                                target: {
                                  value: nxt,
                                  checked: nxt,
                                },
                              });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </Popover.Panel>
              </>
            )}
          </Popover>
          <div className="mx-2">
            <CheckboxInput
              xs
              label={{
                active: "small",
                inactive: "regular",
              }}
              value={condensed}
              onChange={setCondensed}
            />
          </div>
        </div>
        <div>
          <hr className="my-1 w-full" />
        </div>
      </div>
      {headerGroups.map((headerGroup, hgix) => (
        <div
          key={hgix}
          className="pb-1"
          {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column, cix) => (
            <div
              key={cix}
              {...column.getHeaderProps(
                column.getSortByToggleProps(),
              )}
              className="font-bold text-left text-xs px-1">
              {column.render("Header")}
              <span>
                {column.isSorted
                  ? column.isSortedDesc
                    ? " 🔽"
                    : " 🔼"
                  : ""}
              </span>
              {column.canResize && (
                <div
                  {...column.getResizerProps()}
                  className="w-1 group">
                  <div
                    className={`right-0 bg-indigo-400 group-hover:bg-indigo-600 w-[2px] h-full absolute top-0 z-1 touch-none ${
                      column.isResizing ? "bg-red-600" : ""
                    }`}
                  />
                </div>
              )}
              {!column.canResize && (
                <div className="w-1 group">
                  <div
                    className={`right-0 bg-gray-200 w-[2px] h-full absolute top-0 z-1 touch-none`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const TableData = ({
  onItemsRendered,
  listRef,
  height,
  width,
}) => {
  const { condensed, table, page } = useProductTable();
  const { rows, prepareRow } = table;

  useEffect(() => {
    const nxIndex = (page - 1) * 25 - 1
    listRef?.current?.scrollToItem?.(nxIndex < 0 ? 0 : nxIndex, "start")
    console.log(listRef.current)
    console.log("scrolling")
  }, [page, listRef?.current])
  
  return (
    <List
      height={height}
      ref={listRef}
      onItemsRendered={onItemsRendered}
      itemCount={rows.length}
      itemSize={condensed ? 35 : 50}
      width={width}
      className="scrollbar-slim"
      layout="vertical">
      {({ index, style }) => {
        // console.log("rendering row")
        const row = rows[index];
        if (row) {
          // console.log("ROW", row)
          prepareRow(row);
          const { style: rowStyle, ...rowProps } =
            row.getRowProps();
          return (
            <div
              id={`row-${index}`}
              key={index}
              className={`align-middle self-center ${index % 2 === 0 ? "bg-gray-100": ""} hover:bg-indigo-100 first:mt-2 group`}
              style={{ ...style, ...rowStyle }}
              {...rowProps}>
              {row.cells.map((cell, cix) => {
                return (
                  <div
                    key={row.values.id}
                    {...cell.getCellProps()}
                    className={`px-1 align-middle self-center ${
                      condensed ? "text-xs" : ""
                    }`}>
                    {cell.render("Cell")}
                  </div>
                );
              })}
            </div>
          );
        }
        return null;
      }}
    </List>
  );
};

const ListLoader = ({ width, height }) => {
  const {
    totalProducts,
    table,
    page,
    getProducts,
  } = useProductTable();
  const loc = useLocation();
  const ref = useRef(null);
  const router = useHistory();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = table;

  const isLoaded = useCallback((index) => {
    console.log("loaded", index, totalProducts, rows.length)
    return index < rows.length
  }, [rows?.length, totalProducts])

  return (
    <InfiniteLoader
      isItemLoaded={isLoaded}
      itemCount={Math.max(totalProducts, 25)}
      loadMoreItems={async (start, stop) => {
        const nxPage = Math.round((stop + 1) / 25);
        console.log("LOAD ITEMS", start, stop, nxPage);
        getProducts(nxPage);
        // router.replace(
        //   `${loc.pathname}?p=${nxPage + 1}`,
        // );
      }}
      minimumBatchSize={25}
      threshold={5}>
      {({ onItemsRendered, ref }) => (
        <TableData
          onItemsRendered={onItemsRendered}
          listRef={ref}
          height={height}
          width={width}
        />
      )}
    </InfiniteLoader>
  )
}

const ProductTableBody = () => {
  const {
    totalProducts,
    table,
  } = useProductTable();
  const loc = useLocation();
  const ref = useRef(null);
  const router = useHistory();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = table;

  // console.warn(rows)

  console.info(rows.length, totalProducts)

  return (
    <div
      ref={ref}
      className="max-h-full h-[calc(100%-5rem)] w-full overflow-y-hidden scrollbar-slim"
      {...getTableBodyProps()}>
      <AutoSizer>
        {({ width, height }) => <ListLoader width={width} height={height} />}
      </AutoSizer>
    </div>
  );
};

export const ProductListPage = () => {
  // const params = useParams<any>();
  const loc = useLocation();
  const query = new URLSearchParams(loc.search);
  const {
    getProducts,
    products,
    columns,
    table,
    page,
    maxPage,
    delayedGetProducts,
  } = useProductTable();
  const router = useHistory();

  // const [called, setCalled] = useState(false);
  const initialScrollSize = useRef(0);

  const scrollable = useRef<HTMLDivElement>(null);
  const called = useRef<boolean>(false);

  const pg = query.has("p") ? Number(query.get("p")) : 1;
  useEffect(() => {
    const fn = async () => {
      await getProducts(pg);

      // setTimeout(() => {
      //   if (!called.current) {
      //     const idx = (pg - 1) * 25;
      //     // scrollable.current.querySelector()
      //     const totalHeight = scrollable.current?.scrollHeight;
      //     const toScroll = totalHeight / (products.length * 25)
      //     console.log(
      //       scrollable.current?.querySelector?.(
      //         `#row-${idx}`,
      //       ),
      //     );
      //     scrollable.current
      //       ?.querySelector?.(`#row-${idx}`)
      //       ?.scrollTop = toScroll;
      //     called.current = true;
      //   }
      // }, 500);

      // if (!called.current && scrollable.current) {
      //   initialScrollSize.current = scrollable.current.scrollHeight;
      //   called.current = true;
      // }

      // if (scrollable.current && pg !== page && called.current) {
      //   console.log("scrolling")
      //   scrollable.current.scrollTo({
      //     top: (initialScrollSize.current / 25) * pg
      //   })
      // }
    };

    fn();
  }, [pg, products]);

  const fetchPage = useCallback((nxPage) => {
    router.replace(`${loc.pathname}?p=${nxPage}`);
  }, []);

  const { getTableProps } = table;

  // const bodyScroll = useCallback(
  //   (e: React.UIEvent<HTMLDivElement>) => {
  //     const divEl = e.target as HTMLDivElement;
  //     const scrollTop = divEl.scrollTop;
  //     const realHeight =
  //       divEl.scrollHeight - divEl.clientHeight;

  //     if (scrollTop > realHeight * 0.8 && page < maxPage) {
  //       // 80%
  //       // delayedGetProducts(page + 1)
  //       router.replace(`${loc.pathname}?p=${page + 1}`);
  //     }

  //     if (scrollTop < 40 && page > 1) {
  //       // 80%
  //       // delayedGetProducts(page - 1)
  //       router.replace(`${loc.pathname}?p=${page - 1}`);
  //     }
  //   },
  //   [scrollable.current, delayedGetProducts, page, maxPage],
  // );

  return (
    <div className="p-4">
      <div className="mb-2 block">
        <TBreadcrumbs path={titlePath} />
      </div>
      <div className="bg-white h-full max-w-full rounded-2xl shadow-md max-h-[calc(100vh-100px)] p-4 relative">
        <div
          ref={scrollable}
          // onScroll={bodyScroll}
          className="h-[calc(100vh-140px)] w-full max-h-[calc(100vh-140px)] px-4 relative overflow-y-hidden block scrollbar-slim">
          <div
            {...getTableProps()}
            className="h-full w-full">
            <ProductTableHead />
            <ProductTableBody />
            <div className="bg-white border rounded-xl flex flex-row mx-auto max-w-min shadow-xl p-3 transform bottom-2 sticky">
              <div className="flex flex-row mx-auto max-w-min">
                <button
                  className="mx-1 disabled:text-gray-400"
                  disabled={page === 1}
                  onClick={() => fetchPage(1)}>
                  <ChevronDoubleLeftIcon className="h-5 w-5" />
                </button>
                <button
                  className="mx-1 disabled:text-gray-400"
                  disabled={page === 1}
                  onClick={() => fetchPage(page - 1)}>
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <span className="rounded-full bg-indigo-600 h-5 text-center text-sm text-white w-5">
                  {page}
                </span>

                <button
                  className="mx-1 disabled:text-gray-400"
                  disabled={page === maxPage}
                  onClick={() => fetchPage(page + 1)}>
                  <ChevronLeftIcon className="h-5 transform w-5 rotate-180" />
                </button>

                <button
                  className="mx-1 disabled:text-gray-400"
                  disabled={page === maxPage}
                  onClick={() => fetchPage(maxPage)}>
                  <ChevronDoubleLeftIcon className="h-5 transform w-5 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  return (
    <ProductTableContextProvider>
      <ProductListPage />
    </ProductTableContextProvider>
  );
};

export function ProductTable() {
  const client = getGraphQLClient();
  const [showFilter, setShowFilter] = useState(false);
  const filterInstRef = useRef<IFrontendFilter | null>(
    null,
  );
  const [attributes, setAttributes] = useState<
    TAttribute[] | null
  >(null);
  const productsRef = useRef<TFilteredProductList | null>(
    null,
  );
  const attributesFilterInput = useRef<TProductFilter>({});
  const initialFilterRef = useRef<TProductFilter>({});
  const entityListPageRef =
    useRef<IEntityListPage<TProductFilter> | null>(null);

  useEffect(() => {
    init();

    if (filterInstRef.current && initialFilterRef.current) {
      const filter = initialFilterRef.current;
      if (
        filter.attributes ||
        filter.minPrice ||
        filter.maxPrice ||
        filter.nameSearch
      ) {
        filterInstRef.current.setFilter(filter);
        attributesFilterInput.current = filter;
        entityListPageRef.current?.resetList?.();
      }
    }
  }, []);

  const init = async () => {
    const attributes = await client.getAttributes();
    setAttributes(attributes);
  };

  const handleToggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const onFilterMount = () => {
    filterInstRef.current?.updateFilterMeta(
      productsRef.current,
    );
  };

  const onFilterChange = (params: TProductFilter) => {
    Object.keys(params).forEach((key) => {
      attributesFilterInput.current[key] = params[key];
    });
    entityListPageRef.current?.resetList?.();
  };

  return (
    <>
      <EntityTableComp
        entityCategory={EDBEntity.Product}
        entityListRoute={productListInfo.route}
        entityBaseRoute={productPageInfo.baseRoute}
        listLabel="Products"
        entityLabel="Product"
        nameProperty="name"
        getManyFiltered={async (options) => {
          if (!options.filterParams)
            options.filterParams = {};
          options.filterParams.minPrice =
            attributesFilterInput.current?.minPrice;
          options.filterParams.maxPrice =
            attributesFilterInput.current?.maxPrice;
          options.filterParams.attributes =
            attributesFilterInput.current?.attributes;
          options.filterParams.nameSearch =
            attributesFilterInput.current?.nameSearch;

          const data = await client.getFilteredProducts(
            options,
          );
          filterInstRef.current?.updateFilterMeta(data);
          productsRef.current = data;
          return data;
        }}
        deleteOne={client.deleteProduct}
        deleteMany={client.deleteManyProducts}
        deleteManyFiltered={
          client.deleteManyFilteredProducts
        }
        getPageListInstance={(inst) => {
          entityListPageRef.current = inst;
          initialFilterRef.current = Object.assign(
            {},
            inst.getFilterInput(),
          );
        }}
        onClearAllFilters={() => {
          filterInstRef.current?.setFilter({});
          attributesFilterInput.current = {};
        }}
        isFilterActive={() => {
          const filter = attributesFilterInput.current;
          return !!(
            filter.nameSearch ||
            filter.attributes ||
            filter.maxPrice ||
            filter.minPrice
          );
        }}
        columns={[
          {
            name: "mainImage",
            label: "Image",
            type: "Image",
            visible: true,
          },
          {
            name: "name",
            label: "Name",
            type: "Simple text",
            visible: true,
            minWidth: "25%",
          },
          {
            name: "sku",
            label: "SKU",
            type: "Simple text",
            visible: true,
          },
          {
            name: "price",
            label: "Price",
            type: "Currency",
            visible: true,
          },
          {
            name: "oldPrice",
            label: "Old Price",
            type: "Currency",
            visible: false,
          },
          {
            name: "stockStatus",
            label: "Stock status",
            type: "Simple text",
            visible: true,
            exactSearch: true,
            searchOptions: [
              {
                value: "In stock",
                label: "In stock",
              },
              {
                value: "Out of stock",
                label: "Out of stock",
              },
              {
                value: "On backorder",
                label: "On backorder",
              },
            ],
          },
          ...baseEntityColumns.map((col) => {
            if (col.name === "createDate")
              return { ...col, visible: true };
            return { ...col, visible: false };
          }),
        ]}
        customElements={{
          listLeftActions: (
            <div>
              <Tooltip title="Attribute filter">
                <IconButton
                  className={styles.attributeFilterButton}
                  onClick={handleToggleFilter}
                  aria-label="show filter">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </div>
          ),
        }}
      />
      <Drawer
        classes={{ paper: styles.filterDrawer }}
        variant="persistent"
        anchor={"left"}
        open={showFilter}
        onClose={() => setShowFilter(false)}>
        <div className={styles.filterHeader}>
          <h3>Filter</h3>
          <Tooltip title="Close">
            <IconButton
              onClick={handleToggleFilter}
              aria-label="close filter">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
        <ProductFilter
          instanceSettings={{
            disableMobile: true,
            onChange: onFilterChange,
            getInstance: (inst) => {
              filterInstRef.current = inst;
            },
            onMount: onFilterMount,
          }}
          data={{
            attributes,
          }}
        />
      </Drawer>
    </>
  );
}
