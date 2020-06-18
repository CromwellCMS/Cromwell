const fs = require('fs-extra');
const resolve = require('path').resolve;

function generateAdminPanelImports() {
    const adminPanelDir = resolve(__dirname, '../').replace(/\\/g, '/');
    const globalPluginsDir = resolve(__dirname, '../../plugins').replace(/\\/g, '/');
    const distDir = 'es';
    const pluginsNames: string[] = fs.readdirSync(globalPluginsDir);
    console.log('generateAdminPanelImports:Plugins found:', pluginsNames);

    let pluginsImports = '';
    let pluginsImportsSwitch = '';
    let pluginNames = '[\n';
    pluginsNames.forEach(name => {
        const pluginAdminComponent = `${globalPluginsDir}/${name}/${distDir}/admin/index.js`;
        if (fs.existsSync(pluginAdminComponent)) {
            pluginsImports += `\nconst ${name}_Plugin = lazy(() => import('${pluginAdminComponent}'))`;
            pluginsImportsSwitch += `   if (pluginName === '${name}') return ${name}_Plugin;\n`;
            pluginNames += `"${name}",\n`;
        }
    });
    pluginNames += '];';

    const content = `
import { lazy } from 'react';
/**
 * Plugins
 */
export const pluginsNames = ${pluginNames}

${pluginsImports}

export const importPlugin = (pluginName) => {
${pluginsImportsSwitch}
    return undefined;
}
    `;
    fs.outputFileSync(`${adminPanelDir}/.cromwell/imports/imports.gen.js`, content);
}
generateAdminPanelImports();