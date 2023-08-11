import { registerDataFilter, TBackendModule } from '@cromwell/core-backend';

import { SettingsType } from '../types';
import PluginMarqoController from './controllers/plugin-marqo.controller';
import { marqoClient } from './marqo-client';
import PluginMarqoResolver from './resolvers/plugin-marqo.resolver';

const backendModule: TBackendModule = {
  controllers: [PluginMarqoController],
  resolvers: [PluginMarqoResolver],
};

export default backendModule;

registerDataFilter({
  id: '@cromwell/plugin-marqo__create-product',
  entity: 'Product',
  action: 'createOutput',
  filter: ({ data, input }) => {
    marqoClient.upsertProducts([{ ...data, customMeta: Object.assign({}, input.customMeta, data.customMeta) }]);
  },
});

registerDataFilter({
  id: '@cromwell/plugin-marqo__update-product',
  entity: 'Product',
  action: 'updateOutput',
  filter: ({ data, input }) => {
    marqoClient.upsertProducts([{ ...data, customMeta: Object.assign({}, input.customMeta, data.customMeta) }]);
  },
});

registerDataFilter({
  id: '@cromwell/plugin-marqo__delete-product',
  entity: 'Product',
  action: 'deleteOutput',
  filter: ({ id }) => {
    marqoClient.deleteProducts([id]);
  },
});

registerDataFilter({
  id: '@cromwell/plugin-marqo__delete-many-products',
  entity: 'Product',
  action: 'deleteManyOutput',
  filter: ({ input }) => {
    if (input.all) {
      marqoClient.syncAllProducts();
    } else {
      marqoClient.deleteProducts(input.ids);
    }
  },
});

registerDataFilter({
  id: '@cromwell/plugin-marqo__plugin-any',
  entity: 'PluginSettings',
  action: 'updateOutput',
  filter: async (args) => {
    if ((args.id as any) !== '@cromwell/plugin-marqo') return;
    const indexName = (args.data as SettingsType)?.index_name;
    if (!indexName) return args;

    // Create index if does not exist
    await marqoClient.ensureIndex(indexName);

    return args;
  },
});
