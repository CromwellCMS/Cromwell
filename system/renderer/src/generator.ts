import { getStoreItem, setStoreItem, genericPageName } from '@cromwell/core';
import {
    getCmsModuleConfig,
    getModulePackage,
    getNodeModuleDir,
    getPublicDir,
    getRendererBuildDir,
    getRendererTempDir,
    getThemeBuildDir,
    readCMSConfig,
    readThemeExports,
    serverLogFor,
} from '@cromwell/core-backend';
import { bundledModulesDirName, downloader, getBundledModulesDir } from '@cromwell/utils';
import fs from 'fs-extra';
import makeEmptyDir from 'make-empty-dir';
import normalizePath from 'normalize-path';
import { dirname, resolve } from 'path';
import symlinkDir from 'symlink-dir';
import yargs from 'yargs-parser';

const localThemeBuildDurChunk = 'theme';
const disableSSR = false;

const main = async () => {
    const args = yargs(process.argv.slice(2));
    const scriptName = process.argv[2];

    const config = await readCMSConfig();
    if (config) setStoreItem('cmsSettings', config);

    const themeName = args.themeName ?? config?.defaultSettings?.themeName;
    if (!themeName) {
        serverLogFor('errors-only', 'No theme name provided', 'Error');
        return;
    }

    const themeDir = await getNodeModuleDir(themeName);
    if (!themeDir) {
        serverLogFor('errors-only', 'Theme directory was not found for: ' + themeName, 'Error');
        return;
    }

    const tempDir = getRendererTempDir();
    const tempDirPublic = resolve(tempDir, 'public');

    await fs.ensureDir(tempDir);

    const pckg = getModulePackage(themeName);
    if (pckg) await downloader({
        rootDir: process.cwd(),
        packages: [pckg],
    });

    if (scriptName === 'dev' || scriptName === 'build' || scriptName === 'buildStart') {
        await devGenerate(themeName);
    } else {
        await prodGenerate(themeName);
    }

    // Link public dir in root to renderer's public dir for Next.js server
    if (!fs.existsSync(tempDirPublic)) {
        try {
            await symlinkDir(getPublicDir(), tempDirPublic)
        } catch (e) { console.error(e) }
    }

    // Link bundled modules
    const bundledDir = getBundledModulesDir();
    const bundledPublicDir = resolve(getPublicDir(), bundledModulesDirName);
    if (!fs.existsSync(bundledPublicDir) && fs.existsSync(bundledDir)) {
        try {
            await symlinkDir(bundledDir, bundledPublicDir)
        } catch (e) { console.error(e) }
    }
};

const devGenerate = async (themeName: string) => {
    const tempDir = getRendererTempDir();
    const tempDirBuild = resolve(tempDir, 'build');
    const rendererBuildDir = getRendererBuildDir();
    const themeConfig = await getCmsModuleConfig(themeName);
    const config = getStoreItem('cmsSettings');
    const pagesLocalDir = resolve(tempDir, 'pages');

    // Read pages
    const themeExports = await readThemeExports(themeName);

    // Create pages in Nex.js pages dir based on theme's pages

    // console.log('pagesLocalDir', pagesLocalDir)
    await makeEmptyDir(tempDir, { recursive: true });
    await new Promise(done => setTimeout(done, 200));
    await fs.ensureDir(pagesLocalDir);

    // Add pages/[slug] page for dynamic pages creation in Admin Panel
    // if it was not created by theme
    const hasGenericPage = themeExports.pagesInfo.some(page => page.name === genericPageName)
    if (!hasGenericPage) {
        themeExports.pagesInfo.push({
            name: genericPageName,
            compName: 'pages__slug_',
        });
    }

    for (const pageInfo of themeExports.pagesInfo) {

        const pageRelativePath: string | undefined = pageInfo.path ? normalizePath(pageInfo.path).replace(
            normalizePath(themeExports.themeBuildDir), localThemeBuildDurChunk) : undefined;

        let metaInfoRelativePath;
        if (pageInfo.metaInfoPath) metaInfoRelativePath = normalizePath(
            pageInfo.metaInfoPath).replace(normalizePath(themeExports.themeBuildDir), localThemeBuildDurChunk);

        let globalCssImports = '';
        if (pageInfo.name === '_app' && themeConfig?.globalCss && pageRelativePath &&
            themeConfig.globalCss?.length > 0) {
            themeConfig.globalCss.forEach(css => {
                if (css.startsWith('.')) {
                    css = normalizePath(resolve(tempDir, dirname(pageRelativePath), css)).replace(
                        normalizePath(tempDir) + '/', '');
                }
                globalCssImports += `import '${css}';\n`
            })
        }

        const pageDynamicImportName = pageInfo.compName + '_DynamicPage';

        const cromwellStoreModulesPath = `CromwellStore.nodeModules.modules`;

        const pageImports = `
         import React from 'react';
         import ReactDOM from 'react-dom';
         import dynamic from 'next/dynamic';
         import NextLink from 'next/link';
         import NextHead from 'next/head';
         import * as cromwellCore from '@cromwell/core';
         import * as cromwellCoreFrontend from '@cromwell/core-frontend';
         import * as reactIs from 'react-is';
         import * as NextRouter from 'next/router';
         import ReactHtmlParser from 'react-html-parser';
         import Document, { Html, Main, NextScript } from 'next/document';
         import { getModuleImporter } from '@cromwell/utils/build/importer.js';
         import { isServer, getStoreItem, setStoreItem } from "@cromwell/core";
         import { createGetStaticProps, createGetStaticPaths, getPage, checkCMSConfig, 
             fsRequire } from 'build/renderer';
 
 
         const cmsSettings = ${JSON.stringify(config)};
         checkCMSConfig(cmsSettings, getStoreItem, setStoreItem);
         
         const importer = getModuleImporter();
         ${cromwellStoreModulesPath}['react'] = React;
         ${cromwellStoreModulesPath}['react'].didDefaultImport = true;
         ${cromwellStoreModulesPath}['react-dom'] = ReactDOM;
         ${cromwellStoreModulesPath}['react-dom'].didDefaultImport = true;
         ${cromwellStoreModulesPath}['next/link'] = NextLink;
         ${cromwellStoreModulesPath}['next/router'] = NextRouter;
         ${cromwellStoreModulesPath}['next/dynamic'] = dynamic;
         ${cromwellStoreModulesPath}['next/head'] = NextHead;
         ${cromwellStoreModulesPath}['@cromwell/core'] = cromwellCore;
         ${cromwellStoreModulesPath}['@cromwell/core'].didDefaultImport = true;
         ${cromwellStoreModulesPath}['@cromwell/core-frontend'] = cromwellCoreFrontend;
         ${cromwellStoreModulesPath}['@cromwell/core-frontend'].didDefaultImport = true;
         ${cromwellStoreModulesPath}['react-is'] = reactIs;
         ${cromwellStoreModulesPath}['react-is'].didDefaultImport = true;
         ${cromwellStoreModulesPath}['react-html-parser'] = ReactHtmlParser;
         ${cromwellStoreModulesPath}['react-html-parser'].didDefaultImport = true;
 
         ${pageInfo.metaInfoPath ? `
         if (isServer()) {
             const metaInfo = fsRequire("${pageInfo.metaInfoPath}", true);
             importer.importSciptExternals(metaInfo);
         }
         ` : ''}
         `;
        let pageContent = `
         ${globalCssImports}
         ${pageImports}
 
         const ${pageDynamicImportName} = dynamic(async () => {
 
             ${pageInfo.depsBundlePath ? `
             if (!importer.hasBeenExecuted) {
                 await import('${pageInfo.depsBundlePath}');
             }
             ` : ''}
 
             ${pageInfo.metaInfoPath ? `
             const meta = await import('${metaInfoRelativePath}');
             await importer.importSciptExternals(meta);
             ` : ''}

             ${pageRelativePath ? `
             const pagePromise = import('${pageRelativePath}');
             const pageComp = await pagePromise;
 
             ${disableSSR ? `
             const browserGetStaticProps = createGetStaticProps('${pageInfo.name}', pageComp ? pageComp.getStaticProps : null);
             setTimeout(async () => {
                 if (isServer()) return;
                 try {
                     const props = await browserGetStaticProps();
                     console.log('browserGetStaticProps', props);
                     const forceUpdatePage = getStoreItem('forceUpdatePage');
                     forceUpdatePage(props.childStaticProps);
                     // forceUpdatePage();
                 } catch (e) {
                     console.log('browserGetStaticProps', e)
                 }
             }, 3000)
             ` : ''}
 
             return getPage('${pageInfo.name}', pageComp.default);
             
             ` :

                `
            return (() => null);
            `}
         });;
 
 
         ${!disableSSR && pageRelativePath ? `
         const pageServerModule = require('${pageRelativePath}');
 
         export const getStaticProps = createGetStaticProps('${pageInfo.name}', pageServerModule ? pageServerModule.getStaticProps : null);
         
         export const getStaticPaths = createGetStaticPaths('${pageInfo.name}', pageServerModule ? pageServerModule.getStaticPaths : null);
         `: ''}

         ${(pageInfo.name === genericPageName && !hasGenericPage) ? `
         export const getStaticProps = createGetStaticProps('${pageInfo.name}', null);

         export const getStaticPaths = function () {
            return {
                paths: [],
                fallback: true
            };
        };
         ` : ''}
 
         export default ${pageDynamicImportName};
         `;

        if (!pageInfo.path && pageInfo.fileContent) {
            pageContent = pageInfo.fileContent + '';
        }

        if (pageInfo.name === '_document') {
            pageContent = `
             ${pageImports}
 
             ${pageInfo.fileContent}
             `
        }

        const pagePath = resolve(pagesLocalDir, pageInfo.name + '.js');

        await fs.ensureDir(dirname(pagePath));
        await fs.outputFile(pagePath, pageContent);
    };

    // Create jsconfig for Next.js
    const jsconfigPath = resolve(tempDir, 'jsconfig.json')
    if (!fs.existsSync(jsconfigPath)) {
        await fs.outputFile(jsconfigPath, `
         {
             "compilerOptions": {
             "baseUrl": "."
             }
         }
         `);
    }


    // Create next.config.js
    const themePckgJsonPath = resolve(themeExports.themeDir, 'package.json');
    const themePckg = require(themePckgJsonPath);
    const nextConfigPath = resolve(tempDir, 'next.config.js');
    if (!fs.existsSync(nextConfigPath)) {
        await fs.outputFile(nextConfigPath, `
             module.exports = {
                 webpack: (config, { isServer }) => {
                     config.resolve.symlinks = false
                     // Fixes npm packages that depend on 'fs' module
                     if (!isServer) {
                         config.node = {
                             fs: 'empty',
                             module: 'empty',
                             path: 'empty'
                         }
                     }
                     return config
                 }
             };`
        );
    }

    // Link renderer's build dir into next dir
    if (!fs.existsSync(tempDirBuild) && rendererBuildDir) {
        try {
            await symlinkDir(rendererBuildDir, tempDirBuild)
        } catch (e) { console.error(e) }
    }

    // Link theme's build dir
    const localThemeBuildDir = resolve(tempDir, localThemeBuildDurChunk);
    try {
        await symlinkDir(themeExports.themeBuildDir, localThemeBuildDir)
    } catch (e) { console.error(e) }

}

const prodGenerate = async (themeName: string) => {
    // if prod, recreate .next dir from theme's build dir
    const themeBuildDir = await getThemeBuildDir(themeName);
    const rendererTempNextDir = resolve(getRendererTempDir(), '.next');

    if (themeBuildDir) {
        const themeNextBuildDir = resolve(themeBuildDir, '.next');
        if (fs.existsSync(themeNextBuildDir)) {
            await fs.remove(rendererTempNextDir);
            await fs.copy(themeNextBuildDir, rendererTempNextDir);
        }
    }
}

main();




