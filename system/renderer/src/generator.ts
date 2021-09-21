import { bundledModulesDirName, genericPageName, getRandStr, setStoreItem, sleep, TScriptMetaInfo } from '@cromwell/core';
import {
    configFileName,
    getBundledModulesDir,
    getCmsModuleConfig,
    getCmsModuleInfo,
    getLogger,
    getModulePackage,
    getNodeModuleDir,
    getPublicDir,
    getRendererBuildDir,
    getRendererTempDevDir,
    getRendererTempDir,
    getThemeBuildDir,
    readCMSConfig,
} from '@cromwell/core-backend';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { dirname, resolve } from 'path';
import symlinkDir from 'symlink-dir';

import { readThemeExports } from './helpers/readThemeExports';
import { jsOperators } from './helpers/helpers';

const localThemeBuildDurChunk = 'theme';
const disableSSR = false;
const logger = getLogger();

export const generator = async (options: {
    scriptName: string;
    targetThemeName?: string;
}) => {
    const { scriptName, targetThemeName } = options
    const config = await readCMSConfig();
    if (config) setStoreItem('cmsSettings', config);

    const themeName = targetThemeName ?? config?.defaultSettings?.publicSettings?.themeName;
    if (!themeName) {
        logger.error('No theme name provided');
        return;
    }

    const themeDir = await getNodeModuleDir(themeName);
    if (!themeDir) {
        logger.error('Theme directory was not found for: ' + themeName);
        return;
    }

    if (scriptName === 'dev' || scriptName === 'build' || scriptName === 'buildStart') {
        await devGenerate(themeName, options);
    } else {
        await prodGenerate(themeName, options);
    }
};

const devGenerate = async (themeName: string, options) => {
    const tempDir = getRendererTempDevDir();
    const tempDirBuild = resolve(tempDir, 'build');
    const rendererBuildDir = getRendererBuildDir();
    const themeConfig = await getCmsModuleConfig(themeName);
    const pagesLocalDir = resolve(tempDir, 'pages');
    const themeDir = await getNodeModuleDir(themeName);
    const themePackageInfo = await getCmsModuleInfo(themeName);

    await linkFiles(tempDir, themeName, options);

    // Read pages
    const themeExports = await readThemeExports(themeName);

    // Create pages in Nex.js pages dir based on theme's pages
    await fs.ensureDir(tempDir);
    await sleep(0.1);
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
        const cromwellStoreModulesPath = `importer.modules`;
        const cromwellStoreStatusesPath = `importer.importStatuses`;

        const defaultImported = ['react', 'react-dom', 'next/dynamic', 'next/link', 'next/head', '@cromwell/core',
            '@cromwell/core-frontend', 'react-is', 'next/document', 'next/router',
            'next/image', 'next/amp', 'react-html-parser'
        ]

        const pageRelativePath: string | undefined = pageInfo.path ? normalizePath(pageInfo.path).replace(
            normalizePath(themeExports.themeBuildDir), localThemeBuildDurChunk) : undefined;

        let depsBundlePath;
        if (pageInfo.depsBundlePath) {
            depsBundlePath = normalizePath(pageInfo.depsBundlePath).replace(
                normalizePath(themeExports.themeBuildDir), localThemeBuildDurChunk);
        }

        // Expose used dependencies as Frontend dependencies based on metaInfo file 
        // so that they will be available to re-use by Plugins.
        const metaInfo: TScriptMetaInfo = pageInfo.metaInfoPath ? fs.readJSONSync(pageInfo.metaInfoPath) : {};
        const externals = metaInfo?.externalDependencies ?? {};

        let importExtStr = '';

        Object.keys(externals).forEach(depName => {
            importExtStr += '\n';
            const pckgChunks = depName.split('@');
            pckgChunks.pop(); // pckgVersion
            const pckgName = pckgChunks.join('@');

            if (defaultImported.includes(pckgName)) return;
            if (!themePackageInfo?.frontendDependencies?.length) return;
            if (!themePackageInfo.frontendDependencies.includes(pckgName)) return;
            if (themePackageInfo.bundledDependencies?.includes(pckgName)) return;
            if (themePackageInfo.firstLoadedDependencies?.includes(pckgName)) return;

            const pckgHash = getRandStr(4);
            const pckgNameStripped = pckgName.replace(/\W/g, '_');

            if (externals[depName].includes('default')) {
                // Simple case. Import external entirely, using `import * as lib from 'lib';`
                importExtStr += `\nimport * as ${pckgNameStripped}_${pckgHash} from '${pckgName}';`;
                importExtStr += `\n${cromwellStoreModulesPath}['${pckgName}'] = ${pckgNameStripped}_${pckgHash};`;
                importExtStr += `\n${cromwellStoreStatusesPath}['${pckgName}'] = 'default';`;
            } else {
                // Make used imports be instantly available inside a Frontend dependency
                let namedImports = '';
                externals[depName].forEach(named => {
                    namedImports += `${named} as ${named}_${pckgHash}, `;
                });
                importExtStr += `\nimport { ${namedImports} } from '${pckgName}';`;
                importExtStr += `\n${cromwellStoreModulesPath}['${pckgName}'] = {};`;
                externals[depName].forEach(ext => {
                    importExtStr += `\n${cromwellStoreModulesPath}['${pckgName}']['${ext}'] = ${ext}_${pckgHash};`;
                });

                // Make all other exports of external to be available to load additionally into the Frontend dependency
                let allExports: string[] = [];
                try {
                    const pckg = require(pckgName);
                    allExports = Object.keys(pckg);
                } catch (error) {
                    console.error(`Failed to require() package: ${pckgName} during generation of Frontend dependencies`, error);
                }
                importExtStr += `\nif (!importer.imports['${pckgName}']) importer.imports['${pckgName}'] = {};\n`;
                allExports.forEach(otherExport => {
                    if (jsOperators.includes(otherExport)) return;
                    // Generate chunk
                    const otherExportStripped = otherExport.replace(/\W/g, '_') + getRandStr(5);
                    const exportChunkName = `${pckgNameStripped}_${otherExport.replace(/\W/g, '_')}.js`;
                    const chunkPath = resolve(tempDir, 'chunks', exportChunkName);
                    fs.outputFileSync(chunkPath, `import {${otherExport}} from '${pckgName}'; export default ${otherExport};`)

                    importExtStr += `\nconst load_${otherExportStripped} = async () => { \n`;
                    importExtStr += `   const chunk = await import('${normalizePath(chunkPath)}');\n`;
                    importExtStr += `   ${cromwellStoreModulesPath}['${pckgName}']['${otherExport}'] = chunk.default || chunk; }`;

                    importExtStr += `\nimporter.imports['${pckgName}']['${otherExport}'] = load_${otherExportStripped};`
                    importExtStr += `\nimporter.importStatuses['${pckgName}'] = 'ready';`
                });
                importExtStr += `\nimporter.imports['${pckgName}']['default'] = async () => { const chunk = await import('${pckgName}'); ${cromwellStoreModulesPath}['${pckgName}']['default'] = chunk.default || chunk; };`
            }
        });


        let importDefaultStr = '';
        // Make imports for standard always-packaged externals.
        defaultImported.forEach(depName => {
            const pckgHash = getRandStr(4);
            const pckgNameStripped = depName.replace(/\W/g, '_');

            importDefaultStr += `\nimport * as ${pckgNameStripped}_${pckgHash} from '${depName}';`;
            importDefaultStr += `\n${cromwellStoreModulesPath}['${depName}'] = ${pckgNameStripped}_${pckgHash};`;
            importDefaultStr += `\n${cromwellStoreStatusesPath}['${depName}'] = 'default';`;
        });

        // Add global CSS into _app
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

        const pageImports = `
         import { getModuleImporter } from '@cromwell/core-frontend';
         import { checkCMSConfig } from 'build/renderer';
         ${pageInfo.name !== '_document' ? `
         import { getPage, createGetStaticPaths, createGetStaticProps } from 'build/renderer';
         ` : ''}
 
         checkCMSConfig();
         
         const importer = getModuleImporter();
 
         ${importDefaultStr}
         ${importExtStr}
         `;

        let pageContent = `
         ${globalCssImports}
         ${pageImports}

         ${depsBundlePath ? `
         import '${depsBundlePath}';
         ` : ''}

         import ${pageInfo.compName} from '${pageRelativePath}';
 
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
 
         export default getPage('${pageInfo.name}', ${pageInfo.compName});
         `;

        if (!pageInfo.path && pageInfo.fileContent) {
            pageContent = pageInfo.fileContent + '';
        }

        if (pageInfo.name === '_document') {
            pageContent = `
             ${pageImports}
 
             ${pageInfo.fileContent}
             `
        } else {
            const globalStyles = `
            import 'pure-react-carousel/dist/react-carousel.es.css';
            import 'react-image-lightbox/style.css';
            import '@cromwell/renderer/build/editor-styles.css';
            import '@cromwell/core-frontend/dist/_index.css';
            `;

            pageContent = globalStyles + '\n' + pageContent;
        }

        const pagePath = resolve(pagesLocalDir, pageInfo.name + '.js');

        await fs.ensureDir(dirname(pagePath));
        try {
            await fs.outputFile(pagePath, pageContent);
        } catch (error) {
            logger.error(error);
        }
    }

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
            const cromwellConf = {
                webpack: (config, { isServer }) => {
                    config.resolve.symlinks = false
                    return config
                }
            }
            ${themeConfig?.nextConfig && themeDir ? `
            const themeConf = require('${normalizePath(themeDir)}/${configFileName}').nextConfig();
            ` : `
            const themeConf = {};
            `}
            module.exports = Object.assign({}, cromwellConf, themeConf);
            `

        );
    }

    // Link renderer's build dir into next dir
    if (!fs.existsSync(tempDirBuild) && rendererBuildDir) {
        try {
            await symlinkDir(rendererBuildDir, tempDirBuild)
        } catch (e) { console.error(e) }
    }
}

const prodGenerate = async (themeName: string, options) => {
    // if prod, recreate .next dir from theme's build dir
    const tempDir = getRendererTempDir();
    await linkFiles(tempDir, themeName, options);

    const themeBuildDir = await getThemeBuildDir(themeName);
    const rendererTempNextDir = resolve(getRendererTempDir(), '.next');

    if (themeBuildDir) {
        const themeNextBuildDir = resolve(themeBuildDir, '.next');
        if (fs.existsSync(themeNextBuildDir)) {
            await fs.remove(rendererTempNextDir);
            await sleep(0.1);
            await fs.copy(themeNextBuildDir, rendererTempNextDir);
            await sleep(0.1);
        }
    }
}

const linkFiles = async (tempDir: string, themeName: string, options) => {
    const tempDirPublic = resolve(tempDir, 'public');

    await fs.ensureDir(tempDir);

    const pckg = await getModulePackage(themeName);
    const { downloader } = require('@cromwell/utils/build/downloader');
    if (pckg) await downloader({
        rootDir: process.cwd(),
        packages: [pckg],
    });

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

    // Output .env file
    let envContent = '';
    if (options.serverUrl) {
        envContent += `API_URL=${options.serverUrl}`;
        await fs.outputFile(resolve(tempDir, '.env.local'), envContent);
    }
}