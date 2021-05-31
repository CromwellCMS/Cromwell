import { TCromwellaConfig, TFrontendDependency, TPackageJson } from '@cromwell/core';
import { getNodeModuleDir, getTempDir, readCmsModules } from '@cromwell/core-backend';
import { each as asyncEach } from 'async';
import colorsdef from 'colors/safe';
import fs from 'fs-extra';
import glob from 'glob';
import importFrom from 'import-from';
import path, { isAbsolute, resolve } from 'path';

import { bundledModulesDirName, defaultFrontendDeps, systemPackages } from './constants';
import { TDependency, TGetDeps, THoistedDeps, TLocalSymlink, TModuleInfo, TNonHoisted, TPackage } from './types';

const colors: any = colorsdef;

export const isExternalForm = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id) && !id.startsWith('$$');

export const getBundledModulesDir = () => resolve(getTempDir(), bundledModulesDirName);

export const getNodeModuleVersion = (moduleName: string, importFromPath?: string): string | undefined => {
    const pckgImportName = `${moduleName}/package.json`;
    let modulePackageJson: TPackageJson | undefined;
    try {
        modulePackageJson = importFromPath ? importFrom(importFromPath, pckgImportName) as any :
            require(pckgImportName);
    } catch (e) {
        console.log(`Cromwell bundler: Failed to require package ${pckgImportName} ${importFromPath ? 'from ' + importFromPath : ''}. You may need to reconfigure your frontendDependencies`)
    }

    return modulePackageJson?.version;
}

export const getNodeModuleNameWithVersion = (moduleName: string, importFromPath?: string): string | undefined => {
    const ver = getNodeModuleVersion(moduleName);
    if (ver) return `${moduleName}@${ver}`;
}

export const getDepVersion = (pckg: TPackageJson | TPackage, depName: string): string | undefined => {
    let ver = pckg?.dependencies?.[depName] ?? pckg?.devDependencies?.[depName] ?? pckg?.peerDependencies?.[depName];
    if (ver) return ver;
    const frontDeps: (string | TFrontendDependency)[] | undefined = pckg?.cromwell?.frontendDependencies;

    if (frontDeps) {
        frontDeps.forEach(dep => {
            if (typeof dep === 'object' && dep.version) ver = dep.version;
        })
    }
    return ver;
}

export const getDepNameWithVersion = (pckg: TPackageJson, depName: string): string | undefined => {
    const ver = getDepVersion(pckg, depName);
    if (ver) return `${depName}@${ver}`;
}


// Stores export keys of modules that have been requested
const modulesExportKeys: Record<string, TModuleInfo> = {};
export const getModuleInfo = (moduleName: string, moduleVer?: string, from?: string): TModuleInfo => {
    let exportKeys: string[] | undefined;
    let exactVersion: string | undefined;
    if (!modulesExportKeys[moduleName]) {

        try {
            const imported: any = from ? importFrom(from, moduleName) : require(moduleName);
            const keys = Object.keys(imported);
            if (!keys.includes('default')) keys.unshift('default');
            if (keys) exportKeys = keys;
            if (!exportKeys) throw new Error('!exportKeys')
        } catch (e) {
            try {
                const imported: any = require(moduleName);
                const keys = Object.keys(imported);
                if (keys && !keys.includes('default')) keys.unshift('default');
                if (keys) exportKeys = keys;
            } catch (e) {
                console.log(colors.brightYellow(`Cromwell: Failed to require() module: ${moduleName}`));
            }
        }

        try {
            const modulePackageJson: TPackageJson | undefined = from ? importFrom(from, `${moduleName}/package.json`) as any :
                require(`${moduleName}/package.json`);
            exactVersion = modulePackageJson?.version;
            if (!exactVersion) throw new Error('!exactVersion')
        } catch (e) {
            console.log(colors.brightYellow(`Cromwell: Failed to require() package.json of module: ${moduleName}`));
        }

        const info: TModuleInfo = {
            exportKeys,
            exactVersion
        }
        modulesExportKeys[moduleName] = info;
        return info;
    } else {
        return modulesExportKeys[moduleName];
    }
}

/**
 * Collect dependencies and devDependencies from all packages into provided @param store
 * Will calc usage number if package is already in the store and write different versions
 * @param packageDeps dependencies or devDependencies from package.json
 * @param packagePath absolute path to package.json
 * @param store store where to push or edit dependencies info
 */
const collectDeps = (packageDeps: Record<string, string>,
    packagePath: string, store: TDependency[]): TDependency[] => {
    // console.log('packagePath', packagePath);
    // console.log('store', store);
    for (const [moduleName, moduleVer] of Object.entries(packageDeps)) {
        let index: number | null = null;
        store.forEach((dep, i) => {
            if (dep.name === moduleName) {
                index = i;
            }
        });
        if (index != null) {
            store[index].versions[moduleVer] = (store[index].versions[moduleVer] || 0) + 1;
            store[index].packages[packagePath] = moduleVer;
        } else {
            store.push({
                name: moduleName,
                versions: { [moduleVer]: 1 },
                packages: { [packagePath]: moduleVer }
            })
        }
    }
    return store;
}

/**
 * Hoists provided dependencies. Creates one object with hoisted deps and array of ojects for each package where modules 
 * cannot be hoisted (has different versions).
 * Also will find local packages that depends on other local packages
 * @param store collected dependencies from all package.json's by collectDeps function
 * @param packages info about all package.json files
 */
const hoistDeps = (store: TDependency[], packages: TPackage[],
    isProduction: boolean, forceInstall: boolean): THoistedDeps => {

    // Out main package.json with hoisted modules. Will be temporary placed in root of the project to install all modules
    // { [packageName]: version }
    const hoisted: Record<string, string> = {};

    // Other local packages with different versions of modules from hoisted ones. Packages includes only those types of modules
    const nonHoisted: TNonHoisted = {};

    const localSymlinks: TLocalSymlink[] = [];

    for (const module of store) {
        // Sort to set most frequently used version as first and then use it as hoisted one
        const versions = Object.entries(module.versions).sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);

        const hoistedVersion = versions[0];

        // Exclude modules that are local packages from being inclued in main package
        let localPckIndex: number | null = null;
        packages.forEach((pkg, i) => { if (pkg.name == module.name) localPckIndex = i });
        if (localPckIndex != null) {
            // Module is a local package. It will be symlinked into other local packages that depends on it
            Object.keys(module.packages).forEach(dependentPckg => {
                if (localPckIndex == null) return;
                // console.log('dependentPckg: ', path.dirname(dependentPckg), 'module.name', module.name);
                const includeInPath = resolve(path.dirname(dependentPckg), 'node_modules', module.name);
                const includeToPath = path.dirname(packages[localPckIndex].path || '');
                localSymlinks.push({
                    linkPath: includeInPath,
                    referredDir: includeToPath
                })
            })
        } else {
            hoisted[module.name] = hoistedVersion;
        }

        // Handle different versions.
        if (versions.length > 1 && localPckIndex == null) {
            for (let i = 1; i < versions.length; i++) {
                const ver = versions[i];
                Object.entries(module.packages).forEach(([packagePath, packageVer]) => {
                    if (packageVer === ver) {
                        const packageName = packages?.find(p => p.path === packagePath)?.name;

                        console.log(colors.brightYellow(`\nCromwell:: Local package ${packageName} at ${packagePath} dependent on different version of hoisted package ${module.name}. \nHoisted (commonly used) ${module.name} is "${hoistedVersion}", but dependent is "${ver}".\n`));
                        if (!forceInstall) {
                            console.log(colors.brightRed(`Cromwell:: Error. Abort operation. Please fix "${module.name}": "${ver}" or run command in force mode (add -f flag).\n`));
                            process.exit();
                        }
                        // if (isProduction || (!isProduction && forceInstall)) {
                        //     console.log(colors.brightYellow(`Cromwell:: Installing ${module.name}: "${ver}" locally...\n`));
                        // }

                        if (!nonHoisted[path.dirname(packagePath)]) {
                            nonHoisted[path.dirname(packagePath)] = {
                                name: packageName || '',
                                modules: { [module.name]: ver }
                            }
                        } else {
                            nonHoisted[path.dirname(packagePath)].modules[module.name] = ver;
                        }

                    }
                })
            }
        }
    }
    return {
        hoisted,
        nonHoisted,
        localSymlinks
    }
}

export const getCromwellaConfigSync = (projectRootDir: string, canLog?: boolean): TCromwellaConfig | undefined => {
    const cromwellaConfigPath = resolve(projectRootDir, 'cromwella.json');
    let cromwellaConfig: TCromwellaConfig | undefined = undefined;
    try {
        cromwellaConfig = JSON.parse(fs.readFileSync(cromwellaConfigPath).toString());
    } catch (e) {
        if (canLog) console.log(e);
    }

    if (!cromwellaConfig || !cromwellaConfig.packages) {
        if (canLog) console.log(colors.brightRed(`\nCromwella:: Error. Failed to read config in ${cromwellaConfigPath}\n`))
    }

    return cromwellaConfig;
}


export const globPackages = async (projectRootDir: string): Promise<string[]> => {
    // console.log(colors.cyan(`Cromwella:: Start. Scannig for local packages from ./cromwella.json...\n`));
    const globOptions = {};

    // From Cromwella config
    const cromwellaConfig = getCromwellaConfigSync(projectRootDir);
    const packageGlobs = cromwellaConfig?.packages ?? [''];
    const packagePaths: string[] = [];

    await new Promise(done => {
        asyncEach(packageGlobs, function (pkgPath: string, callback: () => void) {
            const globPath = resolve(projectRootDir, pkgPath, 'package.json');
            glob(globPath, globOptions, function (er: any, files: string[]) {
                files.forEach(f => packagePaths.push(resolve(projectRootDir, f)));
                callback();
            })
        }, () => done(true));
    });

    // From main package.json as cms modules
    const cmsModules = await readCmsModules();

    const addDir = async (mod) => {
        const dir = await getNodeModuleDir(mod);
        if (dir) {
            packagePaths.push(resolve(dir, 'package.json'))
        }
    }
    for (const p of cmsModules.plugins) {
        await addDir(p);
    }
    for (const p of cmsModules.themes) {
        await addDir(p);
    }
    for (const p of systemPackages) {
        await addDir(p);
    }

    return packagePaths;
}


export const collectPackagesInfo = (packagePaths: string[]): TPackage[] => {
    packagePaths = Array.from(new Set(packagePaths));
    if (packagePaths.length === 0) {
        console.log(colors.brightYellow(`\nCromwell:: No local packages found\n`))
        return [];
    }
    // console.log(colors.cyan(`Cromwell:: Bootstraping local packages:`));
    // packagePaths.forEach(path => {
    //     console.log(colors.blue(path));
    // });

    // Collect info about package.json files
    const packages: TPackage[] = [];

    for (const pkgPath of packagePaths) {
        try {
            const pkgJson: TPackageJson = JSON.parse(fs.readFileSync(pkgPath).toString());
            const pckg: TPackage = {
                name: pkgJson.name,
                path: pkgPath,
                dependencies: pkgJson.dependencies,
                devDependencies: pkgJson.devDependencies,
                peerDependencies: pkgJson.peerDependencies,
                cromwell: {
                    frontendDependencies: pkgJson?.cromwell?.frontendDependencies
                }
            };
            packages.push(pckg);
        } catch (e) {
            console.log(e);
        }
    }

    return packages;
}

export const hoistDependencies = (packages: TPackage[], isProduction, forceInstall): TGetDeps => {
    // Collect dependencies and devDependencies from all packages
    const dependencies: TDependency[] = [];
    const devDependencies: TDependency[] = [];

    for (const pkg of packages) {
        if (pkg.dependencies && pkg.path) {
            collectDeps(pkg.dependencies, pkg.path, dependencies);
        }
    }
    for (const pkg of packages) {
        if (pkg.devDependencies && pkg.path) {
            collectDeps(pkg.devDependencies, pkg.path, devDependencies);
        }
    }

    // Merge all dependencies into one object and create symlinks for local packages refs
    // There proccess can be exited if found same modules with diff versions in dev mode.
    const hoistedDependencies: THoistedDeps = JSON.parse(JSON.stringify(hoistDeps(dependencies, packages, isProduction, forceInstall)));
    const hoistedDevDependencies: THoistedDeps = JSON.parse(JSON.stringify(hoistDeps(devDependencies, packages, isProduction, forceInstall)));
    // All ok -> can start installation.

    return { packages, hoistedDependencies, hoistedDevDependencies };
}

export const parseFrontendDeps = async (dependencies: (string | TFrontendDependency)[]): Promise<TFrontendDependency[]> => {
    const packagePaths = await globPackages(process.cwd());
    const packages = collectPackagesInfo(packagePaths);
    let allDeps: Record<string, string> = {};
    packages.forEach(p => {
        allDeps = {
            ...allDeps,
            ...(p.dependencies ?? {}),
            ...(p.devDependencies ?? {}),
            ...(p.peerDependencies ?? {}),
        }
    })

    return dependencies.map(dep => {
        if (typeof dep === 'object') {
            if (!dep.version) dep.version = allDeps[dep.name];
            return dep;
        }
        return {
            name: dep,
            version: allDeps[dep],
        }
    });
}

export const collectFrontendDependencies = async (packages: TPackage[], forceInstall?: boolean): Promise<TFrontendDependency[]> => {
    const frontendDependencies = await parseFrontendDeps(defaultFrontendDeps);

    packages.forEach(pckg => {
        const pckheDeps = pckg?.cromwell?.frontendDependencies;
        if (pckheDeps && Array.isArray(pckheDeps)) {
            pckheDeps.forEach(dep => {
                const depName = typeof dep === 'object' ? dep.name : dep;

                const depVersion = getDepVersion(pckg, depName);
                if (!depVersion) return;

                const frontendDep: TFrontendDependency = typeof dep === 'object' ? dep : {
                    name: dep,
                    version: depVersion
                };
                if (!frontendDep.version) frontendDep.version = depVersion;

                // if (!frontendDependencies.includes(dep))
                let index: number | undefined = undefined;
                frontendDependencies.every((mainDep, i) => {
                    if (mainDep.name === frontendDep.name) {

                        if (mainDep.version !== frontendDep.version) {
                            console.log(colors.brightYellow(`\nCromwell:: Local package ${pckg.name} at ${pckg.path} dependent on different version of used frontend module ${frontendDep.name}. \nAlready used ${frontendDep.name} is "${mainDep.version}", but dependent is "${frontendDep.version}".\n`));
                            if (!forceInstall) {
                                console.log(colors.brightRed(`Cromwell:: Error. Abort operation. Please fix "${frontendDep.name}": "${frontendDep.version}" or run command in force mode (add -f flag).\n`));
                                process.exit();
                            }
                        } else {
                            index = i;
                        }
                        return false;
                    }
                    return true;
                });

                if (index !== undefined) {
                    if (typeof dep === 'object') {
                        frontendDependencies[index] = frontendDep;
                    }
                } else {
                    frontendDependencies.push(frontendDep);
                }
            })
        }
    });

    return frontendDependencies;
}


export const interopDefaultContent = `
const interopDefault = (lib, importName) => {
    if (lib && typeof lib === 'object' && 'default' in lib) {

        if (importName !== 'default') {
            return lib.default;
        }

        if (typeof lib.default === 'object' || typeof lib.default === 'function') {
            if (Object.keys(lib).length === 1) {
                return lib.default;
            } else if ('default' in lib.default && Object.keys(lib).length === Object.keys(lib.default).length) {
                return lib.default;
            } else if (Object.keys(lib).length === Object.keys(lib.default).length + 1) {
                return lib.default;
            }
        } 
    }
    return lib;
}
`;
