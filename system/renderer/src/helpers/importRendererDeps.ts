import pckg from '../../package.json';
const { getModuleImporter } = require('@cromwell/cromwella/build/importer.js');

export const importRendererDeps = () => {
    const { isServer, getStore } = require('@cromwell/core');
    const React = require('react');
    const NextHead = require('next/head');

    const importer = getModuleImporter();
    //@ts-ignore
    getStore().nodeModules.modules['react'] = React;
    //@ts-ignore
    getStore().nodeModules.modules['react'].didDefaultImport = true;
    //@ts-ignore
    getStore().nodeModules.modules['next/head'] = NextHead;

    if (isServer()) {
        const nodeFetch = require('node-fetch');
        //@ts-ignore
        getStore().nodeModules.modules['node-fetch'] = nodeFetch;

        importRendererDepsFrontend();
    }

}

export const importRendererDepsFrontend = async (): Promise<boolean> => {
    const importer = getModuleImporter();
    return importer.importSciptExternals!({
        name: '@cromwell/renderer',
        externalDependencies: {
            [getNodeModuleNameWithVersion('@cromwell/core') as string]: [
                'getStoreItem', 'setStoreItem'
            ],
            [getNodeModuleNameWithVersion('@cromwell/core-frontend') as string]: [
                'Head'
            ],
            [getNodeModuleNameWithVersion('react-is') as string]: [
                'isValidElementType'
            ]
        }
    });
}

export const getNodeModuleVersion = (moduleName: string): string | undefined => {
    //@ts-ignore
    return pckg.rendererFrontendDependencies[moduleName];
}

export const getNodeModuleNameWithVersion = (moduleName: string): string | undefined => {
    const ver = getNodeModuleVersion(moduleName);
    if (ver) return `${moduleName}@${ver}`;
}