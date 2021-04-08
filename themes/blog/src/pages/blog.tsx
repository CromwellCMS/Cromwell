import { gql } from '@apollo/client';
import { TCromwellPage, TGetStaticProps, TPagedList, TPagedParams, TPost, TPostFilter, getBlockInstance, TTag } from '@cromwell/core';
import { CContainer, CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import React, { useState, useRef } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { Checkbox, IconButton, TextField, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import Layout from '../components/layout/Layout';
import layoutStyles from '../components/layout/Layout.module.scss';
import { Pagination } from '../components/pagination/Pagination';
import { PostCard } from '../components/postCard/PostCard';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Blog.module.scss';


interface BlogProps {
    posts?: TPagedList<TPost>;
    tags?: TTag[];
}
const Blog: TCromwellPage<BlogProps> = (props) => {
    const filterInput = useRef<TPostFilter>({});
    const listId = 'Blog_list_01';
    const publishSort = useRef<"ASC" | "DESC">('DESC');
    const forceUpdate = useForceUpdate();

    const updateList = () => {
        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
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
        if (event.target.value === 'Older') publishSort.current = 'ASC';
        updateList();
    }

    const handleTagClick = (tag?: TTag) => {
        if (!tag) return;
        if (filterInput.current.tagIds?.length === 1 &&
            filterInput.current.tagIds[0] === tag.id) return;
        handleChangeTags(null, [tag]);
        forceUpdate();
    }

    return (
        <Layout>
            <div className={commonStyles.content}>
                <div className={styles.filter}>
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
                        <InputLabel>Sort</InputLabel>
                        <Select
                            style={{ width: '100px' }}
                            onChange={handleChangeSort}
                            defaultValue='Newest'
                        >
                            {['Newest', 'Older'].map(sort => (
                                <MenuItem value={sort} key={sort}>{sort}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
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
                    maxDomPages={2}
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
                <CContainer id="Product_ProductShowcase" />
            </div>
        </Layout>
    );
}

export default Blog;


const handleGetFilteredPosts = async (params: TPagedParams<TPost>, filter?: TPostFilter) => {
    const client = getGraphQLClient();
    return client?.getFilteredPosts({
        pagedParams: params,
        customFragment: gql`
        fragment PostListFragment on Post {
            id
            slug
            title
            createDate
            excerpt
            author {
                id
                fullName
                avatar
            }
            mainImage
            tags {
                name
                id
                slug
                color
                image
            }
            publishDate
        }
    `,
        customFragmentName: 'PostListFragment',
        filterParams: filter,
    });
}

export const getStaticProps: TGetStaticProps = async (context): Promise<BlogProps> => {
    // console.log('CategoryThemePage::getStaticProps: slug', slug, 'context.params', context.params);
    const client = getGraphQLClient();

    let posts: TPagedList<TPost> | undefined;
    try {
        posts = await handleGetFilteredPosts({ pageSize: 20, order: 'DESC', orderBy: 'publishDate' });
    } catch (e) {
        console.error('BlogPage::getStaticProps', e)
    }

    let tags: TTag[] | undefined;
    try {
        tags = (await client?.getTags({ pageSize: 99999 }))?.elements;
    } catch (e) {
        console.error('BlogPage::getStaticProps', e)
    }
    return {
        posts,
        tags
    }
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}
