import { TAuthUserInfo } from '@cromwell/core-backend';
import { graphQlAuthChecker } from '../../src/helpers/auth-guards';


describe('auth-guards', () => {

    it('allows for administrators', async () => {
        expect(graphQlAuthChecker({
            context: {
                user: {
                    id: 1,
                    roles: [{ name: 'administrator', permissions: ['all'] }],
                    email: 'test',
                } as TAuthUserInfo
            }
        }, ['all'])).toBeTruthy();
    })

    it('allows for administrators access other permissions', async () => {
        expect(graphQlAuthChecker({
            context: {
                user: {
                    id: 1,
                    roles: [{ name: 'administrator', permissions: ['all'] }],
                    email: 'test',
                } as TAuthUserInfo
            }
        }, ['update_cms'])).toBeTruthy();
    });

    it('not enough permissions', async () => {
        const test = () => {
            graphQlAuthChecker({
                context: {
                    user: {
                        id: 1,
                        roles: [{ name: 'author', permissions: ['update_post'] }],
                        email: 'test',
                    } as TAuthUserInfo
                }
            }, ['create_post'])
        };
        expect(test).toThrow();
    })


    it('unauthorized access', async () => {
        const test = () => {
            graphQlAuthChecker(null, ['update_cms_settings'])
        }
        expect(test).toThrow();
    })

    it('no auth access no auth', async () => {
        expect(graphQlAuthChecker(null, null)).toBeTruthy();
    })

})