import { getStoreItem, setStoreItem, TFrontendBundle, isServer, getStore, logFor } from '@cromwell/core';
import loadableComponent from '@loadable/component';

export const loadFrontendBundle = <TLoadable extends (...args: any) => any = (func: (() => Promise<React.ComponentType>)) => React.ComponentType>(bundleName: string,
    loader: () => Promise<TFrontendBundle | null | undefined>,
    loadable?: TLoadable,
    fallbackComponent?: React.ComponentType,
    dynamicLoaderProps?: Record<string, any>
): ReturnType<TLoadable> => {

    let components = getStoreItem('components');
    if (!components) {
        components = {};
        setStoreItem('components', components);
    }

    const savedComp = components[bundleName];
    if (savedComp) {
        return (savedComp as any)?.default ?? savedComp;
    }

    const loadableFunc = loadable ?? loadableComponent;

    const loadableComp = loadableFunc(async () => {
        let bundle;
        let comp: any;
        try {
            bundle = await loader();
        } catch (e) {
            console.error(e);
        }

        if (bundle?.source) {
            if (bundle?.meta) {
                const nodeModules = getStoreItem('nodeModules');
                await nodeModules?.importScriptExternals?.(bundle.meta);
            }

            if (isServer()) {
                // Server-side
                const evalCode = () => {
                    try {
                        comp = Function('CromwellStore', `return ${bundle.source}`)(getStore());
                    } catch (e) {
                        logFor('errors-only', 'loadFrontendBundle: Failed to evaluate code of a bundle: ' + bundleName, console.error);
                    }
                }

                if (bundle.cjsPath) {
                    try {
                        const fsRequire = getStoreItem('fsRequire') as any;
                        comp = await fsRequire(bundle.cjsPath);
                    } catch (e) {
                        logFor('errors-only', 'loadFrontendBundle: Failed to fsRequire bundle at: ' + bundle.cjsPath + e, console.error);
                        evalCode();
                    }
                } else {
                    evalCode();
                }

            } else {
                // Browser-side
                const source = `
                var comp = ${bundle.source};
                CromwellStore.components['${bundleName}'] = comp;
                `;

                await new Promise(done => {
                    const sourceBlob = new Blob([source], { type: 'text/javascript' });
                    const objectURL = URL.createObjectURL(sourceBlob);
                    const domScript = document.createElement('script');
                    domScript.src = objectURL;
                    domScript.onload = () => done(true);
                    document.head.appendChild(domScript);
                });

                const components = getStoreItem('components');
                comp = components?.[bundleName];
            }

            comp = comp?.default ?? comp;

            const components = getStoreItem('components') ?? {};
            if (comp) {
                components[bundleName] = comp;
            }
        }

        return comp ?? fallbackComponent ?? (() => null);
    }, dynamicLoaderProps) ?? fallbackComponent ?? (() => null);

    components[bundleName] = loadableComp;

    return loadableComp;
}