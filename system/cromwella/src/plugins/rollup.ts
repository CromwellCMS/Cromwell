import { TPagesMetaInfo, TPluginConfig, TSciprtMetaInfo, TThemeConfig, TRollupConfig } from '@cromwell/core';
import {
    buildDirName,
    getMetaInfoPath,
    getPluginBackendPath,
    pluginAdminBundlePath,
    pluginAdminCjsPath,
    pluginFrontendBundlePath,
    pluginFrontendCjsPath,
    serverLogFor,
    getThemeRollupBuildDir
} from '@cromwell/core-backend';
import virtual from '@rollup/plugin-virtual';
import cryptoRandomString from 'crypto-random-string';
import { walk } from 'estree-walker';
import fs from 'fs-extra';
import glob from 'glob';
import normalizePath from 'normalize-path';
import { dirname, resolve } from 'path';
import { OutputOptions, Plugin, RollupOptions } from 'rollup';
import externalGlobals from 'rollup-plugin-external-globals';
import isPromise from 'is-promise';
import { cromwellStoreModulesPath } from '../constants';
import { getDepVersion, getNodeModuleVersion, isExternalForm } from '../shared';

export const rollupConfigWrapper = async (cromwellConfig: TPluginConfig | TThemeConfig): Promise<RollupOptions[]> => {

    if (!cromwellConfig) throw new Error(`CromwellPlugin Error. Provide config as second argumet to the wrapper function`);
    if (!cromwellConfig?.type) throw new Error(`CromwellPlugin Error. Provide one of types to the CromwellConfig: 'plugin', 'theme'`);

    try {
        const pckg = require(resolve(process.cwd(), 'package.json'));
        if (pckg?.name) cromwellConfig.name = pckg.name;
    } catch (e) { console.error(e) };

    if (!cromwellConfig.name) throw new Error(`CromwellPlugin Error. Failed to find name of the package in working directory`);

    const strippedName = cromwellConfig.name.replace(/\W/g, '_');

    let specifiedOptions: TRollupConfig | undefined = cromwellConfig.rollupConfig?.() as any;
    //@ts-ignore
    if (isPromise(specifiedOptions)) specifiedOptions = await specifiedOptions;

    const inputOptions = specifiedOptions?.main;
    const outOptions: RollupOptions[] = [];

    if (cromwellConfig.type === 'plugin') {
        const pluginConfig = cromwellConfig as TPluginConfig;

        const handleInputFile = (inputFilePath: string, distChunk: string, cjsChunk: string) => {

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
                        import { FrontendPlugin } from '@cromwell/core-frontend';
                        import defaulComp from '${inputPath}';
                        export default FrontendPlugin(defaulComp, '${cromwellConfig.name}');
                        `
            }))
            options.plugins.unshift(rollupPluginCromwellFrontend({
                cromwellConfig
            }));
            outOptions.push(options);


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
            cjsOptions.plugins.unshift(rollupPluginCromwellFrontend({
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

            options.plugins.unshift(rollupPluginCromwellFrontend({ pagesMetaInfo, buildDir, srcDir, cromwellConfig }));

            outOptions.push(options);


            pagesMetaInfo.paths.forEach(pagePath => {
                const adminOptions = (Object.assign({}, (specifiedOptions?.adminPanel ?? inputOptions)));
                adminOptions.plugins = [...(adminOptions.plugins ?? [])];

                const optionsInput = '$$' + cromwellConfig.name + '/admin/' + pagePath.pageName;
                adminOptions.plugins.push(virtual({
                    [optionsInput]: `import pageComp from '${pagePath.srcFullPath}';export default pageComp;`
                }));
                adminOptions.input = optionsInput;
                adminOptions.plugins.unshift(rollupPluginCromwellFrontend({ buildDir, cromwellConfig }));
                adminOptions.output = Object.assign({}, adminOptions.output, {
                    dir: resolve(buildDir, 'admin', dirname(pagePath.pageName)),
                    format: "iife",
                } as OutputOptions);

                adminPanelOptions.push(adminOptions);
            });
            adminPanelOptions.forEach(opt => outOptions.push(opt));

        } else {
            throw new Error('CromwellPlugin Error. No pages found at: ' + pagesDir);
        }


        const adminPanelDirChunk = 'adminPanel';
        const adminPanelDir = resolve(srcDir, adminPanelDirChunk);
        if (fs.pathExistsSync(adminPanelDir)) {
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

            adminOptions.plugins.unshift(rollupPluginCromwellFrontend({ pagesMetaInfo, buildDir, srcDir, cromwellConfig }));

            outOptions.push(adminOptions);
        }
    }


    return outOptions;
}

export const rollupPluginCromwellFrontend = (settings?: {
    packageJsonPath?: string;
    generateMeta?: boolean;
    pagesMetaInfo?: TPagesMetaInfo;
    buildDir?: string;
    srcDir?: string;
    cromwellConfig?: TPluginConfig | TThemeConfig;
}): Plugin => {

    const modulesInfo = {};
    const chunksInfo = {};
    const importsInfo: Record<string, {
        externals: Record<string, string[]>;
        internals: string[];
    }> = {};

    // console.log('globals', globals);
    const plugin: Plugin = {
        name: 'cromwell-frontend',
        options(options: RollupOptions) {

            if (!options.plugins) options.plugins = [];
            options.plugins.push(externalGlobals((id) => {
                if (isExternalForm(id)) return `${cromwellStoreModulesPath}["${id}"]`;
            }, {
                include: '**/*.+(ts|tsx|js|jsx)'
            }));

            return options;
        },
        resolveId(source, importer) {
            // console.log('resolveId', source);

            if (settings?.cromwellConfig?.type === 'theme' && settings?.pagesMetaInfo?.paths) {
                if (/\.s?css$/.test(source)) {
                    return { id: source, external: true };
                }
            }

            if (isExternalForm(source)) {
                // console.log('source', source)
                return { id: source, external: true };
            }
            return null;
        },
    };

    if (settings?.generateMeta !== false) {
        plugin.transform = function (code, id): string | null {
            // console.log('id', id);
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
                            // console.log('globStr', globStr)
                            const targetFiles = glob.sync(globStr);
                            // console.log('targetFiles', targetFiles);
                            if (targetFiles[0]) importsInfo[id].internals.push(targetFiles[0]);
                            return;
                        }

                        // Add external

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
                            const pckg = require(resolve(process.cwd(), 'package.json'));
                            ver = getDepVersion(pckg, dep);
                        } catch (e) { console.log(e) }
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
                            delete paths.srcFullPath;
                        }
                        return paths;
                    })
                }
            });

            if (settings?.pagesMetaInfo?.paths && settings.srcDir && settings.buildDir) {

                // Copy locally imported stylesheets
                const globStr = `${normalizePath(settings.srcDir)}/**/*.+(css|scss|sass)`;
                const pageFiles = glob.sync(globStr);
                for (const styleSheetPath of pageFiles) {
                    const styleSheetBuildPath = normalizePath(styleSheetPath).replace(normalizePath(settings.srcDir),
                        normalizePath(settings.buildDir));

                    if (!fs.existsSync(styleSheetBuildPath)) {
                        fs.ensureDirSync(dirname(styleSheetBuildPath));
                        fs.copyFileSync(styleSheetPath, styleSheetBuildPath);
                    }
                    console.log('styleSheetSourcePath', styleSheetPath, 'styleSheetBuildPath', styleSheetBuildPath)
                }

                fs.outputFileSync(resolve(settings.buildDir, 'pages_meta.json'), JSON.stringify(settings.pagesMetaInfo, null, 2));
            }

        }
    }

    return plugin;
}