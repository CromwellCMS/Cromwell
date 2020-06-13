import { CMSconfigType } from '@cromwell/core';
const { BasePageNames } = require('@cromwell/core')
const fs = require('fs-extra');
const resolve = require('path').resolve;
// const config: CMSconfigType = require('../cmsconfig.json');
const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
let config: CMSconfigType | undefined = undefined;
try {
    config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
} catch (e) {
    console.log('renderer::server ', e);
}
if (!config) throw new Error('renderer::server cannot read CMS config');


const templatesDir = resolve(__dirname, '../', '../', 'templates').replace(/\\/g, '/');
const globalModulesDir = resolve(__dirname, '../', '../', 'modules').replace(/\\/g, '/');
const templateDir = `${templatesDir}/${config.templateName}`;
const templateImportsDir = `${templateDir}/es`;
const templateConfigPath = templateDir + '/' + 'cromwell.config.json';
const customPagesLocalDir = resolve(__dirname, './pages/pages').replace(/\\/g, '/');

let templateConfig: Record<string, any> | undefined = undefined;
try {
    templateConfig = JSON.parse(fs.readFileSync(templateConfigPath, { encoding: 'utf8', flag: 'r' }));
} catch (e) {
    console.log(e);
}


let moduleImportPaths: Record<string, any> | undefined = undefined;

// Read global modules

if (templateConfig && templateConfig.modules) {
    const moduleNames = Object.keys(templateConfig.modules);
    moduleNames.forEach(name => {
        const mPath = `${globalModulesDir}/${name}/es/frontend/index.js`;
        if (fs.existsSync(mPath)) {
            if (!moduleImportPaths) moduleImportPaths = {};
            moduleImportPaths[name] = mPath;
        }
    })
}

// Read modules of template

let moduleImports = '';
let dynamicModuleImports = '';
let moduleImportsSwitch = '';
let dynamicModuleImportsSwitch = '';

if (templateConfig && templateConfig.modules) {
    const moduleNames = Object.keys(templateConfig.modules);
    moduleNames.forEach(name => {
        const mPath = `${templateImportsDir}/modules/${name}/index.js`;
        if (fs.existsSync(mPath)) {
            if (!moduleImportPaths) moduleImportPaths = {};
            moduleImportPaths[name] = mPath;
        }
    });

}

// Concat all imports
if (moduleImportPaths) {
    Object.entries(moduleImportPaths).map(e => {
        // moduleImports += `\nconst ${e[0]} = import('${e[1]}')`;
        moduleImports += `\nconst ${e[0]} = import('${e[1]}')`;
        moduleImportsSwitch += `if (moduleName === '${e[0]}') return ${e[0]};\n`;

        dynamicModuleImports += `\nconst Dynamic${e[0]} = dynamic(() => import('${e[1]}'));`;
        dynamicModuleImportsSwitch += `if (moduleName === '${e[0]}') return Dynamic${e[0]};\n   `;
    })
}

console.log('moduleImports', moduleImports);

// Import custom pages
const customPages: Record<string, string> = {};
const customPagesPath = `${templateImportsDir}/customPages`;
let customPageImports = '';
let customPageImportsSwitch = '';
let customPageDynamicImports = '';
let customPageDynamicImportsSwitch = '';
if (fs.existsSync(customPagesPath)) {
    const files: string[] = fs.readdirSync(customPagesPath);
    console.log('files of custom pages:', files)
    files.forEach(fileName => {
        customPages[fileName.replace('.js', '')] = `${customPagesPath}/${fileName}`;
    });
    Object.entries(customPages).forEach(e => {
        customPageImports += `\nconst ${e[0]}_Page = import('${e[1]}')`;
        customPageImportsSwitch += `if (pageName === '${e[0]}') return ${e[0]}_Page;\n`;

        customPageDynamicImports += `\nconst ${e[0]}_DynamicPage = dynamic(() => import('${e[1]}'));`;
        customPageDynamicImportsSwitch += `if (pageName === '${e[0]}') return ${e[0]}_DynamicPage;\n   `;
    })
}

const content = `
import dynamic from "next/dynamic";
/**
 * Configs 
 */
export const moduleImports = ${JSON.stringify(moduleImportPaths)};
export const templateConfig = ${JSON.stringify(templateConfig)};
export const CMSconfig = ${JSON.stringify(config)};

export const importTemplateConfig = () => {
    return templateConfig;
}
export const importCMSConfig = () => {
    return CMSconfig;
}

/**
 * Basic pages 
 */
export const IndexPage = import('${templateImportsDir}/pages/${BasePageNames.Index}');
export const DynamicIndexPage = dynamic(() => import('${templateImportsDir}/pages/${BasePageNames.Index}'));

export const ProductPage = import('${templateImportsDir}/pages/${BasePageNames.Product}');
export const DynamicProductPage = dynamic(() => import('${templateImportsDir}/pages/${BasePageNames.Product}'));

/**
 * Custom pages
 */
${customPageImports}
${customPageDynamicImports}

/**
 * Combined page imports
 */
export const importPage = (pageName) => {
    if (pageName === '${BasePageNames.Index}') return IndexPage;
    if (pageName === '${BasePageNames.Product}') return ProductPage;
    
    ${customPageImportsSwitch}
    return undefined;
}

export const importDynamicPage = (pageName) => {
    if (pageName === '${BasePageNames.Index}') return DynamicIndexPage;
    if (pageName === '${BasePageNames.Product}') return DynamicProductPage;

    ${customPageDynamicImportsSwitch}
    return undefined;
}

/**
 * Modules
 */
${moduleImports}

export const importModule = (moduleName) => {
    ${moduleImportsSwitch}
    return undefined;
}
${dynamicModuleImports}

export const importDynamicModule = (moduleName) => {
    ${dynamicModuleImportsSwitch}
    return undefined;
}
`

fs.outputFileSync('./.cromwell/imports/gen.imports.js', content);
fs.outputFileSync('./.cromwell/imports/gen.config.json', JSON.stringify(moduleImportPaths));


// Create dir for custom pages
console.log('customPagesLocalPath', customPagesLocalDir)
if (fs.existsSync(customPagesLocalDir)) {
    fs.removeSync(customPagesLocalDir);
}
Object.keys(customPages).forEach(pageName => {
    const pageContent = `
    import { CromwellPageType } from '@cromwell/core';
    import { createGetStaticProps } from '../../common/createGetStaticProps';
    import { getPage } from '../../common/getPage';

    /* eslint-disable @typescript-eslint/camelcase */
    const ${pageName}_Page: CromwellPageType = getPage('${pageName}');

    export const getStaticProps = createGetStaticProps('${pageName}');

    /* eslint-disable @typescript-eslint/camelcase */
    export default ${pageName}_Page;
    `;
    fs.outputFileSync(`${customPagesLocalDir}/${pageName}.tsx`, pageContent);
})