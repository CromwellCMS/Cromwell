import { GraphQLPaths, TPagedParams, TTag, TTagInput } from '@cromwell/core';
import { TagRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Tag resolver', () => {
  let server: ApolloServer;
  let crwClient: TCGraphQLClient | undefined;

  beforeAll(async () => {
    server = await setupResolver('tag');
    crwClient = getGraphQLClient();
  });

  const query: typeof server.executeOperation = async (...args) => {
    const res = await server.executeOperation(...args);
    if (res.errors) throw res.errors;
    return res;
  };

  it(`getTags`, async () => {
    const path = GraphQLPaths.Tag.getMany;
    const res = await query({
      query: gql`
              query testGetTags($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...TagFragment
                      }
                  }
              }
              ${crwClient?.TagFragment}
              ${crwClient?.PagedMetaFragment}
          `,
      variables: {
        pagedParams: {
          pageNumber: 1,
        } as TPagedParams<TTag>,
      },
    });
    const data = crwClient?.returnData(res, path);
    expect(data).toBeTruthy();
    expect(data.elements.length).toBeTruthy();
    expect(data.pagedMeta.pageSize).toBeTruthy();
  });

  const getTag = async (tagId: number): Promise<TTag> => {
    const path = GraphQLPaths.Tag.getOneById;
    const res = await query({
      query: gql`
            query testGetTagById($id: Int!) {
                ${path}(id: $id) {
                    ...TagFragment
                }
            }
            ${crwClient?.TagFragment}
            `,
      variables: {
        id: tagId,
      },
    });
    const data = crwClient?.returnData(res, path);
    return data;
  };

  it(`getTag`, async () => {
    const data = await getTag(1);
    expect(data).toBeTruthy();
    expect(data.id).toBeTruthy();
  });

  it(`updateTag`, async () => {
    const data1 = await getTag(1);
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();

    const path = GraphQLPaths.Tag.update;

    const inputData: TTagInput = {
      name: '__test__',
    };

    const res = await query({
      query: gql`
              mutation testUpdateTag($id: Int!, $data: TagInput!) {
                  ${path}(id: $id, data: $data) {
                      ...TagFragment
                  }
              }
              ${crwClient?.TagFragment}
          `,
      variables: {
        id: 1,
        data: inputData,
      },
    });
    const success = crwClient?.returnData(res, path);
    expect(success).toBeTruthy();

    const data2 = await getTag(1);
    expect(data2).toBeTruthy();
    expect(data2.id).toBeTruthy();
    expect(data2.name).toEqual(inputData.name);
  });

  it(`createTag`, async () => {
    const data1: TTag = await getTag(3);
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();

    const path = GraphQLPaths.Tag.create;

    const inputData: TTagInput = {
      name: '__test2__',
    };

    const res = await query({
      query: gql`
              mutation testCreateTag($data: TagInput!) {
                  ${path}(data: $data) {
                      ...TagFragment
                  }
              }
              ${crwClient?.TagFragment}
          `,
      variables: {
        data: inputData,
      },
    });
    const success = crwClient?.returnData(res, path);
    expect(success).toBeTruthy();

    const data2 = await getCustomRepository(TagRepository).findOne({
      where: {
        name: inputData.name,
      },
    });
    expect(data2).toBeTruthy();
    expect(data2?.id).toBeTruthy();
    expect(data2?.name).toEqual(inputData.name);
  });

  it(`deleteTag`, async () => {
    const data1 = await getTag(4);
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();
    const path = GraphQLPaths.Tag.delete;

    const res = await query({
      query: gql`
                mutation testDeleteTag($id: Int!) {
                    ${path}(id: $id)
                }
          `,
      variables: {
        id: 4,
      },
    });
    const success = crwClient?.returnData(res, path);
    expect(success === true).toBeTruthy();

    const data2 = await getTag(4).catch(() => null);

    expect(!data2?.id).toBeTruthy();
  });

  afterAll(async () => {
    await tearDownResolver(server);
  });
});
