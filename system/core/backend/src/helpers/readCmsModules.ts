import { resolve, dirname } from 'path';
import { getNodeModuleDir, getNodeModuleDirSync, cmsName } from './paths';

export const readCmsModules = async () => {
    const themes: string[] = [];
    const plugins: string[] = [];
    const mainPackage = require(resolve(process.cwd(), 'package.json'));

    const getPackageModules = async (packageName?: string, pckgObj?: object) => {
        const packagePath = packageName && await getNodeModuleDir(packageName);
        if (packagePath || pckgObj) {
            const pckg = packagePath ? require(resolve(packagePath, 'package.json')) : pckgObj;
            const packageThemes = pckg?.[cmsName]?.themes ?? [];
            const packagePlugins = pckg?.[cmsName]?.plugins ?? [];

            for (const themeName of packageThemes) {
                if (!themes.includes(themeName)) {
                    themes.push(themeName);
                    await getPackageModules(themeName);
                }
            }
            for (const pluginName of packagePlugins) {
                if (!plugins.includes(pluginName)) {
                    plugins.push(pluginName);
                    await getPackageModules(pluginName);
                }
            }
        }
    }
    await getPackageModules(undefined, mainPackage);

    return {
        themes,
        plugins
    }
}


export const readCmsModulesSync = () => {
    const themes: string[] = [];
    const plugins: string[] = [];
    const mainPackage = require(resolve(process.cwd(), 'package.json'));

    const getPackageModules = (packageName?: string, pckgObj?: object) => {
        const packagePath = packageName && getNodeModuleDirSync(packageName);
        if (packagePath || pckgObj) {
            const pckg = packagePath ? require(resolve(packagePath, 'package.json')) : pckgObj;
            const packageThemes = pckg?.[cmsName]?.themes ?? [];
            const packagePlugins = pckg?.[cmsName]?.plugins ?? [];

            for (const themeName of packageThemes) {
                if (!themes.includes(themeName)) {
                    themes.push(themeName);
                    getPackageModules(themeName);
                }
            }
            for (const pluginName of packagePlugins) {
                if (!plugins.includes(pluginName)) {
                    plugins.push(pluginName);
                    getPackageModules(pluginName);
                }
            }
        }
    }
    getPackageModules(undefined, mainPackage);

    return {
        themes,
        plugins
    }
}