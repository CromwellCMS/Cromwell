

// Chunks
export const moduleMainBuidFileName = 'main.bundle.js';

// Entire library
export const moduleLibBuidFileName = 'lib.bundle.js';
export const moduleNodeBuidFileName = 'node.bundle.js';
export const moduleMetaInfoFileName = 'meta.json';
export const moduleBundleInfoFileName = 'bundle.info.json';
export const moduleArchiveFileName = 'module.zip';
export const bundledModulesDirName = 'bundled-modules';

export const moduleGeneratedFileName = 'generated.js';
export const moduleNodeGeneratedFileName = 'generated.node.js';
export const moduleExportsDirChunk = 'generated';

export const jsOperators = ['let', 'var', 'const', 'function', 'class', 'new', 'delete',
    'import', 'export', 'default', 'typeof', 'in', 'of', 'instanceof', 'void',
    'return', 'try', 'catch', 'throw', 'if', 'else', 'switch', 'case',
    'continue', 'do', 'while'];

export const cromwellStoreModulesPath = 'CromwellStore.nodeModules.modules';
export const cromwellStoreImportsPath = 'CromwellStore.nodeModules.imports';
export const getGlobalModuleStr = (moduleName: string) => `${cromwellStoreModulesPath}['${moduleName}']`;

export const moduleChunksBuildDirChunk = 'chunks';

export const tempPckgName = '@cromwell/temp-bundler';


export const defaultFrontendDeps: (string)[] = [
    "@apollo/client",
    "@cromwell/core",
    "@cromwell/core-frontend",
    "@material-ui/core",
    "@material-ui/icons",
    "@material-ui/lab",
    "clsx",
    "mobx",
    "mobx-react",
    "debounce",
    "gridlex",
    "whatwg-fetch",
    "query-string",
    "react",
    "react-dom",
    "react-number-format",
    "react-html-parser",
    "react-router-dom",
    "react-swipeable-views",
    "react-toastify",
    "reset-css",
    "style-inject",
    "swiper",
    "tslib",
]