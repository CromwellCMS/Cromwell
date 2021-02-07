import { gql } from '@apollo/client';
import { TCromwellPage, TGetStaticProps, TPagedList, TPagedParams, TPost } from '@cromwell/core';
import { CContainer, CList, getGraphQLClient } from '@cromwell/core-frontend';
import React, { useEffect, useRef } from 'react';

import Layout from '../components/layout/Layout';
import layoutStyles from '../components/layout/Layout.module.scss';
import { Pagination } from '../components/pagination/Pagination';
import { PostCard } from '../components/postCard/PostCard';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Blog.module.scss';


interface BlogProps {
    posts?: TPagedList<TPost>;
}
const Blog: TCromwellPage<BlogProps> = (props) => {

    return (
        <Layout>
            <div className={commonStyles.content}>
                <CList<TPost>
                    id={'Blog_list_01'}
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
                <CContainer id="Product_ProductShowcase" />
            </div>
        </Layout>
    );
}

export default Blog;


const handleGetPosts = async (params: TPagedParams<TPost>) => {
    const client = getGraphQLClient();
    return client?.getPosts(params, gql`
    fragment PostListFragment on Post {
        id
        slug
        pageTitle
        createDate
        updateDate
        title
        author {
            id
            fullName
            avatar
        }
        mainImage
        isPublished
    }
`, 'PostListFragment');
}

export const getStaticProps: TGetStaticProps = async (context): Promise<BlogProps> => {
    // console.log('CategoryThemePage::getStaticProps: slug', slug, 'context.params', context.params);

    let posts: TPagedList<TPost> | undefined;
    try {
        posts = await handleGetPosts({ pageSize: 20 });
    } catch (e) {
        console.error('ProductCategory::getStaticProps', e)
    }
    return {
        posts
    }
}