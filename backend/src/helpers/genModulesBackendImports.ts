const fs = require('fs-extra');
const resolve = require('path').resolve;

export function genModulesBackendImports() {
    const backendRootDir = resolve(__dirname, '../../').replace(/\\/g, '/');
    const globalModulesDir = resolve(__dirname, '../../../modules').replace(/\\/g, '/');
    const distDir = 'es';
    const moduleNames: string[] = fs.readdirSync(globalModulesDir);
    console.log('genModulesBackendImports:Modules found:', moduleNames);

    // Collect models
    let modelsImports = '';
    moduleNames.forEach(name => {
        const modelsDir = `${globalModulesDir}/${name}/${distDir}/backend/models`;
        if (fs.existsSync(modelsDir)) {
            const modelNames: string[] = fs.readdirSync(modelsDir);
            modelNames.forEach(modelName => {
                modelsImports += `\nexport * from '${modelsDir}/${modelName}';`;
            })
        }
    });

    const content = `
    /**
     * Models
     */
    ${modelsImports}
    `;
    fs.outputFileSync(`${backendRootDir}/.cromwell/imports/gen.imports.js`, content);
}
genModulesBackendImports();