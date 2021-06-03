import { getModuleImporter } from '@cromwell/utils/build/importer.js';

getModuleImporter();

if (module?.['hot']) {
    module['hot'].accept();
}

(async () => {
    await import('./app');
})();
