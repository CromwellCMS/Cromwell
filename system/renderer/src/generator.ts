import { bundledModulesDirName, getRandStr, setStoreItem, sleep } from '@cromwell/core';
import { readCMSConfig } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import {
    getBundledModulesDir,
    getCmsModuleInfo,
    getNodeModuleDir,
    getPublicDir,
    getRendererDir,
    getRendererTempDevDir,
    getRendererTempDir,
    getThemeBuildDir,
} from '@cromwell/core-backend/dist/helpers/paths';
import { interopDefaultContent } from '@cromwell/utils/build/shared';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { join, resolve } from 'path';
import symlinkDir from 'symlink-dir';

import { defaultGenericPageContent } from './helpers/defaultGenericPage';
import { jsOperators } from './helpers/helpers';

const logger = getLogger();

export const generator = async (options: {
    scriptName: string;
    targetThemeName?: string;
}) => {
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

const devGenerate = async (themeName: string, options) => {
    const tempDir = getRendererTempDevDir();
    const themePackageInfo = await getCmsModuleInfo(themeName);
    const rendererDir = await getRendererDir();
    if (!rendererDir) throw new Error('Could not define package @cromwell/renderer directory')


    await linkFiles(tempDir, themeName, options);

    // Create pages in Nex.js pages dir based on theme's pages
    await fs.ensureDir(tempDir);
    await sleep(0.1);

    let pagesDir = resolve(process.cwd(), 'pages');
    if (! await fs.pathExists(pagesDir)) pagesDir = resolve(process.cwd(), 'src/pages');
    if (! await fs.pathExists(pagesDir)) throw new Error('Pages directory not found');


    // Add pages/[slug] page for dynamic pages creation in Admin Panel
    // if it was not created by theme
    const rootPages = await fs.readdir(pagesDir);
    const genericPagePath = join(pagesDir, 'pages/[slug].js');
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


    const defaultImported = ['react', 'react-dom', 'next/dynamic', '@cromwell/core', 'react-is',
        'next/link', 'next/head', 'next/document', 'next/router'];
    // Make imports for standard always-packaged externals.
    defaultImported.forEach(depName => {
        const pckgHash = getRandStr(4);
        const pckgNameStripped = depName.replace(/\W/g, '_');

        fdImports += `\nimport * as ${pckgNameStripped}_${pckgHash} from '${depName}';`;
        fdImports += `\nimporter.modules['${depName}'] = interopDefault(${pckgNameStripped}_${pckgHash}, 'default');`;
        fdImports += `\nimporter.importStatuses['${depName}'] = 'default';`;
    });

    const defaultFd = ['@cromwell/core-frontend', 'next/image', 'next/amp', 'react-html-parser'];
    const frontendDependencies = themePackageInfo?.frontendDependencies ?? [];
    const firstLoadedDependencies = themePackageInfo?.firstLoadedDependencies ?? [];

    for (const fd of defaultFd) {
        if (!frontendDependencies.includes(fd)) frontendDependencies.push(fd);
    }
    for (const fd of firstLoadedDependencies) {
        if (!frontendDependencies.includes(fd)) frontendDependencies.push(fd);
    }

    const processedFds: string[] = []

    for (const dependency of frontendDependencies) {
        const pckgName = typeof dependency === 'object' ? dependency.name : dependency;
        if (processedFds.includes(pckgName)) return;
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

    await fs.outputFile(join(rendererDir, 'build/generated-imports.js'), fdImports);
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
    let envContent = '';
    if (options.serverUrl) {
        envContent += `API_URL=${options.serverUrl}`;
        await fs.outputFile(resolve(tempDir, '.env.local'), envContent);
    }
}