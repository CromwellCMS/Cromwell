import { PluginEntity } from '../../src/models/entities/plugin.entity';
import { createGenericEntity } from '../../src/helpers/create-generic-entity';

describe('createGenericEntity', () => {
  it('creates GenericEntity', async () => {
    const entity = createGenericEntity('plugin', PluginEntity);

    expect(entity.abstractResolver).toBeTruthy();
    expect(entity.repository).toBeTruthy();
    expect(entity.pagedEntity).toBeTruthy();
  });
});
