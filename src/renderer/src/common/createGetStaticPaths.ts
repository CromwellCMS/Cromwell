import { DBEntity, getGraphQLClient, GraphQLPaths } from "@cromwell/core";

export const createGetStaticPaths = (dbEntity: DBEntity) => {
    return async function () {
        const getAllPath = GraphQLPaths[dbEntity].getAll;
        let slugs;
        let paths = [];
        try {
            slugs = await getGraphQLClient().request(`
                query get${dbEntity} {
                    ${getAllPath}(pagedParams: {pageNumber: 1, pageSize: 1000000000}) {
                        slug
                    }
                }
            `);
            if (slugs) {
                paths = slugs[getAllPath].map((entity: any) => {
                    return {
                        params: { slug: entity.slug }
                    }
                })
            }
        } catch (e) {
            console.error(e)
        }
        // console.log('getStaticPaths', paths)
        return {
            paths,
            fallback: true
        };
    }

}