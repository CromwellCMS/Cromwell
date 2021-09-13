import { GraphQLPaths, TPagedParams, TUser, TCreateUser, TUpdateUser } from '@cromwell/core';
import { UserRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('User resolver', () => {
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;

    beforeAll(async () => {
        server = await setupResolver('user');
        crwClient = getGraphQLClient();
    });

    afterAll(async () => {
        await tearDownResolver(server);
    });

    it(`getUsers`, async () => {
        const path = GraphQLPaths.User.getMany;
        const res = await server.executeOperation({
            query: gql`
              query testGetUsers($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...UserFragment
                      }
                  }
              }
              ${crwClient?.UserFragment}
              ${crwClient?.PagedMetaFragment}
          `,
            variables: {
                pagedParams: {
                    pageNumber: 1,
                } as TPagedParams<TUser>
            }
        });
        const data = crwClient?.returnData(res, path);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.elements.length).toBeTruthy();
        expect(data.pagedMeta.pageSize).toBeTruthy();
    });

    const getUser = async (id: string): Promise<TUser> => {
        const path = GraphQLPaths.User.getOneById;
        const res = await server.executeOperation({
            query: gql`
            query testGetUserById($id: String!) {
                ${path}(id: $id) {
                    ...UserFragment
                }
            }
            ${crwClient?.UserFragment}
            `,
            variables: {
                id
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getUser`, async () => {
        const data = await getUser('1');
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
    });

    it(`updateUser`, async () => {
        const data1 = await getUser('1');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.User.update;

        const inputData: TUpdateUser = {
            fullName: '__test__',
            email: '__test__@mail.com',
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testUpdateUser($id: String!, $data: UpdateUser!) {
                  ${path}(id: $id, data: $data) {
                      ...UserFragment
                  }
              }
              ${crwClient?.UserFragment}
          `,
            variables: {
                id: '1',
                data: inputData,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        const data2 = await getUser('1');
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.email).toEqual(inputData.email);
    });


    it(`createUser`, async () => {
        const data1: TUser = await getUser('3');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.User.create;

        const inputData: TCreateUser = {
            fullName: '__test2__',
            email: '__test2__@mail.com',
            password: '__test2__',
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testCreateUser($data: CreateUser!) {
                  ${path}(data: $data) {
                      ...UserFragment
                  }
              }
              ${crwClient?.UserFragment}
          `,
            variables: {
                data: inputData,
            }
        });
        const success = crwClient?.returnData(res, path);
        expect(success).toBeTruthy();
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }

        const data2 = await getCustomRepository(UserRepository).findOne({
            where: {
                email: inputData.email
            }
        });
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }
        expect(data2).toBeTruthy();
        expect(data2?.id).toBeTruthy();
        expect(data2?.email).toEqual(inputData.email);
    });


    it(`deleteUser`, async () => {
        const data1 = await getUser('4');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        const path = GraphQLPaths.User.delete;

        const res = await server.executeOperation({
            query: gql`
                mutation testDeleteUser($id: String!) {
                    ${path}(id: $id)
                }
            `,
            variables: {
                id: '4',
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        expect(success === true).toBeTruthy();

        const data2 = await getUser('4');
        expect(!data2?.id).toBeTruthy();
    });
});