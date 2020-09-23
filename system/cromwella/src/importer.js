if (!window.Cromwell) Cromwell = {};
if (!window.Cromwell.importStatuses) window.Cromwell.importStatuses = {};
if (!window.Cromwell.imports) window.Cromwell.imports = {};
if (!window.Cromwell.modules) window.Cromwell.modules = {};
if (!window.Cromwell.moduleExternals) window.Cromwell.moduleExternals = {};

window.Cromwell.importModule = async (moduleName, namedExport) => {
    if (!namedExport) namedExport = 'default';

    if (!window.Cromwell.importStatuses[moduleName]) {
        window.Cromwell.importStatuses[moduleName] = 'loading';

        const importerPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = `bundle/${moduleName}/main.bundle.js`;
        });

        // Load meta and externals if any
        const metaInfoPromise = fetch(`bundle/${moduleName}/meta.json`);
        try {
            const metaInfo = await (await metaInfoPromise).json();
            let externals = metaInfo.externalDependencies;

            if (externals && Array.isArray(externals) && externals.length > 0) {
                console.log('Cromwella:bundler: module ' + moduleName + ' has externals: ' + externals);
                console.log('Cromwella:bundler: loading externals first for module ' + moduleName + ' ...');

                const promises = [];
                for (const ext of externals) {

                    const promise = window.Cromwell.importModule(ext);
                    promise.catch(e => {
                        console.error('Cromwella:bundler: Failed to load external ' + ext + ' for module: ' + moduleName, e);
                    })
                    // promises.push(promise);
                    try {
                        await promise;
                    } catch (e) { }
                };
                try {
                    await Promise.all(promises);
                } catch (e) {
                    console.error('Cromwella:bundler: Failed to load externals for module: ' + moduleName, e);
                }
                console.log('Cromwella:bundler: all externals for module ' + moduleName + ' have been processed');

            }
        } catch (e) {
            console.error('Cromwella:bundler: Failed to load meta info about importer of module: ' + moduleName, e);
        }


        try {
            await importerPromise;
        } catch (e) {
            console.error('Cromwella:bundler: Failed to load importer for module: ' + moduleName, e);
            window.Cromwell.importStatuses[moduleName] = 'failed';
            return;
        }

        console.log('Cromwella:bundler: successfully loaded importer for module: ' + moduleName);


        // console.log('namedExport', namedExport)
        if (!window.Cromwell.imports[moduleName]) throw new Error('loading:!window.Cromwell.imports[moduleName]' + moduleName);
        if (!window.Cromwell.imports[moduleName][namedExport]) throw new Error('loading:!window.Cromwell.imports[moduleName][namedExport]' + moduleName + namedExport);
        await window.Cromwell.imports[moduleName][namedExport]();

        console.log('Cromwella:bundler: module ' + moduleName + ' is ready!');
        window.Cromwell.importStatuses[moduleName] = 'ready';
    }

    if (window.Cromwell.importStatuses[moduleName] === 'loading') {

    }

    if (window.Cromwell.importStatuses[moduleName] === 'ready') {
        if (!window.Cromwell.imports[moduleName]) throw new Error('ready:!window.Cromwell.imports[moduleName]' + moduleName);
        if (!window.Cromwell.imports[moduleName][namedExport]) throw new Error('ready:!window.Cromwell.imports[moduleName][namedExport]' + moduleName + namedExport);
        // console.log('namedExport', namedExport)
        await window.Cromwell.imports[moduleName][namedExport]();
    }
}
