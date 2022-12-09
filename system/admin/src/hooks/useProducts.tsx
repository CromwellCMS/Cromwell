import { TBasePageEntity, TProduct } from '@cromwell/core';
import { getCStore, getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import { PencilIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useMemo, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { Column, useBlockLayout, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table';

import { baseEntityColumns, TBaseEntityFilter } from '../exports';
import { timeSince } from '../helpers/time';
import { useDebounceFn } from './useDebounce';

const client = getRestApiClient();
const gqlClient = getGraphQLClient();
const cstore = getCStore();

const defaultColumns: (x: any) => any[] = ({ condensed = false }) => {
  return [
    {
      Header: 'Photo',
      accessor: 'mainImage',
      minWidth: 75,
      maxWidth: 75,
      width: 75,
      disableResizing: true,
      Cell: ({ row, value }) => {
        return (
          <img src={value} alt={row?.values?.name} className={`rounded-lg ${condensed ? 'h-8 w-8' : 'h-14 w-14'}`} />
        );
      },
    },
    {
      Header: 'Title',
      accessor: 'name',
      minWidth: 30,
      maxWidth: 180,
      width: 120,
      disableResizing: false,
      Cell: ({ value }) => <span className="font-bold">{value}</span>,
    },
    {
      Header: 'SKU',
      accessor: 'sku',
      minWidth: 30,
      maxWidth: 120,
      width: 90,
      disableResizing: false,
    },
    {
      Header: 'Price',
      accessor: 'price',
      minWidth: 30,
      maxWidth: 120,
      width: 80,
      disableResizing: true,
      Cell: ({ value }) => <span>{cstore.getPriceWithCurrency(value)}</span>,
    },
    {
      Header: 'Old Price',
      accessor: 'oldPrice',
      minWidth: 30,
      maxWidth: 120,
      width: 80,
      disableResizing: true,
      Cell: ({ value }) => (
        <span className="line-through hover:no-underline">
          {cstore.getPriceWithCurrency(value)?.length > 0 ? cstore.getPriceWithCurrency(value) : '-'}
        </span>
      ),
    },
    {
      Header: 'Status',
      accessor: 'stockStatus',
      minWidth: 30,
      maxWidth: 100,
      width: 120,
      disableResizing: true,
      Cell: ({ value }) => {
        return (
          <span
            className={`${condensed ? 'p-[2px]' : 'p-1'} text-xs font-bold rounded-lg bg-gray-100 ${
              value === 'In stock' ? 'bg-green-200' : value === 'On backorder' ? 'bg-yellow-300' : 'bg-red-300'
            }`}
          >
            {value}
          </span>
        );
      },
    },
    ...baseEntityColumns
      .filter((k) => k.name !== 'slug')
      .map((col) => {
        const isDate = col.type === 'Date' || col.type === 'Datetime';
        return {
          Header: col.label,
          accessor: col.name,
          minWidth: isDate ? 100 : Number(col.minWidth),
          maxWidth: isDate ? 100 : Number(col.maxWidth),
          width: isDate ? 100 : Number(col.width),
          disableResizing: false,
          Cell: ({ value }) => {
            // col.type
            if (isDate) {
              return <span className="">{timeSince(value)}</span>;
            }

            return value;
          },
        };
      }),
    {
      Header: 'Actions',
      accessor: 'pageTitle',
      minWidth: 30,
      maxWidth: 100,
      width: 120,
      disableResizing: true,
      Cell: ({ row }) => {
        return (
          <Link to={`products/${row.original.id}`}>
            <PencilIcon className="h-4 text-gray-300 w-4 float-right group-hover:text-indigo-700" />
          </Link>
        );
      },
    },
  ];
};

export function useProducts<TFilterType extends TBaseEntityFilter>() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const columns = useMemo<Column<TProduct>[]>(() => defaultColumns({ condensed }), [condensed]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState({});
  const tableInstance = useTable(
    {
      columns,
      data: products,
      manualPagination: true,
      initialState: {
        pageIndex: 1,
      },
      pageCount: maxPage,
    },
    useSortBy,
    usePagination,
    useResizeColumns,
    useBlockLayout,
    // useFlexLayout,
  );
  const [filterInput, setFilterInput] = useState<TFilterType>();
  const [filterParams, setFilterParams] = useState<TFilterType>();

  const [orderBy, setOrderBy] = useState<keyof TBasePageEntity>('id');
  const [orderDirection, setOrderDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [attributes, setAttributes] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [, forceUpdate] = useReducer((d) => d + 1, 0);

  const getProducts = useCallback(
    async (pageNo: number = page) => {
      setLoading(true);

      if (!loadedPages[pageNo]) {
        const data = await gqlClient.getProducts({
          pagedParams: {
            pageSize: 25,
            pageNumber: pageNo,
            order: orderDirection,
            orderBy: orderBy,
          },
          filterParams: {
            minPrice,
            maxPrice,
            attributes,
            nameSearch,
          },
        });

        // setProducts(data.elements);
        setLoadedPages({ ...loadedPages, [pageNo]: true });
        if (pageNo > page) {
          setProducts([...products, ...data.elements]);
        } else if (pageNo < page) {
          setProducts([...data.elements, ...products]);
        }
        if (pageNo === page) {
          setProducts(data.elements);
        }
        setMinPrice(data.filterMeta.minPrice);
        setMaxPrice(data.filterMeta.maxPrice);
        setTotalProducts(data.pagedMeta.totalElements);
        setMaxPage(data.pagedMeta.totalPages);
      }
      setPage(pageNo);

      setLoading(false);
      forceUpdate();
      // console.log(data);
    },
    [orderBy, orderDirection, page, products],
  );

  const delayedGetProducts = useDebounceFn(getProducts, 200, false);

  return {
    products,
    loading,
    columns,
    orderBy,
    condensed,
    page,
    setPage,
    setCondensed,
    maxPage,
    delayedGetProducts,
    // visibleCols,
    // setVisibleCols,
    totalProducts,
    filterParams,
    setOrderBy,
    filterInput,
    table: tableInstance,
    getProducts,
  };
}

export const useProductTable = () => {
  return React.useContext(ProductTableContext);
};

type ContextType = ReturnType<typeof useProducts>;
const Empty = {} as ContextType;

const ProductTableContext = React.createContext<ContextType>(Empty);

export const ProductTableContextProvider = ({ children }) => {
  const value = useProducts();

  return <ProductTableContext.Provider value={value}>{children}</ProductTableContext.Provider>;
};
