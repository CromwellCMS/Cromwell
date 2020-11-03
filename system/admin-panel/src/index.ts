import { getModuleImporter } from '@cromwell/cromwella/build/importer.js';

const importer = getModuleImporter();

(async () => {
    const meta = await (await fetch('/build/meta.json')).json();
    await importer.importSciptExternals(meta);

    await import('./app');
})();



