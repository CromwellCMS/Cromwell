import path, { resolve } from 'path';
import fs from 'fs';
import { sync as mkdirp } from 'mkdirp';
import { sync as rimraf } from 'rimraf';
import glob from "glob";
import { each as asyncEach } from 'async';
import nodeCleanup from 'node-cleanup';
import colors from 'colors/safe';
import yargs from 'yargs-parser';
import { spawnSync, spawn } from "child_process";
import { sync as symlinkOrCopySync } from 'symlink-or-copy';
import { TPackage, TDependency, THoistedDeps, TNonHoisted, TLocalSymlink } from './types';

/**
 * Cromwella package manager.
 */

export const cromwella = () => {
    const args = yargs(process.argv.slice(2));

    const projectRootDir: string = (!args.path || typeof args.path !== 'string' || args.path == '') ?
        process.cwd() : args.path;

    if (!projectRootDir || typeof projectRootDir !== 'string' || projectRootDir == '') {
        console.log(colors.red(`\nCromwella:: Error. Please pass absolute project root directory as --path argument\n`));
        return;
    }

    const isProduction = Boolean(typeof args.production === 'boolean' && args.production)
    const installationMode = isProduction ? 'production' : 'development';
    const forceInstall = Boolean(args.f);


    const installPaths: string[] = [projectRootDir];

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
    const hoistDeps = (store: TDependency[], packages: TPackage[]): THoistedDeps => {

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

                            console.log(colors.yellow(`\nCromwella:: Local package ${packageName} at ${packagePath} dependent on different version of hoisted package ${module.name}. \nHoisted (commonly used) ${module.name} is "${hoistedVersion}", but dependent is "${ver}".\n`));
                            if (!isProduction && !forceInstall) {
                                console.log(colors.red(`Cromwella:: Error. Abort installation. Please fix "${module.name}": "${ver}" or run installation in force mode (add -f flag).\n`));
                                process.exit();
                            }
                            if (isProduction || (!isProduction && forceInstall)) {
                                console.log(colors.yellow(`Cromwella:: Installing ${module.name}: "${ver}" locally...\n`));
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

    /**
     * For local packages (1) that depends on other local packages (2) will create symlinks  
     * in node_modules of (1) to the directory of (2) with symlink name as (2's) name in package.json 
     * @param includeInPath symlink full path
     * @param includeToPath referred directory
     */
    const makeSymlink = (includeInPath: string, includeToPath: string) => {
        if (!fs.existsSync(includeInPath)) {
            // console.log(`Cromwella:: Make include in: ${includeInPath} to: ${includeToPath}`);
            const includeInDir = resolve(includeInPath, '../');
            if (!fs.existsSync(includeInDir)) {
                try {
                    mkdirp(includeInDir);
                } catch (e) {
                    console.log(e);
                }
            }
            try {
                symlinkOrCopySync(includeToPath, includeInPath);
            } catch (e) {
                console.log(e);
            }
        }
    }

    /**
     * Creates package.json with provided modules for installation
     * @param dir directory where to create. Directory should already contain package.json that will be replaced during 
     * installation process and then switched back
     * @param pckg modules for installation, no need to provide other info, it will be copied from original package.json 
     */
    const createInstallPackage = (dir: string, pckg: TPackage) => {
        const hoistedPackageJsonPath = resolve(dir, 'package.json');
        const hoistedPackageJsonBackupPath = resolve(dir, '_backup_package.json');

        removeInstallPackage(dir);

        if (!fs.existsSync(hoistedPackageJsonPath)) return;

        try {
            const bytes = fs.readFileSync(hoistedPackageJsonPath);
            fs.writeFileSync(hoistedPackageJsonBackupPath, bytes);
            const mainPackageContent = JSON.parse(bytes.toString());
            const hoistedPackageJson = {
                ...mainPackageContent,
                ...pckg
            }

            fs.writeFileSync(hoistedPackageJsonPath, JSON.stringify(hoistedPackageJson));
        } catch (e) {
            console.log(colors.red('Failed to create install package file for ' + dir));
            console.log(e)
            removeInstallPackage(dir);
        }
    }

    /**
     * Switches back original package.json and removes installation one.
     * @param dir directory where to look. Directory should already contain _backup_package.json
     */
    const removeInstallPackage = (dir: string) => {
        const hoistedPackageJsonPath = resolve(dir, 'package.json');
        const hoistedPackageJsonBackupPath = resolve(dir, '_backup_package.json');
        try {
            if (fs.existsSync(hoistedPackageJsonBackupPath)) {
                fs.writeFileSync(hoistedPackageJsonPath, fs.readFileSync(hoistedPackageJsonBackupPath));
                fs.unlinkSync(hoistedPackageJsonBackupPath);
            }
        } catch (e) {
            console.log(colors.red('Failed to remove install package file for ' + dir));
            console.log(e)
        }
    }

    /**
     * Step 1
     */
    const globPackages = () => {
        console.log(colors.cyan(`Cromwella:: Start. Scannig for local packages from ./cromwella.json...\n`));
        const globOptions = {};

        const cromwellaConfigPath = resolve(projectRootDir, 'cromwella.json');
        let cromwellaConfig: {
            packages: string[];
        } | undefined = undefined;
        try {
            cromwellaConfig = JSON.parse(fs.readFileSync(cromwellaConfigPath).toString());
        } catch (e) {
            console.log(e);
        }

        if (!cromwellaConfig || !cromwellaConfig.packages) {
            console.log(colors.red(`\nCromwella:: Error. Failed to read config in ${cromwellaConfigPath}\n`))
            return;
        }

        const packagePaths: string[] = [];

        asyncEach(cromwellaConfig.packages, function (pkg: string, callback: () => void) {
            const globPath = resolve(projectRootDir, pkg, 'package.json');
            glob(globPath, globOptions, function (er: any, files: string[]) {
                files.forEach(f => packagePaths.push(resolve(projectRootDir, f)));
                callback();
            })
        }, () => onGlobDone(packagePaths));
    }

    /**
     * Step 2
     */
    const onGlobDone = (packagePaths: string[]) => {
        packagePaths = Array.from(new Set(packagePaths));
        if (packagePaths.length === 0) {
            console.log(colors.red(`\nCromwella:: Error. No local packages found\n`))
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
                    devDependencies: pkgJson.devDependencies
                };
                packages.push(pckg);
            } catch (e) {
                console.log(e);
            }
        }

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
        const hoistedDependencies: THoistedDeps = JSON.parse(JSON.stringify(hoistDeps(dependencies, packages)));
        const hoistedDevDependencies: THoistedDeps = JSON.parse(JSON.stringify(hoistDeps(devDependencies, packages)));
        // All ok -> can start installation.



        // Clean node_modules in local packages. Some non-hoisted modules could be installed before
        // But if now versions are changed/fixed, we need to delete old modules. 
        // If they weren't fixed, than we install them again dooing a double job here :|
        const rootModules = resolve(projectRootDir, 'node_modules');
        for (const pkg of packages) {
            if (pkg.path) {
                const modulesPath = resolve(path.dirname(pkg.path), 'node_modules');
                const packageLockPath = resolve(path.dirname(pkg.path), 'package-lock.json');
                if (modulesPath !== rootModules) {
                    if (fs.existsSync(modulesPath)) {
                        // console.log('modulesPath', modulesPath)
                        try {
                            rimraf(modulesPath);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
                if (fs.existsSync(packageLockPath)) {
                    try {
                        fs.unlinkSync(packageLockPath);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }


        // Write all dependencies in temp package.json in root and backup original
        createInstallPackage(projectRootDir, {
            dependencies: hoistedDependencies.hoisted,
            devDependencies: hoistedDevDependencies.hoisted
        });

        // Do the same for all packages with non-hoisted modules
        // { [package root dir]: modules }
        const uniques: Record<string, {
            deps?: Record<string, string>;
            devDeps?: Record<string, string>;
        }> = {}

        Object.entries(hoistedDependencies.nonHoisted).forEach(([packagePath, packageModules]) => {
            if (!uniques[packagePath]) {
                uniques[packagePath] = {};
            }
            uniques[packagePath].deps = packageModules.modules;
        });
        Object.entries(hoistedDevDependencies.nonHoisted).forEach(([packagePath, packageModules]) => {
            if (!uniques[packagePath]) {
                uniques[packagePath] = {};
            }
            uniques[packagePath].devDeps = packageModules.modules;
        });

        Object.keys(uniques).forEach(uni => {
            installPaths.push(uni);
            createInstallPackage(uni, {
                dependencies: uniques[uni].deps,
                devDependencies: uniques[uni].devDeps
            });
        });

        asyncEach(installPaths, (path: string, callback: () => void) => {
            console.log(colors.cyan(`\nCromwella:: Installing modules for: ${path} package in ${installationMode} mode...\n`));
            const modeStr = isProduction ? ' --production' : '';
            try {
                const proc = spawn(`npm install${modeStr}`, { shell: true, cwd: path, stdio: 'inherit' });
                proc.on('close', (code: number) => {
                    console.log(colors.cyan(`\nCromwella:: Installation for ${path} package completed\n`));
                    removeInstallPackage(path);
                    callback();
                });
            } catch (e) {
                console.log(colors.red(`\nCromwella:: Error. Failed to install node_modules for ${path} package\n`))
            }
        }, () => onInstallationDone(hoistedDependencies, hoistedDevDependencies));
    }

    /**
     * Step 3
     */
    const onInstallationDone = (hoistedDependencies: THoistedDeps, hoistedDevDependencies: THoistedDeps) => {
        // Make symlinks between local packages
        hoistedDependencies.localSymlinks.forEach(link => {
            makeSymlink(link.linkPath, link.referredDir);
        });
        hoistedDevDependencies.localSymlinks.forEach(link => {
            makeSymlink(link.linkPath, link.referredDir);
        });
    }


    nodeCleanup(function (exitCode, signal) {
        installPaths.forEach(path => removeInstallPackage(path));
    });


    try {
        globPackages();
    } catch (e) {
        console.log(e);
    }

}
