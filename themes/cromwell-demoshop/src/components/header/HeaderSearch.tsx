import { gql } from '@apollo/client';
import { TPagedParams, TProduct } from '@cromwell/core';
import { getCStore, getGraphQLClient, Link, LoadBox } from '@cromwell/core-frontend';
import { ClickAwayListener, Fade, Grid, Popper, TextField as MuiTextField, withStyles } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

import styles from './Header.module.scss';

const TextField = withStyles({
    root: {
        paddingTop: '0',
        paddingBottom: '0',
        fontWeight: 300,
        width: "100%"
    },
})(MuiTextField);

export class HeaderSearch extends React.Component<{}, {
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

    private searchRequest = debounce(1000, async (productName: string) => {
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
        query getFilteredProductsFromCategory($categoryId: String!, $pagedParams: PagedParamsInput!, $filterParams: ProductFilterInput!) {
            getFilteredProductsFromCategory(categoryId: $categoryId, pagedParams: $pagedParams, filterParams: $filterParams) {
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
                    categoryId: ' 1'
                }
            });
            const products = data?.data?.getFilteredProductsFromCategory?.elements;
            if (products) this.setState({ searchItems: products });

        } catch (e) {
            console.error(e);
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
                <TextField id="outlined-basic" label="Search..."
                    variant="outlined" size="small"
                    ref={this.searchAnchorRef}
                    // onBlur={handleSearchClose}
                    onChange={(event) => this.handleSearchInput(event.currentTarget.value)} />
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
                                            <Link href={`/product/${product.slug}`}>
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
