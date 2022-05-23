import { EDBEntity, TAttributeValue, TAttribute } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import { attributeListPageInfo, attributePageInfo } from '../../constants/PageInfos';
import { AttributeValues } from './components/AttributeValues';

const AttributePage = () => {
  const client = getGraphQLClient();
  return <EntityEdit
    entityCategory={EDBEntity.Attribute}
    entityListRoute={attributeListPageInfo.route}
    entityBaseRoute={attributePageInfo.baseRoute}
    listLabel="Attributes"
    entityLabel="Attribute"
    getById={client.getAttributeById}
    update={client.updateAttribute}
    create={client.createAttribute}
    deleteOne={client.deleteAttribute}
    fields={[
      {
        key: 'key',
        type: 'Simple text',
        label: 'Key',
        required: true,
      },
      {
        key: 'title',
        type: 'Simple text',
        label: 'Title',
      },
      {
        key: 'icon',
        type: 'Image',
        label: 'Icon',
      },
      {
        key: 'values',
        type: 'custom',
        component: ({ value, onChange }) => <AttributeValues values={value} changeValues={onChange} />,
        customGraphQlFragment: `values {
            value
            icon
          }`,
        saveValue: (values: TAttributeValue[]): TAttributeValue[] => {
          const valuesObj: Record<string, TAttributeValue> = {};
          values?.forEach(value => {
            if (!valuesObj[value.value]) valuesObj[value.value] = {
              value: value.value,
              title: value.title,
              icon: value.icon,
            }
          });
          return Object.values(valuesObj);
        },
      },
      {
        key: 'required',
        type: 'Checkbox',
        tooltip: 'A customer will be required to pick a value of this attribute to add a product to the cart',
        label: 'Required to pick',
      },
      {
        key: 'type',
        type: 'custom',
        saveValue: (): TAttribute['type'] => 'radio',
      }
    ]}
  />
}

export default AttributePage;