import colorsdef from 'colors/safe';
import fs from 'fs-extra';
import mkdirp from 'mkdirp';
import { dirname, isAbsolute, resolve } from 'path';
import webpack from 'webpack';
import { spawnSync } from "child_process";
import { Configuration } from 'webpack';

import {
    buildDirChunk,
    cromwellStoreImportsPath,
    cromwellStoreModulesPath,
    getGlobalModuleStr,
    jsOperators,
    moduleMainBuidFileName,
    moduleMetaInfoFileName,
    moduleChunksBuildDirChunk,
    moduleNodeBuidFileName,
    moduleGeneratedFileName,
    moduleNodeGeneratedFileName,
    moduleExportsDirChunk,
    getDepVersion
} from './constants';
import { getCromwellaConfigSync, globPackages, isExternalForm, collectPackagesInfo } from './shared';
import { TAdditionalExports, TSciprtMetaInfo, TPackage, TFrontendDependency, TPackageJson } from './types';
import symlinkDir from 'symlink-dir';
import makeEmptyDir from 'make-empty-dir';
import importFrom from 'import-from';
import resolveFrom from 'resolve-from';

const colors: any = colorsdef;


/**
 * Cromwella Bundler
 * Bundles frontend node_modules
 */

export const bundler = (projectRootDir: string, installationMode: string,
    isProduction: boolean, rebundle: boolean) => {

    // console.log('process', process.cwd(), '__dirname', __dirname, 'projectRootDir', projectRootDir)

    const tempDir = resolve(projectRootDir, '.cromwell');
    const buildDir = resolve(tempDir, buildDirChunk);

    const publicDir = resolve(projectRootDir, 'public');
    const publicBuildLink = resolve(publicDir, buildDirChunk);

    const nodeModulesDir = resolve(buildDir, 'node_modules');

    const onPackagesCollected = async (packages: TPackage[]) => {

        if (rebundle) {
            await makeEmptyDir(buildDir, { recursive: true });
        }
        if (!fs.existsSync(buildDir)) {
            await mkdirp(buildDir);
        }

        await symlinkDir(buildDir, publicBuildLink);

        // Collect frontendDependencies from cromwella.json in all packages 
        let frontendDependencies: TFrontendDependency[] = [];


        packages.forEach(pckg => {
            if (pckg) {
                if (pckg.frontendDependencies && Array.isArray(pckg.frontendDependencies)) {
                    pckg.frontendDependencies.forEach(dep => {
                        const depName = typeof dep === 'object' ? dep.name : dep;
                        const depVersion = getDepVersion(pckg, depName);
                        if (!depVersion) return;

                        const frontendDep: TFrontendDependency = typeof dep === 'object' ? dep : {
                            name: dep,
                            version: depVersion
                        };

                        // if (!frontendDependencies.includes(dep))
                        if (frontendDependencies.every(mainDep => {
                            return !(mainDep.name === frontendDep.name && mainDep.version === frontendDep.version)
                        })) {
                            frontendDependencies.push(frontendDep);
                        }
                    })
                }
            }
        });

        // frontendDependencies = [
        //     // { name: '@cromwell/core', version: 'workspace:1.1.0' },
        //     { name: 'clsx', version: '^1.1.1' },
        // ];


        // Parse cromwella.json configs
        const moduleExternals: Record<string, string[]> = {};
        const moduleBuiltins: Record<string, string[]> = {};
        const modulesExcludeExports: Record<string, string[]> = {};
        const modulesToIgnore: Record<string, string[]> = {};
        const modulesAdditionalExports: Record<string, TAdditionalExports[]> = {};
        const frontendDependenciesNames: string[] = [];

        frontendDependencies.forEach(dep => {
            if (dep.builtins) {
                moduleBuiltins[dep.name] = dep.builtins;
            }
            if (dep.externals) {
                moduleExternals[dep.name] = dep.externals;
            }
            if (dep.excludeExports) {
                modulesExcludeExports[dep.name] = dep.excludeExports;
            }
            if (dep.addExports) {
                modulesAdditionalExports[dep.name] = dep.addExports;
            }
            if (dep.ignore) {
                modulesToIgnore[dep.name] = dep.ignore;
            }
            frontendDependenciesNames.push(dep.name);
        });

        console.log(colors.cyan(`Cromwella:bundler: Found ${frontendDependencies.length} frontend modules to build: ${JSON.stringify(frontendDependencies, null, 2)}\n`));


        const allDependencyNames: string[] = [...frontendDependenciesNames];
        const collectAllNames = (pckg: any) => {
            const pushDep = ((dep: string) => {
                if (!allDependencyNames.includes(dep)) allDependencyNames.push(dep);
            })
            if (!pckg) return;
            if (pckg.dependencies) Object.keys(pckg.dependencies).forEach(pushDep)
            if (pckg.devDependencies) Object.keys(pckg.devDependencies).forEach(pushDep)
            if (pckg.peerDependencies) Object.keys(pckg.peerDependencies).forEach(pushDep)
        }

        // Install node_modules locally
        const tempPckgName = '@cromwell/temp-budler';

        if (!fs.existsSync(nodeModulesDir)) {
            const tempPackageContent = {
                "name": tempPckgName,
                "version": "1.0.0",
                "private": true,
                "dependencies": Object.assign({}, ...frontendDependencies.map(dep => ({ [dep.name]: dep.version })))
            }
            await fs.outputFile(resolve(buildDir, 'package.json'), JSON.stringify(tempPackageContent, null, 4));

            spawnSync(`pnpm i --filter ${tempPckgName}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
        }

        if (!fs.existsSync(nodeModulesDir)) {
            console.log(colors.brightRed('Cromwella:bundler: Failed to install node_modules'));
            // return;
        }


        /**
         * Helper to translate module's export key (namedImport) into generated file with all keys
         * @param namedImport module's export key
         * @param moduleName node module name as 'react'
         * @param importPath path to use in dynamic import() statement. 
         * @param modulePath full path to moduleName exporter. Preferably esm format. As /path/to/my/project/node_modules/@material-ui/core/esm/index.js
         * @param saveAsModules will also save this export as specified module names in the global store 
         */
        const makeImportString = (namedImport: string, moduleName: string, importPath: string,
            modulePath?: string, saveAsModules?: string[]): string => {

            importPath = importPath.replace(/\\/g, '/');
            let globalPropName = namedImport;
            let importerKey = namedImport;
            let saveAsModulesStr = '';

            if (saveAsModules && Array.isArray(saveAsModules)) {
                saveAsModulesStr = `, ${JSON.stringify(saveAsModules)}`
            }

            // Properties exported via "module.exports" can be the same as JS operators, we cannot code-split them
            // with current implementation via "import { prop } from '...';"
            // so just replace for 'default' to include whole lib instead.
            if (jsOperators.includes(namedImport)) {
                importPath = modulePath ?? resolveFrom(buildDir, moduleName).replace(/\\/g, '/');
                globalPropName = 'default';
            }

            return `
            '${importerKey}': () => {
                return startImport(() => {
                    return handleImport(import('${importPath}'), '${globalPropName}'${saveAsModulesStr});
                });
            },
            `;
        }

        type ModuleInfo = {
            exportKeys: string[] | undefined;
            exactVersion: string | undefined;
        };


        // Stores export keys of modules that have been requested
        const modulesExportKeys: Record<string, ModuleInfo> = {};
        const getModuleInfo = (moduleName: string, moduleVer?: string): ModuleInfo => {
            let exportKeys: string[] | undefined;
            let exactVersion: string | undefined;
            if (!modulesExportKeys[moduleName]) {

                const requireExportKeys = () => {
                    const imported: any = importFrom(buildDir, moduleName);
                    const keys = Object.keys(imported);
                    if (!keys.includes('default')) keys.unshift('default');
                    return keys;
                }

                try {
                    exportKeys = requireExportKeys();
                    if (!exportKeys) throw new Error('!exportKeys')
                } catch (e) {
                    // Module not found, install
                    const fullDepName = moduleName + (moduleVer ? '@' + moduleVer : '');
                    const command = `pnpm add ${fullDepName} --filter ${tempPckgName}`;
                    console.log(colors.cyan(`Cromwella:bundler: Installing dependency. Command: ${command}`));
                    spawnSync(command, { shell: true, cwd: projectRootDir, stdio: 'ignore' });
                }

                if (!exportKeys) {
                    try {
                        exportKeys = requireExportKeys();
                        if (!exportKeys) throw new Error('!exportKeys')
                    } catch (e) {
                        console.log(colors.brightYellow(`Cromwella:bundler: Failed to install and require() module: ${moduleName}`));
                    }
                }

                try {
                    const modulePackageJson: TPackageJson | undefined = importFrom(buildDir, `${moduleName}/package.json`) as any;
                    exactVersion = modulePackageJson?.version;
                    if (!exactVersion) throw new Error('!exactVersion')
                } catch (e) {
                    console.log(colors.brightYellow(`Cromwella:bundler: Failed to require() package.json of module: ${moduleName}`));
                }

                const info: ModuleInfo = {
                    exportKeys,
                    exactVersion
                }
                modulesExportKeys[moduleName] = info;
                return info;
            } else {
                return modulesExportKeys[moduleName];
            }
        }

        // collect keys for initially installed
        for (const dep of frontendDependencies) {
            getModuleInfo(dep.name, dep.version);
        }



        /**
         * Start bundling a node module. After bundling requsted moduleName will parse 
         * used modules and bundle them same way recursively
         * @param moduleName 
         */
        const bundleNodeModuleRecursive = async (moduleName: string, moduleVer: string) => {
            getModuleInfo(moduleName, moduleVer);

            let modulePath: string | undefined;
            let moduleRootPath: string | undefined;
            try {
                modulePath = resolveFrom(buildDir, moduleName).replace(/\\/g, '/');
                moduleRootPath = dirname(resolveFrom(buildDir, `${moduleName}/package.json`)).replace(/\\/g, '/');
            } catch (e) {
                console.log(colors.brightRed('Cromwella:bundler: required module ' + moduleName + ' is not found'));
                return;
            }
            if (!moduleRootPath && modulePath) {
                moduleRootPath = dirname(modulePath).replace(/\\/g, '/');;
            }

            // Get package.json to set all Dependencies as external and then transpile them same way
            let modulePackageJson: TPackageJson | undefined;
            const packageExternals: string[] = [...frontendDependenciesNames];
            if (moduleExternals[moduleName]) {
                moduleExternals[moduleName].forEach(ext => packageExternals.push(ext));
            }

            const collectedDependencies = {};

            try {
                modulePackageJson = importFrom(buildDir, `${moduleName}/package.json`) as any;
                if (!modulePackageJson) throw modulePackageJson;

                if (modulePackageJson.dependencies) {
                    for (const depName of Object.keys(modulePackageJson.dependencies)) {
                        packageExternals.push(depName);
                        collectedDependencies[depName] = modulePackageJson.dependencies[depName];
                    }
                }
                if (modulePackageJson.peerDependencies) {
                    for (const depName of Object.keys(modulePackageJson.peerDependencies)) {
                        packageExternals.push(depName);
                        collectedDependencies[depName] = modulePackageJson.peerDependencies[depName];
                    };
                }
            } catch (e) {
                console.error(colors.brightRed('Cromwella:bundler:: Failed to read package.json dependencies of module: ' + moduleName));
                return;
            }

            // const moduleBuildDir = resolve(buildDir, `${moduleName}@${moduleVer}`);
            const moduleBuildDir = resolve(buildDir, `${moduleName}@${modulePackageJson.version}`);
            const libEntry = resolve(moduleBuildDir, moduleGeneratedFileName);
            const nodeLibEntry = resolve(moduleBuildDir, moduleNodeGeneratedFileName);

            if (fs.existsSync(libEntry)) {
                // module has been bundled is some other chain of recursive calls
                return;
            }

            console.log(colors.cyan(`Cromwella:bundler: ${colors.brightCyan('Starting')} to build module: ${colors.brightCyan(`"${moduleName}"`)} from path: ${modulePath}`));
            let imports = '';

            try {
                await makeEmptyDir(moduleBuildDir, { recursive: true });
            } catch (e) {
                console.log('Failed to make dir: ' + moduleBuildDir, e);
                return;
            }


            collectAllNames(modulePackageJson);

            // Find es module export
            if (moduleRootPath && modulePackageJson && modulePackageJson.module) {
                modulePath = resolve(moduleRootPath, modulePackageJson.module).replace(/\\/g, '/');
            }


            // Create a file for each export so webpack could make chunks for each export
            const handleExportKey = async (exportKey: string, exportPath: string, importType?: 'default' | 'named', saveAsModules?: string[]) => {
                const excludeExports = modulesExcludeExports[moduleName];
                if (excludeExports && excludeExports.includes(exportKey)) return;


                const exportContentPath = resolve(moduleBuildDir, moduleExportsDirChunk, exportKey);
                imports += makeImportString(exportKey, moduleName, exportContentPath, modulePath, saveAsModules);

                if (jsOperators.includes(exportKey)) return;

                const importStr = importType === 'default' ? exportKey : `{${exportKey}}`;
                const exportContent = `
                import ${importStr} from '${exportPath}'
                export default ${exportKey};
                `;

                await mkdirp(exportContentPath);
                await fs.writeFile(resolve(exportContentPath, 'index.js'), exportContent);
            }

            const exportKeys = getModuleInfo(moduleName, moduleVer)?.exportKeys;

            if (exportKeys && modulePath) {
                console.log(colors.cyan(`Cromwella:bundler: Found ${exportKeys.length} exports for module ${moduleName}`));
                for (const exportKey of exportKeys) {
                    await handleExportKey(exportKey, modulePath);
                }
            }

            const aditionalExports = modulesAdditionalExports[moduleName];
            if (aditionalExports) {
                for (const key of aditionalExports) {
                    const path = key.path ?? modulePath;
                    if (path) await handleExportKey(key.name, path, key.importType, key.saveAsModules)
                };
            }


            // Main generated file that contains references to generated chunks
            let content = `
            const moduleName = '${moduleName}';

            const isServer = () => (typeof window === 'undefined');
            const getStore = () => {
                if (isServer()) {
                    if (!global.CromwellStore) global.CromwellStore = {};
                    return global.CromwellStore;
                }
                else {
                    if (!window.CromwellStore) window.CromwellStore = {};
                    return window.CromwellStore;
                }
            }
            const CromwellStore = getStore();

            if (!${cromwellStoreImportsPath}) ${cromwellStoreImportsPath} = {};
            if (!${cromwellStoreModulesPath}) ${cromwellStoreModulesPath} = {};
            if (!${getGlobalModuleStr(moduleName)}) {
                const module = {};
                ${getGlobalModuleStr(moduleName)} = module;
            }

            // If we once used 'default' import (which is whole lib), don't let it to make any other imports
            let didDefaultImport = false;

            const checkDidDefaultImport = () => {
                if (checkDidGloballyDefaultImport()) return true;
                return didDefaultImport;
            }
            const checkDidGloballyDefaultImport = () => {
                const storedLib = ${cromwellStoreModulesPath}[moduleName];
                if (typeof storedLib === 'object' || storedLib === 'function') {
                    if (storedLib.didDefaultImport) return true;
                }
            }

            const startImport = (cb) => {
                if (checkDidDefaultImport()) return;
                return cb();
            }

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

            const handleImport = ((promise, importName, saveAsModules) => {
                if (checkDidDefaultImport()) return;
                if (importName === 'default') {
                    didDefaultImport = true;
                }
                promise.then(lib => {
                    if (checkDidGloballyDefaultImport()) return;

                    if (importName === 'default') {
                        ${cromwellStoreModulesPath}[moduleName] = interopDefault(lib, importName);
                    } else {
                        if (checkDidDefaultImport()) return;
                        ${cromwellStoreModulesPath}[moduleName][importName] = interopDefault(lib, importName);
                    }
                    if (saveAsModules && Array.isArray(saveAsModules)) {
                        saveAsModules.forEach(modName => {
                            ${cromwellStoreModulesPath}[modName] = interopDefault(lib, importName);
                        })
                    }
                });
                return promise;
            })

            ${cromwellStoreImportsPath}['${moduleName}'] = {
                ${imports}
            }
            `;

            await fs.writeFile(libEntry, content);


            // Main generated file that contains references to generated chunks
            let nodeContent = `
            const moduleName = '${moduleName}';

            const getStore = () => {
                    if (!global.CromwellStore) global.CromwellStore = {};
                    return global.CromwellStore;
            }
            const CromwellStore = getStore();

            if (!${cromwellStoreImportsPath}) ${cromwellStoreImportsPath} = {};
            if (!${cromwellStoreModulesPath}) ${cromwellStoreModulesPath} = {};
            if (!${getGlobalModuleStr(moduleName)}) {
                ${getGlobalModuleStr(moduleName)} = require('${modulePath}');
            }
            `;

            await fs.writeFile(nodeLibEntry, nodeContent);


            // 1. FIRST BUILD PASS
            // Run compiler to parse files and find actually used dependencies.

            const parsingWebpackConfig = Object.assign({}, parseImportsWebpackConfig);
            parsingWebpackConfig.output = Object.assign({}, parseImportsWebpackConfig.output);
            parsingWebpackConfig.output!.path = resolve(moduleBuildDir, 'parse_temp');
            parsingWebpackConfig.output!.library = moduleName.replace(/\W/g, '_');
            parsingWebpackConfig.entry = nodeLibEntry;

            // { [moduleName]: namedExports }
            const usedExternals: Record<string, string[]> = {};

            // Used AND included in package.json
            const filteredUsedExternals: Record<string, string[]> = {};

            let moduleStats: any[] = [];

            const shouldLogBuild = false;

            parsingWebpackConfig.externals = [
                function (context, request, callback) {
                    if (isExternalForm(request)) {
                        //@ts-ignore
                        return callback(null, 'commonjs ' + request);
                    }
                    //@ts-ignore
                    callback();
                }
            ]

            const compiler = webpack(parsingWebpackConfig);


            // Decryption of webpack's actually used modules via AST to define externals list
            const handleStatement = (statement, source: string, exportName: string, identifierName: string) => {
                if (!isExternalForm(source)) return;

                if (moduleBuiltins[moduleName] && moduleBuiltins[moduleName].includes(source)) return;

                const depVersion = getDepVersion(modulePackageJson, source);

                // if (!depVersion) return;

                const exportKeys = getModuleInfo(source, depVersion)?.exportKeys;

                if (!exportKeys) return;

                if (!exportName && identifierName) {
                    if (exportKeys.includes(identifierName)) exportName = identifierName;
                    else exportName = 'default';
                }

                if (!exportKeys.includes(exportName)) exportName = 'default';

                if (!usedExternals[source]) usedExternals[source] = [];

                if (exportName && exportKeys.includes(exportName) &&
                    !usedExternals[source].includes(exportName)) {

                    // Properties exported via "module.exports" can be the same as JS operators, we cannot code-split them
                    // with current implementation via "import { prop } from '...';"
                    // so just replace for 'default' to include whole lib instead 
                    if (jsOperators.includes(exportName)) {
                        exportName = 'default';
                    }

                    usedExternals[source].push(exportName);
                }
            }

            compiler.hooks.normalModuleFactory.tap('CromwellaBundlerPlugin', factory => {
                factory.hooks.parser.for('javascript/auto').tap('CromwellaBundlerPlugin', (parser, options) => {
                    parser.hooks.importSpecifier.tap('CromwellaBundlerPlugin', handleStatement);
                    parser.hooks.exportImportSpecifier.tap('CromwellaBundlerPlugin', (statement, source, identifierName, exportName) => {
                        handleStatement(statement, source, exportName, identifierName);
                    });
                });
            });

            compiler.hooks.shouldEmit.tap('CromwellaBundlerPlugin', (compilation) => {
                return false;
            });

            await new Promise((done) => {
                compiler.run(async (err, stats) => {

                    // Optimize used externals:
                    // If has "default" key with any other, leave only "default"
                    Object.keys(usedExternals).forEach(extName => {
                        if (usedExternals[extName].includes('default')) {
                            usedExternals[extName] = ['default'];
                        }
                    });
                    // If imported more than 80% of keys, replace them by one "default"
                    Object.keys(usedExternals).forEach(extName => {

                        const depVersion = getDepVersion(modulePackageJson, extName);
                        if (!depVersion) return;

                        const exportKeys = getModuleInfo(extName, depVersion)?.exportKeys;
                        if (exportKeys) {
                            if (usedExternals[extName].length > exportKeys.length * 0.8) {
                                usedExternals[extName] = ['default'];
                            }
                        }

                    });

                    Object.keys(usedExternals).forEach(extName => {
                        if (packageExternals.includes(extName)) {
                            filteredUsedExternals[extName] = usedExternals[extName];
                        }
                    });

                    // Get versions
                    const versionedExternals: Record<string, string[]> = {};
                    Object.keys(filteredUsedExternals).forEach(depName => {
                        const depVersion = getDepVersion(modulePackageJson, depName);
                        if (!depVersion) return;

                        const exactVersion = getModuleInfo(depName, depVersion)?.exactVersion;

                        if (!exactVersion) return;

                        versionedExternals[`${depName}@${exactVersion}`] = filteredUsedExternals[depName];
                    })

                    // Create meta info file with actually used dependencies
                    const metaInfoPath = resolve(moduleBuildDir, moduleMetaInfoFileName);
                    const metaInfoContent: TSciprtMetaInfo = {
                        name: `${moduleName}@${moduleVer}`,
                        externalDependencies: versionedExternals,
                    };

                    await fs.writeFile(metaInfoPath, JSON.stringify(metaInfoContent, null, 4));


                    if (stats && !stats.hasErrors() && !err && fs.existsSync(metaInfoPath)) {
                        console.log(colors.cyan('Cromwella:bundler: Parsed imports for module: ' + moduleName));
                    } else {
                        console.log(colors.brightRed('Cromwella:bundler: Failed to parse imports for module: ' + moduleName));
                        console.log('stats.hasErrors()', stats?.hasErrors(), 'err', err, 'fs.existsSync(metaInfoPath)', fs.existsSync(metaInfoPath));
                        console.log('usedExternals', usedExternals);
                        if (err) console.error(err);
                        if (stats) console.log(stats.toString({ colors: true }));
                    }

                    done();
                });
            });

            // Check if found used node_modules that weren't included in package.json
            // and hence weren't marked as externals in webpack config. 
            const notIncludedExts: string[] = []
            Object.keys(usedExternals).forEach(used => {
                if (!packageExternals.includes(used)) {
                    notIncludedExts.push(used);
                }
            });

            if (notIncludedExts.length > 0) {
                console.log(colors.brightYellow(`Cromwella:bundler: Found used node_modules of ${moduleName} that weren't included in package.json or cromwella.json : ${notIncludedExts.join(', ')}.`));
                console.log(colors.brightYellow(`Cromwella:bundler: All listed modules will be bundled with ${moduleName} and hence not reusable for other modules. This may cause bloating of bundles. Please configure encountered modules as externals.`));

            }


            // 2. SECOND BUILD PASS
            // Build module for web.

            // console.log(JSON.stringify(webpackConfig.externals, null, 2));
            const makeConfig = (templateConfig, templateLibEntry, useGlobals: boolean) => {
                const webpackConfig = Object.assign({}, templateConfig);
                webpackConfig.output = Object.assign({}, templateConfig.output);
                webpackConfig.entry = templateLibEntry;
                webpackConfig.output!.library = moduleName.replace(/\W/g, '_');
                webpackConfig.output!.path = resolve(moduleBuildDir);

                if (!isProduction) {
                    webpackConfig.devtool = 'cheap-source-map';
                }
                webpackConfig.mode = isProduction ? 'production' : 'development';

                if (modulesToIgnore[moduleName] && modulesToIgnore[moduleName].length > 0) {
                    if (!webpackConfig.plugins) webpackConfig.plugins = [];
                    webpackConfig.plugins.push(new webpack.IgnorePlugin({
                        checkResource(resource) {
                            return modulesToIgnore[moduleName].includes(resource);
                        }
                    }))
                }

                webpackConfig.externals = Object.assign({}, ...packageExternals.map(ext => ({
                    [ext]: useGlobals ? `root ${getGlobalModuleStr(ext)}` : `commonjs ${ext}`
                })));

                return webpackConfig;
            }

            const webpackConfig = makeConfig(commonWebpackConfig, libEntry, true);

            webpackConfig.output!.publicPath = `/${buildDirChunk}/${moduleName}@${modulePackageJson.version}/`;

            const buildCompiler = webpack(webpackConfig);

            await new Promise((done) => {

                buildCompiler.run(async (err, stats) => {

                    if (shouldLogBuild) {
                        // const jsonStats = stats?.toString({ colors: true });
                        // console.log(jsonStats);

                        const jsonStatsPath = resolve(moduleBuildDir, 'build_stats.json');
                        await fs.writeFile(jsonStatsPath, JSON.stringify(moduleStats, null, 4));
                    }

                    if (stats && !stats.hasErrors() && !err && fs.existsSync(resolve(moduleBuildDir, moduleMainBuidFileName))) {
                        console.log(colors.brightGreen('Cromwella:bundler: Successfully built module for web: ' + moduleName));
                        // console.log(colors.cyan('usedExternals: \n' + JSON.stringify(usedExternals, null, 4)));
                        if (Object.keys(filteredUsedExternals).length > 0) {
                            console.log(colors.cyan(`Cromwella:bundler: Starting to build following used dependencies of module ${moduleName}: ${Object.keys(filteredUsedExternals).join(', ')}`));
                            // console.log('collectedDependencies', collectedDependencies)
                            for (const ext of Object.keys(filteredUsedExternals)) {
                                const version = collectedDependencies[ext];
                                if (version)
                                    await bundleNodeModuleRecursive(ext, version);
                            }
                            console.log(colors.cyan(`Cromwella:bundler: All dependencies of module ${moduleName} has been built`));
                        }
                    } else {
                        console.log(colors.brightRed('Cromwella:bundler: Failed to built module for web: ' + moduleName));
                        if (err) console.error(err);
                        if (stats) console.error(stats?.toString({ colors: true }));
                    }
                    // console.log(stats?.toString({ colors: true }))
                    done();
                });

            })


            // 3. THIRD BUILD PASS
            // Build module for Node.js.
            const nodeWebpackConfig = makeConfig(nodeWebpackConfigTemplate, nodeLibEntry, false);

            const nodeBuildCompiler = webpack(nodeWebpackConfig);

            await new Promise((done) => {

                nodeBuildCompiler.run(async (err, stats) => {

                    if (stats && !stats.hasErrors() && !err && fs.existsSync(resolve(moduleBuildDir, moduleNodeBuidFileName))) {
                        console.log(colors.brightGreen('Cromwella:bundler: Successfully built module for Node.js: ' + moduleName));
                        // console.log(colors.cyan('usedExternals: \n' + JSON.stringify(usedExternals, null, 4)));
                    } else {
                        console.log(colors.brightRed('Cromwella:bundler: Failed to built module for Node.js: ' + moduleName));
                        if (err) console.error(err);
                        if (stats) console.error(stats?.toString({ colors: true }));
                    }
                    // console.log(stats?.toString({ colors: true }))
                    done();
                });

            })

            console.log(colors.cyan(`Cromwella:bundler: Module: ${colors.brightCyan(`"${moduleName}"`)} has been ${colors.brightCyan('processed')}`));
        }

        for (const module of frontendDependencies) {
            if (module.version)
                await bundleNodeModuleRecursive(module.name, module.version);
        }
    }

    globPackages(projectRootDir, (packagePaths: string[]) => {
        collectPackagesInfo(packagePaths, (packages: TPackage[]) => {
            onPackagesCollected(packages);
        })
    });
}

// function cleanStringify(object) {
//     if (object && typeof object === 'object') {
//         object = copyWithoutCircularReferences([object], object);
//     }
//     return JSON.stringify(object);
//     function copyWithoutCircularReferences(references, object) {
//         var cleanObject = {};
//         Object.keys(object).forEach(function (key) {
//             var value = object[key];
//             if (value && typeof value === 'object') {
//                 if (references.indexOf(value) < 0) {
//                     references.push(value);
//                     cleanObject[key] = copyWithoutCircularReferences(references, value);
//                     references.pop();
//                 } else {
//                     cleanObject[key] = '###_Circular_###';
//                 }
//             } else if (typeof value !== 'function') {
//                 cleanObject[key] = value;
//             }
//         });
//         return cleanObject;
//     }
// }

export const commonWebpackConfig: Configuration = {
    target: 'web',
    output: {
        filename: moduleMainBuidFileName,
        chunkFilename: moduleChunksBuildDirChunk + '/[name].bundle.js',
        // libraryTarget: 'umd',
        libraryExport: 'default',
    },
    optimization: {
        splitChunks: {
            minSize: 20000,
            maxSize: 100000,
            chunks: 'all',
            // name: (module, chunks, cacheGroupKey) => {
            //     const moduleFileName = module.identifier().replace(/\\/g, '/').split('/').reduceRight(item => item);
            //     // console.log('moduleFileName', moduleFileName);
            //     if (moduleFileName === 'main.js') return moduleFileName;
            //     const allChunksNames = chunks.map((item) => item.name).join('~');
            //     return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
            // }
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    { loader: require.resolve('style-loader') },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty'
    },
    stats: 'errors-only'
    // stats: 'normal'
};

export const nodeWebpackConfigTemplate: any = {
    target: 'node',
    output: {
        filename: moduleNodeBuidFileName,
        libraryTarget: 'commonjs',
        // libraryExport: 'default',
        globalObject: `(() => {
            if (typeof self !== 'undefined') {
                return self;
            } else if (typeof global !== 'undefined') {
                return global;
            } else {
                return Function('return this')();
            }
        })()`,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    { loader: require.resolve('style-loader') },
                    {
                        loader: require.resolve('css-loader')
                    }
                ],
            }
        ]
    },
    stats: 'errors-only'
    // stats: 'normal'
};

export const parseImportsWebpackConfig: Configuration = {
    // mode: "production",
    target: 'node',
    mode: "development",
    devtool: false,
    output: {
        filename: 'temp_' + moduleMainBuidFileName,
        libraryTarget: "var"
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: {
                    loader: require.resolve('babel-loader'),
                    options: {
                        plugins: [
                            require.resolve('babel-plugin-transform-commonjs')
                        ]
                    }
                }
            }
        ]
    },
    stats: 'errors-only'
    // stats: 'normal'
}