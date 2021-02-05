import { TFrontendDependency, TPackageJson, TPagesMetaInfo, TPluginConfig, TRollupConfig, TSciprtMetaInfo, TThemeConfig } from '@cromwell/core';
import {
    buildDirName,
    getMetaInfoPath,
    getPluginBackendPath,
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
import { dirname, join, resolve } from 'path';
import { OutputOptions, Plugin, RollupOptions } from 'rollup';
import externalGlobals from 'rollup-plugin-external-globals';
import { collectFrontendDependencies, collectPackagesInfo, getBundledModulesDir, globPackages } from '../shared';

import { cromwellStoreModulesPath } from '../constants';
import { getDepVersion, getNodeModuleVersion, isExternalForm } from '../shared';

const resolveExternal = (source: string, frontendDeps?: TFrontendDependency[]): boolean => {
    // Mark all as external for backend and only included in frontendDeps for frontend 
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

export const rollupConfigWrapper = async (cromwellConfig: TPluginConfig | TThemeConfig, watch?: boolean): Promise<RollupOptions[]> => {

    if (!cromwellConfig) throw new Error(`CromwellPlugin Error. Provide config as second argumet to the wrapper function`);
    if (!cromwellConfig?.type) throw new Error(`CromwellPlugin Error. Provide one of types to the CromwellConfig: 'plugin', 'theme'`);

    try {
        const pckg: TPackageJson = require(resolve(process.cwd(), 'package.json'));
        if (pckg?.name) cromwellConfig.name = pckg.name;
    } catch (e) { console.error(e) };

    if (!cromwellConfig.name) throw new Error(`CromwellPlugin Error. Failed to find name of the package in working directory`);

    const strippedName = cromwellConfig.name.replace(/\W/g, '_');


    const packagePaths = await globPackages(process.cwd());
    const packages = collectPackagesInfo(packagePaths);
    const frontendDeps = collectFrontendDependencies(packages, false);

    let specifiedOptions: TRollupConfig | undefined = cromwellConfig.rollupConfig?.() as any;
    //@ts-ignore
    if (isPromise(specifiedOptions)) specifiedOptions = await specifiedOptions;

    const inputOptions = specifiedOptions?.main;
    const outOptions: RollupOptions[] = [];

    if (cromwellConfig.type === 'plugin') {
        const pluginConfig = cromwellConfig as TPluginConfig;

        const handleInputFile = (inputFilePath: string, distChunk: string, cjsChunk: string) => {

            // Plugin frontend
            const options = (Object.assign({}, specifiedOptions?.frontendBundle ?? inputOptions));
            const inputPath = normalizePath(resolve(process.cwd(), inputFilePath));

            const optionsInput = '$$' + pluginConfig.name + '/' + inputFilePath;
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
                cromwellConfig,
                frontendDeps,
            }));
            outOptions.push(options);

            // Plugin frontend cjs (for getStatic paths at server)
            const cjsOptions = Object.assign({}, specifiedOptions?.frontendCjs ?? inputOptions);

            cjsOptions.input = optionsInput;
            cjsOptions.output = Object.assign({}, cjsOptions.output, {
                file: resolve(process.cwd(), buildDirName, cjsChunk),
                format: "cjs",
                name: pluginConfig.name,
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
                generateMeta: false, cromwellConfig
            }));
            outOptions.push(cjsOptions);
        }

        if (pluginConfig.frontendInputFile) {
            handleInputFile(pluginConfig.frontendInputFile, pluginFrontendBundlePath, pluginFrontendCjsPath);
        }
        if (pluginConfig.adminInputFile) {
            handleInputFile(pluginConfig.adminInputFile, pluginAdminBundlePath, pluginAdminCjsPath);
        }

        // Plugin backend
        if (pluginConfig.backend) {
            let resolverFiles: string[] = [];
            let entityFiles: string[] = [];

            if (pluginConfig.backend.entitiesDir) {
                const entitiesDir = resolve(process.cwd(), pluginConfig.backend.entitiesDir)
                entityFiles = fs.readdirSync(entitiesDir).map(file => normalizePath(resolve(entitiesDir, file)));
            }
            if (pluginConfig.backend.resolversDir) {
                const resolversDir = resolve(process.cwd(), pluginConfig.backend.resolversDir)
                resolverFiles = fs.readdirSync(resolversDir).map(file => normalizePath(resolve(resolversDir, file)));
            }

            if (entityFiles.length > 0 || resolverFiles.length > 0) {
                const cjsOptions = Object.assign({}, specifiedOptions?.backend ?? inputOptions);

                const optionsInput = '$$' + pluginConfig.name + '/backend';

                cjsOptions.input = optionsInput;
                cjsOptions.output = Object.assign({}, cjsOptions.output, {
                    file: getPluginBackendPath(resolve(process.cwd(), buildDirName)),
                    format: "cjs",
                    name: pluginConfig.name,
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

    if (cromwellConfig.type === 'theme') {
        const buildDir = await getThemeRollupBuildDir(cromwellConfig.name);
        if (!buildDir) throw new Error(`CromwellPlugin Error. Failed to find package directory of ` + cromwellConfig.name);

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
        const pagesMetaInfo: TPagesMetaInfo = { paths: [] }

        const adminPanelOptions: RollupOptions[] = [];

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

            const optionsInput = '$$' + cromwellConfig.name + '/' + pagesDirChunk;
            options.plugins.push(virtual({
                [optionsInput]: pageImports
            }));
            options.input = optionsInput;

            options.output = Object.assign({}, options.output, {
                dir: buildDir,
                format: "esm",
                preserveModules: true
            } as OutputOptions);

            options.plugins.unshift(scssExternalPlugin());
            options.plugins.push(rollupPluginCromwellFrontend({ pagesMetaInfo, buildDir, srcDir, cromwellConfig, watch, frontendDeps }));

            outOptions.push(options);

            // Theme admin panel config
            if (!watch) {
                pagesMetaInfo.paths.forEach(pagePath => {
                    const adminOptions = (Object.assign({}, (specifiedOptions?.adminPanel ?? inputOptions)));
                    adminOptions.plugins = [...(adminOptions.plugins ?? [])];

                    const optionsInput = '$$' + cromwellConfig.name + '/admin/' + pagePath.pageName;
                    adminOptions.plugins.push(virtual({
                        [optionsInput]: `import pageComp from '${pagePath.srcFullPath}';export default pageComp;`
                    }));
                    adminOptions.input = optionsInput;
                    adminOptions.plugins.push(rollupPluginCromwellFrontend({ buildDir, cromwellConfig, frontendDeps }));

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
        const adminPanelDirChunk = 'adminPanel';
        const adminPanelDir = resolve(srcDir, adminPanelDirChunk);
        if (!watch && fs.pathExistsSync(adminPanelDir)) {
            const adminOptions = (Object.assign({}, specifiedOptions?.themePages ? specifiedOptions.themePages : inputOptions));

            adminOptions.plugins = [...(adminOptions.plugins ?? [])];

            const optionsInput = '$$' + cromwellConfig.name + '/' + adminPanelDirChunk;
            adminOptions.plugins.push(virtual({
                [optionsInput]: `import settings from '${normalizePath(adminPanelDir)}'; export default settings`
            }));
            adminOptions.input = optionsInput;

            adminOptions.output = Object.assign({}, adminOptions.output, {
                dir: resolve(buildDir, 'admin', '_settings'),
                format: "iife",
            } as OutputOptions);

            adminOptions.plugins.push(rollupPluginCromwellFrontend({ pagesMetaInfo, buildDir, srcDir, cromwellConfig, frontendDeps }));

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
    cromwellConfig?: TPluginConfig | TThemeConfig;
    frontendDeps?: TFrontendDependency[];
}): Plugin => {

    const modulesInfo = {};
    const chunksInfo = {};
    const importsInfo: Record<string, {
        externals: Record<string, string[]>;
        internals: string[];
    }> = {};

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

    const plugin: Plugin = {
        name: 'cromwell-frontend',
        options(options: RollupOptions) {

            if (!options.plugins) options.plugins = [];
            options.plugins.push(externalGlobals((id) => {
                if (resolveExternal(id, settings?.frontendDeps)) return `${cromwellStoreModulesPath}["${id}"]`;
            }, {
                include: '**/*.+(ts|tsx|js|jsx)'
            }));

            return options;
        },
        resolveId(source, importer) {


            if (settings?.cromwellConfig?.type === 'theme' && settings?.pagesMetaInfo?.paths) {
                if (/\.s?css$/.test(source)) {
                    return { id: source, external: true };
                }
            }
            if (resolveExternal(source, settings?.frontendDeps)) {
                return { id: source, external: true };
            }

            if (isExternalForm(source)) {
                return { id: require.resolve(source), external: false };
            }

            return null;
        },
    };

    if (settings?.generateMeta !== false) {
        plugin.transform = function (code, id): string | null {
            // console.log('id', id);
            id = normalizePath(id);
            if (!/\.(m?jsx?|tsx?)$/.test(id)) return null;

            //@ts-ignore
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
                        try {
                            const pckg: TPackageJson = require(resolve(process.cwd(), 'package.json'));
                            ver = getDepVersion(pckg, dep);
                        } catch (e) { console.error(e) }
                    }
                    if (ver) {
                        if (totalImportedBindings[dep].includes('default')) totalImportedBindings[dep] = ['default'];
                        versionedImportedBindings[`${dep}@${ver}`] = totalImportedBindings[dep];
                    }
                })

                const metaInfo: TSciprtMetaInfo = {
                    name: settings?.cromwellConfig?.name + '/' + info.fileName + '_' + cryptoRandomString({ length: 8 }),
                    externalDependencies: versionedImportedBindings,
                    // importsInfo
                    // info
                };

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
                            if (settings?.srcDir && info.facadeModuleId) {
                                let baseFileName: any = normalizePath(info.facadeModuleId).replace(normalizePath(settings.srcDir), '').split('.');
                                baseFileName.length > 1 ? baseFileName = baseFileName.slice(0, -1).join('.') : baseFileName.join('.');
                                let basePath: any = normalizePath(info.fileName).split('.');
                                basePath.length > 1 ? basePath = basePath.slice(0, -1).join('.') : basePath.join('.');
                                basePath = normalizePath(basePath).replace(baseFileName, '');
                                if (basePath !== '' && settings?.pagesMetaInfo) {
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
                fs.outputFileSync(resolve(settings.buildDir, 'pages_meta.json'), JSON.stringify(settings.pagesMetaInfo, null, 2));
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
