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
    readCMSConfig
} from '@cromwell/core-backend';
import { resolve } from 'path';
import { ConnectionOptions, createConnection } from 'typeorm';

import { projectRootDir } from '../constants';
import { collectPlugins } from './collectPlugins';
import { getCmsSettings } from '../services/cms.service';

export const connectDatabase = async (env: string) => {

    const ormconfig = env === 'dev' ? require('../ormconfig.dev.json') : require('../ormconfig.prod.json');

    if (!ormconfig || !ormconfig.type) throw new Error('server.ts: Cannot read ormconfig');
    setStoreItem('dbType', ormconfig.type);

    const pluginsExports = collectPlugins(projectRootDir);
    const connectionOptions: ConnectionOptions = {
        ...ormconfig,
        entities: [
            Product, ProductCategory, Post, Author, Attribute, ProductReview, ThemeEntity, PluginEntity, CmsEntity,
            ...pluginsExports.entities,
            ...(ormconfig.entities ?? [])
        ],
        database: typeof ormconfig.database === 'string' ? resolve(__dirname, '../', ormconfig.database) : ormconfig.database
    };

    if (connectionOptions) await createConnection(connectionOptions);

    const settings = await getCmsSettings();
    if (settings) {
        setStoreItem('cmsSettings', settings)
    }

}