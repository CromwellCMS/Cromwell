import fs from 'fs-extra';
import { resolve } from 'path';
import { TPluginConfig } from '@cromwell/core';
import { projectRootDir } from './constants';

export function generate(): void {
    const backendRootDir = resolve(__dirname, '../').replace(/\\/g, '/');
    const globalPluginsDir = `${projectRootDir}/plugins`;
    const pluginsNames: string[] = fs.readdirSync(globalPluginsDir);
    console.log('genPluginsBackendImports:Plugins found:', pluginsNames);

    let entitiesImports = '';
    let entitiesExport = '[';

    let resolversImports = '';
    let resolversExport = '[';

    pluginsNames.forEach(name => {
        const configPath = `${globalPluginsDir}/${name}/cromwell.config.json`;
        if (fs.existsSync(configPath)) {
            let config: TPluginConfig | undefined;
            try {
                config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
            } catch (e) {
                console.error('server::generator: ', e);
            }

            if (config) {

                // Collect entities
                if (config.backend && config.backend.entitiesDir) {
                    const entitiesDir = `${globalPluginsDir}/${name}/${config.backend.entitiesDir}`;
                    if (fs.existsSync(entitiesDir)) {
                        const modelNames: string[] = fs.readdirSync(entitiesDir);
                        modelNames.forEach(entityName => {
                            const eName = `Plugin_${name}_Entity_${entityName.replace(/.js$/, '')}`;
                            entitiesExport += eName + ',\n';
                            entitiesImports += `\nconst ${eName} = require('${entitiesDir}/${entityName}');`;
                        })
                    }
                }

                // Collect resolvers
                if (config.backend && config.backend.resolversDir) {
                    const resolversDir = `${globalPluginsDir}/${name}/${config.backend.resolversDir}`;
                    if (fs.existsSync(resolversDir)) {
                        const resolverNames: string[] = fs.readdirSync(resolversDir);
                        resolverNames.forEach(rPath => {
                            const rName = rPath.replace(/.js$/, '') + '_Resolver';
                            resolversExport += rName + ',\n';
                            resolversImports += `\nconst ${rName} = require('${resolversDir}/${rPath}');`;
                        })
                    }
                }

            }
        }
    })

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