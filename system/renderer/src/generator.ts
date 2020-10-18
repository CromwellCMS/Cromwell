import { TCmsConfig, setStoreItem, TPluginConfig } from '@cromwell/core';
import { readCMSConfigSync, readPluginsExports, readThemeExports } from '@cromwell/core-backend';
import { getRestAPIClient } from '@cromwell/core-frontend';
import makeEmptyDir from 'make-empty-dir';
import fs from 'fs-extra';
import gracefulfs from 'graceful-fs';
import { resolve, dirname } from 'path';
import symlinkDir from 'symlink-dir';
import { promisify } from 'util';
const mkdir = promisify(gracefulfs.mkdir);

const main = async () => {
    const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
    const projectRootDir = resolve(__dirname, '../../../').replace(/\\/g, '/');
    const config = readCMSConfigSync(projectRootDir);

    const themeMainConfig = await getRestAPIClient()?.getThemeMainConfig();
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
    });

    pluginInfos.forEach(info => {
        if (info.frontendPath) {
            pluginImports += `\nconst ${info.pluginName} = import('${info.frontendPath}');`;
            pluginImportsSwitch += `if (pluginName === '${info.pluginName}') return ${info.pluginName};\n`;

            dynamicPluginImports += `\nconst Dynamic${info.pluginName} = dynamic(() => import('${info.frontendPath}'));`;
            dynamicPluginImportsSwitch += `if (pluginName === '${info.pluginName}') return Dynamic${info.pluginName};\n   `;
        }
    });

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

            // customPageDynamicImports += `\nconst ${pageInfo.compName}_DynamicPage = dynamic(() => import('${pageInfo.path}'));`;
            customPageDynamicImports += `\nconst ${pageInfo.compName}_DynamicPage = dynamic(async () => {
                const pagePromise = import('${pageInfo.path}');
                const meta = await import('${pageInfo.metaInfoPath}');
                await importer.importSciptExternals(meta);
                return pagePromise;
            });`;

            customPageDynamicImportsSwitch += `    if (pageName === '${pageInfo.name}') return ${pageInfo.compName}_DynamicPage;\n   `;
        }
    })

    const content = `
            import dynamic from "next/dynamic";
            import { getModuleImporter } from '@cromwell/cromwella/build/importer.js';

            const importer = getModuleImporter();
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

    const disableSSR = false;

    console.log('pagesLocalDir', pagesLocalDir)
    await makeEmptyDir(pagesLocalDir, { recursive: true });

    for (const pageInfo of themeExports.pagesInfo) {
        let globalCssImports = '';
        if (pageInfo.name === '_app' && themeMainConfig && themeMainConfig.globalCss &&
            Array.isArray(themeMainConfig.globalCss) && themeMainConfig.globalCss.length > 0) {
            themeMainConfig.globalCss.forEach(css => {
                globalCssImports += `import '${css}';\n`
            })
        }

        const pageDynamicImportName = pageInfo.compName + '_DynamicPage';


        // pageDynamicImport = `
        // import ${pageDynamicImportName} from '${pageInfo.path}';
        // `;

        const cromwellStoreModulesPath = `CromwellStore.nodeModules.modules`;

        let pageContent = `
        ${globalCssImports}
        import React from 'react';
        import ReactDOM from 'react-dom';
        import dynamic from "next/dynamic";
        import NextLink from 'next/link';
        import { getModuleImporter } from '@cromwell/cromwella/build/importer.js';
        import { isServer, getStoreItem } from "@cromwell/core";
        const { createGetStaticProps, createGetStaticPaths, getPage, checkCMSConfig } = require('build/renderer');

        console.log('pageInfo.name', '${pageInfo.name}');

        const cmsConfig = ${JSON.stringify(config)};
        checkCMSConfig(cmsConfig);

        const importer = getModuleImporter();
        ${cromwellStoreModulesPath}['react'] = React;
        ${cromwellStoreModulesPath}['react'].didDefaultImport = true;
        ${cromwellStoreModulesPath}['react-dom'] = ReactDOM;
        ${cromwellStoreModulesPath}['react-dom'].didDefaultImport = true;
        ${cromwellStoreModulesPath}['next/link'] = NextLink;
        ${pageInfo.metaInfoPath ? `
        if (isServer()) {
            console.log('isServer pageInfo.name', '${pageInfo.name}');
            const metaInfo = require('${pageInfo.metaInfoPath}');
            importer.importSciptExternals(metaInfo);
        } else {
            window.React = React;
            window.ReactDOM = ReactDOM;
        }
        ` : ''}

        const ${pageDynamicImportName} = dynamic(async () => {
            ${pageInfo.metaInfoPath ? `
            const meta = await import('${pageInfo.metaInfoPath}');
            await importer.importSciptExternals(meta);
            ` : ''} 
            const pagePromise = import('${pageInfo.path}');
            console.log('pagePromise', pagePromise);
            const pageComp = await pagePromise;
            console.log('pageComp', pageComp);

            ${disableSSR ? `
            const browserGetStaticProps = createGetStaticProps('${pageInfo.name}', pageComp ? pageComp.getStaticProps : null);
            setTimeout(async () => {
                if (isServer()) return;
                try {
                    const props = await browserGetStaticProps();
                    console.log('browserGetStaticProps', props);
                    const forceUpdatePage = getStoreItem('forceUpdatePage');
                    forceUpdatePage(props.childStaticProps)
                } catch (e) {
                    console.log('browserGetStaticProps', e)
                }
            }, 3000)
            ` : ''}

            return pageComp.default;
        });;


        ${disableSSR ? `` : `
        const pageServerModule = require('${pageInfo.path}');

        export const getStaticProps = createGetStaticProps('${pageInfo.name}', pageServerModule ? pageServerModule.getStaticProps : null);
        
        export const getStaticPaths = createGetStaticPaths('${pageInfo.name}', pageServerModule ? pageServerModule.getStaticPaths : null);
        `}

        const PageComp = getPage('${pageInfo.name}', ${pageDynamicImportName});

        export default PageComp;
            `;

        if (!pageInfo.path && pageInfo.fileContent) {
            pageContent = pageInfo.fileContent + '';
        }

        const pagePath = `${pagesLocalDir}/${pageInfo.name}.js`;

        await mkdir(dirname(pagePath), { recursive: true })

        await fs.outputFile(pagePath, pageContent);
    };


    // Create jsconfig for Next.js
    await fs.outputFile(`${buildDir}/jsconfig.json`, `
    {
        "compilerOptions": {
          "baseUrl": "."
        }
      }
    `);


    // Link public dir in root to renderer's public dir for Next.js server
    if (!fs.existsSync(`${buildDir}/public`)) {
        try {
            await symlinkDir(`${projectRootDir}/public`, `${buildDir}/public`)
        } catch (e) { console.log(e) }
    }

    // Link renderer's build dir into next dir
    if (!fs.existsSync(`${buildDir}/build`)) {
        try {
            await symlinkDir(`${localDir}/build`, `${buildDir}/build`)
        } catch (e) { console.log(e) }
    }

};

main();




