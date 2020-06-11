import { DBEntity, GraphQLNode } from './types';
export declare const GraphQLPaths: {
    [K in DBEntity]: GraphQLNode;
};
export declare const DBTableNames: {
    [K in DBEntity]: string;
};
export declare const componentsCachePath = "/tmp/components";
export declare const isServer: () => boolean;
