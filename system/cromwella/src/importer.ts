import { TCromwellNodeModules, TSciprtMetaInfo } from './types';
import { buildDirChunk, moduleMainBuidFileName, moduleNodeBuidFileName, moduleMetaInfoFileName } from './constants';

/**
 * Node modules loading app for a Browser
 */
const isServer = (): boolean => (typeof window === 'undefined');
const getStore = () => {
    if (isServer()) {
        if (!(global as any).CromwellStore) (global as any).CromwellStore = {};
        return (global as any).CromwellStore;
    }
    else {
        if (!(window as any).CromwellStore) (window as any).CromwellStore = {};
        return (window as any).CromwellStore;
    }
}



export const getModuleImporter = (serverPublicDir?: string): TCromwellNodeModules => {
    const CromwellStore: any = getStore();
    if (!CromwellStore.nodeModules) CromwellStore.nodeModules = {};
    const Cromwell: TCromwellNodeModules = CromwellStore.nodeModules;

    if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
    if (!Cromwell.imports) Cromwell.imports = {};
    if (!Cromwell.modules) Cromwell.modules = {};
    if (!Cromwell.moduleExternals) Cromwell.moduleExternals = {};

    const canShowInfo = true;

    if (!Cromwell.importModule) Cromwell.importModule = (moduleName, namedExports = ['default']): Promise<boolean> | boolean => {
        if (canShowInfo) console.log('Cromwella:bundler: importModule ' + moduleName + ' named: ' + namedExports);
        if (namedExports.includes('default')) namedExports = ['default'];

        if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
        if (!Cromwell.imports) Cromwell.imports = {};
        if (!Cromwell.modules) Cromwell.modules = {};
        if (!Cromwell.moduleExternals) Cromwell.moduleExternals = {};

        const metaFilepath = `${buildDirChunk}/${moduleName}/${moduleMetaInfoFileName}`;
        const importerFilepath = `${buildDirChunk}/${moduleName}/${moduleMainBuidFileName}`;
        const importerNodeFilepath = `${buildDirChunk}/${moduleName}/${moduleNodeBuidFileName}`;

        let moduleVer: string | undefined;
        if (/@\d+\.\d+\.\d+/.test(moduleName)) {
            const modChunks = moduleName.split('@');
            moduleVer = modChunks.pop();
            moduleName = modChunks.join('@');
        }
        if (canShowInfo) console.log('moduleName', moduleName, 'moduleVer', moduleVer)

        // Sync, require()
        const serverimport = () => {
            if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
            if (Cromwell.importStatuses[moduleName]) return true;
            else {
                const resolve = Function('require', "return require('path').resolve")(require);

                try {
                    const fullPath = resolve(serverPublicDir ? serverPublicDir :
                        resolve(process.cwd(), 'public'), metaFilepath);

                    const metaInfo: TSciprtMetaInfo = require(fullPath);
                    // { [moduleName]: namedExports }
                    if (metaInfo && Cromwell?.importSciptExternals)
                        Cromwell.importSciptExternals(metaInfo);
                } catch (e) {
                    console.error('Cromwella:bundler: Failed to require module server-side', e);
                    return false;
                }

                try {
                    const fullPath = resolve(serverPublicDir ? serverPublicDir :
                        resolve(process.cwd(), 'public'), importerNodeFilepath);

                    const reqModule = require(fullPath);
                } catch (e) {
                    console.error('Cromwella:bundler: Failed to require module server-side', e);
                    return false;
                }

                if (canShowInfo) console.log('Cromwella:bundler: Successfully loaded module: ' + moduleName);

                return true;
            }
        }

        // Async, fetch
        const browserImport = async (): Promise<boolean> => {
            if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
            if (!Cromwell.imports) Cromwell.imports = {};

            const importAllNamed = async (): Promise<boolean[]> => {
                const promises: Promise<boolean>[] = [];
                namedExports.forEach(named => {
                    promises.push(useImporter(named));
                });
                const success = await Promise.all(promises);
                return success;
            }

            const useImporter = async (namedExport: string): Promise<boolean> => {
                if (Cromwell.imports && Cromwell.imports[moduleName]) {
                    if (!Cromwell.imports[moduleName][namedExport]) {
                        console.error(`loading:!Cromwell.imports[moduleName][namedExport]: import {${namedExport}} from ${moduleName}`);
                        return false;
                    }
                    try {
                        await Cromwell.imports[moduleName][namedExport]();
                        return true;
                    } catch (error) {
                        console.error(`Cromwella:bundler: An error occurred while loading the library: import { ${namedExport} } from '${moduleName}'`, error);
                        return false;
                    };
                }
                return false;
            }

            // Module has been requested for the first time. Load main importer script of the module.
            if (!Cromwell.importStatuses[moduleName]) {

                Cromwell.importStatuses[moduleName] = new Promise(async (onLoad) => {

                    if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
                    if (!Cromwell.imports) Cromwell.imports = {};

                    let importerPromise = fetch(importerFilepath).then(res => res.text());

                    // Load meta and externals if it has any
                    const metaInfoPromise = fetch(metaFilepath).then(res => res.text());

                    try {
                        const metaInfoStr = await metaInfoPromise;
                        if (metaInfoStr) {
                            const metaInfo: TSciprtMetaInfo = JSON.parse(metaInfoStr);
                            // { [moduleName]: namedExports }
                            if (metaInfo && Cromwell?.importSciptExternals)
                                await Cromwell.importSciptExternals(metaInfo)
                        } else {
                            throw new Error('Failed to fetch file ' + metaFilepath)
                        }
                    } catch (e) {
                        console.error('Cromwella:bundler: Failed to load meta info about importer of the module: ' + moduleName, e);
                    }

                    try {
                        const jsText = await importerPromise;
                        if (jsText) {
                            if (isServer()) {
                                Function('require', jsText)(require);
                            } else {
                                Function(jsText)();
                            }
                            if (canShowInfo) console.log(`Cromwella:bundler: Importer for module "${moduleName}" executed`);
                        } else {
                            throw new Error('Failed to fetch file ' + importerFilepath)
                        }
                    } catch (e) {
                        console.error('Cromwella:bundler: Failed to execute importer for module: ' + moduleName, e);
                        Cromwell.importStatuses[moduleName] = 'failed';
                        onLoad('failed');
                        return false;
                    }



                    if (!Cromwell.imports[moduleName]) {
                        console.error('Cromwella:bundler: Failed to load importer for module: ' + moduleName);
                        Cromwell.importStatuses[moduleName] = 'failed';
                        onLoad('failed');
                        return false;
                    };

                    if (canShowInfo) console.log('Cromwella:bundler: Successfully loaded importer for module: ' + moduleName);

                    const success = await importAllNamed();

                    if (success.includes(false)) {
                        console.error('Cromwella:bundler: Failed to import one of named exports');
                        Cromwell.importStatuses[moduleName] = 'failed';
                        onLoad('failed');
                        return false;
                    } else {
                        if (canShowInfo) console.log('Cromwella:bundler: All initially requested named exports for module "' + moduleName + '" have been successfully loaded', namedExports);
                    }

                    Cromwell.importStatuses[moduleName] = 'ready';
                    onLoad('ready');

                    return true;
                })

                const status = await Cromwell.importStatuses[moduleName];
                if (status === 'ready') return true;
                return false;
            }

            if (typeof Cromwell.importStatuses[moduleName] === 'object') {
                if (canShowInfo) console.log('awaitig... ' + moduleName);
                const status = await Cromwell.importStatuses[moduleName];
                if (status === 'ready') {
                    const success = await importAllNamed();
                    if (canShowInfo) console.log('Cromwella:bundler: All named exports for module "' + moduleName + '" have been successfully loaded', namedExports);
                    if (success.includes(false)) return false;
                    return true;
                }
            }

            if (Cromwell.importStatuses[moduleName] === 'ready') {
                if (!Cromwell.imports[moduleName]) throw new Error('ready:!Cromwell.imports[moduleName]' + moduleName);
                const success = await importAllNamed();
                if (success.includes(false)) return false;
                return true;
            }

            return false;
        }


        if (isServer()) {
            return serverimport()
        } else {
            return browserImport();
        }

    }

    if (!Cromwell.importSciptExternals) Cromwell.importSciptExternals = async (metaInfo: TSciprtMetaInfo | undefined) => {
        const externals = metaInfo?.externalDependencies;
        if (metaInfo && externals && typeof externals === 'object' && Object.keys(externals).length > 0) {
            if (canShowInfo) console.log('Cromwella:bundler: module ' + metaInfo.name + ' has externals: ' + JSON.stringify(externals, null, 4));
            if (canShowInfo) console.log('Cromwella:bundler: loading externals first for module ' + metaInfo.name + ' ...');
            const promises: Promise<boolean>[] = []
            let success: boolean[] | undefined;

            Object.keys(externals).forEach(ext => {
                const result = Cromwell?.importModule?.(ext, externals[ext]);
                if (result !== undefined) {
                    if (typeof result === 'object') {
                        result.catch(e => {
                            console.error('Cromwella:bundler: Failed to load external ' + ext + ' for module: ' + metaInfo.name, e);
                        });
                        promises.push(result);
                    } else if (typeof result === 'boolean') {
                        if (!success) success = [];
                        success.push(result);
                    }
                }
            });
            try {
                if (!isServer()) {
                    success = await Promise.all(promises);
                }
            } catch (e) {
                console.error('Cromwella:bundler: Failed to load externals for module: ' + metaInfo.name, e);
            }
            let successNum = 0;
            if (success) {
                success.forEach(s => s && successNum++);
            }
            if (canShowInfo) console.log(`Cromwella:bundler: ${successNum}/${Object.keys(externals).length} externals for module ${metaInfo.name} have been loaded`);
            if (success && !success.includes(false)) return true;
        }

        return false
    }

    return Cromwell;
}

