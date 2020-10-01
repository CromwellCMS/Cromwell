import { each as asyncEach } from 'async';
import colorsdef from 'colors/safe';
import fs from 'fs';
import glob from 'glob';
import path, { resolve, isAbsolute } from 'path';

import { TCromwellaConfig, TDependency, TGetDepsCb, THoistedDeps, TLocalSymlink, TNonHoisted, TPackage } from './types';

const colors: any = colorsdef;

export const isExternalForm = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);

export const getHoistedDependencies = (projectRootDir: string, isProduction: boolean, forceInstall: boolean, cb: TGetDepsCb) => {
    globPackages(projectRootDir, (packagePaths) => {
        collectPackagesInfo(packagePaths, (packages) => {
            hoistDependencies(packages, isProduction, forceInstall, cb);
        })
    });
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

        let hoistedVersion = versions[0];

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

                        console.log(colors.brightYellow(`\nCromwella:: Local package ${packageName} at ${packagePath} dependent on different version of hoisted package ${module.name}. \nHoisted (commonly used) ${module.name} is "${hoistedVersion}", but dependent is "${ver}".\n`));
                        if (!isProduction && !forceInstall) {
                            console.log(colors.brightRed(`Cromwella:: Error. Abort operation. Please fix "${module.name}": "${ver}" or run installation in force mode (add -f flag).\n`));
                            process.exit();
                        }
                        if (isProduction || (!isProduction && forceInstall)) {
                            console.log(colors.brightYellow(`Cromwella:: Installing ${module.name}: "${ver}" locally...\n`));
                        }

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


export const globPackages = (projectRootDir: string, cb: (packagePaths: string[]) => void) => {
    console.log(colors.cyan(`Cromwella:: Start. Scannig for local packages from ./cromwella.json...\n`));
    const globOptions = {};

    const cromwellaConfig = getCromwellaConfigSync(projectRootDir);
    if (!cromwellaConfig || !cromwellaConfig.packages) {
        cb([]);
        return;
    }

    const packagePaths: string[] = [];

    asyncEach(cromwellaConfig.packages, function (pkg: string, callback: () => void) {
        const globPath = resolve(projectRootDir, pkg, 'package.json');
        glob(globPath, globOptions, function (er: any, files: string[]) {
            files.forEach(f => packagePaths.push(resolve(projectRootDir, f)));
            callback();
        })
    }, () => cb(packagePaths));
}


export const collectPackagesInfo = (packagePaths: string[], cb: (packages: TPackage[]) => void) => {
    packagePaths = Array.from(new Set(packagePaths));
    if (packagePaths.length === 0) {
        console.log(colors.brightYellow(`\nCromwella:: No local packages found\n`))
        cb([])
        return;
    }
    console.log(colors.cyan(`Cromwella:: Bootstraping local packages:`));
    packagePaths.forEach(path => {
        console.log(colors.blue(path));
    });

    // Collect info about package.json files
    const packages: TPackage[] = [];

    for (const pkgPath of packagePaths) {
        try {
            const pkgJson = JSON.parse(fs.readFileSync(pkgPath).toString());
            const pckg: TPackage = {
                name: pkgJson.name,
                path: pkgPath,
                dependencies: pkgJson.dependencies,
                devDependencies: pkgJson.devDependencies,
                frontendDependencies: pkgJson.frontendDependencies
            };
            packages.push(pckg);
        } catch (e) {
            console.log(e);
        }
    }

    cb(packages);

}

export const hoistDependencies = (packages: TPackage[], isProduction, forceInstall, cb: TGetDepsCb) => {
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

    cb(packages, hoistedDependencies, hoistedDevDependencies);
}