const fs = require('fs-extra');
const resolve = require('path').resolve;

export function genPluginsBackendImports() {
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

    const content = `
    /**
     * Entities
     */
    ${entitiesImports}
    `;
    fs.outputFileSync(`${backendRootDir}/.cromwell/imports/imports.gen.js`, content);
}
genPluginsBackendImports();