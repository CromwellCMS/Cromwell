import { gql } from '@apollo/client';
import { TPagedParams, TProduct } from '@cromwell/core';
import { getCStore, getGraphQLClient, getGraphQLErrorInfo, Link, LoadBox } from '@cromwell/core-frontend';
import { ClickAwayListener, Fade, Grid, Popper } from '@mui/material';
import React from 'react';
import { debounce } from 'throttle-debounce';

import styles from './Header.module.scss';

export class HeaderSearch extends React.Component<unknown, {
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
        if (!this.state.isLoading)
            this.setState({ isLoading: true });

        try {
            const data = await client?.query({
                query: gql`
                    query getFilteredProducts($pagedParams: PagedParamsInput, $filterParams: ProductFilterInput) {
                        getFilteredProducts(pagedParams: $pagedParams, filterParams: $filterParams) {
                            pagedMeta {
                                ...PagedMetaFragment
                            }
                            elements {
                                id
                                isEnabled
                                slug
                                pageTitle
                                name
                                price
                                oldPrice
                                mainImage
                            }
                        }
                    }
                    ${client?.PagedMetaFragment}
                    `,
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
        const cstore = getCStore();
        const { isLoading, searchItems, searchOpen } = this.state;

        return (
            <>
                <div
                    style={{ width: '100%' }}
                    ref={this.searchAnchorRef}
                >
                    <input
                        className={styles.searchInput}
                        placeholder="Search..."
                        onChange={(event) => this.handleSearchInput(event.currentTarget.value)}
                    />
                </div>
                <Popper open={searchOpen} anchorEl={this.searchAnchorRef.current}
                    style={{ zIndex: 9999 }}
                    transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <ClickAwayListener onClickAway={this.handleSearchClose}>
                                <div className={styles.searchContent} onClick={this.handleSearchClose}>
                                    {isLoading && (
                                        <LoadBox size={100} />
                                    )}
                                    {!isLoading && searchItems.length === 0 && (
                                        <p className={styles.notFoundText}>No items found</p>
                                    )}
                                    {!isLoading && searchItems.map(product => {
                                        return (
                                            <Link href={`/product/${product.slug}`} key={product.id}>
                                                <Grid container className={styles.listItem}>
                                                    <Grid xs={7} className={styles.itemMain}>
                                                        <div
                                                            style={{ backgroundImage: `url(${product?.mainImage})` }}
                                                            className={styles.itemImage}
                                                        ></div>
                                                        <div className={styles.itemMainInfo}>
                                                            <p className={styles.itemTitle}>{product.name}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid xs={5} className={styles.itemSubInfo}>
                                                        <div className={styles.priceBlock}>
                                                            {(product.oldPrice !== undefined && product.oldPrice !== null) && (
                                                                <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
                                                            )}
                                                            <p className={styles.price}>{cstore.getPriceWithCurrency(product.price)}</p>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </ClickAwayListener>
                        </Fade>
                    )}
                </Popper>
            </>
        );
    }

}
