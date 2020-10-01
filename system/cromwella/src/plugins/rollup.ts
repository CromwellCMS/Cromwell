import colorsdef from 'colors/safe';
import externalGlobals from 'rollup-plugin-external-globals';
import { walk } from "estree-walker";
import { cromwellStoreModulesPath } from '../constants';
import { getCromwellaConfigSync, isExternalForm } from '../shared';
import { TSciprtMetaInfo } from '../types';

const colors: any = colorsdef;
const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');


export const rollupPluginCromwellFrontend = (settings?: {
    dependencies?: string[];
}) => {
    // const deps = Object.keys(packageJson.dependencies);
    const cromwellaConfig = getCromwellaConfigSync(process.cwd());

    const deps = settings?.dependencies ?? cromwellaConfig?.frontendDependencies?.map(dep =>
        typeof dep === 'object' ? dep.name : dep) ?? [];

    const globals = Object.assign({}, ...deps.map(mod => ({
        [mod]: `${cromwellStoreModulesPath}["${mod}"]`
    })));

    const modulesInfo = {};
    const chunksInfo = {};
    const importsInfo = {};

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
            console.log('id', id);
            if (!/\.(m?jsx?|tsx?)$/.test(id)) return;

            //@ts-ignore
            const ast = this.parse(code);
            walk(ast, {
                enter(node: any, walker) {
                    if (node.type === 'ImportDeclaration') {
                        if (!node.specifiers || !node.source) return;
                        const source = node.source.value;
                        if (!isExternalForm(source)) return;

                        // if (!importsInfo[id]) importsInfo[id] = [];
                        // importsInfo[id].push(node);
                        // return;
                        if (!importsInfo[id]) importsInfo[id] = {};
                        if (!importsInfo[id][source]) importsInfo[id][source] = [];

                        node.specifiers.forEach(spec => {
                            if (spec.type === 'ImportDefaultSpecifier') {
                                importsInfo[id][source].push('default')
                            }
                            if (spec.type === 'ImportSpecifier' && spec.imported) {
                                importsInfo[id][source].push(spec.imported.name)
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
                const importedBindings = {};
                if (info.modules) {
                    Object.keys(info.modules).forEach(modId => {
                        if (importsInfo[modId]) {
                            Object.keys(importsInfo[modId]).forEach(libName => {
                                if (!deps.includes(libName)) return;

                                const importsSpecs = importsInfo[modId][libName];
                                importsSpecs.forEach(spec => {
                                    if (!importedBindings[libName]) importedBindings[libName] = [];
                                    if (!importedBindings[libName].includes(spec)) {
                                        importedBindings[libName].push(spec);
                                    }
                                })

                            })
                        }
                    })
                }

                const metaInfo: TSciprtMetaInfo = {
                    name: info.facadeModuleId,
                    externalDependencies: importedBindings,
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