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
                            entitiesImports += `\nexport * from '${entitiesDir}/${entityName}';`;
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
                            resolversImports += `\nimport ${rName} from '${resolversDir}/${rPath}';`;
                        })
                    }
                }

            }
        }
    })

    resolversExport += ']';


    const entitiesContent = `
        /**
         * Entities
         */
        ${entitiesImports}
    `;

    fs.outputFileSync(`${backendRootDir}/.cromwell/imports/entities.imports.gen.js`, entitiesContent);

    const resolversContent = `
        /**
         * Resolvers
         */
        ${resolversImports}
        export const pluginsResolvers = ${resolversExport};
    `;

    fs.outputFileSync(`${backendRootDir}/.cromwell/imports/resolvers.imports.gen.js`, resolversContent);

}
generate();