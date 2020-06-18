const fs = require('fs-extra');
const resolve = require('path').resolve;

export function generateAdminPanelImports() {
    const adminPanelDir = resolve(__dirname, '../../../admin-panel').replace(/\\/g, '/');
    const globalPluginsDir = resolve(__dirname, '../../../plugins').replace(/\\/g, '/');
    const distDir = 'es';
    const pluginsNames: string[] = fs.readdirSync(globalPluginsDir);
    console.log('generateAdminPanelImports:Plugins found:', pluginsNames);

    let pluginsImports = '';
    let pluginsImportsSwitch = '';
    pluginsNames.forEach(name => {
        const pluginAdminComponent = `${globalPluginsDir}/${name}/${distDir}/admin/index.js`;
        if (fs.existsSync(pluginAdminComponent)) {
            pluginsImports += `\nconst ${name}_Plugin = import('${pluginAdminComponent}')`;
            pluginsImportsSwitch += `if (pluginName === '${name}') return ${name}_Page;\n`;

        }
    });

    const content = `
    /**
     * Plugins
     */
    ${pluginsImports}
    
    export const importPlugin = (pluginName) => {
        ${pluginsImportsSwitch}
        return undefined;
    }
    `;
    fs.outputFileSync(`${adminPanelDir}/.cromwell/imports/imports.gen.js`, content);
}
generateAdminPanelImports();