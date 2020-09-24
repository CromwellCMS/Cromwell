import { TCromwellNodeModules, TCromwellStore } from '@cromwell/core';

/**
 * Node modules loading app for a Browser
 */
const isServer = (): boolean => (typeof window === 'undefined');
const getStore = () => {
    if (isServer()) {
        if (!global.CromwellStore) global.CromwellStore = {};
        return global.CromwellStore;
    }
    else {
        if (!window.CromwellStore) window.CromwellStore = {};
        return window.CromwellStore;
    }
}
const CromwellStore: TCromwellStore = getStore();
if (!CromwellStore.nodeModules) CromwellStore.nodeModules = {};
const Cromwell: TCromwellNodeModules = CromwellStore.nodeModules

if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
if (!Cromwell.imports) Cromwell.imports = {};
if (!Cromwell.modules) Cromwell.modules = {};
if (!Cromwell.moduleExternals) Cromwell.moduleExternals = {};

const canShowInfo = false;

Cromwell.importModule = async (moduleName, namedExport = 'default'): Promise<boolean> => {
    if (canShowInfo) console.log('Cromwella:bundler: importModule ' + moduleName + ' named: ' + namedExport);

    if (!Cromwell.importStatuses) Cromwell.importStatuses = {};
    if (!Cromwell.imports) Cromwell.imports = {};
    if (!Cromwell.modules) Cromwell.modules = {};
    if (!Cromwell.moduleExternals) Cromwell.moduleExternals = {};

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


            // Load meta and externals if any
            const metaInfoPromise = fetch(`bundle/${moduleName}/meta.json`);
            try {
                const metaInfo = await (await metaInfoPromise).json();
                let externals = metaInfo.externalDependencies;

                if (Cromwell && Cromwell.importModule &&
                    externals && Array.isArray(externals) && externals.length > 0) {
                    if (canShowInfo) console.log('Cromwella:bundler: module ' + moduleName + ' has externals: ' + externals);
                    if (canShowInfo) console.log('Cromwella:bundler: loading externals first for module ' + moduleName + ' ...');

                    const promises: Promise<boolean>[] = [];
                    for (const ext of externals) {

                        const promise = Cromwell.importModule(ext);
                        promise.catch(e => {
                            console.error('Cromwella:bundler: Failed to load external ' + ext + ' for module: ' + moduleName, e);
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
            } catch (e) {
                console.error('Cromwella:bundler: Failed to load meta info about importer of module: ' + moduleName, e);
            }

            try {
                const jsText = await importerPromise;
                eval(jsText);
                if (canShowInfo) console.log(moduleName + 'moduleName executed');
            } catch (e) {
                console.error('Cromwella:bundler: Failed to load importer for module: ' + moduleName, e);
                Cromwell.importStatuses[moduleName] = 'failed';
                onLoad('failed');
                return false;
            }

            if (canShowInfo) console.log('Cromwella:bundler: successfully loaded importer for module: ' + moduleName);


            // console.log('namedExport', namedExport)
            if (!Cromwell.imports[moduleName]) {
                onLoad('failed');
                console.error('loading:!Cromwell.imports[moduleName]' + moduleName);
                Cromwell.importStatuses[moduleName] = 'failed';
                return false;
            }
            if (!Cromwell.imports[moduleName][namedExport]) {
                onLoad('failed');
                console.error('loading:!Cromwell.imports[moduleName][namedExport]' + moduleName + namedExport);
                Cromwell.importStatuses[moduleName] = 'failed';
                return false;
            }

            try {
                await Cromwell.imports[moduleName][namedExport]();
            } catch (error) {
                console.error(`Cromwella:bundler: An error occurred while loading the library: import { ${namedExport} } from '${moduleName}'`, error);
                onLoad('failed');
                Cromwell.importStatuses[moduleName] = 'failed';
                return false;
            };

            if (canShowInfo) console.log('Cromwella:bundler: module ' + moduleName + ' is ready!');
            Cromwell.importStatuses[moduleName] = 'ready';
            onLoad('ready');
        })


    }

    if (typeof Cromwell.importStatuses[moduleName] === 'object') {
        if (canShowInfo) console.log('awaitig... ' + moduleName);
        const status = await Cromwell.importStatuses[moduleName];
    }

    if (Cromwell.importStatuses[moduleName] === 'ready') {
        if (!Cromwell.imports[moduleName]) throw new Error('ready:!Cromwell.imports[moduleName]' + moduleName);
        if (!Cromwell.imports[moduleName][namedExport]) throw new Error('ready:!Cromwell.imports[moduleName][namedExport]' + moduleName + namedExport);
        // console.log('namedExport', namedExport)
        await Cromwell.imports[moduleName][namedExport]();

        return true;

    }

    return false;
}