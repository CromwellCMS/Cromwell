import { DocumentNode, gql } from '@apollo/client';
import { TPagedParams, TProduct } from '@cromwell/core';
import { getGraphQLClient, getGraphQLErrorInfo, LoadBox } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useRef, useState, useCallback } from 'react';
import { debounce } from 'throttle-debounce';

import { BasePopper, BasePopperProps } from '../shared/Popper';
import { BaseTextField, TBaseTextField } from '../shared/TextField';
import { DefaultListItem, ListItemProps } from './ListItem';
import styles from './ProductSearch.module.scss';

export type ProductSearchProps = {
  classes?: Partial<Record<'root' | 'content' | 'notFoundText' | 'item' | 'itemImage' |
    'itemTitle' | 'priceBlock' | 'oldPrice' | 'price', string>>;

  elements?: {
    TextField?: TBaseTextField;
    Popper?: React.ComponentType<BasePopperProps>;
    ListItem?: React.ComponentType<ListItemProps>;
  };

  text?: {
    notFound?: string;
    searchLabel?: string;
  };

  /**
   * Custom GraphQL fragment on Product
   */
  customFragment?: DocumentNode;

  /**
   * Name of custom fragment
   */
  customFragmentName?: string;
}

/**
 * Search input field. Queries products in the store. Results are shown in pop-up window on user input.
 */
export function ProductSearch(props: ProductSearchProps) {
  const { text, classes } = props;
  const { TextField = BaseTextField, Popper = BasePopper,
    ListItem = DefaultListItem } = props.elements ?? {};

  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchItems, setSearchItems] = useState<TProduct[]>([]);
  const searchAnchorRef = useRef<HTMLDivElement | null>(null);

  const searchRequest = useCallback(debounce(500, async (productName: string) => {
    const pagedParams: TPagedParams<TProduct> = {
      pageNumber: 1,
      pageSize: 10,
    }
    const filterParams = {
      nameSearch: productName
    }

    const client = getGraphQLClient();
    if (!isLoading) setIsLoading(true);

    const fragment = props.customFragment ?? gql`
      fragment ProductSearchFragment on Product {
        id
        isEnabled
        slug
        pageTitle
        name
        price
        oldPrice
        mainImage
      }`;
    const fragmentName = props.customFragmentName ?? 'ProductSearchFragment';

    try {
      const data = await client?.query({
        query: gql`
          query getFilteredProducts($pagedParams: PagedParamsInput, $filterParams: ProductFilterInput) {
            getFilteredProducts(pagedParams: $pagedParams, filterParams: $filterParams) {
              pagedMeta {
                ...PagedMetaFragment
              }
              elements {
                ...${fragmentName}
              }
            }
          }
          ${fragment}
          ${client?.PagedMetaFragment}`,
        variables: {
          pagedParams,
          filterParams,
        }
      });
      const products = data?.data?.getFilteredProducts?.elements;
      if (products) setSearchItems(products);

    } catch (e) {
      console.error(getGraphQLErrorInfo(e));
    }

    setIsLoading(false);
  }), []);

  const handleSearchInput = (productName: string) => {
    if (!isLoading) setIsLoading(true);

    if (!searchOpen) {
      setSearchOpen(true);
    }
    searchRequest(productName);
  }

  const handleSearchClose = () => {
    setSearchOpen(false);
  }

  return (
    <div className={clsx(styles.ProductSearch, classes?.root)} ref={searchAnchorRef}>
      <TextField
        label={text?.searchLabel ?? "Search..."}
        onChange={(event) => handleSearchInput(event.currentTarget.value)}
      />
      <Popper open={searchOpen}
        anchorEl={searchAnchorRef.current}
        onClose={handleSearchClose}
      >
        <div className={clsx(styles.searchContent, classes?.content)}
          onClick={handleSearchClose}
        >
          {isLoading && (
            <LoadBox size={100} />
          )}
          {!isLoading && searchItems.length === 0 && (
            <p className={clsx(styles.searchNotFoundText, classes?.notFoundText)}
            >{text?.notFound ?? 'No items found'}</p>
          )}
          {!isLoading && searchItems?.map(product => (
            <ListItem
              key={product.id}
              product={product}
              searchProps={props}
            />
          ))}
        </div>
      </Popper>
    </div>
  );
}
