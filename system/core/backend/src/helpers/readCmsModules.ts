import { TPackageJson } from '@cromwell/core';
import { resolve, dirname } from 'path';
import { serverLogFor } from './constants';
import { getNodeModuleDir, getNodeModuleDirSync, cmsName } from './paths';
import { getLogger } from '../helpers/constants';

const defaultThemes = ["@cromwell/theme-store"];
const logger = getLogger('errors-warnings');

const reqModule = (name: string) => {
    try {
        return require(name);
    } catch (e) { logger.warn('readCmsModules: Failed to require ' + name) }
}

export const readCmsModules = async () => {
    const themes: string[] = [];
    const plugins: string[] = [];
    let mainPackage: TPackageJson | undefined = reqModule(resolve(process.cwd(), 'package.json'));

    if (!mainPackage) mainPackage = {};
    if (!mainPackage.cromwell) mainPackage.cromwell = {};
    if (!mainPackage.cromwell.themes) mainPackage.cromwell.themes = [];
    mainPackage.cromwell.themes = [...defaultThemes, ...mainPackage.cromwell.themes];

    const getPackageModules = async (packageName?: string, pckgObj?: TPackageJson) => {
        const packagePath = packageName && await getNodeModuleDir(packageName);
        if (packagePath || pckgObj) {
            const pckg: TPackageJson | undefined = packagePath ? reqModule(resolve(packagePath, 'package.json')) : pckgObj;
            const packageThemes = pckg?.cromwell?.themes ?? [];
            const packagePlugins = pckg?.cromwell?.plugins ?? [];

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
    let mainPackage: TPackageJson | undefined = reqModule(resolve(process.cwd(), 'package.json'));
    if (!mainPackage) mainPackage = {};
    if (!mainPackage.cromwell) mainPackage.cromwell = {};
    if (!mainPackage.cromwell.themes) mainPackage.cromwell.themes = [];
    mainPackage.cromwell.themes = [...defaultThemes, ...mainPackage.cromwell.themes];

    const getPackageModules = (packageName?: string, pckgObj?: any) => {
        const packagePath = packageName && getNodeModuleDirSync(packageName);
        if (packagePath || pckgObj) {
            const pckg = packagePath ? reqModule(resolve(packagePath, 'package.json')) : pckgObj;
            const packageThemes = pckg?.cromwell?.themes ?? [];
            const packagePlugins = pckg?.cromwell?.plugins ?? [];

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