import { gql } from '@apollo/client';
import { TPagedParams, TPost, TPostFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';

export const handleGetFilteredPosts = async (params: TPagedParams<TPost>, filter?: TPostFilter) => {
    if (!filter) filter = {};
    filter.published = true;

    const client = getGraphQLClient();
    const posts = await client?.getFilteredPosts({
        pagedParams: params,
        customFragment: gql`
            fragment PostListFragment on Post {
                id
                slug
                title
                createDate
                excerpt
                mainImage
                readTime
                tags {
                    name
                    id
                    slug
                    color
                    image
                }
                published 
                publishDate
                readTime
        }
    `,
        customFragmentName: 'PostListFragment',
        filterParams: filter,
    });

    if (!posts?.elements?.length) return;

    const authorIds: string[] = [];
    posts.elements.forEach(post => {
        if (post.authorId && !authorIds.includes(post.authorId)) {
            authorIds.push(post.authorId);
        }
    });

    const authors = await Promise.all(authorIds.map(async id => {
        try {
            return await client.getUserById(id);
        } catch (error) {
            console.error(error);
        }
    }));

    posts.elements.forEach(post => {
        if (post.authorId) {
            const author = authors.find(a => a?.id + '' === post.authorId + '')
            if (author) {
                post.author = author;
            }
        }
    });

    return posts;
}
