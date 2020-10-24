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

const disableSSR = false;

const main = async () => {
    const projectRootDir = resolve(__dirname, '../../../');
    const config = readCMSConfigSync(projectRootDir);

    const themeMainConfig = await getRestAPIClient()?.getThemeMainConfig();
    const localDir = resolve(__dirname, '../');
    const tempDir = resolve(localDir, '.cromwell');
    const pagesLocalDir = resolve(tempDir, 'pages');

    // Read pages
    const themeExports = await readThemeExports(projectRootDir, config.themeName);

    // Create pages in Nex.js pages dir based on theme's pages

    // console.log('pagesLocalDir', pagesLocalDir)
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
        import dynamic from 'next/dynamic';
        import NextLink from 'next/link';
        import * as NextRouter from 'next/router';
        import { getModuleImporter } from '@cromwell/cromwella/build/importer.js';
        import { isServer, getStoreItem } from "@cromwell/core";
        import { createGetStaticProps, createGetStaticPaths, getPage, checkCMSConfig, fsRequire } from 'build/renderer';


        const cmsConfig = ${JSON.stringify(config)};
        checkCMSConfig(cmsConfig);
        
        const importer = getModuleImporter();
        ${cromwellStoreModulesPath}['react'] = React;
        ${cromwellStoreModulesPath}['react'].didDefaultImport = true;
        ${cromwellStoreModulesPath}['react-dom'] = ReactDOM;
        ${cromwellStoreModulesPath}['react-dom'].didDefaultImport = true;
        ${cromwellStoreModulesPath}['next/link'] = NextLink;
        ${cromwellStoreModulesPath}['next/router'] = NextRouter;
        ${cromwellStoreModulesPath}['next/dynamic'] = dynamic;

        // TEMP
        ${cromwellStoreModulesPath}['@cromwell/core-frontend'] = require('@cromwell/core-frontend');
        
        ${pageInfo.metaInfoPath ? `
        if (isServer()) {
            console.log('isServer pageInfo.name', '${pageInfo.name}');
            const metaInfo = fsRequire("${pageInfo.metaInfoPath}", true);
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
                    forceUpdatePage(props.childStaticProps);
                    // forceUpdatePage();
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

        const pagePath = resolve(pagesLocalDir, pageInfo.name + '.js');

        await mkdir(dirname(pagePath), { recursive: true })

        await fs.outputFile(pagePath, pageContent);
    };


    // Create jsconfig for Next.js
    await fs.outputFile(resolve(tempDir, 'jsconfig.json'), `
    {
        "compilerOptions": {
          "baseUrl": "."
        }
    }
    `);

    // Create next.config.js
    await fs.outputFile(resolve(tempDir, 'next.config.js'), `
    module.exports = {
        webpack: (config, { isServer }) => {
            // Fixes npm packages that depend on 'fs' module
            if (!isServer) {
                config.node = {
                    fs: 'empty',
                    module: 'empty',
                }
            }
            return config
        }
    }`);

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

};

main();




