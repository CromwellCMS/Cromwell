import { TGetStaticProps, TPost } from '@cromwell/core';
import {
  CContainer,
  CText,
  EntityHead,
  getGraphQLClient,
  getGraphQLErrorInfo,
  Link,
  LoadBox,
} from '@cromwell/core-frontend';
import { useRouter } from 'next/router';
import React from 'react';

import Layout from '../../components/layout/Layout';
import { PostInfo } from '../../components/postCard/PostCard';
import postStyles from '../../components/postCard/PostCard.module.scss';
import { removeUndefined } from '../../helpers/removeUndefined';
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
    <CContainer className={styles.BlogPost} id="blog-1">
      <EntityHead
        entity={post}
        useFallback
      />
      <CContainer className={commonStyles.content} id="blog-2">
        {post?.mainImage && (
          <img className={styles.mainImage} src={post.mainImage} />
        )}
      </CContainer>
      <CContainer className={styles.postContent} id="blog-3">
        {(!post && router && router.isFallback) && (
          <LoadBox />
        )}
        {(!post && !(router && router.isFallback)) && (
          <CContainer id="blog_08" className={styles.notFound}>
            <CText id="blog_09" text={{ textElementType: 'h3' }}>Post not found</CText>
          </CContainer>
        )}
        {post?.title && (
          <CContainer id="blog_04">
            <h1 className={styles.postTitle}>{post?.title}</h1>
          </CContainer>
        )}
        {post?.tags && (
          <CContainer className={postStyles.tagsBlock} id="blog_05">
            {post?.tags?.map(tag => {
              return (
                <Link href={`/tag/${tag.slug}`}
                  key={tag.id}
                  className={postStyles.tag}
                >{tag?.name}</Link>
              )
            })}
          </CContainer>
        )}
        {post && (
          <CContainer id="blog_06" className={styles.postInfo}>
            <PostInfo data={post} />
          </CContainer>
        )}
        {post?.content && (
          <CContainer id="blog_07">
            <div id="text-editor" dangerouslySetInnerHTML={{
              __html: post?.content
            }}></div>
          </CContainer>
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
  let post: TPost | undefined = undefined;

  if (slug && typeof slug === 'string') {
    try {
      post = await client?.getPostBySlug(slug);
    } catch (e) {
      console.error('BlogPostPage::getStaticProps', getGraphQLErrorInfo(e))
    }
  } else {
    console.error('BlogPostPage::getStaticProps: !pid')
  }

  if (!post) return {
    notFound: true,
  }

  return removeUndefined({
    props: {
      post
    }
  });

}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
}