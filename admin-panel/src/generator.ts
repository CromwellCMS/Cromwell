import { CMSconfigType } from '@cromwell/core';

function generateAdminPanelImports() {
    const fs = require('fs-extra');
    const resolve = require('path').resolve;

    const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
    let config: CMSconfigType | undefined = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('renderer::server cannot read CMS config');

    // Import global plugins
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

    // Import theme pages

    const themesDir = resolve(__dirname, '../', '../', 'themes').replace(/\\/g, '/');
    const themeExportDir = `${themesDir}/${config.themeName}/es`;



    const content = `
import { lazy } from 'react';
export const CMSconfig = ${JSON.stringify(config)};

/**
 * Plugins
 */
export const pluginNames = ${pluginNames}

${pluginsImports}

export const importPlugin = (pluginName) => {
${pluginsImportsSwitch}
    return undefined;
}
    `;
    fs.outputFileSync(`${adminPanelDir}/.cromwell/imports/imports.gen.js`, content);
}
generateAdminPanelImports();