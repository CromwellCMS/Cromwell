import { EDBEntity, TAttribute, TAttributeValue, TBaseFilter } from '@cromwell/core';
import { getGraphQLClient, useForceUpdate } from '@cromwell/core-frontend';
import React from 'react';

import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import { attributeListPageInfo, attributePageInfo } from '../../constants/PageInfos';
import { AttributeValues } from './components/AttributeValues';

export default function AttributePage() {
  const client = getGraphQLClient();

  const typeInitialValueRef = React.useRef<string | undefined>();
  const valuesVisibleRef = React.useRef<boolean>(true);
  const forceUpdate = useForceUpdate();

  return (
    <EntityEdit<TAttribute, TBaseFilter>
      entityCategory={EDBEntity.Attribute}
      entityListRoute={attributeListPageInfo.route}
      entityBaseRoute={attributePageInfo.baseRoute}
      listLabel="Attributes"
      entityLabel="Attribute"
      getById={client.getAttributeById}
      update={client.updateAttribute}
      create={client.createAttribute}
      deleteOne={client.deleteAttribute}
      onSave={async (data) => {
        if (data.type === 'text_input') {
          data.values = [
            {
              value: 'text_input',
            },
          ];
        }
        return data;
      }}
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
          key: 'type',
          type: 'Select',
          label: 'Attribute type',
          width: { sm: 6 },
          options: [
            {
              value: 'radio',
              label: 'Radio',
            },
            {
              value: 'checkbox',
              label: 'Checkbox',
            },
            {
              value: 'text_input',
              label: 'Text input',
            },
          ],
          getInitialValue: (value) => {
            if (typeInitialValueRef.current) return value || 'radio';
            typeInitialValueRef.current = value || 'radio';
            if (value === 'text_input') valuesVisibleRef.current = false;
            else valuesVisibleRef.current = true;

            forceUpdate();
            return value || 'radio';
          },
          onChange: (value) => {
            if (value === 'text_input') valuesVisibleRef.current = false;
            else valuesVisibleRef.current = true;
            forceUpdate();
            return value;
          },
          saveValue: (value): Record<'type', TAttribute['type']> => {
            return { type: value || 'radio' };
          },
        },
        {
          key: 'values',
          type: 'custom',
          component: ({ value, onChange }) => {
            if (!valuesVisibleRef.current) return <></>;
            return <AttributeValues values={value} changeValues={onChange} />;
          },
          customGraphQlProperty: {
            values: {
              value: true,
              icon: true,
            },
          },
          saveValue: (values: TAttributeValue[]): Record<'values', TAttributeValue[]> => {
            const valuesObj: Record<string, TAttributeValue> = {};
            values?.forEach((value) => {
              if (!valuesObj[value.value])
                valuesObj[value.value] = {
                  value: value.value,
                  title: value.title,
                  icon: value.icon,
                };
            });
            return {
              values: Object.values(valuesObj),
            };
          },
        },
        {
          key: 'required',
          type: 'Checkbox',
          tooltip: 'A customer will be required to pick a value of this attribute to add a product to the cart',
          label: 'Required to fill',
          saveValue: (value) => ({ required: !!value }),
        },
      ]}
    />
  );
}
