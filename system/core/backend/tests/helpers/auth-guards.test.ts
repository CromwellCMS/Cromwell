import { graphQlAuthChecker, TAuthUserInfo } from '../../src/helpers/auth-guards';


describe('auth-guards', () => {

    it('allows for administrators', async () => {
        expect(graphQlAuthChecker({
            context: {
                user: {
                    id: 1,
                    role: 'administrator',
                    email: 'test',
                } as TAuthUserInfo
            }
        }, ['administrator'])).toBeTruthy();
    })

    it('allows for administrators access other roles', async () => {
        expect(graphQlAuthChecker({
            context: {
                user: {
                    id: 1,
                    role: 'administrator',
                    email: 'test',
                } as TAuthUserInfo
            }
        }, ['author'])).toBeTruthy();
    });

    it('forbids author to access admin', async () => {
        const test = () => {
            graphQlAuthChecker({
                context: {
                    user: {
                        id: 1,
                        role: 'author',
                        email: 'test',
                    } as TAuthUserInfo
                }
            }, ['administrator'])
        };
        expect(test).toThrow();
    })

    it('forbids customer to access admin', async () => {
        const test = () => {
            graphQlAuthChecker({
                context: {
                    user: {
                        id: 1,
                        role: 'customer',
                        email: 'test',
                    } as TAuthUserInfo
                }
            }, ['administrator'])
        }
        expect(test).toThrow();
    })

    it('unauthorized access customer', async () => {
        const test = () => {
            graphQlAuthChecker(null, ['customer'])
        }
        expect(test).toThrow();
    })

    it('no auth access no auth', async () => {
        expect(graphQlAuthChecker(null, null)).toBeTruthy();
    })

})