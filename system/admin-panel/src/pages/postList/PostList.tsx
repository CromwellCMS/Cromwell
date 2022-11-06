import { EDBEntity, TPostFilter, TTag, TUser } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import LoadBox from '../../components/loadBox/LoadBox';
import { postListInfo, postPageInfo } from '../../constants/PageInfos';
import { baseEntityColumns } from '../../helpers/customEntities';
import { formatTimeAgo } from '../../helpers/time';

export default function PostTable() {
  const client = getGraphQLClient();
  const [users, setUsers] = useState<TUser[] | null>(null);
  const [tags, setTags] = useState<TTag[] | null>(null);

  const ellipsisStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const getUsers = async () => {
    const authors = await client
      .getUsers({
        pagedParams: {
          pageSize: 10000,
        },
        filterParams: {
          permissions: ['create_post', 'update_post', 'all'],
        },
      })
      .catch((err) => {
        console.error(err);
        return undefined;
      });
    setUsers(authors?.elements ?? []);
  };

  const getPostTags = async () => {
    const data = (
      await client?.getTags({ pagedParams: { pageSize: 10000 } }).catch((err) => {
        console.error(err);
        return undefined;
      })
    )?.elements as TTag[];
    setTags(data?.sort((a, b) => (a.name < b.name ? -1 : 1)) ?? []);
  };

  useEffect(() => {
    getUsers();
    getPostTags();
  }, []);

  if (!users || !tags) return <LoadBox />;

  return (
    <EntityTable
      entityCategory={EDBEntity.Post}
      entityListRoute={postListInfo.route}
      entityBaseRoute={postPageInfo.baseRoute}
      listLabel="Posts"
      entityLabel="Post"
      nameProperty="title"
      getMany={client.getPosts}
      deleteOne={client.deletePost}
      deleteMany={client.deleteManyPosts}
      columns={[
        {
          name: 'mainImage',
          label: 'Image',
          type: 'Image',
          visible: true,
        },
        {
          name: 'title',
          label: 'Title',
          type: 'Simple text',
          visible: true,
          minWidth: '25%',
          width: '25%',
        },
        {
          name: 'author',
          label: 'Author',
          type: 'Simple text',
          visible: true,
          customGraphQlFragment: 'author {\n id\n fullName\n }\n',
          getValueView: (value: TUser) => <p style={ellipsisStyle}>{value?.fullName}</p>,
          searchOptions:
            users?.map((user) => ({
              value: user.id,
              label: user.fullName,
            })) ?? [],
          applyFilter: (value: number, filter: any) => {
            (filter as TPostFilter).authorId = value;
            return filter;
          },
        },
        {
          name: 'published',
          label: 'Status',
          type: 'Simple text',
          visible: true,
          exactSearch: true,
          searchOptions: [
            {
              label: 'Published',
              value: true,
            },
            {
              label: 'Draft',
              value: false,
            },
          ],
          getValueView: (value: boolean) => <p style={ellipsisStyle}>{value ? 'Published' : 'Draft'}</p>,
        },
        {
          name: 'publishDate',
          label: 'Published at',
          type: 'Datetime',
          visible: true,
          getValueView: (value) => formatTimeAgo(value),
        },
        {
          name: 'tags',
          label: 'Tags',
          type: 'Simple text',
          visible: true,
          disableSort: true,
          customGraphQlFragment: 'tags {\n id\n name\n }\n',
          getValueView: (tags: TTag[]) => {
            const text = tags?.map((tag) => tag.name)?.join(', ') ?? '';
            return (
              <Tooltip title={text}>
                <p style={ellipsisStyle}>{text}</p>
              </Tooltip>
            );
          },
          multipleOptions: true,
          searchOptions:
            tags?.map((tag) => ({
              value: tag.id,
              label: tag.name,
            })) ?? [],
          applyFilter: (value: string | number, filter: any) => {
            let ids = [];
            if (typeof value === 'string') {
              try {
                ids = JSON.parse(value);
              } catch (error) {
                console.error(error);
              }
            }
            if (typeof value === 'number') {
              ids.push(value);
            }
            (filter as TPostFilter).tagIds = ids;
            return filter;
          },
        },
        ...baseEntityColumns.map((col) => {
          if (col.name === 'createDate') return { ...col, visible: true };
          return { ...col, visible: false };
        }),
      ]}
    />
  );
}
