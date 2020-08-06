import { TCmsConfig, setStoreItem, TPluginConfig } from '@cromwell/core';
import { readThemePages } from '@cromwell/core-backend';
import { getRestAPIClient } from '@cromwell/core-frontend';
import fs from 'fs-extra';
import { resolve } from 'path';

const main = async () => {
    const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
    let config: TCmsConfig | undefined = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('renderer::server cannot read CMS config');
    setStoreItem('cmsconfig', config);

    const projectRootDir = resolve(__dirname, '../../../').replace(/\\/g, '/');
    const globalPluginsDir = `${projectRootDir}/plugins`;
    const localDir = resolve(__dirname, '../').replace(/\\/g, '/');
    const pagesLocalDir = `${localDir}/pages`;

    let pluginImportPaths: Record<string, any> | undefined = undefined;

    // Read global plugins
    const pluginNames = await getRestAPIClient().getPluginNames();
    pluginNames.forEach(name => {
        const configPath = `${globalPluginsDir}/${name}/cromwell.config.json`;
        if (fs.existsSync(configPath)) {
            let config: TPluginConfig | undefined;
            try {
                config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
            } catch (e) {
                console.error('renderer::generator: ', e);
            }
            if (config && config.frontendDir) {
                const mPath = `${globalPluginsDir}/${name}/${config.frontendDir}/index.js`;
                if (fs.existsSync(mPath)) {
                    if (!pluginImportPaths) pluginImportPaths = {};
                    pluginImportPaths[name] = mPath;
                }
            }
        }

    })

    let pluginImports = '';
    let dynamicPluginImports = '';
    let pluginImportsSwitch = '';
    let dynamicPluginImportsSwitch = '';

    // Concat all imports
    if (pluginImportPaths) {
        Object.entries(pluginImportPaths).map(e => {
            // pluginImports += `\nconst ${e[0]} = import('${e[1]}')`;
            pluginImports += `\nconst ${e[0]} = import('${e[1]}');`;
            pluginImportsSwitch += `if (pluginName === '${e[0]}') return ${e[0]};\n`;

            dynamicPluginImports += `\nconst Dynamic${e[0]} = dynamic(() => import('${e[1]}'));`;
            dynamicPluginImportsSwitch += `if (pluginName === '${e[0]}') return Dynamic${e[0]};\n   `;
        })
    }

    console.log('pluginImports', pluginImports);


    const customPages = await readThemePages(projectRootDir);
    const pageNames: string[] = [];
    let customPageImports = '';
    let customPageImportsSwitch = '';
    let customPageDynamicImports = '';
    let customPageDynamicImportsSwitch = '';

    Object.entries(customPages).forEach(e => {
        const pageName = e[0];
        pageNames.push(pageName);
        const pagePath = e[1].pagePath;
        const pageComponentName = e[1].pageComponentName;
        if (pagePath && pageComponentName) {
            console.log('pageName', pageName, 'pageComponentName', pageComponentName);

            customPageImports += `\nimport * as ${pageComponentName}_Page from '${pagePath}';`;
            customPageImportsSwitch += `    if (pageName === '${pageName}') return ${pageComponentName}_Page;\n`;

            customPageDynamicImports += `\nconst ${pageComponentName}_DynamicPage = dynamic(() => import('${pagePath}'));`;
            customPageDynamicImportsSwitch += `    if (pageName === '${pageName}') return ${pageComponentName}_DynamicPage;\n   `;
        }
    })


    const content = `
            import dynamic from "next/dynamic";
            /**
             * Configs 
             */
            export const pluginImports = ${JSON.stringify(pluginImportPaths)};
            export const CMSconfig = ${JSON.stringify(config)};
            
            export const importThemeConfig = () => {
                return themeConfig;
            }
            export const importCMSConfig = () => {
                return CMSconfig;
            }
            
            /**
             * Page imports
             */
            export const pageNames = ${JSON.stringify(pageNames)};
            ${customPageImports}
            ${customPageDynamicImports}
            
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
    // fs.outputFileSync('./.cromwell/imports/gen.config.json', JSON.stringify(pluginImportPaths));



    // Import theme's pages into nexjs pages dir

    console.log('customPagesLocalPath', pagesLocalDir)
    if (fs.existsSync(pagesLocalDir)) {
        fs.removeSync(pagesLocalDir);
    }
    Object.keys(customPages).forEach(pageName => {
        const pageComponentName = customPages[pageName].pageComponentName;
        let pageContent = `
                import { createGetStaticProps } from 'common/createGetStaticProps';
                import { createGetStaticPaths } from 'common/createGetStaticPaths';
                import { getPage } from 'common/getPage';
                
                const PageComp = getPage('${pageName}');
                
                export const getStaticProps = createGetStaticProps('${pageName}');
                
                export const getStaticPaths = createGetStaticPaths('${pageName}');
                
                export default PageComp;
            `;

        if (!customPages[pageName].pagePath && customPages[pageName].fileContent) {
            pageContent = customPages[pageName].fileContent + '';
        }
        fs.outputFileSync(`${pagesLocalDir}/${pageName}.js`, pageContent);
    });

};

main();




