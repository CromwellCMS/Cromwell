import "reflect-metadata";
import express from 'express';
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/PostResolver";
import { AuthorResolver } from "./resolvers/AuthorResolver";
import { ProductResolver } from "./resolvers/ProductResolver";
import { ProductCategoryResolver } from "./resolvers/ProductCategoryResolver";
import { setStoreItem, CMSconfigType, CromwellBlockDataType, CromwellBlock } from "@cromwell/core";
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

const tempDir = resolve(__dirname, '../', './.cromwell/templates/', config.templateName).replace(/\\/g, '/');
const userModificationsPath = tempDir + '/userModifications.json';

const connectionOptions = require('../ormconfig.json');

async function apiServer(): Promise<void> {
    if (!config || !config.apiPort || !config.templateName) throw new Error('renderer::server cannot read CMS config ' + JSON.stringify(config));

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

    app.get('/api/v1/modifications/:pageName', function (req, res) {
        fs.readFile(userModificationsPath, (err, data) => {
            const userModifications: Record<string, CromwellBlockDataType> | undefined = JSON.parse(data);
            const mod = userModifications ? userModifications[req.params.pageName] : [];
            res.send(mod ? mod : []);
        });
    })

    app.listen(config.apiPort);
    console.log(`API server has started at ${config.apiPort}/api/v1/graphql`);
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

// async function frontendServer() {
//     const app = express();

//     app.use(express.static(currentTemplatePublicDir, {}));

//     app.listen(config.templatePort);
//     console.log(`Frontend template server has started at http://localhost:${config.templatePort}/`);
// }

apiServer();
// adminPanelServer();
// frontendServer();
