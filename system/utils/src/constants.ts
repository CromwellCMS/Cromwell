import { TFrontendDependency } from '@cromwell/core';


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
export const cromwellStoreStatusesPath = 'CromwellStore.nodeModules.importStatuses';
export const cromwellStoreImportsPath = 'CromwellStore.nodeModules.imports';
export const getGlobalModuleStr = (moduleName: string) => `${cromwellStoreModulesPath}['${moduleName}']`;
export const getGlobalModuleStatusStr = (moduleName: string) => `${cromwellStoreStatusesPath}['${moduleName}']`;

export const moduleChunksBuildDirChunk = 'chunks';

export const tempPckgName = '@cromwell/temp-bundler';

export const defaultFrontendDeps: (string | TFrontendDependency)[] = [
    "@apollo/client",
    "@cromwell/core",
    "@cromwell/core-frontend",
    {
        "name": "@cromwell/core-frontend",
        "externals": [
            {
                "usedName": "next/head"
            },
            {
                "usedName": "next/router"
            },
            {
                "usedName": "next/link"
            },
            {
                "usedName": "next/dynamic"
            },
            {
                "usedName": "next/document"
            }
        ]
    },
    "@loadable/component",
    "clsx",
    "debounce",
    "query-string",
    "quill",
    "react",
    "react-dom",
    "react-is",
    "react-number-format",
    "react-router-dom",
    "react-toastify",
    "swiper",
    "tslib",
    "whatwg-fetch",
    "pure-react-carousel",
    "react-image-lightbox",
];