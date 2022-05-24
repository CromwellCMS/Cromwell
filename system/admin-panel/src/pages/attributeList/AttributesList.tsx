import { EDBEntity, TAttribute, TBaseFilter, TAttributeValue } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../../components/entity/types';
import { attributeListPageInfo, attributePageInfo } from '../../constants/PageInfos';
import { baseEntityColumns } from '../../helpers/customEntities';

type TAttributeItem = TAttribute & { id: number };
const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TAttributeItem, TBaseFilter>>;

export default function AttributesList() {
    const client = getGraphQLClient();
    return (
        <EntityTableComp
            entityCategory={EDBEntity.Attribute}
            entityListRoute={attributeListPageInfo.route}
            entityBaseRoute={attributePageInfo.baseRoute}
            listLabel="Attributes"
            entityLabel="Attribute"
            getMany={client.getAttributes}
            deleteOne={client.deleteAttribute}
            deleteMany={client.deleteManyAttributes}
            columns={[
                {
                    name: 'key',
                    label: 'Key',
                    type: 'Simple text',
                    visible: true,
                },
                {
                    name: 'title',
                    label: 'Title',
                    type: 'Simple text',
                    visible: true,
                },
                {
                    name: 'values',
                    label: 'Values',
                    type: 'Simple text',
                    visible: true,
                    disableSearch: true,
                    disableSort: true,
                    customGraphQlFragment: 'values {\n id\n value\n title\n }\n',
                    getValueView: (value: TAttributeValue[]) => value?.map(r => r.title ?? r.value).join(', '),
                    getTooltipValueView: (value: any) => value?.map(r => r.title ?? r.value).join(', '),
                },
                {
                    name: 'icon',
                    label: 'Icon',
                    type: 'Image',
                    visible: true,
                },
                {
                    name: 'required',
                    label: 'Required',
                    type: 'Checkbox',
                    searchOptions: [{
                        label: 'Required',
                        value: true,
                    }, {
                        label: 'Optional',
                        value: false,
                    }],
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