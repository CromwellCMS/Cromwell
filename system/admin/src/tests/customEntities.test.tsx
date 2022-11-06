import { TAdminCustomEntity } from '@cromwell/core';

jest.mock('@cromwell/core-frontend', () => {
  return {
    getGraphQLClient: () => ({}),
  };
});

import {
  getCustomEntities,
  getCustomEntityPages,
  getCustomEntitySidebarLinks,
  registerCustomEntity,
  unregisterCustomEntity,
} from '../helpers/customEntities';

const testData: TAdminCustomEntity = {
  entityType: '_test1_',
  listLabel: '_test2_',
};

describe('custom entities', () => {
  it('registers custom entity', () => {
    registerCustomEntity(testData);

    expect(getCustomEntities()[0].listLabel).toBe(testData.listLabel);
  });

  it('unregisters entity', () => {
    registerCustomEntity(testData);
    unregisterCustomEntity(testData.entityType);
    expect(getCustomEntities()[0]?.listLabel).toBeFalsy();
  });

  it('registers pages and sidebar link', () => {
    registerCustomEntity(testData);
    expect(getCustomEntityPages().length).toBe(2);
    expect(getCustomEntitySidebarLinks().length).toBe(1);
  });
});
