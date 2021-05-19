import { graphQlAuthChecker, TAuthUserInfo } from '../../src/helpers/auth-guards';


describe('auth-guards', () => {

    it('verifies permissions', async () => {

        expect(graphQlAuthChecker({
            context: {
                user: {
                    id: '1',
                    role: 'administrator',
                    email: 'test',
                } as TAuthUserInfo
            }
        }, ['administrator'])).toBeTruthy();

        expect(graphQlAuthChecker({
            context: {
                user: {
                    id: '1',
                    role: 'administrator',
                    email: 'test',
                } as TAuthUserInfo
            }
        }, ['author'])).toBeTruthy();

        expect(graphQlAuthChecker({
            context: {
                user: {
                    id: '1',
                    role: 'author',
                    email: 'test',
                } as TAuthUserInfo
            }
        }, ['administrator'])).toBeFalsy();

        expect(graphQlAuthChecker({
            context: {
                user: {
                    id: '1',
                    role: 'customer',
                    email: 'test',
                } as TAuthUserInfo
            }
        }, ['administrator'])).toBeFalsy();


        expect(graphQlAuthChecker(null, ['customer'])).toBeFalsy();

        expect(graphQlAuthChecker(null, null)).toBeTruthy();
    })
})