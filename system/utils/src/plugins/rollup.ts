import {
    getRandStr,
    TFrontendDependency,
    TModuleConfig,
    TPackageJson,
    TPagesMetaInfo,
    TPluginConfig,
    TRollupConfig,
    TSciprtMetaInfo,
    TThemeConfig,
    TPackageCromwellConfig
} from '@cromwell/core';
import {
    buildDirName,
    getLogger,
    getMetaInfoPath,
    getPluginBackendPath,
    getThemeBuildDir,
    getThemePagesMetaPath,
    getThemeRollupBuildDir,
    pluginAdminBundlePath,
    pluginAdminCjsPath,
    pluginFrontendBundlePath,
    pluginFrontendCjsPath,
} from '@cromwell/core-backend';
import virtual from '@rollup/plugin-virtual';
import chokidar from 'chokidar';
import cryptoRandomString from 'crypto-random-string';
import { walk } from 'estree-walker';
import fs from 'fs-extra';
import glob from 'glob';
import isPromise from 'is-promise';
import normalizePath from 'normalize-path';
import { dirname, isAbsolute, join, resolve } from 'path';
import { OutputOptions, Plugin, RollupOptions } from 'rollup';
import externalGlobals from 'rollup-plugin-external-globals';

import { cromwellStoreModulesPath, getGlobalModuleStr } from '../constants';
import {
    collectFrontendDependencies,
    collectPackagesInfo,
    getDepVersion,
    getNodeModuleVersion,
    globPackages,
    interopDefaultContent,
    isExternalForm,
    parseFrontendDeps,
} from '../shared';

const resolveExternal = (source: string, frontendDeps?: TFrontendDependency[]): boolean => {
    // Mark all as external for backend bundle and only include in frontendDeps for frontend bundle
    if (isExternalForm(source)) {
        if (frontendDeps) {
            // Frontend
            if (frontendDeps.some(dep => dep.name === source)) {
                return true;
            } else {
                return false;
            }
        } else {
            // Backend
            return true;
        }
    }
    return false;
}

const errorLogger = getLogger('errors-only').error;

export const rollupConfigWrapper = async (moduleInfo: TPackageCromwellConfig, moduleConfig?: TModuleConfig, watch?: boolean): Promise<RollupOptions[]> => {

    if (!moduleInfo) throw new Error(`CromwellPlugin Error. Provide config as second argumet to the wrapper function`);
    if (!moduleInfo?.type) throw new Error(`CromwellPlugin Error. Provide one of types to the CromwellConfig: 'plugin', 'theme'`);

    try {
        const pckg: TPackageJson = require(resolve(process.cwd(), 'package.json'));
        if (pckg?.name) moduleInfo.name = pckg.name;
    } catch (e) {
        errorLogger('Failed to find package.json in project root');
        console.error(e);
    };

    if (!moduleInfo.name) throw new Error(`CromwellPlugin Error. Failed to find name of the package in working directory`);

    const strippedName = moduleInfo.name.replace(/\W/g, '_');


    const packagePaths = await globPackages(process.cwd());
    const packages = collectPackagesInfo(packagePaths);
    const frontendDeps = collectFrontendDependencies(packages, false);

    let specifiedOptions: TRollupConfig | undefined = moduleConfig?.rollupConfig?.() as any;
    //@ts-ignore
    if (isPromise(specifiedOptions)) specifiedOptions = await specifiedOptions;

    const inputOptions = specifiedOptions?.main;
    const outOptions: RollupOptions[] = [];

    if (moduleInfo.type === 'plugin') {
        const pluginConfig = moduleConfig as TPluginConfig | undefined;

        const handleInputFile = (inputFilePath: string, distChunk: string, cjsChunk: string) => {

            // Plugin frontend
            const options = (Object.assign({}, specifiedOptions?.frontendBundle ?? inputOptions));
            const inputPath = isAbsolute(inputFilePath) ? normalizePath(inputFilePath) :
                normalizePath(resolve(process.cwd(), inputFilePath));

            const optionsInput = '$$' + moduleInfo.name + '/' + inputFilePath;
            options.input = optionsInput;
            options.output = Object.assign({}, options.output, {
                file: resolve(process.cwd(), buildDirName, distChunk),
                format: "iife",
                name: strippedName,
                banner: '(function() {',
                footer: `return ${strippedName};})();`
            } as OutputOptions);

            options.plugins = [...(options.plugins ?? [])];

            options.plugins.push(virtual({
                [optionsInput]: `
                        import defaulComp from '${inputPath}';
                        export default defaulComp;
                        `
            }))
            options.plugins.push(rollupPluginCromwellFrontend({
                moduleInfo,
                moduleConfig,
                frontendDeps,
            }));
            outOptions.push(options);

            // Plugin frontend cjs (for getStatic paths at server)
            const cjsOptions = Object.assign({}, specifiedOptions?.frontendCjs ?? inputOptions);

            cjsOptions.input = optionsInput;
            cjsOptions.output = Object.assign({}, cjsOptions.output, {
                file: resolve(process.cwd(), buildDirName, cjsChunk),
                format: "cjs",
                name: moduleInfo.name,
                exports: "auto"
            } as OutputOptions)

            cjsOptions.plugins = [...(cjsOptions.plugins ?? [])];

            cjsOptions.plugins.push(virtual({
                [optionsInput]: `
                    import * as allExports from '${inputPath}';
                    export default allExports;
                    `
            }))
            cjsOptions.plugins.push(rollupPluginCromwellFrontend({
                generateMeta: false,
                moduleInfo,
                moduleConfig,
            }));
            outOptions.push(cjsOptions);
        }

        const resolveFileExtension = (basePath: string): string | undefined => {
            const globStr = `${normalizePath(resolve(process.cwd(), basePath))}.+(ts|tsx|js|jsx)`;
            const files = glob.sync(globStr);
            return files[0]
        }

        let frontendInputFile = pluginConfig?.frontendInputFile;
        if (!frontendInputFile) {
            frontendInputFile = resolveFileExtension('src/frontend/index');
        }
        if (frontendInputFile) {
            handleInputFile(frontendInputFile, pluginFrontendBundlePath, pluginFrontendCjsPath);
        }

        // Plugin admin panel
        let adminInputFile = pluginConfig?.adminInputFile;
        if (!adminInputFile) {
            adminInputFile = resolveFileExtension('src/admin/index');
        }
        if (adminInputFile) {
            handleInputFile(adminInputFile, pluginAdminBundlePath, pluginAdminCjsPath);
        }

        // Plugin backend
        let entitiesdir = pluginConfig?.backend?.entitiesDir;
        if (!entitiesdir) {
            const entitiesDefDir = resolve(process.cwd(), 'src/backend/entities');
            if (fs.pathExistsSync(entitiesDefDir)) entitiesdir = 'src/backend/entities';
        }

        let resolversDir = pluginConfig?.backend?.resolversDir;
        if (!resolversDir) {
            const resolversDefDir = resolve(process.cwd(), 'src/backend/resolvers');
            if (fs.pathExistsSync(resolversDefDir)) resolversDir = 'src/backend/resolvers';
        }

        if (entitiesdir || resolversDir) {
            let resolverFiles: string[] = [];
            let entityFiles: string[] = [];

            if (entitiesdir) {
                const entitiesFullDir = resolve(process.cwd(), entitiesdir)
                entityFiles = fs.readdirSync(entitiesFullDir).map(file => normalizePath(resolve(entitiesFullDir, file)));
            }
            if (resolversDir) {
                const resolversFullDir = resolve(process.cwd(), resolversDir);
                resolverFiles = fs.readdirSync(resolversFullDir).map(file => normalizePath(resolve(resolversFullDir, file)));
            }

            if (entityFiles.length > 0 || resolverFiles.length > 0) {
                const cjsOptions = Object.assign({}, specifiedOptions?.backend ?? inputOptions);

                const optionsInput = '$$' + moduleInfo.name + '/backend';

                cjsOptions.input = optionsInput;
                cjsOptions.output = Object.assign({}, cjsOptions.output, {
                    file: getPluginBackendPath(resolve(process.cwd(), buildDirName)),
                    format: "cjs",
                    name: moduleInfo.name,
                    exports: "auto"
                } as OutputOptions)

                cjsOptions.plugins = [...(cjsOptions.plugins ?? [])];

                let exportsStr = '';
                const resolverNames: string[] = [];
                const entityNames: string[] = [];
                resolverFiles.forEach(file => {
                    const name = `resolver_${cryptoRandomString({ length: 8 })}`
                    resolverNames.push(name);
                    exportsStr += `import ${name} from '${file}'\n`;
                });
                entityFiles.forEach(file => {
                    const name = `entity_${cryptoRandomString({ length: 8 })}`
                    entityNames.push(name);
                    exportsStr += `import ${name} from '${file}'\n`;
                });

                exportsStr += 'export const resolvers = [\n';
                resolverNames.forEach(name => exportsStr += `\t${name},\n`);
                exportsStr += '];\nexport const entities = [\n';
                entityNames.forEach(name => exportsStr += `\t${name},\n`);
                exportsStr += '];\n';

                cjsOptions.plugins.push(virtual({
                    [optionsInput]: exportsStr
                }));

                cjsOptions.external = isExternalForm;

                outOptions.push(cjsOptions);
            }
        }

    }

    if (moduleInfo.type === 'theme') {
        const buildDir = normalizePath((await getThemeRollupBuildDir(process.cwd()))!);
        const rootBuildDir = normalizePath((await getThemeBuildDir(process.cwd()))!);
        if (!buildDir) throw new Error(`CromwellPlugin Error. Failed to find package directory of ` + moduleInfo.name);

        let srcDir = process.cwd();
        let pagesDirChunk = 'pages';
        let pagesDir = resolve(srcDir, pagesDirChunk);

        if (!fs.existsSync(pagesDir)) {
            srcDir = resolve(process.cwd(), 'src');
            pagesDir = resolve(srcDir, 'pages');
            pagesDirChunk = 'src/pages';
        }

        if (!fs.pathExistsSync(pagesDir)) {
            throw new Error('Pages directory was not found')
        }

        const options = (Object.assign({}, specifiedOptions?.themePages ? specifiedOptions.themePages : inputOptions));
        const globStr = `${pagesDir}/**/*.+(ts|tsx|js|jsx)`;
        const pageFiles = glob.sync(globStr);
        const pagesMetaInfo: TPagesMetaInfo = {
            paths: [],
            rootBuildDir,
            buildDir,
        }

        const adminPanelOptions: RollupOptions[] = [];
        const dependecyOptions: RollupOptions[] = [];

        // Theme frontend
        if (pageFiles && pageFiles.length > 0) {

            let pageImports = '';
            for (let fileName of pageFiles) {
                fileName = normalizePath(fileName);
                const pageName = fileName.replace(normalizePath(pagesDir) + '/', '').replace(/\.(m?jsx?|tsx?)$/, '');
                pagesMetaInfo.paths.push({
                    srcFullPath: fileName,
                    pageName
                });
                pageImports += `export * as Page_${cryptoRandomString({ length: 12 })} from '${fileName}';\n`;
                // pageImports += `export const Page_${cryptoRandomString({ length: 12 })} = require('${fileName}');\n`;
            };

            options.plugins = [...(options.plugins ?? [])];

            const optionsInput = '$$' + moduleInfo.name + '/' + pagesDirChunk;
            options.plugins.push(virtual({
                [optionsInput]: pageImports
            }));
            options.input = optionsInput;

            options.output = Object.assign({}, options.output, {
                dir: buildDir,
                format: "esm",
                preserveModules: true
            } as OutputOptions);

            options.plugins.push(scssExternalPlugin());
            options.plugins.push(rollupPluginCromwellFrontend({
                pagesMetaInfo, buildDir, srcDir, moduleInfo,
                moduleConfig, watch,
                frontendDeps, dependecyOptions,
                type: 'themePages'
            }));

            outOptions.push(options);

            // Theme admin panel config
            if (!watch) {
                pagesMetaInfo.paths.forEach(pagePath => {
                    const adminOptions = (Object.assign({}, (specifiedOptions?.adminPanel ?? inputOptions)));
                    adminOptions.plugins = [...(adminOptions.plugins ?? [])];

                    const optionsInput = '$$' + moduleInfo.name + '/admin/' + pagePath.pageName;
                    adminOptions.plugins.push(virtual({
                        [optionsInput]: `import pageComp from '${pagePath.srcFullPath}';export default pageComp;`
                    }));
                    adminOptions.input = optionsInput;
                    adminOptions.plugins.push(rollupPluginCromwellFrontend({
                        buildDir, moduleInfo,
                        moduleConfig, frontendDeps,
                        type: 'themeAdminPanel'
                    }));

                    const pageStrippedName = pagePath?.pageName?.replace(/\W/g, '_') ?? strippedName;

                    adminOptions.output = Object.assign({}, adminOptions.output, {
                        dir: resolve(buildDir, 'admin', dirname(pagePath.pageName)),
                        format: "iife",
                        name: pagePath?.pageName?.replace(/\W/g, '_'),
                        banner: '(function() {',
                        footer: `return ${pageStrippedName};})();`
                    } as OutputOptions);

                    adminPanelOptions.push(adminOptions);
                });
                adminPanelOptions.forEach(opt => outOptions.push(opt));
            }

        } else {
            throw new Error('CromwellPlugin Error. No pages found at: ' + pagesDir);
        }


        // Theme admin panel page-controller 
        const adminPanelDirChunk = 'admin-panel';
        const adminPanelDir = resolve(srcDir, adminPanelDirChunk);
        if (!watch && fs.pathExistsSync(adminPanelDir)) {
            const adminOptions = (Object.assign({}, specifiedOptions?.themePages ? specifiedOptions.themePages : inputOptions));

            adminOptions.plugins = [...(adminOptions.plugins ?? [])];

            const optionsInput = '$$' + moduleInfo.name + '/' + adminPanelDirChunk;
            adminOptions.plugins.push(virtual({
                [optionsInput]: `import settings from '${normalizePath(adminPanelDir)}'; export default settings`
            }));
            adminOptions.input = optionsInput;

            adminOptions.output = Object.assign({}, adminOptions.output, {
                dir: resolve(buildDir, 'admin', '_settings'),
                format: "iife",
            } as OutputOptions);

            adminOptions.plugins.push(rollupPluginCromwellFrontend({
                pagesMetaInfo, buildDir, srcDir,
                moduleInfo, moduleConfig, frontendDeps
            }));

            outOptions.push(adminOptions);
        }
    }

    return outOptions;
}

const scssExternalPlugin = (): Plugin => {
    return {
        name: 'cromwell-scssExternalPlugin',
        resolveId(source, importer) {
            if (/\.s?css$/.test(source)) {
                return { id: source, external: true };
            }
        }
    }

}

export const rollupPluginCromwellFrontend = (settings?: {
    packageJsonPath?: string;
    generateMeta?: boolean;
    pagesMetaInfo?: TPagesMetaInfo;
    buildDir?: string;
    srcDir?: string;
    watch?: boolean;
    moduleInfo?: TPackageCromwellConfig;
    moduleConfig?: TModuleConfig;
    frontendDeps?: TFrontendDependency[];
    dependecyOptions?: RollupOptions[];
    type?: 'themePages' | 'themeAdminPanel';
}): Plugin => {

    const scriptsInfo: Record<string, TSciprtMetaInfo> = {};
    const importsInfo: Record<string, {
        externals: Record<string, string[]>;
        internals: string[];
    }> = {};

    if (settings?.frontendDeps) settings.frontendDeps = parseFrontendDeps(settings.frontendDeps);

    // Defer stylesheetsLoader until compile info available. Look for: stylesheetsLoaderStarter()
    let stylesheetsLoaderStarter;
    if (settings?.srcDir && settings?.buildDir) {
        (async () => {
            await new Promise(resolve => {
                stylesheetsLoaderStarter = resolve;
            })
            if (settings?.srcDir && settings?.buildDir)
                initStylesheetsLoader(settings?.srcDir, settings?.buildDir, settings?.pagesMetaInfo?.basePath, settings?.watch);
        })();

    }

    let packageJson: TPackageJson;
    try {
        packageJson = require(resolve(process.cwd(), 'package.json'));
    } catch (e) { console.error(e) }

    const plugin: Plugin = {
        name: 'cromwell-frontend',
        options(options: RollupOptions) {
            if (!options.plugins) options.plugins = [];
            options.plugins.push(externalGlobals((id) => {
                const isExt = resolveExternal(id, settings?.frontendDeps);
                if (isExt) return `${cromwellStoreModulesPath}["${id}"]`;
            }, {
                include: '**/*.+(ts|tsx|js|jsx)'
            }));

            return options;
        },
        resolveId(source, importer) {
            if (settings?.moduleInfo?.type === 'theme' && settings?.pagesMetaInfo?.paths) {
                if (/\.s?css$/.test(source)) {
                    return { id: source, external: true };
                }
            }

            if (settings?.moduleInfo?.type === 'theme' && settings?.type === 'themePages') {
                // left external for themes, so Next.js will bundle node modules
                if (resolveExternal(source)) {
                    return { id: source, external: true };
                }
            } else {
                // bundle node modules with plugins that aren't specified in frontendDeps
                if (resolveExternal(source, settings?.frontendDeps)) {
                    return { id: source, external: true };
                }

                if (isExternalForm(source)) {
                    return { id: require.resolve(source), external: false };
                }
            }

            return null;
        },
    };

    if (settings?.generateMeta !== false) {
        plugin.transform = function (code, id): string | null {
            // console.log('id', id);
            id = normalizePath(id);
            if (!/\.(m?jsx?|tsx?)$/.test(id)) return null;

            const ast = this.parse(code);
            walk(ast, {
                enter(node: any, walker) {
                    if (node.type === 'ImportDeclaration') {
                        if (!node.specifiers || !node.source) return;
                        const source = node.source.value;

                        if (!importsInfo[id]) importsInfo[id] = {
                            externals: {},
                            internals: []
                        };

                        if (!isExternalForm(source)) {
                            const absolutePath = resolve(dirname(id), source);
                            const globStr = `${absolutePath}.+(ts|tsx|js|jsx)`;
                            const targetFiles = glob.sync(globStr);
                            if (targetFiles[0]) importsInfo[id].internals.push(targetFiles[0]);
                            return;
                        }

                        // Add external
                        if (resolveExternal(source, settings?.frontendDeps)) {
                            if (!importsInfo[id].externals[source]) importsInfo[id].externals[source] = [];

                            node.specifiers.forEach(spec => {
                                if (spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier') {
                                    importsInfo[id].externals[source].push('default')
                                }
                                if (spec.type === 'ImportSpecifier' && spec.imported) {
                                    importsInfo[id].externals[source].push(spec.imported.name)
                                }
                            })
                        }
                    }
                }
            });
            return null;
        };

        plugin.generateBundle = function (options, bundle) {


            Object.values(bundle).forEach((info: any) => {

                const mergeBindings = (bindings1, bindings2): Record<string, string[]> => {
                    const mergedBindings = Object.assign({}, bindings1);

                    Object.keys(bindings2).forEach(modDep => {
                        if (mergedBindings[modDep]) {
                            mergedBindings[modDep] = [...mergedBindings[modDep], ...bindings2[modDep]];
                            mergedBindings[modDep] = Array.from(new Set(mergedBindings[modDep]));
                        }
                        else mergedBindings[modDep] = bindings2[modDep];
                    })

                    return mergedBindings;
                }

                const importBingingsCache: Record<string, Record<string, string[]>> = {}
                const getImportBingingsForModule = (modId: string): Record<string, string[]> => {
                    modId = normalizePath(modId);
                    if (importBingingsCache[modId]) return importBingingsCache[modId];

                    let importedBindings = {};
                    importBingingsCache[modId] = {};
                    if (importsInfo[modId]) {
                        Object.keys(importsInfo[modId].externals).forEach(libName => {
                            if (!isExternalForm(libName)) return;

                            const importsSpecs = importsInfo[modId].externals[libName];
                            importsSpecs?.forEach(spec => {
                                if (!importedBindings[libName]) importedBindings[libName] = [];
                                if (!importedBindings[libName].includes(spec)) {
                                    importedBindings[libName].push(spec);
                                }
                            });
                        });

                        importsInfo[modId].internals.forEach(internal => {
                            const internalBinds = getImportBingingsForModule(internal);
                            importedBindings = mergeBindings(importedBindings, internalBinds);
                        })
                    }
                    importBingingsCache[modId] = importedBindings;
                    return importedBindings;
                }

                let totalImportedBindings = {};

                if (info.modules) {
                    Object.keys(info.modules).forEach(modId => {
                        const modBindings = getImportBingingsForModule(modId);
                        totalImportedBindings = mergeBindings(totalImportedBindings, modBindings);
                    })
                }

                const versionedImportedBindings = {};
                Object.keys(totalImportedBindings).forEach(dep => {
                    let ver = getNodeModuleVersion(dep, process.cwd());
                    if (!ver) {
                        ver = getDepVersion(packageJson, dep);
                    }
                    if (ver) {
                        if (totalImportedBindings[dep].includes('default')) totalImportedBindings[dep] = ['default'];
                        versionedImportedBindings[`${dep}@${ver}`] = totalImportedBindings[dep];
                    }
                })

                const metaInfo: TSciprtMetaInfo = {
                    name: settings?.moduleInfo?.name + '/' + info.fileName + '_' + cryptoRandomString({ length: 8 }),
                    externalDependencies: versionedImportedBindings,
                    // importsInfo
                    // info
                };

                scriptsInfo[info.fileName] = metaInfo;

                //@ts-ignore
                this.emitFile({
                    type: 'asset',
                    fileName: getMetaInfoPath(info.fileName),
                    source: JSON.stringify(metaInfo, null, 2)
                });


                if (settings?.pagesMetaInfo?.paths) {
                    settings.pagesMetaInfo.paths = settings.pagesMetaInfo.paths.map(paths => {

                        if (info.fileName && paths.srcFullPath === normalizePath(info.facadeModuleId)) {
                            paths.localPath = info.fileName;

                            // Get base path chunk that appended in build dir relatively src dir.
                            // Since we use preserveModules: true, node_modules can appear in build dir.
                            // That will relatively move rollup's options.output.dir on a prefix 
                            // We don't know this prefix (basePath) before compile, so we calc it here: 
                            if (!settings?.pagesMetaInfo?.basePath && settings?.srcDir && info.facadeModuleId) {
                                let baseFileName: any = normalizePath(info.facadeModuleId).replace(normalizePath(settings.srcDir), '').split('.');
                                baseFileName.length > 1 ? baseFileName = baseFileName.slice(0, -1).join('.') : baseFileName.join('.');

                                let basePath: any = normalizePath(info.fileName).split('.');
                                basePath.length > 1 ? basePath = basePath.slice(0, -1).join('.') : basePath.join('.');
                                if ((basePath as string).startsWith('/')) basePath = (basePath as string).substring(1);
                                if ((baseFileName as string).startsWith('/')) baseFileName = (baseFileName as string).substring(1);

                                basePath = normalizePath(basePath).replace(baseFileName, '');
                                if (settings?.pagesMetaInfo) {
                                    settings.pagesMetaInfo.basePath = basePath;
                                    if (stylesheetsLoaderStarter) {
                                        stylesheetsLoaderStarter();
                                        stylesheetsLoaderStarter = null;
                                    }
                                }
                            }

                            delete paths.srcFullPath;
                        }

                        return paths;
                    })
                }
            });

            if (settings?.pagesMetaInfo?.paths && settings.srcDir && settings.buildDir) {

                // Generate JS lists of node_modules that are going to be bundled in one chunk by Next.js to load
                // on first page open when a customer has no cached modules. It cuts hundreds of requests
                // for each separate node module on first load. List loaded from package.json - cromwell.bundledDependencies
                // Beware that modules are going to be bundled entirely without tree-shaking
                // We definetely don't want @material-ui/icons in this list!
                for (const pagePath of settings.pagesMetaInfo.paths) {
                    if (pagePath?.localPath && packageJson.cromwell?.bundledDependencies) {

                        packageJson.cromwell.bundledDependencies = Array.from(new Set(packageJson.cromwell.bundledDependencies));
                        let importsStr = `${interopDefaultContent}\n`;

                        for (const depName of packageJson.cromwell.bundledDependencies) {

                            const strippedDepName = depName.replace(/\W/g, '_') + '_' + getRandStr(4);
                            importsStr += `
                                import * as ${strippedDepName} from '${depName}';
                                ${getGlobalModuleStr(depName)} = interopDefault(${strippedDepName}, 'default');
                                ${getGlobalModuleStr(depName)}.didDefaultImport = true;
                                `
                        }

                        const generatedFileName = normalizePath(resolve(settings.buildDir, 'dependencies', pagePath.pageName + '.generated.js'));
                        fs.outputFileSync(generatedFileName, importsStr);

                        pagePath.localDepsBundle = generatedFileName
                            .replace(settings.buildDir!, '').replace(/^\//, '');

                        // Code below generates lists with actually used keys of modules (very useful feature)
                        // But currently it doesn't work, bcs if Importer in browser will try to load additional
                        // key, we'll have two instances of a module. In case with material-ui or react it will
                        // crash everything. But code can be reused later if we'll decide to make it work.

                        // const meta = scriptsInfo[pagePath.localPath];
                        // if (meta?.externalDependencies) {

                        //     let importsStr = `${interopDefaultContent}\n`;
                        //     for (const usedModule of Object.keys(meta.externalDependencies)) {
                        //         const usedkeys = meta.externalDependencies[usedModule];
                        //         let usedModuleName: string[] | string = usedModule.split('@');
                        //         usedModuleName.pop();
                        //         usedModuleName = usedModuleName.join('@');


                        //         if (rendererDefaultDeps.includes(usedModuleName) ||
                        //             usedModuleName.startsWith('next/')) continue;

                        //         if (!packageJson.cromwell?.bundledDependencies ||
                        //             !packageJson.cromwell?.bundledDependencies.includes(usedModuleName)) continue;

                        //         const strippedusedModuleName = usedModuleName.replace(/\W/g, '_') + '_' + getRandStr(4);

                        //         // if (usedkeys.includes('default')) {
                        //         importsStr += `
                        //             import * as ${strippedusedModuleName} from '${usedModuleName}';
                        //             ${getGlobalModuleStr(usedModuleName)} = interopDefault(${strippedusedModuleName}, 'default');
                        //             ${getGlobalModuleStr(usedModuleName)}.didDefaultImport = true;
                        //             `
                        //         // } else {
                        //         //     let importKeysStr = '';
                        //         //     let exportKeysStr = '';
                        //         //     usedkeys.forEach((key, index) => {
                        //         //         const keyAs = key + '_' + getRandStr(4);
                        //         //         importKeysStr += `${key} as ${keyAs}`;
                        //         //         exportKeysStr += `${key}: ${keyAs}`;
                        //         //         if (index < usedkeys.length - 1) {
                        //         //             importKeysStr += ', ';
                        //         //             exportKeysStr += ', ';
                        //         //         }
                        //         //     })

                        //         //     importsStr += `
                        //         //     import { ${importKeysStr} } from '${resolvedModuleName}';
                        //         //     ${getGlobalModuleStr(usedModuleName)} = { ${exportKeysStr} };
                        //         //     `
                        //         // }
                        //     }
                        //     // console.log('importsStr for' + meta.name, '\n', importsStr, '\n\n');

                        //     const generatedFileName = normalizePath(resolve(settings.buildDir, 'dependencies', pagePath.pageName + '.generated.js'));
                        //     fs.outputFileSync(generatedFileName, importsStr);

                        //     pagePath.localDepsBundle = generatedFileName
                        //         .replace(settings.buildDir!, '').replace(/^\//, '');
                        // }

                    }
                }

                delete settings.pagesMetaInfo.buildDir;
                delete settings.pagesMetaInfo.rootBuildDir;
                fs.outputFileSync(getThemePagesMetaPath(settings.buildDir), JSON.stringify(settings.pagesMetaInfo, null, 2));

            }
        }
    }

    return plugin;
}



const stylesheetsLoaderDirs: string[] = [];

const initStylesheetsLoader = (srcDir: string, buildDir: string, basePath?: string, watch?: boolean) => {
    if (stylesheetsLoaderDirs.includes(srcDir)) return;
    stylesheetsLoaderDirs.push(srcDir);

    const globStr = `${normalizePath(srcDir)}/**/*.+(css|scss|sass)`;

    const getBuildPath = (styleSheetPath: string) => {
        const finalBuildDir = basePath ? join(buildDir, basePath) : buildDir;
        return normalizePath(styleSheetPath).replace(normalizePath(srcDir),
            normalizePath(finalBuildDir));
    }

    const copyFile = async (styleSheetPath: string) => {
        const styleSheetBuildPath = getBuildPath(styleSheetPath);
        await fs.ensureDir(dirname(styleSheetBuildPath));
        await fs.copyFile(styleSheetPath, styleSheetBuildPath);
    }

    const removeFile = async (styleSheetPath: string) => {
        const styleSheetBuildPath = getBuildPath(styleSheetPath);
        await fs.remove(styleSheetBuildPath);
    }

    if (!watch) {
        const targetFiles = glob.sync(globStr);

        targetFiles.forEach(copyFile);
        return;
    }

    const watcher = chokidar.watch(globStr, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });



    watcher
        .on('add', copyFile)
        .on('change', copyFile)
        .on('unlink', removeFile);
}
