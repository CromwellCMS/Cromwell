import colorsdef from 'colors/safe';
import externalGlobals from 'rollup-plugin-external-globals';

import { cromwellStoreModulesPath } from '../constants';
import { getCromwellaConfigSync } from '../shared';
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
        renderChunk(code, chunk) {
            console.log('renderChunk', chunk)
            return null;
        },
        generateBundle(options, bundle) {
            Object.values(bundle).forEach((info: any) => {
                const metaInfo: TSciprtMetaInfo = {
                    name: info.facadeModuleId,
                    externalDependencies: info.importedBindings,
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