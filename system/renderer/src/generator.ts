import { readCMSConfigSync, readThemeExports } from '@cromwell/core-backend';
import { getRestAPIClient } from '@cromwell/core-frontend';
import fs from 'fs-extra';
import gracefulfs from 'graceful-fs';
import makeEmptyDir from 'make-empty-dir';
import { dirname, resolve } from 'path';
import symlinkDir from 'symlink-dir';
import { promisify } from 'util';
import normalizePath from 'normalize-path';

const mkdir = promisify(gracefulfs.mkdir);

const disableSSR = false;

const main = async () => {
    const projectRootDir = resolve(__dirname, '../../../');
    const config = readCMSConfigSync(projectRootDir);

    const themeMainConfig = await getRestAPIClient()?.getThemeMainConfig();
    const localDir = resolve(__dirname, '../');
    const tempDir = resolve(localDir, '.cromwell');
    const pagesLocalDir = resolve(tempDir, 'pages');
    const localThemeBuildDurChunk = 'theme';

    // Read pages
    const themeExports = await readThemeExports(projectRootDir, config.themeName);

    // Create pages in Nex.js pages dir based on theme's pages

    // console.log('pagesLocalDir', pagesLocalDir)
    await makeEmptyDir(pagesLocalDir, { recursive: true });

    for (const pageInfo of themeExports.pagesInfo) {

        const pageRelativePath = normalizePath(pageInfo.path).replace(
            normalizePath(themeExports.themeBuildDir), localThemeBuildDurChunk);

        let metaInfoRelativePath;
        if (pageInfo.metaInfoPath) metaInfoRelativePath = normalizePath(
            pageInfo.metaInfoPath).replace(normalizePath(themeExports.themeBuildDir), localThemeBuildDurChunk);

        let globalCssImports = '';
        if (pageInfo.name === '_app' && themeMainConfig && themeMainConfig.globalCss &&
            Array.isArray(themeMainConfig.globalCss) && themeMainConfig.globalCss.length > 0) {
            themeMainConfig.globalCss.forEach(css => {
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
        import * as NextRouter from 'next/router';
        import Document, { Html, Main, NextScript } from 'next/document';
        import { getModuleImporter } from '@cromwell/cromwella/build/importer.js';
        import { isServer, getStoreItem, setStoreItem } from "@cromwell/core";
        import { createGetStaticProps, createGetStaticPaths, getPage, checkCMSConfig, 
            fsRequire, importRendererDepsFrontend } from 'build/renderer';


        const cmsConfig = ${JSON.stringify(config)};
        checkCMSConfig(cmsConfig, getStoreItem, setStoreItem);
        
        const importer = getModuleImporter();
        ${cromwellStoreModulesPath}['react'] = React;
        ${cromwellStoreModulesPath}['react'].didDefaultImport = true;
        ${cromwellStoreModulesPath}['react-dom'] = ReactDOM;
        ${cromwellStoreModulesPath}['react-dom'].didDefaultImport = true;
        ${cromwellStoreModulesPath}['next/link'] = NextLink;
        ${cromwellStoreModulesPath}['next/router'] = NextRouter;
        ${cromwellStoreModulesPath}['next/dynamic'] = dynamic;
        ${cromwellStoreModulesPath}['next/head'] = NextHead;
        // ${cromwellStoreModulesPath}['next/document'] = dynamic;

        ${pageInfo.metaInfoPath ? `
        if (isServer()) {
            console.log('isServer pageInfo.name', '${pageInfo.name}');
            const metaInfo = fsRequire("${pageInfo.metaInfoPath}", true);
            importer.importSciptExternals(metaInfo);
        }
        ` : ''}
        `
        let pageContent = `
        ${globalCssImports}
        ${pageImports}

        const ${pageDynamicImportName} = dynamic(async () => {
            await importRendererDepsFrontend();
            ${pageInfo.metaInfoPath ? `
            const meta = await import('${metaInfoRelativePath}');
            await importer.importSciptExternals(meta);
            ` : ''} 
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
        });;


        ${!disableSSR ? `
        const pageServerModule = require('${pageRelativePath}');

        export const getStaticProps = createGetStaticProps('${pageInfo.name}', pageServerModule ? pageServerModule.getStaticProps : null);
        
        export const getStaticPaths = createGetStaticPaths('${pageInfo.name}', pageServerModule ? pageServerModule.getStaticPaths : null);
        `: ''}

        

        export default ${pageDynamicImportName};
        `;

        if (!pageInfo.path && pageInfo.fileContent) {
            pageContent = pageInfo.fileContent + '';
        }

        console.log('pageInfo.name', pageInfo.name);
        if (pageInfo.name === '_document') {
            pageContent = `
            ${pageImports}

            ${pageInfo.fileContent}
            `
        }

        const pagePath = resolve(pagesLocalDir, pageInfo.name + '.js');

        await mkdir(dirname(pagePath), { recursive: true })

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
    const nextConfigPath = resolve(tempDir, 'next.config.js');
    if (!fs.existsSync(nextConfigPath)) {
        await fs.outputFile(nextConfigPath, `
        module.exports = {
            webpack: (config, { isServer }) => {
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
        }`);
    }

    const tempDirPublic = resolve(tempDir, 'public');
    const tempDirBuild = resolve(tempDir, 'build')
    // Link public dir in root to renderer's public dir for Next.js server
    if (!fs.existsSync(tempDirPublic)) {
        try {
            await symlinkDir(resolve(projectRootDir, 'public'), tempDirPublic)
        } catch (e) { console.log(e) }
    }

    // Link renderer's build dir into next dir
    if (!fs.existsSync(tempDirBuild)) {
        try {
            await symlinkDir(resolve(localDir, 'build'), tempDirBuild)
        } catch (e) { console.log(e) }
    }

    // Link theme's build dir
    const localThemeBuildDir = resolve(tempDir, localThemeBuildDurChunk);
    // try {
    //     await symlinkDir(themeExports.themeBuildDir, localThemeBuildDir)
    // } catch (e) { console.log(e) }
    await makeEmptyDir(localThemeBuildDir);
    await fs.copy(themeExports.themeBuildDir, localThemeBuildDir)


};

main();




