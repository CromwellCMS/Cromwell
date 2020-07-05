const fs = require('fs-extra');
const resolve = require('path').resolve;

export function genPluginsBackendImports(): void {
    const backendRootDir = resolve(__dirname, '../../').replace(/\\/g, '/');
    const globalPluginsDir = resolve(__dirname, '../../../plugins').replace(/\\/g, '/');
    const distDir = 'es';
    const pluginsNames: string[] = fs.readdirSync(globalPluginsDir);
    console.log('genPluginsBackendImports:Plugins found:', pluginsNames);

    // Collect entities
    let entitiesImports = '';
    pluginsNames.forEach(name => {
        const entitiesDir = `${globalPluginsDir}/${name}/${distDir}/backend/entities`;
        if (fs.existsSync(entitiesDir)) {
            const modelNames: string[] = fs.readdirSync(entitiesDir);
            modelNames.forEach(entityName => {
                entitiesImports += `\nexport * from '${entitiesDir}/${entityName}';`;
            })
        }
    });

    const entitiesContent = `
/**
 * Entities
 */
${entitiesImports}
    `;
    fs.outputFileSync(`${backendRootDir}/.cromwell/imports/entities.imports.gen.js`, entitiesContent);


    // Collect resolvers
    let resolversImports = '';
    let resolversExport = '[';
    pluginsNames.forEach(name => {
        const resolversDir = `${globalPluginsDir}/${name}/${distDir}/backend/resolvers`;
        if (fs.existsSync(resolversDir)) {
            const resolverNames: string[] = fs.readdirSync(resolversDir);
            resolverNames.forEach(rPath => {
                const rName = rPath.replace(/.js$/, '') + '_Resolver';
                resolversExport += rName + ',\n';
                resolversImports += `\nimport ${rName} from '${resolversDir}/${rPath}';`;
            })
        }
    });
    resolversExport += ']';

    const resolversContent = `
/**
 * Resolvers
 */
${resolversImports}

export const pluginsResolvers = ${resolversExport};
    `;
    fs.outputFileSync(`${backendRootDir}/.cromwell/imports/resolvers.imports.gen.js`, resolversContent);

}
genPluginsBackendImports();