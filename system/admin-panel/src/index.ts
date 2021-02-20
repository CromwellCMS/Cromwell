import { getModuleImporter } from '@cromwell/utils/build/importer.js';

const importer = getModuleImporter();

(async () => {
    const meta = await (await fetch('/build/meta.json')).json();
    await importer.importSciptExternals(meta);

    await import('./app');
})();

