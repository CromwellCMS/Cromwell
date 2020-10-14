import colorsdef from 'colors/safe';
import externalGlobals from 'rollup-plugin-external-globals';
import { walk } from "estree-walker";
import { cromwellStoreModulesPath, getDepVersion } from '../constants';
import { getCromwellaConfigSync, isExternalForm, getNodeModuleVersion } from '../shared';
import { TSciprtMetaInfo } from '../types';
import { resolve, dirname } from 'path';
import glob from 'glob';


const colors: any = colorsdef;
const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');


export const rollupPluginCromwellFrontend = (settings?: {
    packageJsonPath?: string;
}) => {
    // const deps = Object.keys(packageJson.dependencies);
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

    console.log('globals', globals);
    return {
        name: 'cromwell-frontend',
        options(options) {

            options.plugins.push(externalGlobals(globals));

            const handleOutput = (output) => {
                if (output && output.format !== "esm") {
                    console.log(colors.brightYellow('(!) Found wrong output format. Cromwell CMS works with output.format === "esm"'))
                    // output.globals = Object.assign({}, output.globals, globals);;
                }
            }

            if (Array.isArray(options.output)) {
                options.output = options.output.map(out => {
                    handleOutput(out);
                    return out;
                })
            }
            else if (typeof options.output === 'object') {
                handleOutput(options.output);
            }
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
        transform(code, id) {
            // console.log('id', id);
            if (!/\.(m?jsx?|tsx?)$/.test(id)) return;

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
            })
        },
        renderChunk(code, chunk) {
            // chunksInfo[chunk.id] = info;

            // console.log('renderChunk', chunk)
            return null;
        },
        generateBundle(options, bundle) {
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
                    fileName: `${info.fileName}_meta.json`,
                    source: JSON.stringify(metaInfo, null, 2)
                });
            })
        }
    };
}