import { EDBEntity } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  getCustomFieldsFor,
  getCustomMetaFor,
  getCustomMetaKeysFor,
  registerCustomField,
  registerSimpleTextCustomField,
  RenderCustomFields,
  TRegisteredCustomField,
  unregisterCustomField,
} from '../helpers/customFields';

const testField: TRegisteredCustomField = {
  component: () => <>test_view</>,
  saveData: () => 'savedData',
  entityType: EDBEntity.CustomEntity,
  fieldType: 'Simple text',
  key: '_test_',
  id: '111',
};

describe('custom fields', () => {
  it('registers a field', () => {
    registerCustomField(testField);

    expect(getCustomFieldsFor(EDBEntity.CustomEntity)[0].key).toBe(testField.key);
  });

  it('unregisters a field', () => {
    registerCustomField(testField);
    unregisterCustomField(testField.entityType, testField.key);
    expect(getCustomFieldsFor(EDBEntity.CustomEntity)[0]?.key).toBeFalsy();
  });

  it('renders field', async () => {
    registerCustomField(testField);

    render(
      <>
        <RenderCustomFields entityData={{ id: 1 }} entityType={EDBEntity.CustomEntity} refetchMeta={() => null} />
      </>,
    );

    await screen.findByText('test_view');
  });

  it('gathers meta', async () => {
    registerCustomField(testField);

    expect((await getCustomMetaFor(EDBEntity.CustomEntity))[testField.key]).toBe(testField.saveData());
  });

  it('gathers keys', async () => {
    registerCustomField(testField);

    expect(getCustomMetaKeysFor(EDBEntity.CustomEntity).includes(testField.key)).toBeTruthy();
  });

  it('renders text meta field', async () => {
    registerSimpleTextCustomField({
      ...testField,
    });

    render(
      <>
        <RenderCustomFields
          entityData={{ id: 1, customMeta: { [testField.key]: '_test_' } }}
          entityType={EDBEntity.CustomEntity}
          refetchMeta={() => null}
        />
      </>,
    );

    await screen.findByDisplayValue('_test_');
  });
});
