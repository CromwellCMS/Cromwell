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
export const cromwellStoreImportsPath = 'CromwellStore.nodeModules.imports';
export const getGlobalModuleStr = (moduleName: string) => `${cromwellStoreModulesPath}['${moduleName}']`;

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
    "@material-ui/core",
    {
        "name": "@material-ui/lab",
        "version": "4.0.0-alpha.56",
        "externals": [
            {
                "usedName": "@material-ui/core/styles",
                "moduleName": "@material-ui/core"
            },
            {
                "usedName": "@material-ui/core/ButtonBase",
                "moduleName": "@material-ui/core",
                "importName": "ButtonBase"
            },
            {
                "usedName": "@material-ui/core/utils",
                "moduleName": "@material-ui/core"
            },
            {
                "usedName": "@material-ui/core/Tabs",
                "moduleName": "@material-ui/core",
                "importName": "Tabs"
            },
            {
                "usedName": "@material-ui/core/Fab",
                "moduleName": "@material-ui/core",
                "importName": "Fab"
            },
            {
                "usedName": "@material-ui/core/Tooltip",
                "moduleName": "@material-ui/core",
                "importName": "Tooltip"
            },
            {
                "usedName": "@material-ui/core/Avatar",
                "moduleName": "@material-ui/core",
                "importName": "Avatar"
            },
            {
                "usedName": "@material-ui/core/Popper",
                "moduleName": "@material-ui/core",
                "importName": "Popper"
            },
            {
                "usedName": "@material-ui/core/ListSubheader",
                "moduleName": "@material-ui/core",
                "importName": "ListSubheader"
            },
            {
                "usedName": "@material-ui/core/Paper",
                "moduleName": "@material-ui/core",
                "importName": "Paper"
            },
            {
                "usedName": "@material-ui/core/IconButton",
                "moduleName": "@material-ui/core",
                "importName": "IconButton"
            },
            {
                "usedName": "@material-ui/core/Chip",
                "moduleName": "@material-ui/core",
                "importName": "Chip"
            },
            {
                "usedName": "@material-ui/core/Zoom",
                "moduleName": "@material-ui/core",
                "importName": "Zoom"
            },
            {
                "usedName": "@material-ui/core/Typography",
                "moduleName": "@material-ui/core",
                "importName": "Typography"
            },
            {
                "usedName": "@material-ui/core/Collapse",
                "moduleName": "@material-ui/core",
                "importName": "Collapse"
            }
        ]
    },
    {
        "name": "@material-ui/icons",
        "version": "4.9.1",
        "externals": [
            {
                "usedName": "@material-ui/core/SvgIcon",
                "moduleName": "@material-ui/core",
                "importName": "SvgIcon"
            }
        ]
    },
    "clsx",
    "debounce",
    "gridlex",
    "mobx",
    "mobx-react",
    "query-string",
    "react",
    "react-dom",
    "react-html-parser",
    "react-is",
    "react-number-format",
    "react-router-dom",
    "react-swipeable-views",
    "react-toastify",
    "reset-css",
    "style-inject",
    "swiper",
    "tslib",
    "whatwg-fetch"
];