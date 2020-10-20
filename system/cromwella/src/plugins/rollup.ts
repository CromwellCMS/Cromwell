import { TSciprtMetaInfo, TPluginConfig } from '@cromwell/core';
import { getMetaInfoPath, getPluginFrontendBundlePath, getPluginFrontendCjsPath } from '@cromwell/core-backend';
import colorsdef from 'colors/safe';
import { walk } from 'estree-walker';
import glob from 'glob';
import { dirname, resolve, isAbsolute } from 'path';
import externalGlobals from 'rollup-plugin-external-globals';
import { RollupOptions, Plugin, OutputOptions } from 'rollup'
import virtual from '@rollup/plugin-virtual';

import { cromwellStoreModulesPath } from '../constants';
import { getNodeModuleVersion, isExternalForm } from '../shared';

const colors: any = colorsdef;
const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');


export const rollupConfigWrapper = (inputOptions: RollupOptions, cromwellConfig: TPluginConfig,
    specifiedOptions?: {
        frontendBundle?: RollupOptions;
        frontendCjs?: RollupOptions;
    }): RollupOptions[] => {

    if (!cromwellConfig?.type) throw new Error(`Please provide one of types to the CromwellConfig: 'plugin', 'theme'`);
    if (!cromwellConfig?.name) throw new Error(`Please provide name in the CromwellConfig`);

    const outOptions: RollupOptions[] = [];

    if (cromwellConfig.type === 'plugin' && cromwellConfig.frontendInputFile && cromwellConfig.buildDir) {
        const options = (Object.assign({}, specifiedOptions?.frontendBundle ? specifiedOptions.frontendBundle : inputOptions));
        const inputPath = resolve(process.cwd(), cromwellConfig.frontendInputFile).replace(/\\/g, '/');

        options.input = 'frontendInputFile';
        options.output = Object.assign({}, options.output, {
            file: getPluginFrontendBundlePath(resolve(process.cwd(), cromwellConfig.buildDir)),
            format: "iife",
            name: cromwellConfig.name,
            banner: '(function() {',
            footer: `
                return ${cromwellConfig.name};
                })();`
        } as OutputOptions);

        options.plugins = [...(options.plugins ?? [])];

        options.plugins.push(virtual({
            frontendInputFile: `
                    import defaulComp from '${inputPath}';
                    export default defaulComp;
                    `
        }))
        options.plugins.unshift(rollupPluginCromwellFrontend());
        outOptions.push(options);


        const cjsOptions = Object.assign({}, specifiedOptions?.frontendCjs ? specifiedOptions.frontendCjs : inputOptions);

        // cjsOptions.input = 'cjsfrontendInputFile';
        cjsOptions.input = inputPath;
        cjsOptions.output = Object.assign({}, cjsOptions.output, {
            file: getPluginFrontendCjsPath(resolve(process.cwd(), cromwellConfig.buildDir)),
            format: "cjs",
            name: cromwellConfig.name,
        } as OutputOptions)

        cjsOptions.plugins = [...(cjsOptions.plugins ?? [])];

        // cjsOptions.plugins.push(virtual({
        //     cjsfrontendInputFile: `
        //         // const { getStaticProps } = require('${inputPath}');
        //         // module.exports.getStaticProps = getStaticProps;

        //         export * as allExports from '${inputPath}';
        //         `
        // }))
        cjsOptions.plugins.unshift(rollupPluginCromwellFrontend({ generateMeta: false }));
        outOptions.push(cjsOptions);
    }


    return outOptions;
}

export const rollupPluginCromwellFrontend = (settings?: {
    packageJsonPath?: string;
    generateMeta?: boolean;
}): Plugin => {

    let packageJson;
    try {
        packageJson = require(resolve(settings?.packageJsonPath ?
            settings?.packageJsonPath : process.cwd(), 'package.json'));
    } catch (e) { console.log(e) }

    const deps = packageJson?.frontendDependencies?.map(dep =>
        typeof dep === 'object' ? dep.name : dep) ?? [];

    const globals = Object.assign({}, ...deps.map(mod => ({
        [mod]: `${cromwellStoreModulesPath}["${mod}"]`
    })));

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
            options.plugins.push(externalGlobals(globals));

            return options;
        },
        resolveId(source) {
            // console.log('resolveId', source);
            if (deps.includes(source)) {
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
                            if (!deps.includes(libName)) return;

                            const importsSpecs = importsInfo[modId].externals[libName];
                            importsSpecs?.forEach(spec => {
                                if (!importedBindings[libName]) importedBindings[libName] = [];
                                if (!importedBindings[libName].includes(spec)) {
                                    importedBindings[libName].push(spec);
                                }
                            });

                            importsInfo[modId].internals.forEach(internal => {
                                const intBinds = getImportBingingsForModule(internal);
                                importedBindings = mergeBindings(importedBindings, intBinds);
                            })

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
                    name: info.facadeModuleId,
                    externalDependencies: versionedImportedBindings,
                    // importsInfo
                };

                //@ts-ignore
                this.emitFile({
                    type: 'asset',
                    fileName: getMetaInfoPath(info.fileName),
                    source: JSON.stringify(metaInfo, null, 2)
                });
            })
        }
    }

    return plugin;
}