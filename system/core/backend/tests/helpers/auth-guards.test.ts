jest.doMock('typeorm', () => {
  const originalModule = jest.requireActual('typeorm');
  return {
    getCustomRepository: () => ({
      getAll: async () => [],
    }),
  };
});

jest.doMock('../../src/repositories/role.repository', () => {
  return {
    RoleRepository: null,
  };
});

import { TAuthUserInfo } from '../../src/helpers/types';
import { graphQlAuthChecker } from '../../src/helpers/auth-guards';

describe('auth-guards', () => {
  it('allows for administrators', async () => {
    expect(
      await graphQlAuthChecker(
        {
          context: {
            user: {
              id: 1,
              roles: [{ name: 'administrator', permissions: ['all'] }],
              email: 'test',
            } as TAuthUserInfo,
          },
        },
        ['all'],
      ),
    ).toBeTruthy();
  });

  it('allows for administrators access other permissions', async () => {
    expect(
      await graphQlAuthChecker(
        {
          context: {
            user: {
              id: 1,
              roles: [{ name: 'administrator', permissions: ['all'] }],
              email: 'test',
            } as TAuthUserInfo,
          },
        },
        ['update_cms'],
      ),
    ).toBeTruthy();
  });

  it('not enough permissions', async () => {
    const test = async () => {
      await graphQlAuthChecker(
        {
          context: {
            user: {
              id: 1,
              roles: [{ name: 'author', permissions: ['update_post'] }],
              email: 'test',
            } as TAuthUserInfo,
          },
        },
        ['create_post'],
      );
    };
    expect(await test().catch(() => null)).toBeFalsy();
  });

  it('unauthorized access', async () => {
    const test = async () => {
      await graphQlAuthChecker(null, ['update_cms_settings']);
    };
    expect(await test().catch(() => null)).toBeFalsy();
  });

  it('no auth access no auth', async () => {
    expect(await graphQlAuthChecker(null, null)).toBeTruthy();
  });
});
