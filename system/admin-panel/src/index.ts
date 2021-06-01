import { getModuleImporter } from '@cromwell/utils/build/importer.js';

getModuleImporter();

(async () => {
    await import('./app');
})();
