const fs = require('fs-extra');
const resolve = require('path').resolve;

export function generateAdminPanelImports() {
    const adminPanelDir = resolve(__dirname, '../../../admin-panel').replace(/\\/g, '/');
    const globalModulesDir = resolve(__dirname, '../../../modules').replace(/\\/g, '/');
    const distDir = 'es';
    const moduleNames: string[] = fs.readdirSync(globalModulesDir);
    console.log('generateAdminPanelImports:Modules found:', moduleNames);

    let modulesImports = '';
    let modulesImportsSwitch = '';
    moduleNames.forEach(name => {
        const moduleAdminComponent = `${globalModulesDir}/${name}/${distDir}/admin/index.js`;
        if (fs.existsSync(moduleAdminComponent)) {
            modulesImports += `\nconst ${name}_Module = import('${moduleAdminComponent}')`;
            modulesImportsSwitch += `if (moduleName === '${name}') return ${name}_Page;\n`;

        }
    });

    const content = `
    /**
     * Modules
     */
    ${modulesImports}
    
    export const importModule = (moduleName) => {
        ${modulesImportsSwitch}
        return undefined;
    }
    `;
    fs.outputFileSync(`${adminPanelDir}/.cromwell/imports/gen.imports.js`, content);
}
generateAdminPanelImports();