import { EDBEntity } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import {
  getInitialValueOfTextEditorField,
  setValueOfTextEditorField,
} from '../../components/entity/entityEdit/helpers';
import { tagListPageInfo, tagPageInfo } from '../../constants/PageInfos';

export default function TagPage() {
  const client = getGraphQLClient();

  return (
    <EntityEdit
      entityCategory={EDBEntity.Tag}
      entityListRoute={tagListPageInfo.route}
      entityBaseRoute={tagPageInfo.baseRoute}
      listLabel="Tags"
      entityLabel="Tag"
      defaultPageName="tag"
      getById={client.getTagById}
      update={client.updateTag}
      create={client.createTag}
      deleteOne={client.deleteTag}
      fields={[
        {
          key: 'name',
          type: 'Simple text',
          label: 'Name',
          required: true,
          width: { sm: 6 },
        },
        {
          key: 'color',
          type: 'Color',
          label: 'Color',
          width: { sm: 6 },
        },
        {
          key: 'description',
          type: 'Text editor',
          label: 'Description',
          width: { sm: 6 },
          saveValue: setValueOfTextEditorField,
          getInitialValue: getInitialValueOfTextEditorField,
          customGraphQlFragment: `description \n descriptionDelta`,
        },
        {
          key: 'image',
          type: 'Image',
          label: 'Image',
          width: { sm: 6 },
        },
      ]}
    />
  );
}
