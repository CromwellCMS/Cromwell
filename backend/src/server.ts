import "reflect-metadata";
import express from 'express';
import path from 'path';
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/PostResolver";
import { AuthorResolver } from "./resolvers/AuthorResolver";
import { ProductResolver } from "./resolvers/ProductResolver";
import { ProductCategoryResolver } from "./resolvers/ProductCategoryResolver";
import { setStoreItem, CMSconfigType } from "@cromwell/core";
const resolve = require('path').resolve;
const fs = require('fs-extra');

const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
let config: CMSconfigType | undefined = undefined;
try {
    config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
} catch (e) {
    console.log('renderer::server ', e);
}
if (!config) throw new Error('renderer::server cannot read CMS config');

setStoreItem('cmsconfig', config);

const connectionOptions = require('../ormconfig.json');

async function apiServer(): Promise<void> {
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
    const { url } = await server.listen(config!.apiPort);
    console.log(`API server has started at ${url}`);
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
