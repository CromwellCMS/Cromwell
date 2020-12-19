import { getStoreItem, setStoreItem, TFrontendBundle, isServer, getStore } from '@cromwell/core';
import loadableComponent from '@loadable/component';

export const loadFrontendBundle = (bundleName: string,
    loader: () => Promise<TFrontendBundle | null | undefined>,
    loadable?: (func: (() => Promise<React.ComponentType>)) => React.ComponentType,
    fallbackComponent?: React.ComponentType,
    dynamicLoaderProps?: Record<string, any>
): React.ComponentType<any> => {

    let components = getStoreItem('components');
    if (!components) {
        components = {};
        setStoreItem('components', components);
    }
    const nodeModules = getStoreItem('nodeModules');
    const savedComp = components?.[bundleName];

    let comp: any = undefined;

    if (savedComp) {
        comp = (savedComp as any)?.default ?? savedComp;
        return comp;
    }

    const loadableFunc = loadable ?? loadableComponent;
    comp = loadableFunc(async () => {

        let bundle;
        try {
            bundle = await loader();
        } catch (e) {
            console.error(e);
        }

        if (bundle?.source) {
            if (bundle?.meta) {
                await nodeModules?.importSciptExternals?.(bundle.meta);
            }

            if (isServer()) {
                // Server-side
                if (bundle.cjsPath) {
                    const fsRequire = getStoreItem('fsRequire');
                    comp = fsRequire?.(bundle.cjsPath).default;
                } else {
                    comp = Function('CromwellStore', `return ${bundle.source}`)(getStore());
                }
                if (comp) components![bundleName] = comp;
                comp = comp?.default ?? comp;
                if (comp) return comp;
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

                comp = components?.[bundleName];
                comp = comp?.default ?? comp;
                if (comp) return comp;
            }
        }

        return fallbackComponent ?? (() => null);
    }, dynamicLoaderProps);

    return comp;
}