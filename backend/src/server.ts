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
import { setStoreItem } from "@cromwell/core";
const config = require('./cmsconfig.json');
setStoreItem('cmsconfig', config);

const connectionOptions = require('../ormconfig.json');

let _connection: Connection;

async function apiServer() {
    _connection = await createConnection(connectionOptions);
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
    const { url } = await server.listen(config.apiPort);
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
