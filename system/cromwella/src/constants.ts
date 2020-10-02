

export const buildDirChunk = 'built_modules';

export const moduleMainBuidFileName = 'main.bundle.js';
export const moduleMetaInfoFileName = 'meta.json';

export const jsOperators = ['let', 'var', 'const', 'function', 'class', 'new', 'delete',
    'import', 'export', 'default', 'typeof', 'in', 'of', 'instanceof', 'void',
    'await', 'return', 'try', 'catch', 'throw', 'if', 'else', 'switch', 'case'];

export const cromwellStoreModulesPath = 'CromwellStore.nodeModules.modules';
export const cromwellStoreImportsPath = 'CromwellStore.nodeModules.imports';
export const getGlobalModuleStr = (moduleName: string) => `${cromwellStoreModulesPath}['${moduleName}']`;

export const moduleChunksBuildDirChunk = 'chunks';

