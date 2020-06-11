import { CMSconfigType } from '@cromwell/core';
const fs = require('fs-extra');
const resolve = require('path').resolve;
// const config: CMSconfigType = require('../cmsconfig.json');
const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
let config: CMSconfigType | undefined = undefined;
try {
    config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
} catch (e) {
    console.log(e);
}
if (!config) throw new Error('renderer::server cannot read CMS config')


const templatesDir = resolve(__dirname, '../', '../', 'templates').replace(/\\/g, '/');
const templateDir = `${templatesDir}/${config.templateName}`;
const templateImportsDir = `${templateDir}/es`;
const templateConfigPath = templateDir + '/' + 'cromwell.config.json';
let templateConfig: Record<string, any> | undefined = undefined;
try {
    templateConfig = JSON.parse(fs.readFileSync(templateConfigPath, { encoding: 'utf8', flag: 'r' }));
} catch (e) {
    console.log(e);
}

let moduleImportPaths: Record<string, any> | undefined;
let moduleImports = '';
let moduleImportsSwitch = '';
if (templateConfig && templateConfig.modules) {
    const moduleNames = Object.keys(templateConfig.modules);
    moduleNames.forEach(name => {
        const mPath = `${templateImportsDir}/modules/${name}/index.js`;
        if (fs.existsSync(mPath)) {
            if (!moduleImportPaths) moduleImportPaths = {};
            moduleImportPaths[name] = mPath;
        }
    });
    if (moduleImportPaths) {
        Object.entries(moduleImportPaths).map(e => {
            moduleImports += `\nconst ${e[0]} = import('${e[1]}')`;
            moduleImportsSwitch += `if (moduleName === '${e[0]}') return ${e[0]};\n`
        })

    }

}

console.log('moduleImports', moduleImports);

const content = `
import dynamic from "next/dynamic";
export const IndexPage = import('${templateImportsDir}/pages/index');
export const DynamicIndexPage = dynamic(() => import('${templateImportsDir}/pages/index'));

export const ProductPage = import('${templateImportsDir}/pages/product');
export const DynamicProductPage = dynamic(() => import('${templateImportsDir}/pages/product'));

export const moduleImports = ${JSON.stringify(moduleImportPaths)};
export const templateConfig = ${JSON.stringify(templateConfig)};
export const CMSconfig = ${JSON.stringify(config)};

export const importTemplateConfig = () => {
    return templateConfig;
}
export const importCMSConfig = () => {
    return CMSconfig;
}

export const importPage = (pageName) => {
    if (pageName === 'index') return IndexPage;
    if (pageName === 'product') return ProductPage;
    return undefined;
}

export const importDynamicPage = (pageName) => {
    if (pageName === 'index') return DynamicIndexPage;
    if (pageName === 'product') return DynamicProductPage;
    return undefined;
}

${moduleImports}

export const importModule = (moduleName) => {
    ${moduleImportsSwitch}
    return undefined;
}
`

fs.outputFileSync('./.cromwell/gen.imports.js', content);
fs.outputFileSync('./.cromwell/gen.config.json', JSON.stringify(moduleImportPaths));