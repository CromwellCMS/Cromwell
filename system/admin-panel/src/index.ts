import { getModuleImporter } from '@cromwell/utils/build/importer.js';


const importer = getModuleImporter();

; (async () => {
    const [React, ReactDOM] = await Promise.all([
        import('react'),
        import('react-dom'),
    ]);
    importer.modules['react'] = React;
    importer.importStatuses['react'] = 'default';
    importer.modules['react-dom'] = ReactDOM;
    importer.importStatuses['react-dom'] = 'default';

    try {
        const meta = await (await fetch('/admin/build/meta.json')).json();
        await importer.importSciptExternals(meta);
    } catch (e) {
        console.error(e);
    }

    await import('./app');
})();

