import { removeUndefined, TGetStaticProps, TPost } from '@cromwell/core';
import { CContainer, EntityHead, getGraphQLClient, Link, LoadBox, TGraphQLErrorInfo } from '@cromwell/core-frontend';
import { useRouter } from 'next/router';
import React from 'react';

import Layout from '../../components/layout/Layout';
import { PostInfo } from '../../components/postCard/PostCard';
import postStyles from '../../components/postCard/PostCard.module.scss';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/BlogPost.module.scss';

import type { TPageWithLayout } from '../_app';

interface BlogPostProps {
    post?: TPost | undefined;
    notFound?: boolean;
}

const BlogPostPage: TPageWithLayout<BlogPostProps> = (props) => {
    const { post } = props;
    const router = useRouter?.();

    if (post && !post.pageTitle) {
        // Default meta page title
        post.pageTitle = post.title;
    }

    return (
        <CContainer className={styles.BlogPost} id="post_01">
            <EntityHead
                entity={post}
                useFallback
            />
            <CContainer className={commonStyles.content} id="post_02">
                {post?.mainImage && (
                    <img className={styles.mainImage} src={post.mainImage} />
                )}
            </CContainer>
            <CContainer className={styles.postContent} id="post_03">
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
                                <Link href={`/tag/${tag.slug}`}
                                    key={tag.id}
                                    className={postStyles.tag}
                                >{tag?.name}</Link>
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
                    <div id="text-editor" dangerouslySetInnerHTML={{
                        __html: post?.content
                    }}></div>
                )}
            </CContainer>
        </CContainer>
    );
}

BlogPostPage.getLayout = (page) => {
    return (
        <Layout>
            {page}
        </Layout >
    )
}

export default BlogPostPage;


export const getStaticProps: TGetStaticProps<BlogPostProps> = async (context) => {
    const slug = context?.params?.slug ?? null;
    const client = getGraphQLClient();
    
    const post = (typeof slug === 'string' &&
        await client.getPostBySlug(slug).catch((error: TGraphQLErrorInfo) => {
            if (error.statusCode !== 404)
                console.error('BlogPostPage::getStaticProps', error);
        })) || null;

    if (!post) {
        return {
            notFound: true,
        }
    }

    return {
        props: removeUndefined({
            post,
        })
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
}