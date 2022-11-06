import { gql } from '@apollo/client';
import { EDBEntity } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React, { useContext } from 'react';

import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import { postListInfo, postPageInfo } from '../../constants/PageInfos';
import { getCustomMetaKeysFor } from '../../helpers/customFields';
import { HeaderActions } from './components/HeaderActions';
import { PageContent } from './components/PageContent';
import { PostContext, PostContextProvider } from './contexts/PostContext';

export default function PostPage() {
  return (
    <PostContextProvider>
      <PostEdit />
    </PostContextProvider>
  );
}

function PostEdit() {
  const client = getGraphQLClient();
  const context = useContext(PostContext);

  return (
    <EntityEdit
      entityCategory={EDBEntity.Post}
      entityListRoute={postListInfo.route}
      entityBaseRoute={postPageInfo.baseRoute}
      listLabel="Posts"
      entityLabel=""
      disableMeta
      onSave={() => {
        context.hasChangesRef.current = false;
        return context.getInput();
      }}
      getById={async (id) => {
        return client.getPostById(
          id,
          gql`
          fragment AdminPanelPostFragment on Post {
            id
            slug
            pageTitle
            pageDescription
            meta {
              keywords
            }
            createDate
            updateDate
            isEnabled
            title
            author {
              id
              fullName
              email
              avatar
            }
            mainImage
            publishDate
            featured
            tags {
              id
              slug
              name
              color
            }
            content
            delta
            published 
            customMeta (keys: ${JSON.stringify(getCustomMetaKeysFor(EDBEntity.Post))})
          }`,
          'AdminPanelPostFragment',
        );
      }}
      update={client.updatePost}
      create={client.createPost}
      deleteOne={client.deletePost}
      customElements={{
        getEntityFields: (props) => <PageContent {...props} />,
        getEntityHeaderCenter: (props) => <HeaderActions {...props} />,
      }}
    />
  );
}
