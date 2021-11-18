import { getBlockInstance, TGetStaticProps, TPagedList, TPagedParams, TPost, TPostFilter, TTag } from '@cromwell/core';
import { CContainer, CList, getGraphQLClient, getGraphQLErrorInfo, LoadBox, TCList } from '@cromwell/core-frontend';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';

import Layout from '../../components/layout/Layout';
import layoutStyles from '../../components/layout/Layout.module.scss';
import { Pagination } from '../../components/pagination/Pagination';
import { PostCard } from '../../components/postCard/PostCard';
import { getHead } from '../../helpers/getHead';
import { handleGetFilteredPosts } from '../../helpers/getPosts';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Blog.module.scss';

import type { TPageWithLayout } from '../_app';


interface TagPageProps {
    posts?: TPagedList<TPost>;
    tag?: TTag;
    notFound?: boolean;
}

const TagPage: TPageWithLayout<TagPageProps> = (props) => {
    const filterInput = useRef<TPostFilter>({});
    const listId = 'Blog_list_01';
    const publishSort = useRef<"ASC" | "DESC">('DESC');
    const router = useRouter?.();
    const tag = props?.tag;

    const resetList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list?.clearState();
        list?.updateData();
    }

    const handleGetPosts = async (params: TPagedParams<TPost>): Promise<TPagedList<TPost> | undefined> => {
        params.orderBy = 'publishDate';
        params.order = publishSort.current;
        if (tag?.id) {
            filterInput.current.tagIds = [tag.id];
            return handleGetFilteredPosts(params, filterInput.current);
        } return { elements: [] }
    }

    const handleChangeSort = (event: SelectChangeEvent<unknown>) => {
        if (event.target.value === 'Newest') publishSort.current = 'DESC';
        if (event.target.value === 'Oldest') publishSort.current = 'ASC';
        resetList();
    }

    if (tag && !tag.pageTitle) {
        // Default meta page title
        tag.pageTitle = tag.name;
    }

    return (
        <CContainer className={commonStyles.content} id="tag_01">
            {getHead({
                documentContext: props.documentContext,
                image: props?.tag?.image,
                data: props?.tag,
            })}
            <CContainer className={styles.filter} id="tag_02">
                <div>
                    <h1 className={styles.title}>{tag?.name ?? ''}</h1>
                </div>
                <FormControl className={styles.filterItem}>
                    <InputLabel className={styles.sortLabel}>Sort</InputLabel>
                    <Select
                        style={{ width: '100px' }}
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
            <CContainer style={{ marginBottom: '20px' }} id="tag_03">
                {(router?.isFallback) ? (
                    <LoadBox />
                ) : (
                    <>
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
                        {tag?.description && (
                            <div
                                className={styles.description}
                                dangerouslySetInnerHTML={{ __html: tag.description }}
                            ></div>
                        )}
                    </>
                )}
            </CContainer>
        </CContainer>
    );
}

TagPage.getLayout = (page) => {
    return (
        <Layout>
            {page}
        </Layout >
    )
}

export default TagPage;

export const getStaticProps: TGetStaticProps = async (context): Promise<TagPageProps> => {
    const slug = context?.params?.slug ?? null;
    const client = getGraphQLClient();

    let tag: TTag | undefined;
    try {
        if (slug && typeof slug === 'string') {
            tag = await client?.getTagBySlug(slug);
        }
    } catch (e) {
        console.error(getGraphQLErrorInfo(e))
    }

    if (!tag) {
        return {
            notFound: true
        }
    }

    let posts: TPagedList<TPost> | undefined;
    try {
        posts = tag?.id ? await handleGetFilteredPosts({ pageSize: 20, order: 'DESC', orderBy: 'publishDate' }, {
            tagIds: [tag.id]
        }) : {};
    } catch (e) {
        console.error('TagPage::getStaticProps', getGraphQLErrorInfo(e))
    }

    return {
        posts,
        tag,
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
}