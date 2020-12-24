import { setStoreItem } from '@cromwell/core';
import {
    Attribute,
    Author,
    CmsEntity,
    PluginEntity,
    Post,
    Product,
    ProductCategory,
    ProductReview,
    ThemeEntity,
} from '@cromwell/core-backend';
import { resolve } from 'path';
import { ConnectionOptions, createConnection } from 'typeorm';

import { projectRootDir } from '../constants';
import { collectPlugins } from './collectPlugins';

export const connectDatabase = async (env: string) => {

    let connectionOptions: ConnectionOptions | undefined = undefined;
    if (env === 'dev') {
        connectionOptions = require('../ormconfig.dev.json');
    } else connectionOptions = require('../ormconfig.prod.json');

    if (!connectionOptions || !connectionOptions.type) throw new Error('server.ts: Cannot read connection options');
    setStoreItem('dbType', connectionOptions.type);

    const pluginsExports = collectPlugins(projectRootDir);
    (connectionOptions.entities as any) = [
        Product, ProductCategory, Post, Author, Attribute, ProductReview, ThemeEntity, PluginEntity, CmsEntity,
        ...pluginsExports.entities
    ];
    if (typeof connectionOptions.database === 'string') {
        (connectionOptions.database as any) = resolve(__dirname, '../', connectionOptions.database);
    }

    if (connectionOptions) await createConnection(connectionOptions);
}