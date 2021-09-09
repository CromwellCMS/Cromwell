import { validateEmail } from '../../src/helpers/validation';

describe('validation', () => {

    it('validateEmail', async () => {
        expect(validateEmail('test1')).toBeFalsy();
        expect(validateEmail('test1@test.test')).toBeTruthy();
    });
});


