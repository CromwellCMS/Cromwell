import { GraphQLPaths, TPagedParams, TRole, TRoleInput } from '@cromwell/core';
import { RoleRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Role resolver', () => {
  let server: ApolloServer;
  let crwClient: TCGraphQLClient | undefined;

  beforeAll(async () => {
    server = await setupResolver('role');
    crwClient = getGraphQLClient();
  });

  const query: typeof server.executeOperation = async (...args) => {
    const res = await server.executeOperation(...args);
    if (res.errors) throw res.errors;
    return res;
  };

  it(`getRoles`, async () => {
    const path = GraphQLPaths.Role.getMany;
    const res = await query({
      query: gql`
              query testGetRoles($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...RoleFragment
                      }
                  }
              }
              ${crwClient?.RoleFragment}
              ${crwClient?.PagedMetaFragment}
          `,
      variables: {
        pagedParams: {
          pageNumber: 1,
        } as TPagedParams<TRole>,
      },
    });
    const data = crwClient?.returnData(res, path);
    expect(data).toBeTruthy();
    expect(data.elements.length).toBeTruthy();
    expect(data.pagedMeta.pageSize).toBeTruthy();
  });

  const getRole = async (roleId: number): Promise<TRole> => {
    const path = GraphQLPaths.Role.getOneById;
    const res = await query({
      query: gql`
            query testGetRoleById($id: Int!) {
                ${path}(id: $id) {
                    ...RoleFragment
                }
            }
            ${crwClient?.RoleFragment}
            `,
      variables: {
        id: roleId,
      },
    });
    const data = crwClient?.returnData(res, path);
    return data;
  };

  it(`getRole`, async () => {
    const data = await getRole(1);
    expect(data).toBeTruthy();
    expect(data.id).toBeTruthy();
  });

  it(`updateRole`, async () => {
    const data1 = await getRole(1);
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();

    const path = GraphQLPaths.Role.update;

    const inputData: TRoleInput = {
      name: '__test__',
      permissions: ['all'],
    };

    const res = await query({
      query: gql`
              mutation testUpdateRole($id: Int!, $data: RoleInput!) {
                  ${path}(id: $id, data: $data) {
                      ...RoleFragment
                  }
              }
              ${crwClient?.RoleFragment}
          `,
      variables: {
        id: 1,
        data: inputData,
      },
    });
    const success = crwClient?.returnData(res, path);
    expect(success).toBeTruthy();

    const data2 = await getRole(1);
    expect(data2).toBeTruthy();
    expect(data2.id).toBeTruthy();
    expect(data2.name).toEqual(inputData.name);
  });

  it(`createRole`, async () => {
    const data1: TRole = await getRole(3);
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();

    const path = GraphQLPaths.Role.create;

    const inputData: TRoleInput = {
      name: '__test2__',
      permissions: ['all'],
    };

    const res = await query({
      query: gql`
              mutation testCreateRole($data: RoleInput!) {
                  ${path}(data: $data) {
                      ...RoleFragment
                  }
              }
              ${crwClient?.RoleFragment}
          `,
      variables: {
        data: inputData,
      },
    });
    const success = crwClient?.returnData(res, path);
    expect(success).toBeTruthy();

    const data2 = await getCustomRepository(RoleRepository).findOne({
      where: {
        name: inputData.name,
      },
    });
    expect(data2).toBeTruthy();
    expect(data2?.id).toBeTruthy();
    expect(data2?.name).toEqual(inputData.name);
  });

  it(`deleteRole`, async () => {
    const data1 = await getRole(4);
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();
    const path = GraphQLPaths.Role.delete;

    const res = await query({
      query: gql`
                mutation testDeleteRole($id: Int!) {
                    ${path}(id: $id)
                }
          `,
      variables: {
        id: 4,
      },
    });
    const success = crwClient?.returnData(res, path);
    expect(success === true).toBeTruthy();

    const data2 = await getRole(4).catch(() => null);

    expect(!data2?.id).toBeTruthy();
  });

  afterAll(async () => {
    await tearDownResolver(server);
  });
});
