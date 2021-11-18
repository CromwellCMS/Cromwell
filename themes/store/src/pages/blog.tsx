import { getBlockInstance, TGetStaticProps, TPagedList, TPagedParams, TPost, TPostFilter, TTag } from '@cromwell/core';
import { CContainer, CList, getGraphQLClient, getGraphQLErrorInfo, TCList } from '@cromwell/core-frontend';
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import Layout from '../components/layout/Layout';
import layoutStyles from '../components/layout/Layout.module.scss';
import { Pagination } from '../components/pagination/Pagination';
import { PostCard } from '../components/postCard/PostCard';
import { handleGetFilteredPosts } from '../helpers/getPosts';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Blog.module.scss';

import type { TPageWithLayout } from './_app';

interface BlogProps {
    posts?: TPagedList<TPost>;
    tags?: TTag[];
}

const BlogPage: TPageWithLayout<BlogProps> = (props) => {
    props.cmsSettings
    const filterInput = useRef<TPostFilter>({});
    const listId = 'Blog_list_01';
    const publishSort = useRef<"ASC" | "DESC">('DESC');
    const forceUpdate = useForceUpdate();

    const resetList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list?.clearState();
        list?.init();
        list?.updateData();
    }

    // const updateList = () => {
    //     const list = getBlockInstance<TCList>(listId)?.getContentInstance();
    //     list?.updateData();
    // }

    useEffect(() => {
        // updateList();
    }, []);

    const handleChangeTags = (event: any, newValue?: (TTag | undefined | string)[]) => {
        filterInput.current.tagIds = newValue?.map(tag => (tag as TTag)?.id);
        forceUpdate();
        resetList();
    }

    const handleGetPosts = (params: TPagedParams<TPost>) => {
        params.orderBy = 'publishDate';
        params.order = publishSort.current;
        return handleGetFilteredPosts(params, filterInput.current);
    }

    const handleChangeSort = (event: SelectChangeEvent<unknown>) => {
        if (event.target.value === 'Newest') publishSort.current = 'DESC';
        if (event.target.value === 'Oldest') publishSort.current = 'ASC';
        resetList();
    }

    const handleTagClick = (tag?: TTag) => {
        if (!tag) return;
        if (filterInput.current.tagIds?.length === 1 &&
            filterInput.current.tagIds[0] === tag.id) return;
        handleChangeTags(null, [tag]);
        forceUpdate();
    }

    return (
        <CContainer className={commonStyles.content} id="blog-1">
            <CContainer className={styles.filter} id="blog-2">
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
                <FormControl className={styles.filterItem}>
                    <InputLabel className={styles.sortLabel}>Sort</InputLabel>
                    <Select
                        onChange={handleChangeSort}
                        variant="standard"
                        defaultValue='Newest'
                    >
                        {['Newest', 'Oldest'].map(sort => (
                            <MenuItem value={sort} key={sort}>{sort}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </CContainer>
            <CContainer style={{ marginBottom: '20px' }} id="blog-3">
                <CList<TPost>
                    id={listId}
                    editorHidden
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
    );
}

BlogPage.getLayout = (page) => {
    return (
        <Layout>
            {page}
        </Layout >
    )
}

export default BlogPage;

export const getStaticProps: TGetStaticProps = async (): Promise<BlogProps> => {
    const client = getGraphQLClient();

    let posts: TPagedList<TPost> | undefined;
    try {
        posts = await handleGetFilteredPosts({ pageSize: 20, order: 'DESC', orderBy: 'publishDate' });
    } catch (e) {
        console.error('BlogPage::getStaticProps', getGraphQLErrorInfo(e))
    }

    let tags: TTag[] | undefined;
    try {
        tags = (await client?.getTags({ pageSize: 99999 }))?.elements;
    } catch (e) {
        console.error('BlogPage::getStaticProps', getGraphQLErrorInfo(e))
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
