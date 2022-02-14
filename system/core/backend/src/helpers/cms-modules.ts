import { TPackageJson } from '@cromwell/core';
import { isAbsolute, resolve } from 'path';

import { cmsPackageName } from './constants';
import { readPackage, resolvePackageJsonPath } from './paths';

export const readCmsModules = async (dir?: string) => {
    const themes: string[] = [];
    const plugins: string[] = [];

    const processed: string[] = [];

    const readPackageCmsModules = async (packageName: string, root?: boolean) => {
        if (processed.includes(packageName)) return;
        processed.push(packageName);

        let packagePath;
        try {
            packagePath = isAbsolute(packageName) ? packageName : resolvePackageJsonPath(packageName);
        } catch (error) { }

        if (packagePath) {
            let pckg: TPackageJson | undefined;
            try {
                pckg = await readPackage(packagePath);
            } catch (error) { }

            if (!pckg) return;
            if (!pckg.cromwell && !root) return;

            const packageThemes = pckg?.cromwell?.themes ?? [];
            const packagePlugins = pckg?.cromwell?.plugins ?? [];

            if (pckg.name && pckg.cromwell?.type === 'theme') packageThemes.push(pckg.name);
            if (pckg.name && pckg.cromwell?.type === 'plugin') packagePlugins.push(pckg.name);

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
    await readPackageCmsModules(resolve(dir ?? process.cwd(), 'package.json'), true);
    return {
        themes,
        plugins
    }
}