import { CMSconfigType } from '@cromwell/core';
// import readRecursive from 'recursive-readdir';

const generate = async () => {

    const readRecursive = require('recursive-readdir');
    const { BasePageNames } = require('@cromwell/core')
    const fs = require('fs-extra');
    const resolve = require('path').resolve;
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
    const customPagesLocalDir = resolve(__dirname, './pages').replace(/\\/g, '/');

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
    const getPageComponentName = (pagePath: string): string => {
        return pagePath.replace(/\W/g, '')
    }
    const customPages: Record<string, string> = {};
    const customPageCompNames: Record<string, string> = {};
    let customPageImports = '';
    let customPageImportsSwitch = '';
    let customPageDynamicImports = '';
    let customPageDynamicImportsSwitch = '';
    const pagesPath = `${themeImportsDir}/pages`;
    if (fs.existsSync(pagesPath)) {
        const files: string[] = await readRecursive(pagesPath);
        console.log('pagesPath, files', files);

        files.forEach(p => {
            const pagePath = p.replace(/\\/g, '/');
            const pageName = pagePath.replace(/\.js$/, '').replace(`${pagesPath}/`, '');
            customPages[pageName] = pagePath;
        });

        console.log('customPages', customPages);
        Object.entries(customPages).forEach(e => {
            customPageCompNames[e[0]] = e[0].replace(/\W/g, '_') + '_' + require("crypto").randomBytes(6).toString('hex');
        });
        console.log('customPageCompNames', customPageCompNames);

        Object.entries(customPages).forEach(e => {
            const pageName = e[0];
            const pagePath = e[1];
            const pageComponentName = customPageCompNames[pageName];
            console.log('pageName', pageName, 'pageComponentName', pageComponentName);

            customPageImports += `\nimport * as ${pageComponentName}_Page from '${pagePath}'`;
            customPageImportsSwitch += `if (pageName === '${pageName}') return ${pageComponentName}_Page;\n`;

            customPageDynamicImports += `\nconst ${pageComponentName}_DynamicPage = dynamic(() => import('${pagePath}'));`;
            customPageDynamicImportsSwitch += `if (pageName === '${pageName}') return ${pageComponentName}_DynamicPage;\n   `;
        })
    }


    // const customPagesPath = `${themeImportsDir}/pages`;

    // if (fs.existsSync(customPagesPath)) {
    //     const files: string[] = fs.readdirSync(customPagesPath);
    //     console.log('files of custom pages:', files)
    //     files.forEach(fileName => {
    //         customPages[fileName.replace(/\.js$/, '')] = `${customPagesPath}/${fileName}`;
    //     });
    //     Object.entries(customPages).forEach(e => {
    //         customPageImports += `\nconst ${e[0]}_Page = import('${e[1]}')`;
    //         customPageImportsSwitch += `if (pageName === '${e[0]}') return ${e[0]}_Page;\n`;

    //         customPageDynamicImports += `\nconst ${e[0]}_DynamicPage = dynamic(() => import('${e[1]}'));`;
    //         customPageDynamicImportsSwitch += `if (pageName === '${e[0]}') return ${e[0]}_DynamicPage;\n   `;
    //     })
    // }

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
     * Pages
     */
    ${customPageImports}
    ${customPageDynamicImports}
    
    /**
     * Page imports
     */
    export const importPage = (pageName) => {
        ${customPageImportsSwitch}
        return undefined;
    }
    
    export const importDynamicPage = (pageName) => {
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



    // Import theme's pages into nexjs pages dir

    console.log('customPagesLocalPath', customPagesLocalDir)
    if (fs.existsSync(customPagesLocalDir)) {
        fs.removeSync(customPagesLocalDir);
    }
    Object.keys(customPages).forEach(pageName => {
        const pageComponentName = customPageCompNames[pageName];
        const pageContent = `
import { CromwellPageType } from '@cromwell/core';
//@ts-ignore
import { createGetStaticProps } from 'common/createGetStaticProps';
//@ts-ignore
import { createGetStaticPaths } from 'common/createGetStaticPaths';
//@ts-ignore
import { getPage } from 'common/getPage';

const PageComp: CromwellPageType = getPage('${pageName}');

export const getStaticProps = createGetStaticProps('${pageName}');

export const getStaticPaths = createGetStaticPaths('${pageName}');

export default PageComp;
        `;
        fs.outputFileSync(`${customPagesLocalDir}/${pageName}.ts`, pageContent);
    })
};

generate();