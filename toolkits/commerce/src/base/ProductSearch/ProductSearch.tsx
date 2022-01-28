import { DocumentNode, gql } from '@apollo/client';
import { TPagedParams, TProduct } from '@cromwell/core';
import { getGraphQLClient, getGraphQLErrorInfo, LoadBox } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';
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

export class ProductSearch extends React.Component<ProductSearchProps, {
  searchOpen: boolean;
  isLoading: boolean;
  searchItems: TProduct[];
}>  {
  private searchAnchorRef = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      searchOpen: false,
      isLoading: false,
      searchItems: []
    }
  }

  private searchRequest = debounce(500, async (productName: string) => {
    const pagedParams: TPagedParams<TProduct> = {
      pageNumber: 1,
      pageSize: 10,
    }
    const filterParams = {
      nameSearch: productName
    }

    const client = getGraphQLClient();
    if (!this.state.isLoading) this.setState({ isLoading: true });

    const fragment = this.props.customFragment ?? gql`
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
    const fragmentName = this.props.customFragmentName ?? 'ProductSearchFragment';

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
      if (products) this.setState({ searchItems: products });

    } catch (e) {
      console.error(getGraphQLErrorInfo(e));
    }
    this.setState({ isLoading: false });
  });

  private handleSearchInput = (productName: string) => {
    if (!this.state.isLoading)
      this.setState({ isLoading: true });

    if (!this.state.searchOpen) {
      this.setState({ searchOpen: true });
    }
    this.searchRequest(productName);
  }

  private handleSearchClose = () => {
    this.setState({ searchOpen: false });
  }

  render() {
    const { isLoading, searchItems, searchOpen } = this.state;
    const { text, classes } = this.props;
    const { TextField = BaseTextField, Popper = BasePopper,
      ListItem = DefaultListItem } = this.props.elements ?? {};

    return (
      <div className={clsx(styles.ProductSearch, classes?.root)} ref={this.searchAnchorRef}>
        <TextField
          label={text?.searchLabel ?? "Search..."}
          onChange={(event) => this.handleSearchInput(event.currentTarget.value)}
        />
        <Popper open={searchOpen}
          anchorEl={this.searchAnchorRef.current}
          onClose={this.handleSearchClose}
        >
          <div className={clsx(styles.searchContent, classes?.content)}
            onClick={this.handleSearchClose}
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
                searchProps={this.props}
              />
            ))}
          </div>
        </Popper>
      </div>
    );
  }
}
