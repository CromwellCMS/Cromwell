import { TCmsConfig, TPluginConfig } from '@cromwell/core';
import { readThemePages } from '@cromwell/core-backend';
import fs from 'fs-extra';
import { staticDir, publicStaticDir, projectRootDir, localProjectBuildDir, generatorOutDir, localProjectDir } from './constants';
import { readCMSConfig } from '@cromwell/core-backend';

//@ts-ignore
import lnk from 'lnk';

const generateAdminPanelImports = async () => {
    const configPath = `${projectRootDir}/system/cmsconfig.json`;
    const config = readCMSConfig(projectRootDir);
    
    // Import global plugins
    const globalPluginsDir = `${projectRootDir}/plugins`;
    const pluginsNames: string[] = fs.readdirSync(globalPluginsDir);
    console.log('generateAdminPanelImports:Plugins found:', pluginsNames);

    let pluginsImports = '';
    let pluginsImportsSwitch = '';
    let pluginNames = '[\n';
    pluginsNames.forEach(name => {
        const configPath = `${globalPluginsDir}/${name}/cromwell.config.json`;
        if (fs.existsSync(configPath)) {
            let config: TPluginConfig | undefined;
            try {
                config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
            } catch (e) {
                console.error('server::generator: ', e);
            }
            if (config && config.adminDir) {
                const pluginAdminComponent = `${globalPluginsDir}/${name}/${config.adminDir}/index.js`;
                if (fs.existsSync(pluginAdminComponent)) {
                    pluginsImports += `\nconst ${name}_Plugin = lazy(() => import('${pluginAdminComponent}'))`;
                    pluginsImportsSwitch += `   if (pluginName === '${name}') return ${name}_Plugin;\n`;
                    pluginNames += `"${name}",\n`;
                }
            }
        }
    });
    pluginNames += '];';


    // Import theme pages
    // const themesDir = resolve(__dirname, '../', '../', 'themes').replace(/\\/g, '/');
    // const themeExportDir = `${themesDir}/${config.themeName}/es`;



    const pluginsContent = `
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
    // fs.outputFileSync(`${outDir}/plugins.gen.js`, pluginsContent);



    // Generate page imports for admin panel
    const customPages = await readThemePages(projectRootDir);

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

        // // Render page to static HTML
        // if (pagePath) {
        //     console.log('pagePath', pagePath);
        //     const pageComp: () => JSX.Element = require(pagePath);
        //     console.log('pageComp', pageComp);
        //     // const pageComp: () => JSX.Element = require('C:/Users/a.glebov/projects/cromwell/themes/cromwell-demoshop/es/index').index.default;

        //     if (pageComp) {
        //         const html = ReactDOMServer.renderToStaticMarkup(React.createElement(pageComp));

        //         customPageStatics += `\nconst ${pageComponentName}_StaticPage = '${html}'`;
        //         customPageStaticsSwitch += `    if (pageName === '${pageName}') return ${pageComponentName}_StaticPage;\n   `;
        //     }
        // }
    })

    const adminPanelContent = `
            // import { lazy } from 'react';
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
    // fs.outputFileSync(`${outDir}/pages.gen.js`, adminPanelContent);


    fs.outputFileSync(`${generatorOutDir}/index.js`, (pluginsContent + adminPanelContent));


    const jsAppContent = `
    'use strict';
    import { AdminPanel } from './admin/app';
    AdminPanel.runApp();
    `
    fs.outputFileSync(`${localProjectBuildDir}/index.js`, jsAppContent);


    // Link public dir in root to renderer's public dir for Express.js server
    if (!fs.existsSync(publicStaticDir)) {
        lnk([`${projectRootDir}/public`], `${staticDir}`);
    }
}

generateAdminPanelImports();