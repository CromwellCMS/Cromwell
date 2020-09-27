import { TCromwellNodeModules } from './types';
import { promises } from 'fs';

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
const CromwellStore: any = getStore();
if (!CromwellStore.nodeModules) CromwellStore.nodeModules = {};
const Cromwell: TCromwellNodeModules = CromwellStore.nodeModules

if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
if (!Cromwell.imports) Cromwell.imports = {};
if (!Cromwell.modules) Cromwell.modules = {};
if (!Cromwell.moduleExternals) Cromwell.moduleExternals = {};

const canShowInfo = true;

Cromwell.importModule = async (moduleName, namedExports = ['default']): Promise<boolean> => {
    if (canShowInfo) console.log('Cromwella:bundler: importModule ' + moduleName + ' named: ' + namedExports);
    if (namedExports.includes('default')) namedExports = ['default'];

    if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
    if (!Cromwell.imports) Cromwell.imports = {};
    if (!Cromwell.modules) Cromwell.modules = {};
    if (!Cromwell.moduleExternals) Cromwell.moduleExternals = {};


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
                console.error('loading:!Cromwell.imports[moduleName][namedExport]' + moduleName + namedExport);
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

            let importerPromise;

            // if (isServer()) {
            importerPromise = fetch(`bundle/${moduleName}/main.bundle.js`)
                .then(res => res.text());
            // } else {
            // importerPromise = new Promise((resolve, reject) => {
            //     const script = document.createElement('script');
            //     document.body.appendChild(script);
            //     script.onload = resolve;
            //     script.onerror = reject;
            //     script.async = true;
            //     script.src = `bundle/${moduleName}/main.bundle.js`;
            // });
            // }


            // Load meta and externals if it has any
            const metaInfoPromise = fetch(`bundle/${moduleName}/meta.json`);
            try {
                const metaInfo = await (await metaInfoPromise).json();
                // { [moduleName]: namedExports }
                let externals: Record<string, string[]> = metaInfo.externalDependencies;

                if (Cromwell && Cromwell.importModule &&
                    externals && typeof externals === 'object') {
                    const externalModuleNames = Object.keys(externals);
                    if (externalModuleNames.length > 0) {
                        if (canShowInfo) console.log('Cromwella:bundler: module ' + moduleName + ' has externals: ' + JSON.stringify(externals, null, 4));
                        if (canShowInfo) console.log('Cromwella:bundler: loading externals first for module ' + moduleName + ' ...');

                        const promises: Promise<boolean>[] = [];
                        for (const extName of externalModuleNames) {

                            const promise = Cromwell.importModule(extName, externals[extName]);
                            promise.catch(e => {
                                console.error('Cromwella:bundler: Failed to load external ' + extName + ' for module: ' + moduleName, e);
                            })
                            promises.push(promise);
                            // try {
                            //     await promise;
                            // } catch (e) { }
                        };
                        try {
                            await Promise.all(promises);
                        } catch (e) {
                            console.error('Cromwella:bundler: Failed to load externals for module: ' + moduleName, e);
                        }
                        if (canShowInfo) console.log('Cromwella:bundler: all externals for module ' + moduleName + ' have been processed');
                    }
                }
            } catch (e) {
                console.error('Cromwella:bundler: Failed to load meta info about importer of module: ' + moduleName, e);
            }

            try {
                const jsText = await importerPromise;
                eval(jsText);
                if (canShowInfo) console.log(moduleName + 'moduleName executed');
            } catch (e) {
                console.error('Cromwella:bundler: Failed to execute importer for module: ' + moduleName, e);
                Cromwell.importStatuses[moduleName] = 'failed';
                onLoad('failed');
                return false;
            }



            // console.log('namedExport', namedExport)
            if (!Cromwell.imports[moduleName]) {
                onLoad('failed');
                console.error('Cromwella:bundler: Failed to load importer for module: ' + moduleName);
                Cromwell.importStatuses[moduleName] = 'failed';
                return false;
            };

            if (canShowInfo) console.log('Cromwella:bundler: successfully loaded importer for module: ' + moduleName);

            const success = await importAllNamed();

            if (success.includes(false)) {
                console.error('Cromwella:bundler: Failed to import one of named exports');
                Cromwell.importStatuses[moduleName] = 'failed';
                onLoad('failed');
                return false;
            }

            if (canShowInfo) console.log('Cromwella:bundler: module ' + moduleName + ' is ready!');
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