import { resolve, dirname } from 'path';
import { serverLogFor } from './constants';
import { getNodeModuleDir, getNodeModuleDirSync, cmsName } from './paths';

const defaultThemes = ["@cromwell/theme-store"];

const reqModule = (name: string) => {
    try {
        return require(name);
    } catch (e) { serverLogFor('errors-only', 'readCmsModules: Failed to require ' + name, 'Error') }
}

export const readCmsModules = async () => {
    const themes: string[] = [];
    const plugins: string[] = [];
    let mainPackage = reqModule(resolve(process.cwd(), 'package.json'));

    if (!mainPackage) mainPackage = {};
    if (!mainPackage[cmsName]) mainPackage[cmsName] = {};
    if (!mainPackage[cmsName].themes) mainPackage[cmsName].themes = [];
    mainPackage[cmsName].themes = [...defaultThemes, ...mainPackage[cmsName].themes];

    const getPackageModules = async (packageName?: string, pckgObj?: object) => {
        const packagePath = packageName && await getNodeModuleDir(packageName);
        if (packagePath || pckgObj) {
            const pckg = packagePath ? reqModule(resolve(packagePath, 'package.json')) : pckgObj;
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

    if (mainPackage) await getPackageModules(undefined, mainPackage);

    return {
        themes,
        plugins
    }
}


export const readCmsModulesSync = () => {
    const themes: string[] = [];
    const plugins: string[] = [];
    let mainPackage = reqModule(resolve(process.cwd(), 'package.json'));
    if (!mainPackage) mainPackage = {};
    if (!mainPackage[cmsName]) mainPackage[cmsName] = {};
    if (!mainPackage[cmsName].themes) mainPackage[cmsName].themes = [];
    mainPackage[cmsName].themes = [...defaultThemes, ...mainPackage[cmsName].themes];

    const getPackageModules = (packageName?: string, pckgObj?: object) => {
        const packagePath = packageName && getNodeModuleDirSync(packageName);
        if (packagePath || pckgObj) {
            const pckg = packagePath ? reqModule(resolve(packagePath, 'package.json')) : pckgObj;
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