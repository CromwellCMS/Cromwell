import { PluginEntity } from '../../src/entities/Plugin';
import { createGenericEntity } from '../../src/helpers/createGenericEntity';

describe('createGenericEntity', () => {

    it('creates GenericEntity', async () => {
        const entity = createGenericEntity('plugin', PluginEntity);

        expect(entity.abstractResolver).toBeTruthy();
        expect(entity.repository).toBeTruthy();
        expect(entity.pagedEntity).toBeTruthy();
    });
})