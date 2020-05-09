import { DBEntity, graphQLClient, GraphQLPaths } from "@cromwell/core";

export const createGetStaticPaths = (dbEntity: DBEntity) => {
    return async function () {
        const getAllPath = GraphQLPaths[dbEntity].getAll;
        let slugs;
        let paths = [];
        try {
            slugs = await graphQLClient.request(`
                query get${dbEntity} {
                    ${getAllPath} {
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
        console.log('getStaticPaths', paths)
        return {
            paths,
            fallback: true
        };
    }

}