import { gql } from '@apollo/client';
import { TPagedParams, TPost, TPostFilter } from '@cromwell/core';
import { getGraphQLClient, Link, LoadBox } from '@cromwell/core-frontend';
import { ClickAwayListener, Fade, Grid, Popper, TextField as MuiTextField, withStyles } from '@material-ui/core';
import React from 'react';
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

export class HeaderSearch extends React.Component<unknown, {
    searchOpen: boolean;
    isLoading: boolean;
    searchItems: TPost[];
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

    private searchRequest = debounce(500, async (postName: string) => {
        const pagedParams: TPagedParams<TPost> = {
            pageNumber: 1,
            pageSize: 10,
        }
        const filterParams: TPostFilter = {
            titleSearch: postName
        }

        const client = getGraphQLClient();
        if (!this.state.isLoading)
            this.setState({ isLoading: true });

        try {
            const data = await client?.query({
                query: gql`
                    query getFilteredPosts($pagedParams: PagedParamsInput, $filterParams: PostFilterInput) {
                        getFilteredPosts(pagedParams: $pagedParams, filterParams: $filterParams) {
                            pagedMeta {
                                ...PagedMetaFragment
                            }
                            elements {
                                id
                                isEnabled
                                slug
                                title
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
            const elements = data?.data?.getFilteredPosts?.elements;
            if (elements) this.setState({ searchItems: elements });

        } catch (e) {
            console.error(e);
        }
        this.setState({ isLoading: false });
    });

    private handleSearchInput = (input: string) => {

        if (!this.state.isLoading)
            this.setState({ isLoading: true });


        if (!this.state.searchOpen) {
            this.setState({ searchOpen: true });
        }
        this.searchRequest(input);
    }

    private handleSearchClose = () => {
        this.setState({ searchOpen: false });
    }

    render() {
        const { isLoading, searchItems, searchOpen } = this.state;

        return (
            <>
                <TextField label="Search..."
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
                                    {!isLoading && searchItems.map(post => {
                                        return (
                                            <Grid container className={styles.listItem} key={post.id}>
                                                <Link href={`/post/${post.slug}`} >
                                                    <Grid item xs={12} className={styles.itemMain}>
                                                        <div
                                                            style={{ backgroundImage: `url(${post?.mainImage})` }}
                                                            className={styles.itemImage}
                                                        ></div>
                                                        <div className={styles.itemMainInfo}>
                                                            <p className={styles.itemTitle}>{post.title ?? ''}</p>
                                                        </div>
                                                    </Grid>
                                                </Link>
                                            </Grid>
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
