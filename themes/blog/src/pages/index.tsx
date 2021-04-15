import { TCromwellPage, TGetStaticProps, TPagedList, TPost } from '@cromwell/core';
import { CImage, CContainer, CText } from '@cromwell/core-frontend';
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
            <div className={`${styles.IndexPage}`}>
                <CContainer id="main_1" className={styles.main}>
                    <CImage id="main_2" src="/themes/@cromwell/theme-blog/cover.jpg" objectFit="cover" className={styles.coverImage} />
                    <CContainer id="main_3" className={commonStyles.content}>
                        <CContainer id="main_10" className={styles.titleWrapper}>
                            <CText id="main_11" className={styles.title}>My New Blog</CText>
                            <CText id="main_12" className={styles.desciption}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</CText>
                        </CContainer>
                        <CContainer id="main_4" className={styles.mainPostsWrapper}>
                            <CContainer id="main_5" className={styles.postBigWrapper}>
                                <div className={styles.postBigContent}>
                                    <PostCard
                                        coverImage
                                        imageHeight="350px"
                                        data={props.posts?.elements?.[0]}
                                        key={1} />
                                </div>
                            </CContainer>
                            <CContainer id="main_6" className={styles.postBigWrapper}>
                                <div className={styles.postBigContent}>
                                    <PostCard
                                        coverImage
                                        imageHeight="350px"
                                        data={props.posts?.elements?.[1]}
                                        key={2} />
                                </div>
                            </CContainer>
                        </CContainer>
                    </CContainer>
                </CContainer>
                <CContainer id="main_7" className={commonStyles.content}>
                    <CText id="main_21" className={styles.latestText}>Latest posts</CText>
                    <div className={styles.postGrid}>
                        {props.posts?.elements?.slice(2, 8)?.map(postData => (
                            <div className={blogStyles.postWrapper}>
                                <PostCard data={postData} key={postData?.id} />
                            </div>
                        ))}
                    </div>
                </CContainer>
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
