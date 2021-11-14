import { EDBEntity, TBaseFilter, TTag } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../../components/entity/types';
import { tagListPageInfo, tagPageInfo } from '../../constants/PageInfos';
import { baseEntityColumns } from '../../helpers/customEntities';

const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TTag, TBaseFilter>>;

export default function TagTable() {
    const client = getGraphQLClient();

    return (
        <EntityTableComp
            entityCategory={EDBEntity.Tag}
            entityListRoute={tagListPageInfo.route}
            entityBaseRoute={tagPageInfo.baseRoute}
            listLabel="Tags"
            entityLabel="Tag"
            nameProperty="name"
            getManyFiltered={client.getFilteredTags}
            deleteOne={client.deleteTag}
            deleteMany={client.deleteManyTags}
            deleteManyFiltered={client.deleteManyFilteredTags}
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