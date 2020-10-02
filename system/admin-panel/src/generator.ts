import { TCmsConfig, TPluginConfig } from '@cromwell/core';
import fs from 'fs-extra';
import { staticDir, publicStaticDir, projectRootDir, localProjectBuildDir, generatorOutDir, localProjectDir } from './constants';
import { readCMSConfigSync, readPluginsExports, readThemeExports } from '@cromwell/core-backend';
import symlinkDir from 'symlink-dir';

const generateAdminPanelImports = async () => {
    const config = readCMSConfigSync(projectRootDir);

    // Import plugins
    let pluginsImports = '';
    let pluginsImportsSwitch = '';
    let pluginNames = '[\n';

    const pluginInfos = readPluginsExports(projectRootDir);
    pluginInfos.forEach(info => {
        if (info.adminPanelPath) {
            pluginsImports += `\nconst ${info.pluginName}_Plugin = lazy(() => import('${info.adminPanelPath}'))`;
            pluginsImportsSwitch += `   if (pluginName === '${info.pluginName}') return ${info.pluginName}_Plugin;\n`;
            pluginNames += `"${info.pluginName}",\n`;
        }
    })

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

    let customPageStatics = '';
    let customPageStaticsSwitch = '';
    let customPageLazyImports = '';
    let customPageLazyImportsSwitch = '';
    const pageNames: string[] = [];

    // const themesDir = `${projectRootDir}/themes`;
    // const themeNames: string[] = fs.readdirSync(themesDir);
    // for (const themeName of themeNames) {
    const themeExports = await readThemeExports(projectRootDir, config.themeName);
    themeExports.pagesInfo.forEach(pageInfo => {
        pageNames.push(pageInfo.name);
        console.log('pageName', pageInfo.name, 'pageComponentName', pageInfo.compName);

        customPageLazyImports += `\nconst ${pageInfo.compName}_LazyPage = lazy(() => import('${pageInfo.path}'))`;
        customPageLazyImportsSwitch += `    if (pageName === '${pageInfo.name}') return ${pageInfo.compName}_LazyPage;\n   `;
    });
    // };

    console.log('themeExports.adminPanelPath', themeExports.adminPanelPath);
    const ImportedThemeController = themeExports.adminPanelPath ?
        `export const ImportedThemeController = lazy(() => import('${themeExports.adminPanelPath}'));` :
        'export const ImportedThemeController = undefined;';

    const adminPanelContent = `
            // import { lazy } from 'react';

            ${ImportedThemeController}

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
        symlinkDir(`${projectRootDir}/public`, publicStaticDir)
    }
}

generateAdminPanelImports();