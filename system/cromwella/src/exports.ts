/**
 * Main cjs exports to be used as "require('@cromwell/cromwella');"
 */

// export { rollupPluginCromwellFrontend } from './plugins/rollup';
export { getModuleImporter } from './importer';
export { rollupConfigWrapper, rollupPluginCromwellFrontend } from './plugins/rollup';
export { getDepVersion, getDepNameWithVersion } from './constants';
export { getNodeModuleVersion, getNodeModuleNameWithVersion } from './shared';