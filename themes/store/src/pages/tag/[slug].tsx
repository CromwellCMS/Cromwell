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
import { CList, getGraphQLClient, LoadBox, TCList, useRouter } from '@cromwell/core-frontend';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';

import Layout from '../../components/layout/Layout';
import layoutStyles from '../../components/layout/Layout.module.scss';
import { Pagination } from '../../components/pagination/Pagination';
import { PostCard } from '../../components/postCard/PostCard';
import { handleGetFilteredPosts } from '../../helpers/getPosts';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Blog.module.scss';


interface BlogProps {
    posts?: TPagedList<TPost>;
    tag?: TTag;
}
const TagPage: TCromwellPage<BlogProps> = (props) => {
    const filterInput = useRef<TPostFilter>({});
    const listId = 'Blog_list_01';
    const publishSort = useRef<"ASC" | "DESC">('DESC');
    const router = useRouter?.();

    const updateList = () => {
        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list?.updateData();
    }

    useEffect(() => {
        updateList();
    });

    const handleGetPosts = async (params: TPagedParams<TPost>): Promise<TPagedList<TPost> | undefined> => {
        params.orderBy = 'publishDate';
        params.order = publishSort.current;
        if (props?.tag?.id) {
            filterInput.current.tagIds = [props.tag.id];
            return handleGetFilteredPosts(params, filterInput.current);
        } return { elements: [] }
    }

    const handleChangeSort = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (event.target.value === 'Newest') publishSort.current = 'DESC';
        if (event.target.value === 'Older') publishSort.current = 'ASC';
        updateList();
    }

    return (
        <Layout>
            <div className={commonStyles.content}>
                <div className={styles.filter}>
                    <div>
                        <h1 className={styles.title}>{props.tag?.name ?? ''}</h1>
                    </div>
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
                <div style={{ marginBottom: '20px' }}>
                    {(router?.isFallback) ? (
                        <LoadBox />
                    ) : (
                        <CList<TPost>
                            id={listId}
                            ListItem={(props) => (
                                <div className={styles.postWrapper}>
                                    <PostCard data={props.data} key={props.data?.id} />
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
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default TagPage;

export const getStaticProps: TGetStaticProps = async (context): Promise<BlogProps> => {
    const slug = context?.params?.slug ?? null;
    const client = getGraphQLClient();

    let tag: TTag | undefined;
    try {
        if (slug && typeof slug === 'string') {
            tag = await client?.getTagBySlug(slug);
        }
    } catch (e) {
        console.error(e)
    }

    let posts: TPagedList<TPost> | undefined;
    try {
        posts = tag?.id ? await handleGetFilteredPosts({ pageSize: 20, order: 'DESC', orderBy: 'publishDate' }, {
            tagIds: [tag.id]
        }) : {};
    } catch (e) {
        console.error('TagPage::getStaticProps', e)
    }

    return {
        posts,
        tag,
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}