import { DBEntity, graphQLClient, GraphQLPaths } from "@cromwell/core";

export const createGetStaticPaths = (dbEntity: DBEntity) => {
    return async function () {
        const getAllPath = GraphQLPaths[dbEntity].getAll;
        let ids;
        let paths = [];
        try {
            ids = await graphQLClient.request(`
                query get${dbEntity} {
                    ${getAllPath} {
                        id
                    }
                }
            `);
            if (ids) {
                paths = ids[getAllPath].map((entity: any) => {
                    return {
                        params: { pid: entity.id }
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