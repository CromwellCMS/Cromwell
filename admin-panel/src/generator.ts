import { CMSconfigType, ThemeConfigType } from '@cromwell/core';

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
    if (!config || !config.themeName) throw new Error('renderer::server cannot read CMS config');

    const themeDir = resolve(__dirname, '../', '../', 'themes').replace(/\\/g, '/') + '/' + config.themeName;
    const themeConfigPath = themeDir + '/' + 'cromwell.config.json';
    let themeConfig: ThemeConfigType | undefined = undefined;
    try {
        themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.error('Failed to parse themeConfig', e);
    }


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
    // const themesDir = resolve(__dirname, '../', '../', 'themes').replace(/\\/g, '/');
    // const themeExportDir = `${themesDir}/${config.themeName}/es`;



    const content = `
        import { lazy } from 'react';
        export const CMSconfig = ${JSON.stringify(config)};
        export const themeConfig = ${JSON.stringify(themeConfig)};

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