import { EDBEntity } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { tagListPageInfo, tagPageInfo } from '../../constants/PageInfos';
import { baseEntityColumns } from '../../helpers/customEntities';


export default function TagTable() {
  const client = getGraphQLClient();

  return (
    <EntityTable
      entityCategory={EDBEntity.Tag}
      entityListRoute={tagListPageInfo.route}
      entityBaseRoute={tagPageInfo.baseRoute}
      listLabel="Tags"
      entityLabel="Tag"
      nameProperty="name"
      getMany={client.getTags}
      deleteOne={client.deleteTag}
      deleteMany={client.deleteManyTags}
      columns={[
        {
          name: 'image',
          label: 'Image',
          type: 'Image',
          visible: true,
        },
        {
          name: 'name',
          label: 'Name',
          type: 'Simple text',
          visible: true,
        },
        {
          name: 'color',
          label: 'Color',
          type: 'Color',
          visible: true,
        },
        ...baseEntityColumns.map(col => {
          if (col.name === 'createDate') return { ...col, visible: true }
          return { ...col, visible: false }
        }),
      ]}
    />
  )
}