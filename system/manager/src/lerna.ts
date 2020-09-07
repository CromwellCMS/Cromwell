const fs = require('fs');
const path = require('path');
const resolve = path.resolve;
const glob = require("glob");
const asyncEach = require('async').each;
const { spawnSync, spawn } = require("child_process");
const { projectRootDir, closeAllOnExit, services, windowsDev } = require('./config');
const symlinkOrCopySync = require('symlink-or-copy').sync;
const lernaConfig = require('../../../lerna.json');

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
    var options = {};

    let packagePaths: string[] = [];
    let packages: TPackage[] = [];

    const dependencies: TDependency[] = [];
    const devDependencies: TDependency[] = [];

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
        const outDeps: Record<string, string> = {};
        const uniques: TUniques = {};

        for (const module of store) {
            const versions = Object.entries(module.versions).sort((a, b) => b[1] - a[1])
                .map(entry => entry[0]);

            let hoistedVersion = versions[0];

            // exclude local packages
            let localPckIndex: number | null = null;

            packages.forEach((pkg, i) => { if (pkg.name == module.name) localPckIndex = i });
            if (localPckIndex != null) {

                // module is local package. Install it into dependent local packages
                Object.keys(module.packages).forEach(dependentPckg => {
                    if (localPckIndex == null) return;
                    // console.log('dependentPckg: ', path.dirname(dependentPckg), 'module.name', module.name);
                    const includeInPath = resolve(path.dirname(dependentPckg), 'node_modules', module.name);
                    const includeToPath = path.dirname(packages[localPckIndex].path);
                    if (!fs.existsSync(includeInPath)) {
                        console.log('make include in: ', includeInPath, 'to: ', includeToPath);
                        fs.mkdirSync(resolve(includeInPath, '../'), { recursive: true });

                        symlinkOrCopySync(includeToPath, includeInPath);
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
                            console.log(`Local package ${packageName} at ${entry[0]} requires different version of hoisted package ${module.name}. \nHoisted (commonly used) ${module.name} is "${hoistedVersion}", but required is "${ver}". Installing "${ver}" locally...\n`);
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
            console.log('Failed to create install package file for ' + dir);
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
            console.log('Failed to remove install package file for ' + dir);
            console.log(e)
        }
    }

    asyncEach(lernaConfig.packages, function (pkg: string, callback: () => void) {
        glob(pkg + '/package.json', options, function (er: any, files: string[]) {
            files.forEach(f => packagePaths.push(resolve(projectRootDir, f)));
            callback();
        })
    }, function (err: any) {
        packagePaths = Array.from(new Set(packagePaths));
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

        const uniDependencies: UnifiedDeps = JSON.parse(JSON.stringify(unifyDeps(dependencies)));
        const uniDevDependencies: UnifiedDeps = JSON.parse(JSON.stringify(unifyDeps(devDependencies)));
        const installPaths = [projectRootDir];

        // Write all dependencies in temp package.json in root and backup original
        createInstallPackage(projectRootDir, {
            dependencies: uniDependencies.unified,
            devDependencies: uniDevDependencies.unified
        });

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
            console.log('Installing packages for: ' + path);
            try {
                const proc = spawn(`npm install`, { shell: true, cwd: path, stdio: 'inherit' });
                proc.on('close', (code: number) => {
                    console.log(`Installation for ${path} complete`);
                    removeInstallPackage(path);
                });
            } catch (e) {
                console.log('Failed to install node_modules for ' + path)
            }
        })

    });


    // const files = await readRecursive(__dirname);
    // console.log(files);
})();
