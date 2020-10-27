import { TSciprtMetaInfo, TPluginConfig, TThemeConfig, TPagesMetaInfo } from '@cromwell/core';
import {
    getMetaInfoPath, getPluginFrontendBundlePath, getPluginFrontendCjsPath, getPluginBackendPath,
    buildDirName
} from '@cromwell/core-backend';
import { walk } from 'estree-walker';
import glob from 'glob';
import { dirname, resolve, isAbsolute } from 'path';
import normalizePath from 'normalize-path';
import externalGlobals from 'rollup-plugin-external-globals';
import { RollupOptions, Plugin, OutputOptions } from 'rollup'
import virtual from '@rollup/plugin-virtual';
import fs from 'fs-extra';
import cryptoRandomString from 'crypto-random-string';
import { cromwellStoreModulesPath } from '../constants';
import { getNodeModuleVersion, isExternalForm } from '../shared';

export const rollupConfigWrapper = (inputOptions: RollupOptions, cromwellConfig: TPluginConfig | TThemeConfig,
    specifiedOptions?: {
        frontendBundle?: RollupOptions;
        frontendCjs?: RollupOptions;
        backend?: RollupOptions;
        themePages?: RollupOptions;
    }): RollupOptions[] => {

    if (!cromwellConfig) throw new Error(`CromwellPlugin Error. Provide cromwell.config as second argumet to the wrapper function`);
    if (!cromwellConfig?.type) throw new Error(`CromwellPlugin Error. Provide one of types to the CromwellConfig: 'plugin', 'theme'`);
    if (!cromwellConfig?.name) throw new Error(`CromwellPlugin Error. Provide name in the CromwellConfig`);

    const outOptions: RollupOptions[] = [];

    if (cromwellConfig.type === 'plugin') {
        const pluginConfig = cromwellConfig as TPluginConfig;
        if (pluginConfig.frontendInputFile) {

            const options = (Object.assign({}, specifiedOptions?.frontendBundle ?? inputOptions));
            const inputPath = resolve(process.cwd(), pluginConfig.frontendInputFile).replace(/\\/g, '/');

            const optionsInput = '$$' + pluginConfig.name + '/' + pluginConfig.frontendInputFile;
            options.input = optionsInput;
            options.output = Object.assign({}, options.output, {
                file: getPluginFrontendBundlePath(resolve(process.cwd(), buildDirName)),
                format: "iife",
                name: pluginConfig.name,
                banner: '(function() {',
                footer: `return ${pluginConfig.name};})();`
            } as OutputOptions);

            options.plugins = [...(options.plugins ?? [])];

            options.plugins.push(virtual({
                [optionsInput]: `
                        import defaulComp from '${inputPath}';
                        export default defaulComp;
                        `
            }))
            options.plugins.unshift(rollupPluginCromwellFrontend({
                cromwellConfig
            }));
            outOptions.push(options);


            const cjsOptions = Object.assign({}, specifiedOptions?.frontendCjs ?? inputOptions);

            cjsOptions.input = optionsInput;
            cjsOptions.output = Object.assign({}, cjsOptions.output, {
                file: getPluginFrontendCjsPath(resolve(process.cwd(), buildDirName)),
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
        const buildDir = resolve(process.cwd(), buildDirName);


        let srcDir = process.cwd();
        let pagesDir = resolve(srcDir, 'pages');
        let pagesRelativeDir = 'pages';

        if (!fs.existsSync(pagesDir)) {
            srcDir = resolve(process.cwd(), 'src');
            pagesDir = resolve(srcDir, 'pages');
            pagesRelativeDir = 'src/pages';
        }

        if (!fs.pathExistsSync(pagesDir)) {
            throw new Error('Pages directory was not found')
        }

        const options = (Object.assign({}, specifiedOptions?.themePages ? specifiedOptions.themePages : inputOptions));
        const globStr = `${pagesDir}/**/*.+(ts|tsx|js|jsx)`;
        const pageFiles = glob.sync(globStr);
        const pagesMetaInfo: TPagesMetaInfo = { paths: [] }

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


            const optionsInput = '$$' + cromwellConfig.name + '/' + pagesRelativeDir;
            options.plugins.push(virtual({
                [optionsInput]: pageImports
            }));
            options.input = optionsInput;

            options.output = Object.assign({}, options.output, {
                dir: buildDir,
                format: "esm",
            } as OutputOptions);

            options.preserveModules = true;

            options.plugins.unshift(rollupPluginCromwellFrontend({ pagesMetaInfo, buildDir, srcDir, cromwellConfig }));

            outOptions.push(options);

        } else {
            throw new Error('CromwellPlugin Error. No pages found at: ' + pagesDir);
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
    cromwellConfig: TPluginConfig | TThemeConfig;
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

            if (settings?.cromwellConfig?.type === 'theme') {
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

                const getImportBingingsForModule = (modId: string): Record<string, string[]> => {
                    let importedBindings = {};
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
                            const intBinds = getImportBingingsForModule(internal);
                            importedBindings = mergeBindings(importedBindings, intBinds);
                        })
                    }
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
                    const ver = getNodeModuleVersion(dep);
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
                    // console.log('styleSheetSourcePath', styleSheetPath, 'styleSheetBuildPath', styleSheetBuildPath)
                }

                fs.outputFileSync(resolve(settings.buildDir, 'pages_meta.json'), JSON.stringify(settings.pagesMetaInfo, null, 2));
            }

        }
    }

    return plugin;
}