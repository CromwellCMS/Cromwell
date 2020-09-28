const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');

export type TSciprtMetaInfo = {
    // { [moduleName]: namedImports }
    externalDependencies: Record<string, string[]>
}

export const rollupPluginCromwellFrontend = (settings) => {
    // const deps = Object.keys(packageJson.dependencies);
    const deps = settings.dependencies;
    const globals = Object.assign({}, ...deps.map(mod => ({
        [mod]: `Modules["${mod}"]`
    })));
    // console.log('globals', globals);
    return {
        name: 'cromwell-frontend',
        options(options) {
            if (Array.isArray(options.output)) {
                options.output = options.output.map(out => {
                    out.globals = globals;
                    return out;
                })
            }
            else if (typeof options.output === 'object') {
                options.output.globals = globals;
            }
            return options;
        },
        resolveId(source) {
            // console.log('resolveId', source);
            if (deps.includes(source)) {
                return { id: source, external: true };
            }
            return null;
        },
        generateBundle(options, bundle) {
            Object.values(bundle).forEach((info: any) => {
                const metaInfo: TSciprtMetaInfo = {
                    externalDependencies: info.importedBindings
                }
                //@ts-ignore
                this.emitFile({
                    type: 'asset', fileName: `${info.fileName}_meta.json`,
                    source: JSON.stringify(metaInfo, null, 2)
                });
            })
        }
    };
}