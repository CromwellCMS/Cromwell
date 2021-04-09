import { TCromwellPage, TGetStaticProps, TPagedList, TPost } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React, { useRef, useState } from 'react';

import Layout from '../components/layout/Layout';
import { PostCard } from '../components/postCard/PostCard';
import { handleGetFilteredPosts } from '../helpers/getPosts';
import commonStyles from '../styles/common.module.scss';
import blogStyles from '../styles/pages/Blog.module.scss';
import styles from '../styles/pages/Index.module.scss';

interface BlogProps {
    posts?: TPagedList<TPost>;
}

const IndexPage: TCromwellPage<BlogProps> = (props) => {

    return (
        <Layout>
            <div className={`${styles.IndexPage} ${commonStyles.content}`}>
                <div className={styles.mainPostsWrapper}>
                    <div className={styles.postBigWrapper}>
                        <PostCard
                            coverImage
                            imageHeight="350px"
                            data={props.posts?.elements?.[0]}
                            key={1} />
                    </div>
                    <div className={styles.postBigWrapper}>
                        <PostCard
                            coverImage
                            imageHeight="350px"
                            data={props.posts?.elements?.[1]}
                            key={2} />
                    </div>
                </div>
            </div>
            <div className={commonStyles.content}>
                <div className={styles.postGrid}>
                    {props.posts?.elements?.slice(2, 8)?.map(postData => (
                        <div className={blogStyles.postWrapper}>
                            <PostCard data={postData} key={postData?.id} />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default IndexPage;

export const getStaticProps: TGetStaticProps = async (context): Promise<BlogProps> => {
    let posts: TPagedList<TPost> | undefined;
    try {
        posts = await handleGetFilteredPosts({ pageSize: 20, order: 'DESC', orderBy: 'publishDate' });
    } catch (e) {
        console.error('IndexPage::getStaticProps', e)
    }

    return {
        posts,
    }
}
