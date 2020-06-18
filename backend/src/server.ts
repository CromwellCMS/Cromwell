import "reflect-metadata";
import express from 'express';
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/PostResolver";
import { AuthorResolver } from "./resolvers/AuthorResolver";
import { ProductResolver } from "./resolvers/ProductResolver";
import { ProductCategoryResolver } from "./resolvers/ProductCategoryResolver";
import { applyModificationsController } from "./controllers/modificationsController";
import { setStoreItem, CMSconfigType, CromwellBlockDataType } from "@cromwell/core";
import { rebuildPage } from './helpers/PageBuilder';
setStoreItem('rebuildPage', rebuildPage);
const resolve = require('path').resolve;
const fs = require('fs-extra');
const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
let config: CMSconfigType | undefined = undefined;
try {
    config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
} catch (e) {
    console.log('renderer::server ', e);
}
if (!config) throw new Error('renderer::server cannot read CMS config')
setStoreItem('cmsconfig', config);

const connectionOptions = require('../ormconfig.json');

async function apiServer(): Promise<void> {
    if (!config || !config.apiPort || !config.themeName) throw new Error('renderer::server cannot read CMS config ' + JSON.stringify(config));

    createConnection(connectionOptions);
    const schema = await buildSchema({
        resolvers: [
            PostResolver,
            AuthorResolver,
            ProductResolver,
            ProductCategoryResolver
        ],
        dateScalarMode: "isoDate"
    });
    const server = new ApolloServer({ schema });

    const app = express();
    server.applyMiddleware({ app, path: '/api/v1/graphql' });

    applyModificationsController(app);

    const { address } = app.listen(config.apiPort);
    console.log(`API server has started at http://localhost:${config.apiPort}/api/v1/graphql`);
}

// async function adminPanelServer() {
//     const app = express();
//     app.use(express.static(publicDir, {}));
//     app.get('*', (req, res) => {
//         res.sendFile(publicDir + '/index.html');
//     });
//     app.listen(config.adminPanelPort);
//     console.log(`Admin Panel server has started at http://localhost:${config.adminPanelPort}/`);
// }


// Test feature that serves satic pages and other files from .next folder (bad idea)
// Use Nginx to cache response of Next.js server
/*
import { getFrontendBuildDir, getRootBuildDir, getBuildId } from './helpers/getFrontendBuildDir';
const buildStaticDir = getFrontendBuildDir();
const buildId = getBuildId();
const rootBuildDir = getRootBuildDir();
async function frontendServer() {
    if (buildStaticDir && config && config.themePort) {
        const app = express();
        app.get('*', function (req, res) {
            console.log('req.path', req.path);
            const reqPath = decodeURI(req.path);
            let resFilePath;
            if (reqPath.includes('/_next/data/')) {
                resFilePath = `${rootBuildDir}/${reqPath.replace(`/_next/data/${buildId}`, `server/static/${buildId}/pages`)}`;
            } else if (reqPath.includes('/_next/')) {
                resFilePath = `${rootBuildDir}/${reqPath.replace('/_next/', '')}`;
            } else {
                resFilePath = `${buildStaticDir}${reqPath}.html`;
            }
            fs.access(resFilePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    res.sendFile(resFilePath);
                    return;
                } else {
                    console.error('File does not exist: ' + resFilePath);
                    res.status(404).send('Not found');
                }
            });
        });
        app.listen(config.themePort);
        console.log(`Frontend theme server has started at http://localhost:${config.themePort}/`);
    }
}
*/

apiServer();
// adminPanelServer();
// frontendServer();