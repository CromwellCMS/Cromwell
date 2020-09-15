import fs from 'fs-extra';
import { resolve } from 'path';
import { TPluginConfig } from '@cromwell/core';
import { projectRootDir } from './constants';
import { readPluginsExports, TPluginInfo } from '@cromwell/core-backend';

export function generate(): void {
    const backendRootDir = resolve(__dirname, '../').replace(/\\/g, '/');

    const pluginInfos = readPluginsExports(projectRootDir);
    let entitiesImports = '';
    let entitiesExport = '[';

    let resolversImports = '';
    let resolversExport = '[';

    pluginInfos.forEach(info => {
        if (info.entities) {
            info.entities.forEach(entityInfo => {
                entitiesExport += entityInfo.name + ',\n';
                entitiesImports += `\nconst ${entityInfo.name} = require('${entityInfo.path}');`;
            });
        }
        if (info.resolvers) {
            info.resolvers.forEach(resolverInfo => {
                resolversExport += resolverInfo.name + ',\n';
                resolversImports += `\nconst ${resolverInfo.name} = require('${resolverInfo.path}');`;
            });
        }
    });

    resolversExport += ']';
    entitiesExport += ']';


    const entitiesContent = `
        /**
         * Entities
         */
        ${entitiesImports}
module.exports = {
    pluginsEntities: ${entitiesExport}
}      
    `;

    fs.outputFileSync(`${backendRootDir}/.cromwell/imports/entities.imports.gen.js`, entitiesContent);

    const resolversContent = `
        /**
         * Resolvers
         */
        ${resolversImports}
module.exports = {
    pluginsResolvers: ${resolversExport}
}        
    `;

    fs.outputFileSync(`${backendRootDir}/.cromwell/imports/resolvers.imports.gen.js`, resolversContent);

}
generate();