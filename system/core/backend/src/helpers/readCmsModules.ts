import { TPackageJson } from '@cromwell/core';
import { isAbsolute, resolve } from 'path';

import { cmsPackageName } from '../helpers/constants';
import { readPackage, resolvePackageJsonPath } from './paths';

export const readCmsModules = async () => {
    const themes: string[] = [];
    const plugins: string[] = [];

    const proccessed: string[] = [];

    const readPackageCmsModules = async (packageName: string) => {
        if (proccessed.includes(packageName)) return;
        proccessed.push(packageName);

        let packagePath;
        try {
            packagePath = isAbsolute(packageName) ? packageName : resolvePackageJsonPath(packageName);
        } catch (error) { }

        if (packagePath) {
            let pckg: TPackageJson | undefined;
            try {
                pckg = await readPackage(packagePath);
            } catch (error) { }
            if (!pckg?.cromwell) return;

            const packageThemes = pckg?.cromwell?.themes ?? [];
            const packagePlugins = pckg?.cromwell?.plugins ?? [];

            for (const themeName of packageThemes) {
                if (!themes.includes(themeName)) {
                    themes.push(themeName);
                }
            }
            for (const pluginName of packagePlugins) {
                if (!plugins.includes(pluginName)) {
                    plugins.push(pluginName);
                }
            }

            const childPackages = [
                ...Object.keys(pckg.dependencies ?? {}),
                ...Object.keys(pckg.peerDependencies ?? {}),
                ...Object.keys(pckg.devDependencies ?? {}),
                ...packagePlugins,
                ...packageThemes,
            ];
            const childPromises: Promise<any>[] = [];

            childPackages.forEach(moduleName => {
                childPromises.push(readPackageCmsModules(moduleName));
            });

            await Promise.all(childPromises);
        }
    }

    await readPackageCmsModules(cmsPackageName);
    await readPackageCmsModules(resolve(process.cwd(), 'package.json'));

    return {
        themes,
        plugins
    }
}