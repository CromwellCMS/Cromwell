import {
  getBlockInstance,
  removeUndefined,
  TGetStaticProps,
  TPagedList,
  TPagedParams,
  TPost,
  TPostFilter,
  TTag,
} from '@cromwell/core';
import {
  CContainer,
  CList,
  EntityHead,
  getGraphQLClient,
  getGraphQLErrorInfo,
  LoadBox,
  TCList,
} from '@cromwell/core-frontend';
import { MuiPagination } from '@cromwell/toolkit-commerce';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';

import Layout from '../../components/layout/Layout';
import layoutStyles from '../../components/layout/Layout.module.scss';
import { PostCard } from '../../components/postCard/PostCard';
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
  const { tag } = props;
  const filterInput = useRef<TPostFilter>({});
  const listId = 'Blog_list_01';
  const publishSort = useRef<"ASC" | "DESC">('DESC');
  const router = useRouter?.();

  const resetList = () => {
    const list = getBlockInstance<TCList>(listId)?.getContentInstance();
    list?.clearState();
    list?.updateData();
  }

  const handleGetPosts = async (params: TPagedParams<TPost>): Promise<TPagedList<TPost> | undefined> => {
    params.orderBy = 'publishDate';
    params.order = publishSort.current;
    if (props?.tag?.id) {
      filterInput.current.tagIds = [props.tag.id];
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
    <CContainer className={commonStyles.content} id="tag-1">
      <EntityHead
        entity={tag}
        useFallback
      />
      <CContainer className={styles.filter} id="tag-2">
        <div>
          <h1 className={styles.title}>{props.tag?.name ?? ''}</h1>
        </div>
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
      <CContainer style={{ marginBottom: '20px' }} id="tag-3">
        {(router?.isFallback) ? (
          <LoadBox />
        ) : (
          <>
            <CContainer id="tag_04">
              <CList<TPost>
                id={listId}
                ListItem={(props) => (
                  <div className={styles.postWrapper}>
                    <PostCard post={props.data} key={props.data?.id} />
                  </div>
                )}
                editorHidden
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
                  pagination: MuiPagination
                }}
              />
            </CContainer>
            <CContainer id="tag_05">
              {props.tag?.description && (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: props.tag.description }}
                ></div>
              )}
            </CContainer>
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

export const getStaticProps: TGetStaticProps<TagPageProps> = async (context) => {
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
      notFound: true,
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
    props: removeUndefined({
      posts,
      tag,
    })
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
