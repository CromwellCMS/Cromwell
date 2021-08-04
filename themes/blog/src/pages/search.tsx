import {
    getBlockInstance,
    TCromwellPage,
    TGetStaticProps,
    TPagedList,
    TPagedParams,
    TPost,
    TPostFilter,
    TTag,
} from '@cromwell/core';
import { CContainer, CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

import Layout from '../components/layout/Layout';
import layoutStyles from '../components/layout/Layout.module.scss';
import { Pagination } from '../components/pagination/Pagination';
import { PostCard } from '../components/postCard/PostCard';
import { handleGetFilteredPosts } from '../helpers/getPosts';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Blog.module.scss';


interface BlogProps {
    posts?: TPagedList<TPost>;
    tags?: TTag[];
}

const SearchPage: TCromwellPage<BlogProps> = (props) => {
    const filterInput = useRef<TPostFilter>({});
    const listId = 'Blog_list_01';
    const publishSort = useRef<"ASC" | "DESC">('DESC');
    const forceUpdate = useForceUpdate();
    const titleSearchId = "post-filter-search";

    const updateList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list?.clearState();
        list?.init();
        list?.updateData();
    }

    const handleChangeTags = (event: any, newValue?: (TTag | undefined | string)[]) => {
        filterInput.current.tagIds = newValue?.map(tag => (tag as TTag)?.id);
        forceUpdate();
        updateList();
    }

    const handleGetPosts = (params: TPagedParams<TPost>) => {
        params.orderBy = 'publishDate';
        params.order = publishSort.current;
        return handleGetFilteredPosts(params, filterInput.current);
    }

    const handleChangeSort = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (event.target.value === 'Newest') publishSort.current = 'DESC';
        if (event.target.value === 'Oldest') publishSort.current = 'ASC';
        updateList();
    }

    const handleTagClick = (tag?: TTag) => {
        if (!tag) return;
        if (filterInput.current.tagIds?.length === 1 &&
            filterInput.current.tagIds[0] === tag.id) return;
        handleChangeTags(null, [tag]);
        forceUpdate();
    }

    const handleTitleInput = debounce(400, () => {
        filterInput.current.titleSearch = (document.getElementById(titleSearchId) as HTMLInputElement)?.value ?? undefined;
        updateList();
    });

    return (
        <Layout>
            <CContainer className={commonStyles.content} id="search_01">
                <CContainer className={styles.filter} id="search_02">
                    <div className={styles.filterLeft}>
                        <TextField
                            className={styles.filterItem}
                            placeholder="Search by title"
                            id={titleSearchId}
                            onChange={handleTitleInput}
                        />
                        <Autocomplete
                            multiple
                            freeSolo
                            value={filterInput.current.tagIds?.map(id => props.tags?.find(tag => tag.id === id)) ?? []}
                            className={styles.filterItem}
                            options={props.tags ?? []}
                            getOptionLabel={(option) => option?.name ?? ''}
                            style={{ width: 300 }}
                            onChange={handleChangeTags}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    placeholder="Tags"
                                />
                            )}
                        />
                    </div>
                    <FormControl className={styles.filterItem}>
                        <InputLabel>Sort</InputLabel>
                        <Select
                            style={{ width: '100px' }}
                            onChange={handleChangeSort}
                            defaultValue='Newest'
                        >
                            {['Newest', 'Oldest'].map(sort => (
                                <MenuItem value={sort} key={sort}>{sort}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CContainer>
                <CContainer style={{ marginBottom: '20px' }} id="search_03">
                    <CList<TPost>
                        id={listId}
                        ListItem={(props) => (
                            <div className={styles.postWrapper}>
                                <PostCard onTagClick={handleTagClick} data={props.data} key={props.data?.id} />
                            </div>
                        )}
                        usePagination
                        useShowMoreButton
                        useQueryPagination
                        disableCaching
                        pageSize={20}
                        scrollContainerSelector={`.${layoutStyles.Layout}`}
                        firstBatch={props.posts}
                        loader={handleGetPosts}
                        cssClasses={{
                            page: styles.postList
                        }}
                        elements={{
                            pagination: Pagination
                        }}
                    />
                </CContainer>
            </CContainer>
        </Layout>
    );
}

export default SearchPage;

export const getStaticProps: TGetStaticProps = async (): Promise<BlogProps> => {
    const client = getGraphQLClient();

    let posts: TPagedList<TPost> | undefined;
    try {
        posts = await handleGetFilteredPosts({ pageSize: 20, order: 'DESC', orderBy: 'publishDate' });
    } catch (e) {
        console.error('SearchPage::getStaticProps', e)
    }

    let tags: TTag[] | undefined;
    try {
        tags = (await client?.getTags({ pageSize: 99999 }))?.elements;
    } catch (e) {
        console.error('SearchPage::getStaticProps', e)
    }
    return {
        posts,
        tags
    }
}

function useForceUpdate() {
    const state = useState(0);
    return () => state[1](value => ++value);
}
