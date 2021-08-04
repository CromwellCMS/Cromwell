import { getStore, getStoreItem, isServer, setStoreItem, TFrontendBundle } from '@cromwell/core';
import loadableComponent from '@loadable/component';

import { TDynamicLoader } from '../constants';

const pendingComponents: Record<string, any> = {};

export const loadFrontendBundle = async (
    bundleName: string,
    loader: () => Promise<TFrontendBundle | null | undefined>,
) => {
    const components = getStoreItem('components') ?? {};
    setStoreItem('components', components);

    const savedComp = components[bundleName];
    if (savedComp) {
        return (savedComp as any)?.default ?? savedComp;
    }

    let bundle: TFrontendBundle | null | undefined;
    try {
        bundle = await loader();
    } catch (e) {
        console.error(e);
    }
    let comp: any;

    if (!bundle?.source) return;
    if (bundle?.meta) {
        const nodeModules = getStoreItem('nodeModules');
        await nodeModules?.importScriptExternals?.(bundle.meta);
    }

    if (isServer()) {
        // Server-side
        const evalCode = () => {
            if (!bundle?.source) return;
            try {
                comp = Function('CromwellStore', `return ${bundle.source}`)(getStore());
            } catch (e) {
                console.error(`loadFrontendBundle: Failed to evaluate code of a bundle: ${bundleName}` + e);
            }
        }

        if (bundle.cjsPath) {
            try {
                const fsRequire = getStoreItem('fsRequire') as any;
                comp = await fsRequire(bundle.cjsPath);
            } catch (e) {
                console.error(`loadFrontendBundle: Failed to fsRequire bundle ${bundleName} at: ${bundle.cjsPath}` + e);
                evalCode();
            }
        } else {
            evalCode();
        }

        if (comp) {
            components[bundleName] = comp;
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

    return comp?.default ?? comp;
}

export const getLoadableFrontendBundle = (
    bundleName: string,
    loader: () => Promise<TFrontendBundle | null | undefined>,
    loadable?: TDynamicLoader,
    fallbackComponent?: React.ComponentType,
    dynamicLoaderProps?: Record<string, any>
): ReturnType<TDynamicLoader> => {

    if (pendingComponents[bundleName]) return pendingComponents[bundleName];

    const loadableFunc: TDynamicLoader = loadable ?? loadableComponent;

    const loadableComp = loadableFunc?.(async () => {
        const comp = await loadFrontendBundle(bundleName, loader);
        return comp ?? fallbackComponent ?? (() => null);

    }, dynamicLoaderProps) ?? fallbackComponent ?? (() => null);

    pendingComponents[bundleName] = loadableComp;
    return loadableComp;
}