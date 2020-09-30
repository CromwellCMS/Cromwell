import { each as asyncEach } from 'async';
import { spawn } from 'child_process';
import colorsdef from 'colors/safe';
import fs from 'fs';
import { sync as mkdirp } from 'mkdirp';
import nodeCleanup from 'node-cleanup';
import path, { resolve } from 'path';
import { sync as rimraf } from 'rimraf';
import { sync as symlinkOrCopySync } from 'symlink-or-copy';

import { getCromwellaConfigSync, getHoistedDependencies } from './shared';
import { THoistedDeps, TPackage } from './types';

const colors: any = colorsdef;
/**
 * Cromwella package manager.
 */

export const installer = (projectRootDir: string, installationMode: string,
    isProduction: boolean, forceInstall: boolean) => {

    const installPaths: string[] = [projectRootDir];

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
            console.log(colors.brightRed('Failed to create install package file for ' + dir));
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
            console.log(colors.brightRed('Failed to remove install package file for ' + dir));
            console.log(e)
        }
    }



    const main = () => {
        const cromwellaConfig = getCromwellaConfigSync(projectRootDir, true);

        getHoistedDependencies(projectRootDir, isProduction, forceInstall, (packages: TPackage[],
            hoistedDependencies,
            hoistedDevDependencies) => {

            if (packages.length === 0 || !hoistedDependencies && !hoistedDevDependencies) {
                console.log(colors.brightRed(`\nCromwella:: Error. No packages found\n`));
                return
            }

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
                dependencies: hoistedDependencies?.hoisted,
                devDependencies: hoistedDevDependencies?.hoisted
            });

            // Do the same for all packages with non-hoisted modules
            // { [package root dir]: modules }
            const uniques: Record<string, {
                deps?: Record<string, string>;
                devDeps?: Record<string, string>;
            }> = {}

            if (hoistedDependencies?.nonHoisted)
                Object.entries(hoistedDependencies.nonHoisted).forEach(([packagePath, packageModules]) => {
                    if (!uniques[packagePath]) {
                        uniques[packagePath] = {};
                    }
                    uniques[packagePath].deps = packageModules.modules;
                });

            if (hoistedDevDependencies?.nonHoisted)
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
                console.log(colors.cyan(`\nCromwella:: Installing modules for: ${colors.brightCyan(`${path}`)} package in ${colors.brightCyan(`${installationMode}`)} mode...\n`));
                const modeStr = isProduction ? ' --production' : '';
                try {
                    const proc = spawn(`npm install${modeStr}`, { shell: true, cwd: path, stdio: 'inherit' });
                    proc.on('close', (code: number) => {
                        console.log(colors.brightCyan(`\nCromwella:: Installation for ${path} package completed\n`));
                        removeInstallPackage(path);
                        callback();
                    });
                } catch (e) {
                    console.log(colors.brightRed(`\nCromwella:: Error. Failed to install node_modules for ${path} package\n`))
                }
            }, () => onInstallationDone(hoistedDependencies, hoistedDevDependencies));
        })
    }

    const onInstallationDone = (hoistedDependencies?: THoistedDeps, hoistedDevDependencies?: THoistedDeps) => {
        // Make symlinks between local packages
        hoistedDependencies?.localSymlinks?.forEach(link => {
            makeSymlink(link.linkPath, link.referredDir);
        });
        hoistedDevDependencies?.localSymlinks?.forEach(link => {
            makeSymlink(link.linkPath, link.referredDir);
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

}
