import { TSciprtMetaInfo, TPluginConfig, TThemeConfig, TPagesMetaInfo } from '@cromwell/core';
import {
    getMetaInfoPath, getPluginFrontendBundlePath, getPluginFrontendCjsPath, getPluginBackendPath
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
        if (pluginConfig.frontendInputFile && pluginConfig.buildDir) {

            const options = (Object.assign({}, specifiedOptions?.frontendBundle ?? inputOptions));
            const inputPath = resolve(process.cwd(), pluginConfig.frontendInputFile).replace(/\\/g, '/');

            const optionsInput = '$$' + pluginConfig.name + '/' + pluginConfig.frontendInputFile;
            options.input = optionsInput;
            options.output = Object.assign({}, options.output, {
                file: getPluginFrontendBundlePath(resolve(process.cwd(), pluginConfig.buildDir)),
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
                name: pluginConfig.name
            }));
            outOptions.push(options);


            const cjsOptions = Object.assign({}, specifiedOptions?.frontendCjs ?? inputOptions);

            cjsOptions.input = optionsInput;
            cjsOptions.output = Object.assign({}, cjsOptions.output, {
                file: getPluginFrontendCjsPath(resolve(process.cwd(), pluginConfig.buildDir)),
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
                generateMeta: false, name: pluginConfig.name
            }));
            outOptions.push(cjsOptions);
        }


        if (pluginConfig.backend && pluginConfig.buildDir) {
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
                    file: getPluginBackendPath(resolve(process.cwd(), pluginConfig.buildDir)),
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
        const themeConfig = cromwellConfig as TThemeConfig;
        let pagesDir = themeConfig?.main?.pagesDir;
        let buildDir = themeConfig?.main?.buildDir;
        if (!pagesDir) throw new Error(`CromwellPlugin Error. Specify pagesDir in the cromwell.config.js. It is declared in TThemeConfig type of @cromwell/core module`);
        if (!buildDir) throw new Error(`CromwellPlugin Error. Specify buildDir in the cromwell.config.js. It is declared in TThemeConfig type of @cromwell/core module`);
        pagesDir = isAbsolute(pagesDir) ? pagesDir : resolve(process.cwd(), pagesDir);
        buildDir = isAbsolute(buildDir) ? buildDir : resolve(process.cwd(), buildDir);

        const options = (Object.assign({}, specifiedOptions?.themePages ? specifiedOptions.themePages : inputOptions));
        if (fs.pathExistsSync(pagesDir)) {
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


                const optionsInput = '$$' + themeConfig.name + '/' + themeConfig?.main?.pagesDir
                options.plugins.push(virtual({
                    [optionsInput]: pageImports
                }));
                options.input = optionsInput;

                options.output = Object.assign({}, options.output, {
                    dir: buildDir,
                    format: "esm",
                } as OutputOptions);

                options.preserveModules = true;

                options.plugins.unshift(rollupPluginCromwellFrontend({ pagesMetaInfo, buildDir, name: themeConfig.name }));

                outOptions.push(options);

            } else {
                throw new Error('CromwellPlugin Error. No pages found at: ' + pagesDir);
            }
        }
    }


    return outOptions;
}

export const rollupPluginCromwellFrontend = (settings?: {
    packageJsonPath?: string;
    generateMeta?: boolean;
    pagesMetaInfo?: TPagesMetaInfo;
    buildDir?: string
    name: string
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
            }));

            return options;
        },
        resolveId(source) {
            // console.log('resolveId', source);
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
                    name: settings?.name + '/' + info.fileName + '_' + cryptoRandomString({ length: 8 }),
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

            if (settings?.pagesMetaInfo?.paths && settings.buildDir) {
                fs.outputFileSync(resolve(settings.buildDir, 'pages_meta.json'), JSON.stringify(settings.pagesMetaInfo, null, 2));
            }

        }
    }

    return plugin;
}