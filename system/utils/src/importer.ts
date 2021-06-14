import { TCromwellNodeModules, TSciprtMetaInfo } from '@cromwell/core';
import {
    moduleMainBuidFileName, moduleNodeBuidFileName,
    moduleMetaInfoFileName, moduleLibBuidFileName, bundledModulesDirName
} from './constants';

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

    Cromwell.setPrefix = (prefix) => Cromwell.prefix = prefix;

    const canShowInfo = false;

    let normalizePath;
    let nodeRequire;
    let resolve;

    if (!Cromwell.importModule) Cromwell.importModule = (moduleName, namedExports = ['default']): Promise<boolean> | boolean => {
        Cromwell.hasBeenExecuted = true;
        if (canShowInfo) console.log('Cromwell:importer: importModule ' + moduleName + ' named: ' + namedExports);
        let isDefaultImport = false;
        let isLibImport = false;
        if (namedExports.includes('default')) {
            namedExports = ['default'];
            isDefaultImport = true;
        }

        if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
        if (!Cromwell.imports) Cromwell.imports = {};
        if (!Cromwell.modules) Cromwell.modules = {};
        if (!Cromwell.moduleExternals) Cromwell.moduleExternals = {};

        const metaFilepath = `${Cromwell.prefix ? `${Cromwell.prefix}/` : ''}${bundledModulesDirName}/${moduleName}/${moduleMetaInfoFileName}`;
        const importerFilepath = `${Cromwell.prefix ? `/${Cromwell.prefix}` : ''}/${bundledModulesDirName}/${moduleName}/${moduleMainBuidFileName}`;
        const importerEntireLibFilepath = `${Cromwell.prefix ? `/${Cromwell.prefix}` : ''}/${bundledModulesDirName}/${moduleName}/${moduleLibBuidFileName}`;
        const importerNodeFilepath = `${bundledModulesDirName}/${moduleName}/${moduleNodeBuidFileName}`;

        let moduleVer: string | undefined;
        if (/@\d+\.\d+\.\d+/.test(moduleName)) {
            const modChunks = moduleName.split('@');
            moduleVer = modChunks.pop();
            moduleName = modChunks.join('@');
        }
        if (canShowInfo) console.log('moduleName', moduleName, 'moduleVer', moduleVer)

        // Server-side. Sync, require()
        const serverimport = () => {
            if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
            if (Cromwell.importStatuses[moduleName]) return true;
            if (!Cromwell.modules) Cromwell.modules = {};

            if (!normalizePath) normalizePath = eval(`require('normalize-path');`);
            if (!nodeRequire) nodeRequire = (name) => eval(`require('${normalizePath(name)}');`);
            if (!resolve) resolve = nodeRequire('path').resolve;

            try {
                // Try to require from bundled modules
                try {
                    const fullPath = resolve(serverPublicDir ? serverPublicDir :
                        resolve(process.cwd(), 'public'), metaFilepath);

                    const metaInfo: TSciprtMetaInfo = nodeRequire(fullPath);
                    // { [moduleName]: namedExports }
                    if (metaInfo && Cromwell?.importSciptExternals)
                        Cromwell.importSciptExternals(metaInfo);
                } catch (e) {
                    console.error('Cromwell:importer: Failed to require meta info of module server-side: ' + metaFilepath, e);
                }

                try {
                    const fullPath = resolve(serverPublicDir ? serverPublicDir :
                        resolve(process.cwd(), 'public'), importerNodeFilepath);

                    nodeRequire(fullPath);

                    const mock = Function('require', "return require('mock-require/index');")(nodeRequire)
                    const reqModule = Cromwell.modules?.[moduleName];

                    if (!reqModule) throw new Error('!reqModule');

                    Cromwell.modules[moduleName] = reqModule;
                    mock(moduleName, reqModule);

                } catch (e) {
                    console.error('Cromwell:importer: Failed to require module server-side: ' + importerNodeFilepath, e);
                    Cromwell.importStatuses[moduleName] = 'failed';
                    throw new Error();
                }

            } catch (e) {
                // If failed, try to use Node.js resolution
                const reqModule = nodeRequire(moduleName);

                if (canShowInfo) console.log('reqModule: ' + moduleName + ' keys: ' + Object.keys(reqModule).length);

                Cromwell.modules[moduleName] = reqModule;

                return false;
            }

            if (canShowInfo) console.log('Cromwell:importer: Successfully loaded module: ' + moduleName);

            Cromwell.importStatuses[moduleName] = 'ready';
            return true;
        }

        // Browser-side. Async, fetch
        const browserImport = async (): Promise<boolean> => {
            if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
            if (!Cromwell.imports) Cromwell.imports = {};

            const useImporter = async (namedExport: string): Promise<boolean> => {
                if (!Cromwell?.imports?.[moduleName]?.[namedExport]) {
                    console.error(`loading:!Cromwell.imports[moduleName][namedExport]: import {${namedExport}} from ${moduleName}`);
                    return false;
                }
                if (Cromwell.imports && Cromwell.imports[moduleName]) {
                    try {
                        await Cromwell.imports[moduleName][namedExport]();
                        return true;
                    } catch (error) {
                        console.error(`Cromwell:importer: An error occurred while loading the library: import { ${namedExport} } from '${moduleName}'`, error);
                        return false;
                    }
                }
                return false;
            }

            const importAllNamed = async (): Promise<boolean[]> => {
                if (isLibImport) {
                    return [true];
                }

                const promises: Promise<boolean>[] = [];
                namedExports.forEach(named => {
                    promises.push(useImporter(named));
                });
                const success = await Promise.all(promises);
                return success;
            }

            // Module has been requested for the first time. Load main importer script of the module.
            if (!Cromwell.importStatuses[moduleName]) {
                if (isDefaultImport) isLibImport = true;
                if (Cromwell.modules?.[moduleName]) {
                    // Module has been asyc imported in some other importer or was bundled intentionally that way with reference in global store.
                    return true;
                }

                const scriptId = `${moduleName}@${moduleVer}-main-module-importer`;
                if (document.getElementById(scriptId)) return true;

                let onLoad;
                const importPromise = new Promise<"failed" | "ready" | "default">(done => onLoad = done);
                Cromwell.importStatuses[moduleName] = importPromise;

                if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
                if (!Cromwell.imports) Cromwell.imports = {};

                // Load meta and externals if it has any

                try {
                    const metaInfoStr = await fetch(`/${metaFilepath}`).then(res => res.text());
                    if (metaInfoStr) {
                        const metaInfo: TSciprtMetaInfo = JSON.parse(metaInfoStr);
                        // { [moduleName]: namedExports }
                        if (metaInfo) {
                            if (metaInfo.import === 'lib') {
                                isLibImport = true;
                            }
                            await Cromwell?.importSciptExternals?.(metaInfo);

                            if (canShowInfo) console.log('Cromwell:importer: Successfully loaded all script externals for module: ' + moduleName, metaInfo);
                        }
                    } else {
                        throw new Error('Failed to fetch file:  /' + metaFilepath)
                    }
                } catch (e) {
                    console.error('Cromwell:importer: Failed to load meta info about importer of the module: ' + moduleName, e);
                }



                if (Cromwell.modules?.[moduleName]) {
                    // Module has been asyc imported in some other importer or was bundled intentionally that way with reference in global store.
                    return true;
                }

                const filePath = isLibImport ? importerEntireLibFilepath : importerFilepath;
                try {
                    const success = await new Promise(done => {
                        const domScript = document.createElement('script');
                        domScript.id = scriptId;
                        domScript.src = filePath;
                        domScript.onload = () => done(true);
                        domScript.onerror = (e) => {
                            console.error('Cromwell:importer: Failed to load importer for module: ' + moduleName, e);
                            done(false);
                        }
                        document.head.appendChild(domScript);
                    });
                    if (!success) throw new Error('');

                    if (canShowInfo) console.log(`Cromwell:importer: Importer for module "${moduleName}" executed`);

                    if (isLibImport && Cromwell?.modules?.[moduleName]) {
                        Cromwell.imports[moduleName] = { 'default': () => { } } as any;
                    }
                    if (canShowInfo) console.log(`Cromwell:importer: isLibImport:`, isLibImport, 'Cromwell?.modules?.[moduleName]',
                        Cromwell?.modules?.[moduleName], ' Cromwell.imports[moduleName] ', Cromwell.imports[moduleName]);

                } catch (e) {
                    console.error('Cromwell:importer: Failed to execute importer for module: ' + moduleName, e);
                    Cromwell.importStatuses[moduleName] = 'failed';
                    onLoad('failed');
                    return false;
                }


                if (!Cromwell.imports[moduleName]) {
                    console.error('Cromwell:importer: Failed to load importer for module: ' + moduleName);
                    Cromwell.importStatuses[moduleName] = 'failed';
                    onLoad('failed');
                    return false;
                }

                if (canShowInfo) console.log('Cromwell:importer: Successfully loaded importer for module: ' + moduleName);

                const success = await importAllNamed();

                if (success.includes(false)) {
                    console.error('Cromwell:importer: Failed to import one of named exports');
                    Cromwell.importStatuses[moduleName] = 'failed';
                    onLoad('failed');
                    return false;
                } else {
                    if (canShowInfo) console.log('Cromwell:importer: All initially requested named exports for module "' + moduleName + '" have been successfully loaded', namedExports);
                }

                if (isLibImport) {
                    Cromwell.importStatuses[moduleName] = 'default';
                    onLoad('default');
                } else {
                    Cromwell.importStatuses[moduleName] = 'ready';
                    onLoad('ready');
                }

                return true;
            }

            // check if this module is being imported by another async request
            // await for another and then start
            const importWithCheck = async () => {
                if (!Cromwell.importStatuses) Cromwell.importStatuses = {};

                if (typeof Cromwell?.importStatuses?.[moduleName] === 'object') {
                    if (canShowInfo) console.log('awaitig... ' + moduleName);
                    const status = await Cromwell.importStatuses[moduleName];
                    if (status === 'default') return true;

                    await importWithCheck();
                }

                if (Cromwell?.importStatuses?.[moduleName] === 'default') {
                    return true;
                }

                if (typeof Cromwell.importStatuses[moduleName] === 'string') {
                    if (!Cromwell?.imports?.[moduleName]) throw new Error('ready:!Cromwell.imports[moduleName]' + moduleName);

                    const lastStatus = Cromwell.importStatuses[moduleName];

                    let onLoad;
                    const importPromise = new Promise<"failed" | "ready" | "default">(done => onLoad = done);
                    Cromwell.importStatuses[moduleName] = importPromise;

                    const success = await importAllNamed();

                    Cromwell.importStatuses[moduleName] = lastStatus;

                    if (success.includes(false)) onLoad(lastStatus);
                    else onLoad(lastStatus);
                    return true;
                }

                return false;
            }

            return importWithCheck();
        }


        if (isServer()) {
            return serverimport()
        } else {
            return browserImport().then(success => {
                if (canShowInfo) console.log('Cromwell:importer: Processed module: ' + moduleName, success);
                return success;
            });
        }

    }

    if (!Cromwell.importSciptExternals) Cromwell.importSciptExternals = async (metaInfo: TSciprtMetaInfo | undefined): Promise<boolean> => {
        Cromwell.hasBeenExecuted = true;
        const externals = metaInfo?.externalDependencies;
        if (!metaInfo || !externals) return false;

        if (!Cromwell.scriptStatuses) Cromwell.scriptStatuses = {};

        if (metaInfo.name && typeof Cromwell.scriptStatuses[metaInfo.name] === 'object') {
            await Cromwell.scriptStatuses[metaInfo.name];
            return true;
        }

        if (metaInfo.name && typeof Cromwell.scriptStatuses[metaInfo.name] === 'string') return true;
        if (metaInfo.name && Cromwell.modules?.[metaInfo.name]) {
            Cromwell.scriptStatuses[metaInfo.name] = 'failed';
            return true;
        }

        if (typeof externals === 'object' && Object.keys(externals).length > 0) {
            if (canShowInfo) console.log('Cromwell:importer: module ' + metaInfo.name + ' has externals: ' + JSON.stringify(externals, null, 4));
            if (canShowInfo) console.log('Cromwell:importer: loading externals first for module ' + metaInfo.name + ' ...');
            const promises: Promise<boolean>[] = []
            let success: boolean[] | undefined;

            Object.keys(externals).forEach(ext => {
                const result = Cromwell?.importModule?.(ext, externals[ext]);
                if (result !== undefined) {
                    if (typeof result === 'object') {
                        result.catch(e => {
                            console.error('Cromwell:importer: Failed to load external ' + ext + ' for module: ' + metaInfo.name, e);
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
                console.error('Cromwell:importer: Failed to load externals for module: ' + metaInfo.name, e);
            }
            let successNum = 0;
            if (success) {
                success.forEach(s => s && successNum++);
            }
            if (canShowInfo) console.log(`Cromwell:importer: ${successNum}/${Object.keys(externals).length} externals for module ${metaInfo.name} have been loaded`);

            if (metaInfo.name) Cromwell.scriptStatuses[metaInfo.name] = 'ready';
            if (success && !success.includes(false)) return true;
            return true;
        }

        if (metaInfo.name) Cromwell.scriptStatuses[metaInfo.name] = 'failed';
        return false
    }

    return Cromwell;
}
