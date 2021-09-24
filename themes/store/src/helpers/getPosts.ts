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
                author {
                    id
                    email
                    fullName
                    avatar
                }
                mainImage
                readTime
                tags {
                    name
                    id
                    slug
                    color
                    image
                }
                publishDate
                readTime
        }
    `,
        customFragmentName: 'PostListFragment',
        filterParams: filter,
    });
    return posts;
}
