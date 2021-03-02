import { getModuleImporter } from '@cromwell/utils/build/importer.js';


const importer = getModuleImporter();

; (async () => {
    const [React, ReactDOM] = await Promise.all([
        import('react'),
        import('react-dom'),
    ]);
    importer.modules['react'] = React;
    importer.modules['react'].didDefaultImport = true;
    importer.modules['react-dom'] = ReactDOM;
    importer.modules['react-dom'].didDefaultImport = true;

    try {
        const meta = await (await fetch('/build/meta.json')).json();
        await importer.importSciptExternals(meta);
    } catch (e) {
        console.error(e);
    }

    await import('./app');
})();

