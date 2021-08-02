import { registerAction, fireAction } from '../../src/helpers/actions';

describe('actions', () => {

    it('registers and executes custom action', async () => {
        const testValue = 12345;

        registerAction<any>({
            actionName: 'custom_action',
            pluginName: 'test_plugin',
            action: async () => {
                return testValue;
            }
        });

        const result = await fireAction({ actionName: 'custom_action' });

        expect(result['test_plugin']).toEqual(testValue);
    });
})