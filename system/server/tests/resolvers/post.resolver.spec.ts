import { GraphQLPaths, TPagedParams, TPost, TPostInput } from '@cromwell/core';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient } from 'apollo-server-testing';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Post resolver', () => {
    let server: ApolloServer;
    let client: ApolloServerTestClient;
    let crwClient: TCGraphQLClient | undefined;


    beforeAll(async () => {
        [server, client] = await setupResolver('post');
        crwClient = getGraphQLClient();
    });

    it(`getPosts`, async () => {
        const path = GraphQLPaths.Post.getMany;
        const res = await client.query({
            query: gql`
              query testGetPosts($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...PostFragment
                      }
                  }
              }
              ${crwClient?.PostFragment}
              ${crwClient?.PagedMetaFragment}
          `,
            variables: {
                pagedParams: {
                    pageNumber: 1,
                    pageSize: 10
                } as TPagedParams<TPost>
            }
        });
        const data = crwClient?.returnData(res, path);

        expect(data).toBeTruthy();
        expect(data.elements.length === 10).toBeTruthy();
        expect(data.pagedMeta.pageSize === 10).toBeTruthy();
    });

    const getPostById = async (postId: string) => {
        const path = GraphQLPaths.Post.getOneById;
        const res = await client.query({
            query: gql`
            query testGetPostById($postId: String!) {
                ${path}(id: $postId) {
                    ...PostFragment
                }
            }
            ${crwClient?.PostFragment}
            `,
            variables: {
                postId
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getPostById`, async () => {
        const data = await getPostById('1');

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
        expect(data.slug).toBeTruthy();
    });

    const getPostBySlug = async (slug: string) => {
        const path = GraphQLPaths.Post.getOneBySlug;
        const res = await client.query({
            query: gql`
            query testGetPostBySlug($slug: String!) {
                ${path}(slug: $slug) {
                    ...PostFragment
                }
            }
            ${crwClient?.PostFragment}
            `,
            variables: {
                slug
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getPostBySlug`, async () => {
        const data = await getPostBySlug('1');

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
        expect(data.slug).toBeTruthy();
    });

    it(`updatePost`, async () => {
        const data1: TPost = await getPostById('10');
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();
        expect(data1?.author?.id).toBeTruthy();

        if (!data1?.author?.id) return;
        const path = GraphQLPaths.Post.update;

        const updatePost: TPostInput = {
            slug: '__test__',
            pageTitle: data1.pageTitle,
            title: data1.title,
            mainImage: data1.mainImage,
            published: data1.published,
            isEnabled: data1.isEnabled,
            authorId: data1?.author?.id,
            delta: data1?.delta,
            content: data1.content
        }

        await client.mutate({
            mutation: gql`
              mutation testUpdatePost($id: String!, $data: UpdatePost!) {
                  ${path}(id: $id, data: $data) {
                      ...PostFragment
                  }
              }
              ${crwClient?.PostFragment}
          `,
            variables: {
                id: '10',
                data: updatePost,
            }
        });
        const data2 = await getPostById('10');

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.slug).toBeTruthy();
        expect(data2.slug === '__test__').toBeTruthy();
    });


    it(`createPost`, async () => {
        const data1: TPost = await getPostById('10');
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();
        expect(data1?.author?.id).toBeTruthy();

        if (!data1?.author?.id) return;
        const path = GraphQLPaths.Post.create;

        const createPost: TPostInput = {
            slug: '__test2__',
            pageTitle: data1.pageTitle,
            title: data1.title,
            mainImage: data1.mainImage,
            published: data1.published,
            isEnabled: data1.isEnabled,
            authorId: data1?.author?.id,
            delta: data1?.delta,
            content: data1.content
        }

        const res = await client.mutate({
            mutation: gql`
              mutation testCreatePost($data: CreatePost!) {
                  ${path}(data: $data) {
                      ...PostFragment
                  }
              }
              ${crwClient?.PostFragment}
          `,
            variables: {
                data: createPost,
            }
        });
        const success = crwClient?.returnData(res, path);
        expect(success).toBeTruthy();
        expect(!Array.isArray(success)).toBeTruthy();

        const data2 = await getPostBySlug('__test2__');

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.slug).toBeTruthy();
        expect(data2.slug === '__test2__').toBeTruthy();
    });


    it(`deletePost`, async () => {
        const data1: TPost = await getPostById('11');
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();
        expect(data1?.author?.id).toBeTruthy();

        if (!data1?.author?.id) return;
        const path = GraphQLPaths.Post.delete;

        const res = await client.mutate({
            mutation: gql`
                mutation testDeletePost($id: String!) {
                    ${path}(id: $id)
                }
          `,
            variables: {
                id: '11',
            }
        });
        const success = crwClient?.returnData(res, path);
        expect(!Array.isArray(success)).toBeTruthy();
        expect(success === true).toBeTruthy();

        const data2 = await getPostById('11');

        expect(!data2?.id).toBeTruthy();
        expect(!data2?.slug).toBeTruthy();
    });


    afterAll(async () => {
        await tearDownResolver(server);
    });
});