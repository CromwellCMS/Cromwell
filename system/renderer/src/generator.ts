import { TCmsConfig, setStoreItem, TPluginConfig } from '@cromwell/core';
import { readCMSConfigSync, readPluginsExports, readThemeExports } from '@cromwell/core-backend';
import { getRestAPIClient } from '@cromwell/core-frontend';
import fs from 'fs-extra';
import { resolve } from 'path';
//@ts-ignore
import lnk from 'lnk';

const main = async () => {
    const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
    const projectRootDir = resolve(__dirname, '../../../').replace(/\\/g, '/');
    const config = readCMSConfigSync(projectRootDir);

    const appConfig = await getRestAPIClient()?.getAppConfig();
    const localDir = resolve(__dirname, '../').replace(/\\/g, '/');
    const buildDir = `${localDir}/.cromwell`;
    const pagesLocalDir = `${buildDir}/pages`;

    // Read plugins
    let pluginImports = '';
    let dynamicPluginImports = '';
    let pluginImportsSwitch = '';
    let dynamicPluginImportsSwitch = '';

    const pluginInfos = readPluginsExports(projectRootDir);
    pluginInfos.forEach(info => {
        if (info.frontendPath) {
            pluginImports += `\nconst ${info.pluginName} = import('${info.frontendPath}');`;
            pluginImportsSwitch += `if (pluginName === '${info.pluginName}') return ${info.pluginName};\n`;

            dynamicPluginImports += `\nconst Dynamic${info.pluginName} = dynamic(() => import('${info.frontendPath}'));`;
            dynamicPluginImportsSwitch += `if (pluginName === '${info.pluginName}') return Dynamic${info.pluginName};\n   `;
        }
    })

    // Read pages
    const themeExports = await readThemeExports(projectRootDir, config.themeName);
    const pageNames: string[] = [];
    let customPageImports = '';
    let customPageImportsSwitch = '';
    let customPageDynamicImports = '';
    let customPageDynamicImportsSwitch = '';

    themeExports.pagesInfo.forEach(pageInfo => {
        pageNames.push(pageInfo.name);
        if (pageInfo.path && pageInfo.compName) {
            console.log('pageInfo.name', pageInfo.name, 'pageInfo.compName', pageInfo.compName);

            customPageImports += `\nconst ${pageInfo.compName}_Page = require('${pageInfo.path}');`;
            customPageImportsSwitch += `    if (pageName === '${pageInfo.name}') return ${pageInfo.compName}_Page;\n`;

            customPageDynamicImports += `\nconst ${pageInfo.compName}_DynamicPage = dynamic(() => import('${pageInfo.path}'));`;
            customPageDynamicImportsSwitch += `    if (pageName === '${pageInfo.name}') return ${pageInfo.compName}_DynamicPage;\n   `;
        }
    })

    const content = `
            import dynamic from "next/dynamic";
            /**
             * Configs 
             */
            export const CMSconfig = ${JSON.stringify(config)};
            
            export const importThemeConfig = () => {
                return themeConfig;
            }
            export const importCMSConfig = () => {
                return CMSconfig;
            }
            
            /**
             * Page imports
             */
            export const pageNames = ${JSON.stringify(pageNames)};
            ${customPageImports}
            ${customPageDynamicImports}
            
            export const importPage = (pageName) => {
                ${customPageImportsSwitch}
                return undefined;
            }
            
            export const importDynamicPage = (pageName) => {
                ${customPageDynamicImportsSwitch}
                return undefined;
            }
            
            /**
             * Plugins
             */
            ${pluginImports}
            
            export const importPlugin = (pluginName) => {
            ${pluginImportsSwitch}
                return undefined;
            }
            ${dynamicPluginImports}
            
            export const importDynamicPlugin = (pluginName) => {
            ${dynamicPluginImportsSwitch}
                return undefined;
            }
        `

    fs.outputFileSync(`${buildDir}/imports/imports.gen.js`, content);


    // Create pages in Nex.js pages dir based on theme's pages

    console.log('customPagesLocalPath', pagesLocalDir)
    if (fs.existsSync(pagesLocalDir)) {
        fs.removeSync(pagesLocalDir);
    }

    themeExports.pagesInfo.forEach(pageInfo => {
        let globalCssImports = '';
        if (pageInfo.name === '_app' && appConfig && appConfig.globalCss &&
            Array.isArray(appConfig.globalCss) && appConfig.globalCss.length > 0) {
            appConfig.globalCss.forEach(css => {
                globalCssImports += `import '${css}';\n`
            })
        }

        let pageContent = `
                ${globalCssImports}
                const { createGetStaticProps, createGetStaticPaths, getPage } = require('build/renderer');
                
                const PageComp = getPage('${pageInfo.name}');
                
                export const getStaticProps = createGetStaticProps('${pageInfo.name}');
                
                export const getStaticPaths = createGetStaticPaths('${pageInfo.name}');
                
                export default PageComp;
            `;

        if (!pageInfo.path && pageInfo.fileContent) {
            pageContent = pageInfo.fileContent + '';
        }
        fs.outputFileSync(`${pagesLocalDir}/${pageInfo.name}.js`, pageContent);
    });

    // Create jsconfig for Next.js
    fs.outputFileSync(`${buildDir}/jsconfig.json`, `
    {
        "compilerOptions": {
          "baseUrl": "."
        }
      }
    `);


    // Link public dir in root to renderer's public dir for Next.js server
    if (!fs.existsSync(`${buildDir}/public`)) {
        try {
            lnk([`${projectRootDir}/public`], `${buildDir}`)
        } catch (e) { console.log(e) }
    }

    // Link renderer's build dir into next dir
    if (!fs.existsSync(`${buildDir}/build`)) {
        try {
            lnk([`${localDir}/build`], `${buildDir}`)
        } catch (e) { console.log(e) }
    }

};

main();




