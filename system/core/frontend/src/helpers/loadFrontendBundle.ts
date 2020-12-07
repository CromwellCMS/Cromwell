import { getStoreItem, setStoreItem, TFrontendBundle } from '@cromwell/core';
import loadable from '@loadable/component';

export const loadFrontendBundle = (bundleName: string,
    loader: () => Promise<TFrontendBundle | null | undefined>): React.ComponentType<any> => {
    let components = getStoreItem('components');
    if (!components) {
        components = {};
        setStoreItem('components', components);
    }
    const nodeModules = getStoreItem('nodeModules');
    const savedComp = components?.[bundleName];

    let pageComp: any = undefined;

    if (savedComp) {
        pageComp = (savedComp as any)?.default ?? savedComp;
    } else {
        pageComp = loadable(async () => {
            const bundle = await loader();
            if (bundle?.source) {
                if (bundle?.meta) {
                    await nodeModules?.importSciptExternals?.(bundle.meta);
                }

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
                pageComp = components?.[bundleName];
                return pageComp.default ?? pageComp;
            }
        })
    }
    return pageComp;
}