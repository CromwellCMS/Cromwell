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


const themesDir = resolve(__dirname, '../', '../', 'themes').replace(/\\/g, '/');
const globalPluginsDir = resolve(__dirname, '../', '../', 'plugins').replace(/\\/g, '/');
const themeDir = `${themesDir}/${config.themeName}`;
const themeImportsDir = `${themeDir}/es`;
const themeConfigPath = themeDir + '/' + 'cromwell.config.json';
const customPagesLocalDir = resolve(__dirname, './pages/pages').replace(/\\/g, '/');

let themeConfig: Record<string, any> | undefined = undefined;
try {
    themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, { encoding: 'utf8', flag: 'r' }));
} catch (e) {
    console.error('Failed to parse themeConfig', e);
}


let pluginImportPaths: Record<string, any> | undefined = undefined;

// Read global plugins

if (themeConfig && themeConfig.plugins) {
    const pluginNames = Object.keys(themeConfig.plugins);
    pluginNames.forEach(name => {
        const mPath = `${globalPluginsDir}/${name}/es/frontend/index.js`;
        if (fs.existsSync(mPath)) {
            if (!pluginImportPaths) pluginImportPaths = {};
            pluginImportPaths[name] = mPath;
        }
    })
}

let pluginImports = '';
let dynamicPluginImports = '';
let pluginImportsSwitch = '';
let dynamicPluginImportsSwitch = '';

// Concat all imports
if (pluginImportPaths) {
    Object.entries(pluginImportPaths).map(e => {
        // pluginImports += `\nconst ${e[0]} = import('${e[1]}')`;
        pluginImports += `\nconst ${e[0]} = import('${e[1]}')`;
        pluginImportsSwitch += `if (pluginName === '${e[0]}') return ${e[0]};\n`;

        dynamicPluginImports += `\nconst Dynamic${e[0]} = dynamic(() => import('${e[1]}'));`;
        dynamicPluginImportsSwitch += `if (pluginName === '${e[0]}') return Dynamic${e[0]};\n   `;
    })
}

console.log('pluginImports', pluginImports);


// Import custom pages
const customPages: Record<string, string> = {};
const customPagesPath = `${themeImportsDir}/customPages`;
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
export const pluginImports = ${JSON.stringify(pluginImportPaths)};
export const themeConfig = ${JSON.stringify(themeConfig)};
export const CMSconfig = ${JSON.stringify(config)};

export const importThemeConfig = () => {
    return themeConfig;
}
export const importCMSConfig = () => {
    return CMSconfig;
}

/**
 * Basic pages 
 */
export const IndexPage = import('${themeImportsDir}/pages/${BasePageNames.Index}');
export const DynamicIndexPage = dynamic(() => import('${themeImportsDir}/pages/${BasePageNames.Index}'));

export const ProductPage = import('${themeImportsDir}/pages/${BasePageNames.Product}');
export const DynamicProductPage = dynamic(() => import('${themeImportsDir}/pages/${BasePageNames.Product}'));

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
 * Plugins
 */
${pluginImports}

export const importPlugin = (pluginName) => {
    ${pluginImportsSwitch}
    return undefined;
}
${dynamicPluginImports}

export const importDynamicPlugin = (pluginName) => {
    ${dynamicPluginImportsSwitch}
    return undefined;
}
`

fs.outputFileSync('./.cromwell/imports/imports.gen.js', content);
fs.outputFileSync('./.cromwell/imports/gen.config.json', JSON.stringify(pluginImportPaths));



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

    export const getStaticProps = createGetStaticProps('${pageName}', '/pages/${pageName}');

    /* eslint-disable @typescript-eslint/camelcase */
    export default ${pageName}_Page;
    `;
    fs.outputFileSync(`${customPagesLocalDir}/${pageName}.tsx`, pageContent);
})