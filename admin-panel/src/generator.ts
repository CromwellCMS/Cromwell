import { CMSconfigType } from '@cromwell/core';
import { readThemePages } from '@cromwell/core-backend';
import fs from 'fs-extra';
import { resolve } from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const generateAdminPanelImports = async () => {
    const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');

    let config: CMSconfigType | undefined = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config || !config.themeName) throw new Error('renderer::server cannot read CMS config');


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
    fs.outputFileSync(`${adminPanelDir}/.cromwell/imports/plugins.gen.js`, content);



    // Generate page imports for admin panel
    const customPages = await readThemePages(resolve(__dirname, '../../'));

    let customPageStatics = '';
    let customPageStaticsSwitch = '';
    let customPageLazyImports = '';
    let customPageLazyImportsSwitch = '';
    const pageNames: string[] = [];

    Object.entries(customPages).forEach(e => {
        const pageName = e[0];
        pageNames.push(pageName);
        const pagePath = e[1].pagePath;
        const pageComponentName = e[1].pageComponentName;
        console.log('pageName', pageName, 'pageComponentName', pageComponentName);

        customPageLazyImports += `\nconst ${pageComponentName}_LazyPage = lazy(() => import('${pagePath}'))`;
        customPageLazyImportsSwitch += `    if (pageName === '${pageName}') return ${pageComponentName}_LazyPage;\n   `;

        // Render page to static HTML
        const pageComp: () => JSX.Element = require(pagePath).default;
        const html = ReactDOMServer.renderToStaticMarkup(React.createElement(pageComp));

        customPageStatics += `\nconst ${pageComponentName}_StaticPage = '${html}'`;
        customPageStaticsSwitch += `    if (pageName === '${pageName}') return ${pageComponentName}_StaticPage;\n   `;
    })

    const adminPanelContent = `
            import { lazy } from 'react';
            export const pageNames = ${JSON.stringify(pageNames)};
            ${customPageLazyImports}
            
            export const importLazyPage = (pageName) => {
                ${customPageLazyImportsSwitch}
                return undefined;
            }

            ${customPageStatics}

            export const importStaticPage = (pageName) => {
                ${customPageStaticsSwitch}
                return undefined;
            }
        `;
    fs.outputFileSync(`${adminPanelDir}/.cromwell/imports/pages.gen.js`, adminPanelContent);
}
generateAdminPanelImports();