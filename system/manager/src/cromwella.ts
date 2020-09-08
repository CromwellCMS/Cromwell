import path from 'path';
import fs from 'fs';
import { sync as mkdirp } from 'mkdirp';
import { sync as rimraf } from 'rimraf';
import glob from "glob";
import { each as asyncEach } from 'async';
import nodeCleanup from 'node-cleanup';
import chalk from 'chalk';
import { spawnSync, spawn } from "child_process";
const resolve = path.resolve;
const { projectRootDir, closeAllOnExit, services, windowsDev } = require('../config');
import { sync as symlinkOrCopySync } from 'symlink-or-copy';
const lernaConfig = require('../../../lerna.json');

/**
 * © Cromwella
 * CromellCMS package manager. Siplified rewrite of Lerna package manager
 */

type TDependency = {
    name: string;
    // { [version] : number of matches }
    versions: Record<string, number>;
    // { [path to package.json] : version }
    packages: Record<string, string>;
};

type TPackage = {
    name?: string;
    path?: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
};

// { [project root dir]: info }
type TUniques = Record<string, {
    name: string;
    modules: TModuleInfo[];
}>;

type TModuleInfo = { name: string, version: string };


type UnifiedDeps = {
    unified: Record<string, string>;
    uniques: TUniques;
};

(() => {
    const options = {};

    const installationMode: 'dev' | 'devForce' | 'prod' = process.argv[2] as any;

    let packagePaths: string[] = [];
    let packages: TPackage[] = [];

    const dependencies: TDependency[] = [];
    const devDependencies: TDependency[] = [];
    const installPaths: string[] = [];

    const collectDeps = (packageDeps: Record<string, string>,
        packagePath: string, store: TDependency[]) => {
        // console.log('packagePath', packagePath);
        // console.log('store', store);
        for (const module of Object.entries(packageDeps)) {
            const moduleName = module[0];
            const moduleVer = module[1] as string;
            let idx: number | null = null;
            store.forEach((dep, i) => {
                if (dep.name === moduleName) {
                    idx = i;
                }
            });
            if (idx != null) {
                store[idx].versions[moduleVer] = (store[idx].versions[moduleVer] || 0) + 1;
                store[idx].packages[packagePath] = moduleVer;
            } else {
                store.push({
                    name: moduleName,
                    versions: { [moduleVer]: 1 },
                    packages: { [packagePath]: moduleVer }
                })
            }
        }
    }


    const unifyDeps = (store: TDependency[]): UnifiedDeps => {

        // Out main package.json with hoisted modules. Will be temporary placed in root of the project to install all modules
        const outDeps: Record<string, string> = {};

        // Other local packages with different versions of modules from hoisted ones. Packages includes only those types of modules
        const uniques: TUniques = {};

        for (const module of store) {
            // Sort to set most frequently used version as first and then use it as hoisted one
            const versions = Object.entries(module.versions).sort((a, b) => b[1] - a[1])
                .map(entry => entry[0]);

            let hoistedVersion = versions[0];

            // Exclude modules that are local packages from being inclued in main package
            let localPckIndex: number | null = null;
            packages.forEach((pkg, i) => { if (pkg.name == module.name) localPckIndex = i });
            if (localPckIndex != null) {
                // Module is local package. It will be symlinked into other local packages that depends on it
                Object.keys(module.packages).forEach(dependentPckg => {
                    if (localPckIndex == null) return;
                    // console.log('dependentPckg: ', path.dirname(dependentPckg), 'module.name', module.name);
                    const includeInPath = resolve(path.dirname(dependentPckg), 'node_modules', module.name);
                    const includeToPath = path.dirname(packages[localPckIndex].path || '');
                    if (!fs.existsSync(includeInPath)) {
                        console.log(chalk.blue(`Cromwella:: Make include in: ${includeInPath} to: ${includeToPath}`));
                        try {
                            mkdirp(resolve(includeInPath, '../'));
                        } catch (e) {
                            console.log(e);
                        }
                        try {
                            symlinkOrCopySync(includeToPath, includeInPath);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                })
            } else {
                outDeps[module.name] = hoistedVersion;
            }

            // Handle different versions.
            if (versions.length > 1 && localPckIndex == null) {
                for (let i = 1; i < versions.length; i++) {
                    const ver = versions[i];
                    Object.entries(module.packages).forEach(entry => {
                        if (entry[1] === ver) {
                            const packageName = packages?.find(p => p.path === entry[0])?.name;

                            console.log(chalk.yellow(`\nCromwella:: Local package ${packageName} at ${entry[0]} dependent on different version of hoisted package ${module.name}. \nHoisted (commonly used) ${module.name} is "${hoistedVersion}", but dependent is "${ver}".\n`));
                            if (installationMode === 'dev') {
                                console.log(chalk.red(`Cromwella:: Error. Abort installation. Please fix "${module.name}": "${ver}" or run installation in devForce mode.\n`));
                                process.exit();
                            }
                            if (installationMode === 'prod') {
                                console.log(chalk.yellow(`Cromwella:: Installing ${module.name}: "${ver}" locally...\n`));
                            }

                            if (!uniques[path.dirname(entry[0])]) {
                                uniques[path.dirname(entry[0])] = {
                                    name: packageName || '',
                                    modules: [{
                                        name: module.name,
                                        version: ver
                                    }]
                                }
                            } else {
                                uniques[path.dirname(entry[0])].modules.push({
                                    name: module.name,
                                    version: ver
                                });
                            }

                        }
                    })
                }
            }
        }
        return {
            unified: outDeps,
            uniques: uniques
        }
    }

    const modulesToPackage = (modules: TModuleInfo[]): Record<string, string> => {
        const out: Record<string, string> = {};
        modules.forEach(module => {
            out[module.name] = module.version;
        });
        return out;
    }

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
            console.log(chalk.red('Failed to create install package file for ' + dir));
            console.log(e)
            removeInstallPackage(dir);
        }
    }

    const removeInstallPackage = (dir: string) => {
        const hoistedPackageJsonPath = resolve(dir, 'package.json');
        const hoistedPackageJsonBackupPath = resolve(dir, '_backup_package.json');

        try {
            if (fs.existsSync(hoistedPackageJsonBackupPath)) {
                fs.writeFileSync(hoistedPackageJsonPath, fs.readFileSync(hoistedPackageJsonBackupPath));
                fs.unlinkSync(hoistedPackageJsonBackupPath);
            }
        } catch (e) {
            console.log(chalk.red('Failed to remove install package file for ' + dir));
            console.log(e)
        }
    }

    const main = () => {
        console.log(chalk.cyan(`Cromwella:: Start. Scannig for local packages from ./lerna.json...\n`));

        asyncEach(lernaConfig.packages, function (pkg: string, callback: () => void) {
            glob(pkg + '/package.json', options, function (er: any, files: string[]) {
                files.forEach(f => packagePaths.push(resolve(projectRootDir, f)));
                callback();
            })
        }, function (err: any) {
            packagePaths = Array.from(new Set(packagePaths));
            console.log(chalk.cyan(`Cromwella:: Found local packages:`));
            console.log(packagePaths);
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

            // Clean node_modules in packages. Non-hoisted modules could be installed before in local dirs
            // But if now versions are fixed, we need to delete old modules. If they weren't fixed, than we install them again dooing a double job here.
            for (const pkg of packages) {
                if (pkg.path) {
                    const modulesPath = resolve(path.dirname(pkg.path), 'node_modules');
                    if (fs.existsSync(modulesPath)) {
                        // console.log('modulesPath', modulesPath)
                        try {
                            rimraf(modulesPath);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }

            // Collect dependencies and devDependencies from all packages
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
            const uniDependencies: UnifiedDeps = JSON.parse(JSON.stringify(unifyDeps(dependencies)));
            const uniDevDependencies: UnifiedDeps = JSON.parse(JSON.stringify(unifyDeps(devDependencies)));
            installPaths.push(projectRootDir);

            // Write all dependencies in temp package.json in root and backup original
            createInstallPackage(projectRootDir, {
                dependencies: uniDependencies.unified,
                devDependencies: uniDevDependencies.unified
            });

            // Do the same for all packages with non-hoisted modules
            // { [project root dir]: modules }
            const uniques: Record<string, {
                deps: TModuleInfo[],
                devDeps: TModuleInfo[]
            }> = {}

            Object.entries(uniDependencies.uniques).forEach(entry => {
                if (!uniques[entry[0]]) {
                    uniques[entry[0]] = {
                        deps: [],
                        devDeps: []
                    }
                }
                uniques[entry[0]].deps = entry[1].modules;
            });
            Object.entries(uniDevDependencies.uniques).forEach(entry => {
                uniques[entry[0]].devDeps = entry[1].modules;
            });

            // console.log('uniques', JSON.stringify(uniques));

            Object.keys(uniques).forEach(uni => {
                installPaths.push(uni);
                createInstallPackage(uni, {
                    dependencies: modulesToPackage(uniques[uni].deps),
                    devDependencies: modulesToPackage(uniques[uni].devDeps)
                });
            });

            installPaths.forEach(path => {
                console.log(chalk.cyan(`\nCromwella:: Installing modules for: ${path} package in ${installationMode} mode...\n`));
                const modeStr = installationMode === 'prod' ? ' --production' : '';
                try {
                    const proc = spawn(`npm install${modeStr}`, { shell: true, cwd: path, stdio: 'inherit' });
                    proc.on('close', (code: number) => {
                        console.log(chalk.cyan(`\nCromwella:: Installation for ${path} package completed\n`));
                        removeInstallPackage(path);
                    });
                } catch (e) {
                    console.log(chalk.red(`\nCromwella:: Error. Failed to install node_modules for ${path} package\n`))
                }
            })
        });
    }

    nodeCleanup(function (exitCode, signal) {
        installPaths.forEach(path => removeInstallPackage(path));
    });

    try {
        main();
    } catch (e) {
        console.log(e);
    }


    // const files = await readRecursive(__dirname);
    // console.log(files);
})();
