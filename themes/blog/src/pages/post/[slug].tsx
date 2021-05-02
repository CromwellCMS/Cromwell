import 'quill/dist/quill.snow.css';

import { TCromwellPage, TGetStaticProps, TPost } from '@cromwell/core';
import { getGraphQLClient, Link, LoadBox, useRouter } from '@cromwell/core-frontend';
import React, { useEffect, useRef, useState } from 'react';

import Layout from '../../components/layout/Layout';
import { PostInfo } from '../../components/postCard/PostCard';
import postStyles from '../../components/postCard/PostCard.module.scss';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/BlogPost.module.scss';

interface BlogPostProps {
    post?: TPost | undefined;
}

const BlogPostPage: TCromwellPage<BlogPostProps> = (props) => {
    const { post } = props;
    const router = useRouter?.();

    return (
        <Layout>
            <div className={styles.BlogPost}>
                <div className={commonStyles.content}>
                    {post?.mainImage && (
                        <img className={styles.mainImage} src={post.mainImage} />
                    )}
                </div>
                <div className={styles.postContent}>
                    {(!post && router && router.isFallback) && (
                        <LoadBox />
                    )}
                    {(!post && !(router && router.isFallback)) && (
                        <div className={styles.notFound}>
                            <h3>Post not found</h3>
                        </div>
                    )}
                    {post?.title && (
                        <h1 className={styles.postTitle}>{post?.title}</h1>
                    )}
                    {post?.tags && (
                        <div className={postStyles.tagsBlock}>
                            {post?.tags?.map(tag => {
                                return (
                                    <Link href={`/tag/${tag.slug}`} key={tag.id}>
                                        <a className={postStyles.tag}>{tag?.name}</a>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                    {post && (
                        <div className={styles.postInfo}>
                            <PostInfo data={post} />
                        </div>
                    )}
                    {post?.content && (
                        <div id="quill" dangerouslySetInnerHTML={{
                            __html: post?.content
                        }}></div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default BlogPostPage;


export const getStaticProps: TGetStaticProps = async (context): Promise<BlogPostProps> => {
    const slug = context?.params?.slug ?? null;
    const client = getGraphQLClient();
    let post: TPost | undefined = undefined;

    if (slug && typeof slug === 'string') {
        try {
            post = await client?.getPostBySlug(slug);

            // Don't allow unpublished posts to be seen by customers
            if (!post?.isPublished) post = undefined;
        } catch (e) {
            console.error('BlogPostPage::getStaticProps', e)
        }
    } else {
        console.error('BlogPostPage::getStaticProps: !pid')
    }

    return {
        post,
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}