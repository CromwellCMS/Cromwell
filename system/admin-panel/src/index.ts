import { getModuleImporter } from '@cromwell/core-frontend';

getModuleImporter();

if (module?.['hot']) {
    module['hot'].accept();
}

(async () => {
    await import('./app');
})();
