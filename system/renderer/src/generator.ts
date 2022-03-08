import { bundledModulesDirName, getRandStr, setStoreItem, sleep } from '@cromwell/core';
import { readCMSConfig } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import {
    getBundledModulesDir,
    getCmsModuleConfig,
    getCmsModuleInfo,
    getModuleStaticDir,
    getNodeModuleDir,
    getPublicDir,
    getPublicThemesDir,
    getRendererTempDevDir,
    configFileName,
    getRendererTempDir,
    getThemeBuildDir,
} from '@cromwell/core-backend/dist/helpers/paths';
import { getRestApiClient } from '@cromwell/core-frontend/dist/api/CRestApiClient';
import { interopDefaultContent } from '@cromwell/utils/build/shared';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import glob from 'glob';
import normalizePath from 'normalize-path';
import { dirname, join, resolve } from 'path';
import symlinkDir from 'symlink-dir';
import decache from 'decache';

import { defaultGenericPageContent, defaultCss, tsConfigContent } from './helpers/defaultContents';
import { jsOperators } from './helpers/helpers';

const logger = getLogger();

type TOptions = {
    scriptName: string;
    targetThemeName?: string;
    watch?: boolean;
}

const pagesStore: Record<string, {
    path: string;
}> = {}

export const generator = async (options: TOptions) => {
    const { scriptName, targetThemeName } = options;
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

const devGenerate = async (themeName: string, options: TOptions) => {
    const tempDir = normalizePath(getRendererTempDevDir());
    const themePackageInfo = await getCmsModuleInfo(themeName);
    const themeDir = normalizePath(process.cwd());

    await linkFiles(tempDir, themeName, options);

    // Create pages in Nex.js pages dir based on theme's pages
    await fs.ensureDir(tempDir);
    await sleep(0.1);

    const pagesDir = await getPagesDir();

    // Add pages/[slug] page for dynamic pages creation in Admin Panel
    // if it was not created by theme
    const rootPages = await fs.readdir(pagesDir);
    const genericPagePath = join(pagesDir, 'pages/[slug].jsx');
    if (!rootPages.includes('pages') && ! await fs.pathExists(genericPagePath)) {
        await fs.outputFile(genericPagePath, defaultGenericPageContent);
    }

    // Make all exports of Frontend dependencies to be available to load 
    // in the browser
    let fdImports = `
    import { getModuleImporter } from '@cromwell/core-frontend';
    import { isServer } from '@cromwell/core';

    const importer = getModuleImporter();

    const checkDidDefaultImport = (name) => importer.importStatuses[name] === 'default';

    ${interopDefaultContent}\n`;


    const defaultImported = ['react', 'react-dom', 'next/dynamic', '@cromwell/core',
        '@cromwell/core-frontend', 'react-is', 'next/link', 'next/head', 'next/document',
        'next/router',];
    // Make imports for standard always-packaged externals.
    defaultImported.forEach(depName => {
        const pckgHash = getRandStr(4);
        const pckgNameStripped = depName.replace(/\W/g, '_');

        fdImports += `\nimport * as ${pckgNameStripped}_${pckgHash} from '${depName}';`;
        fdImports += `\nimporter.modules['${depName}'] = interopDefault(${pckgNameStripped}_${pckgHash}, 'default');`;
        fdImports += `\nimporter.importStatuses['${depName}'] = 'default';`;
    });

    const defaultFd = ['next/image', 'next/amp', 'react-html-parser'];
    const frontendDependencies = themePackageInfo?.frontendDependencies ?? [];
    const firstLoadedDependencies = themePackageInfo?.firstLoadedDependencies ?? [];

    for (const fd of defaultFd) {
        if (!frontendDependencies.includes(fd)) frontendDependencies.push(fd);
    }
    for (const fd of firstLoadedDependencies) {
        if (!frontendDependencies.includes(fd)) frontendDependencies.push(fd);
    }

    const processedFds: string[] = [...defaultImported];

    for (const dependency of frontendDependencies) {
        const pckgName = typeof dependency === 'object' ? dependency.name : dependency;
        if (processedFds.includes(pckgName)) continue;
        processedFds.push(pckgName);

        const pckgNameStripped = pckgName.replace(/\W/g, '_');
        const pckgHash = getRandStr(4);

        if (firstLoadedDependencies.includes(pckgName)) {
            // Bundle entirely
            fdImports += `\nimport * as ${pckgNameStripped}_${pckgHash} from '${pckgName}';`;
            fdImports += `\nimporter.modules['${pckgName}'] = interopDefault(${pckgNameStripped}_${pckgHash}, 'default');`;
            fdImports += `\nimporter.importStatuses['${pckgName}'] = 'default';`;
            continue;
        }

        fdImports += `
        if (isServer()) {
            const ${pckgNameStripped}_${pckgHash}_node = require('${pckgName}');
            importer.modules['${pckgName}'] = interopDefault(${pckgNameStripped}_${pckgHash}_node, 'default');
            importer.importStatuses['${pckgName}'] = 'default';
        }`

        // Bundle as loadable chunks
        let allExports: string[] = [];
        try {
            const pckg = require(pckgName);
            allExports = Object.keys(pckg);
        } catch (error) {
            console.error(`Failed to require() package: ${pckgName} during generation of Frontend dependencies`, error);
        }

        fdImports += `\nif (!importer.imports['${pckgName}']) importer.imports['${pckgName}'] = {};\n`;
        fdImports += `\nif (!importer.modules['${pckgName}']) importer.modules['${pckgName}'] = {};\n`;
        fdImports += `\nimporter.importStatuses['${pckgName}'] = 'ready';`
        fdImports += `\nimporter.imports['${pckgName}']['default'] = async () => { 
            if (checkDidDefaultImport('${pckgName}')) return; 
            importer.modules['${pckgName}'] = interopDefault(await import('${pckgName}'), 'default');
        };`

        allExports.forEach(otherExport => {
            if (jsOperators.includes(otherExport)) return;
            // Generate chunk
            const otherExportStripped = otherExport.replace(/\W/g, '_') + getRandStr(5).toLowerCase();
            const exportChunkName = `${pckgNameStripped}_${otherExport.replace(/\W/g, '_')}_${getRandStr(4)}.js`.toLowerCase();
            const chunkPath = resolve(tempDir, 'chunks', exportChunkName);
            fs.outputFileSync(chunkPath, `import {${otherExport}} from '${pckgName}'; export default ${otherExport};`)


            fdImports += `
            const load_${otherExportStripped} = async () => {
               if (checkDidDefaultImport('${pckgName}')) return;  
               const chunk = await import('${normalizePath(chunkPath)}');
               importer.modules['${pckgName}']['${otherExport}'] = interopDefault(chunk, '${otherExport}'); 
            }
            importer.imports['${pckgName}']['${otherExport}'] = load_${otherExportStripped}
            `;
        });
    }

    await fs.outputFile(join(tempDir, 'generated-imports.js'), fdImports);

    // Link src dir
    const srcDestLink = resolve(tempDir, 'src');
    if (! await fs.pathExists(srcDestLink)) {
        try {
            await symlinkDir(resolve(themeDir, 'src'), srcDestLink);
        } catch (e) { console.error(e) }
    }

    const pagesGlobStr = normalizePath(pagesDir) + '/**/*.+(js|jsx|ts|tsx)';
    const pagePaths = glob.sync(pagesGlobStr).map(p => normalizePath(p));
    let hasApp = false;

    for (const pagePath of pagePaths) {
        const pageName = await getPageName(pagePath);
        if (pageName === '_app') {
            hasApp = true;
        }
        pagesStore[pageName] = { path: pagePath }
        await devGeneratePageWrapper(pagePath);
    }

    if (!hasApp) {
        generateDefaultApp();
    }

    const nextConfigPath = normalizePath(resolve(tempDir, 'next.config.js'));
    const themeNextConfPath = normalizePath(resolve(themeDir, 'next.config.js'));
    const themeHasNextConf = await fs.pathExists(themeNextConfPath);

    await fs.outputFile(nextConfigPath, `
        const makeProperties = (obj, str) => {
            let target = obj;
            for (const prop of str.split('.')) {
                if (!target[prop]) target[prop] = {};
                target = target[prop];
            }
        }

        ${themeHasNextConf ? `
        const themeConfig = require('${themeNextConfPath}');
        ` : `
        const themeConfig = {};
        `}

        const cromwellConfig = {
            webpack: (config, options) => {
                makeProperties(config, 'resolve');
                config.resolve.symlinks = false;

                makeProperties(config, 'module.parser.javascript');
                config.module.parser.javascript.commonjsMagicComments = true;

                makeProperties(config, 'experiments');
                config.experiments.topLevelAwait = true;

                if (themeConfig.webpack) {
                    config = themeConfig.webpack(config, options);
                }
                return config;
            }
        }
  
        module.exports = Object.assign({}, themeConfig, cromwellConfig);
        `
    );

    const themeTsConfPath = join(themeDir, 'tsconfig.json');
    if (await fs.pathExists(themeTsConfPath)) {
        const tsConf = await fs.readJSON(themeTsConfPath);
        if (!tsConf.compilerOptions) tsConf.compilerOptions = {};
        tsConf.compilerOptions.baseUrl = '.';
        tsConf.compilerOptions.preserveSymlinks = true;

        if (!tsConf.include) tsConf.include = [];
        tsConf.include = tsConf.include.concat(['pages/**/*.ts', 'pages/**/*.tsx']);

        await fs.outputJSON(join(tempDir, 'tsconfig.json'), tsConf, {
            spaces: 2
        });
    } else {
        await fs.outputFile(join(tempDir, 'tsconfig.json'), tsConfigContent);
    }

    if (options.watch) {
        startPagesWatcher(pagesGlobStr);
        startStaticWatcher(themeName);
        startConfigWatcher(themeName);
    }
}

const generateDefaultApp = async () => {
    const tempDir = normalizePath(getRendererTempDevDir());
    const pageContent = `
    ${await getGlobalCssImports()}
    ${defaultCss}
    import React from 'react';
    import { withCromwellApp } from '@cromwell/renderer';
    import '../generated-imports';

    function App(props) {
        return React.createElement(props.Component, props.pageProps);
    }

    export default withCromwellApp(App);
    `;
    const appPath = resolve(tempDir, 'pages', '_app.js');
    await fs.outputFile(appPath, pageContent);
}

const getGlobalCssImports = async () => {
    try {
        decache(resolve((await getNodeModuleDir(process.cwd()))!, configFileName));
    } catch (error) { }

    const themeConfig = await getCmsModuleConfig(process.cwd());
    const tempDir = normalizePath(getRendererTempDevDir());
    let globalCssImports = '';

    if (themeConfig?.globalCss?.length) {
        themeConfig.globalCss.forEach(css => {
            if (css.startsWith('.')) css = normalizePath(resolve(tempDir, css));
            globalCssImports += `import '${css}';\n`
        })
    }
    return globalCssImports;
}

const getPagesDir = async () => {
    const pagesDir = normalizePath(resolve(process.cwd(), 'src/pages'));
    if (! await fs.pathExists(pagesDir)) throw new Error('Pages directory not found at: ' + pagesDir);
    return pagesDir;
}

const getPageName = async (pagePath: string) => {
    pagePath = normalizePath(pagePath);
    const pagesDir = await getPagesDir();
    const pageRelativePath = pagePath.replace(pagesDir, '').replace(/^\//, '');
    const pageName = pageRelativePath.split('.').slice(0, -1).join('.');
    return pageName;
}

export const devGeneratePageWrapper = async (pagePath: string) => {
    const pageName = await getPageName(pagePath);
    const resolvePagePath = (pageName) => `src/pages/${pageName}`;
    // const resolvePagePath = (pageName) => normalizePath(join(themeDir, `src/pages/${pageName}`));

    let pageContent = '';

    if (pageName === '_app') {
        // Add global CSS into _app

        pageContent = `
            ${await getGlobalCssImports()}
            ${defaultCss}
            import App from '${resolvePagePath(pageName)}';
            import '../generated-imports';
            import { withCromwellApp } from '@cromwell/renderer';
        
            export default withCromwellApp(App);
        `;

    } else if (pageName === '_document') {
        pageContent = `
            import Document from '${resolvePagePath(pageName)}';
            export default Document;
        `;

    } else {
        // We need to check if target page has exported Next.js methods
        // such as getStaticProps, getServerSideProps; and based on this info
        // conditionally re-create same exports in generated page file. 
        const targetPageContent = (await fs.readFile(pagePath).catch(() => ''))?.toString();

        if (!targetPageContent) {
            logger.log(`Page at ${pagePath} was not found`);
            return;
        }

        const hasGetStaticPaths = targetPageContent && (targetPageContent.includes('const getStaticPaths')
            || targetPageContent.includes('function getStaticPaths'));
        const hasGetStaticProps = targetPageContent && (targetPageContent.includes('const getStaticProps')
            || targetPageContent.includes('function getStaticProps'));
        const hasGetServerSideProps = targetPageContent && (targetPageContent.includes('const getServerSideProps')
            || targetPageContent.includes('function getServerSideProps'));
        const hasGetInitialProps = targetPageContent && (targetPageContent.includes('const getInitialProps')
            || targetPageContent.includes('function getInitialProps'));

        const hasAnyGetProps = hasGetStaticPaths || hasGetStaticProps || hasGetServerSideProps || hasGetInitialProps;

        pageContent = `
            /*eslint-disable */
            import { createGetStaticProps, createGetStaticPaths, 
                createGetServerSideProps, createGetInitialProps } from '@cromwell/renderer';
            /*eslint-enable */

            import * as PageComponents from '${resolvePagePath(pageName)}';

            ${hasGetStaticPaths ? `
            export const getStaticPaths = createGetStaticPaths('${pageName}', PageComponents);
            `: ''}

            ${hasGetStaticProps || !hasAnyGetProps ? `
            export const getStaticProps = createGetStaticProps('${pageName}', PageComponents);
            `: ''}

            ${hasGetServerSideProps ? `
            export const getServerSideProps = createGetServerSideProps('${pageName}', PageComponents);
            `: ''}

            ${hasGetInitialProps ? `
            export const getInitialProps = createGetInitialProps('${pageName}', PageComponents);
            `: ''}

            export default PageComponents.default; 
            `;
    }

    await fs.outputFile(await getPageWrapperPath(pagePath), pageContent);
}

const getPageWrapperPath = async (pagePath: string) => {
    const tempDir = normalizePath(getRendererTempDevDir());
    const pageName = await getPageName(pagePath);
    return normalizePath(resolve(tempDir, 'pages', pageName + '.js'));
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
            try {
                await fs.remove(rendererTempNextDir);
            } catch (error) {
                logger.error(error);
            }
            await sleep(0.1);
            await fs.copy(themeNextBuildDir, rendererTempNextDir);
            await sleep(0.1);
        }
    }
}

const linkFiles = async (tempDir: string, themeName: string, options) => {
    const tempDirPublic = resolve(tempDir, 'public');

    await fs.ensureDir(tempDir);

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
    let envContent = `THEME_NAME=${themeName}`;
    if (options.serverUrl) {
        envContent += `API_URL=${options.serverUrl}`;
    }
    await fs.outputFile(resolve(tempDir, '.env.local'), envContent);
}


let pagesWatcherActive = false;
const startPagesWatcher = async (pagesGlobStr: string) => {
    if (pagesWatcherActive) return;
    pagesWatcherActive = true;

    const updatePageWrapper = async (targetPage: string) => {
        await devGeneratePageWrapper(targetPage);
    }

    const removePageWrapper = async (targetPage: string) => {
        const wrapperPath = await getPageWrapperPath(targetPage);
        await fs.remove(wrapperPath).catch(() => '');
    }

    const watcher = chokidar.watch(pagesGlobStr, {
        ignored: /(^|[/\\])\../, // ignore dotfiles
        persistent: true
    });

    watcher
        .on('add', updatePageWrapper)
        .on('change', updatePageWrapper)
        .on('unlink', removePageWrapper);
}


let staticWatcherActive = false;
const startStaticWatcher = async (moduleName: string) => {
    if (staticWatcherActive) return;
    staticWatcherActive = true;

    const staticDir = normalizePath((await getModuleStaticDir(process.cwd())) ?? '');
    await fs.ensureDir(staticDir);
    const publicDir = getPublicThemesDir();

    const globStr = `${staticDir}/**`;

    const copyFile = async (filePath: string) => {
        const pathChunk = normalizePath(filePath).replace(staticDir, '');
        const publicPath = join(publicDir, moduleName, pathChunk);
        try {
            await fs.ensureDir(dirname(publicPath));
            await fs.copyFile(filePath, publicPath);
        } catch (error) {
            console.error(error);
        }
    }

    const watcher = chokidar.watch(globStr, {
        persistent: true
    });

    watcher
        .on('change', copyFile)
        .on('add', copyFile);
}


let configWatcherActive = false;
const startConfigWatcher = async (packageName: string) => {
    if (configWatcherActive) return;
    configWatcherActive = true;

    const rootDir = normalizePath(process.cwd());
    const globStr = `${rootDir}/cromwell.config.js`;

    const configChange = async () => {
        // Re-install theme to update config in the DB
        try {
            await getRestApiClient().activateTheme(packageName);
        } catch (error) {
            console.error(error);
        }
        if (pagesStore['_app']?.path) {
            await devGeneratePageWrapper(pagesStore['_app']?.path);
        } else {
            await generateDefaultApp();
        }
    }

    const watcher = chokidar.watch(globStr, {
        persistent: true
    });

    watcher
        .on('change', configChange)
        .on('add', configChange)
        .on('unlink', configChange);
}