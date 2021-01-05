import { TSciprtMetaInfo } from '@cromwell/core';
import { getPublicDir } from '@cromwell/core-backend';
import archiver from 'archiver';
import { spawnSync } from 'child_process';
import colorsdef from 'colors/safe';
import cryptoRandomString from 'crypto-random-string';
import fs from 'fs-extra';
import importFrom from 'import-from';
import makeEmptyDir from 'make-empty-dir';
import mkdirp from 'mkdirp';
import normalizePath from 'normalize-path';
import { dirname, resolve } from 'path';
import resolveFrom from 'resolve-from';
import symlinkDir from 'symlink-dir';
import webpack, { Configuration } from 'webpack';

import {
    bundledModulesDirName,
    cromwellStoreImportsPath,
    cromwellStoreModulesPath,
    getGlobalModuleStr,
    jsOperators,
    moduleArchiveFileName,
    moduleBundleInfoFileName,
    moduleChunksBuildDirChunk,
    moduleExportsDirChunk,
    moduleGeneratedFileName,
    moduleLibBuidFileName,
    moduleMainBuidFileName,
    moduleMetaInfoFileName,
    moduleNodeBuidFileName,
    moduleNodeGeneratedFileName,
    tempPckgName,
} from './constants';
import { CromwellWebpackPlugin } from './plugins/webpack';
import {
    collectFrontendDependencies,
    collectPackagesInfo,
    getBundledModulesDir,
    getModuleInfo,
    globPackages,
} from './shared';
import { TAdditionalExports, TBundleInfo, TExternal, TPackageJson } from './types';

const colors: any = colorsdef;

/**
 * Cromwella Bundler
 * Bundles frontend node_modules
 */
export const bundler = async (projectRootDir: string, installationMode: string,
    isProduction: boolean, rebundle: boolean, noInstall?: boolean) => {

    // console.log('process', process.cwd(), '__dirname', __dirname, 'projectRootDir', projectRootDir)

    const buildDir = getBundledModulesDir()

    const publicDir = getPublicDir();
    const publicBuildLink = resolve(publicDir, bundledModulesDirName);

    const nodeModulesDir = resolve(buildDir, 'node_modules');

    const packagePaths = await globPackages(projectRootDir);
    const packages = await collectPackagesInfo(packagePaths);


    if (rebundle) {
        await makeEmptyDir(buildDir, { recursive: true });
    }
    if (!fs.existsSync(buildDir)) {
        await mkdirp(buildDir);
    }

    await symlinkDir(buildDir, publicBuildLink);

    // Collect frontendDependencies from cromwella.json in all packages 
    const frontendDependencies = collectFrontendDependencies(packages);


    // frontendDependencies = [
    //     // { name: '@cromwell/core', version: 'workspace:1.1.0' },
    //     { name: 'clsx', version: '^1.1.1' },
    // ];


    // Parse cromwella.json configs
    const moduleExternals: Record<string, TExternal[]> = {};
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

    // if (!noInstall && !fs.existsSync(nodeModulesDir)) {
    //     const tempPackageContent = {
    //         "name": tempPckgName,
    //         "version": "1.0.0",
    //         "private": true,
    //         "dependencies": Object.assign({}, ...frontendDependencies.map(dep => ({ [dep.name]: dep.version })))
    //     }
    //     await fs.outputFile(resolve(buildDir, 'package.json'), JSON.stringify(tempPackageContent, null, 4));

    //     spawnSync(`pnpm i --filter ${tempPckgName}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
    // }

    // if (!noInstall && !fs.existsSync(nodeModulesDir)) {
    //     console.log(colors.brightRed('Cromwella:bundler: Failed to install node_modules'));
    //     // return;
    // }


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

        // `/* webpackChunkName: "${globalPropName}${cryptoRandomString({ length: 6 })}" */ `
        return `
            '${importerKey}': () => {
                return startImport(() => {
                    return handleImport(import( 
                        '${importPath}'), '${globalPropName}'${saveAsModulesStr});
                });
            },
            `;
    }

    // cache keys for initially installed modules
    for (const dep of frontendDependencies) {
        getModuleInfo(dep.name, dep.version, buildDir);
    }

    /**
     * Start bundling a node module. After bundling requsted moduleName will parse 
     * used modules and bundle them same way recursively
     * @param moduleName 
     */
    const bundleNodeModuleRecursive = async (moduleName: string, moduleVer: string): Promise<string | undefined> => {
        getModuleInfo(moduleName, moduleVer, buildDir);

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
        const configuredExternals: TExternal[] | undefined = moduleExternals[moduleName] ?? [];
        if (configuredExternals) {
            configuredExternals.forEach(ext => {
                if (ext.usedName) packageExternals.push(ext.usedName);
                if (ext.moduleName) packageExternals.push(ext.moduleName);
            });
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
        const metaInfoPath = resolve(moduleBuildDir, moduleMetaInfoFileName);
        const bundleInfoPath = resolve(moduleBuildDir, moduleBundleInfoFileName);
        const exportsGeneratedPath = resolve(moduleBuildDir, moduleExportsDirChunk);
        const chunksDir = resolve(moduleBuildDir, moduleChunksBuildDirChunk);
        const moduleMainBuildPath = resolve(moduleBuildDir, moduleMainBuidFileName);
        const moduleLibBuildPath = resolve(moduleBuildDir, moduleLibBuidFileName);
        const moduleArchivePath = resolve(moduleBuildDir, moduleArchiveFileName);

        if (await fs.pathExists(libEntry) || await fs.pathExists(moduleLibBuildPath)) {
            // module has been bundled is some other chain of recursive calls
            return moduleBuildDir;
        }

        console.log(colors.cyan(`Cromwella:bundler: ${colors.brightCyan('Starting')} to build module: ${colors.brightCyan(`"${moduleName}"`)} from path: ${modulePath}`));
        let imports = '';

        try {
            await makeEmptyDir(moduleBuildDir, { recursive: true });
        } catch (e) {
            console.error('Failed to make dir: ' + moduleBuildDir, e);
            return moduleBuildDir;
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


            const exportContentPath = resolve(exportsGeneratedPath,
                exportKey + '_' + cryptoRandomString({ length: 5 }), 'index.js');

            imports += makeImportString(exportKey, moduleName, exportContentPath, modulePath, saveAsModules);

            if (jsOperators.includes(exportKey)) return;

            const importStr = importType === 'default' ? exportKey : `{${exportKey}}`;
            const exportContent = `
                import ${importStr} from '${exportPath}'
                export default ${exportKey};
                `;

            await mkdirp(dirname(exportContentPath));
            await fs.writeFile(exportContentPath, exportContent);
        }

        const exportKeys = getModuleInfo(moduleName, moduleVer, buildDir)?.exportKeys;

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

        const interopDefaultContent = `
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

            ${interopDefaultContent}

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
        const nodeContent = `
            import * as defaultImport from '${modulePath}'
            const moduleName = '${moduleName}';
            
            ${interopDefaultContent}

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
                ${getGlobalModuleStr(moduleName)} = interopDefault(defaultImport, 'default');
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

        parsingWebpackConfig.plugins = [
            new CromwellWebpackPlugin({
                usedExternals,
                filteredUsedExternals,
                configuredExternals,
                moduleBuiltins,
                moduleName,
                moduleVer,
                modulePackageJson,
                buildDir,
                packageExternals,
                metaInfoPath
            })
        ];

        let moduleStats: any[] = [];

        const shouldLogBuild = false;

        const compiler = webpack(parsingWebpackConfig);


        compiler.hooks.shouldEmit.tap('CromwellaBundlerPlugin', (compilation) => {
            return false;
        });

        await new Promise((done) => {
            compiler.run(async (err, stats) => {

                const hasErrors = stats?.hasErrors();
                const existMetaInfo = fs.existsSync(metaInfoPath);
                if (hasErrors === false && !err && existMetaInfo) {
                    console.log(colors.cyan('Cromwella:bundler: Parsed imports for module: ' + moduleName));
                } else {
                    console.log(colors.brightRed('Cromwella:bundler: Failed to parse imports for module: ' + moduleName));
                    console.log('stats.hasErrors()', hasErrors, 'err', err, 'fs.existsSync(metaInfoPath)', existMetaInfo);
                    console.log('usedExternals', usedExternals);
                    if (err) console.error(err);
                    if (stats) console.log(stats.toString({ colors: true }));
                }

                done(true);
            });
        });

        // Check if found used node_modules that weren't included in package.json
        // and hence weren't marked as externals in webpack config. 
        const notIncludedExts: Record<string, string[]> = {};
        Object.keys(usedExternals).forEach(used => {
            if (!packageExternals.includes(used)) {
                notIncludedExts[used] = usedExternals[used];
            }
        });

        if (Object.keys(notIncludedExts).length > 0) {
            console.log(colors.brightYellow(`Cromwella:bundler: Found used node_modules of ${moduleName} that weren't included in package.json or cromwella.json : ${Object.keys(notIncludedExts).join(', ')}. More info in bundle.info.json (bundledDependencies)`));
            console.log(colors.brightYellow(`Cromwella:bundler: All listed modules will be bundled with ${moduleName} and hence not reusable for other modules. This may cause bloating of bundles. Please configure encountered modules as externals.`));
        }

        const bundleInfo: TBundleInfo = {
            bundledDependencies: notIncludedExts
        }


        // 2. SECOND BUILD PASS
        // Build module for web.

        // console.log(JSON.stringify(webpackConfig.externals, null, 2));
        const makeConfig = (templateConfig, templateLibEntry, useGlobals: boolean): Configuration => {
            const webpackConfig = Object.assign({}, templateConfig);
            webpackConfig.output = Object.assign({}, templateConfig.output);
            webpackConfig.entry = templateLibEntry;
            webpackConfig.output!.library = moduleName.replace(/\W/g, '_');
            webpackConfig.output!.path = resolve(moduleBuildDir);

            if (!isProduction) {
                // webpackConfig.devtool = 'cheap-source-map';
                webpackConfig.devtool = false;
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
            })), ...configuredExternals.map(ext => {
                let extStr;
                if (ext.usedName) extStr = `root ${getGlobalModuleStr(ext.usedName)}`;
                if (ext.moduleName && ext.importName) {
                    extStr = `root ${getGlobalModuleStr(ext.moduleName)}['${ext.importName}']`;
                }
                if (ext.moduleName && !ext.importName) {
                    extStr = `root ${getGlobalModuleStr(ext.moduleName)}`;
                }
                if (extStr) {
                    return {
                        [ext.usedName]: useGlobals ? extStr : `commonjs ${ext.usedName}`
                    }
                };
                return {};
            })
            );

            return webpackConfig;
        }

        const webpackConfig = makeConfig(webWebpackConfig, libEntry, true);

        webpackConfig.output!.publicPath = `/${bundledModulesDirName}/${moduleName}@${modulePackageJson.version}/`;

        const buildCompiler = webpack(webpackConfig);

        let webChunksSuccess = false;
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
                    webChunksSuccess = true;

                } else {
                    console.log(colors.brightRed('Cromwella:bundler: Failed to built module for web: ' + moduleName));
                    if (err) console.error(err);
                    if (stats) console.error(stats?.toString({ colors: true }));
                }
                // console.log(stats?.toString({ colors: true }))
                done(true);
            });
        })



        // Additional one-chunk build
        const webpackSingleConfig = makeConfig(webWebpackConfig, nodeLibEntry, true);
        webpackSingleConfig.output!.publicPath = `/${bundledModulesDirName}/${moduleName}@${modulePackageJson.version}/`;
        webpackSingleConfig!.output!.filename = moduleLibBuidFileName;
        webpackSingleConfig!.optimization = undefined;
        const singlebuildCompiler = webpack(webpackSingleConfig);

        await new Promise((done) => {

            singlebuildCompiler.run(async (err, stats) => {

                if (stats && !stats.hasErrors() && !err && fs.existsSync(moduleMainBuildPath)) {
                    console.log(colors.brightGreen('Cromwella:bundler: Successfully built one-chunk module for web: ' + moduleName));
                } else {
                    console.log(colors.brightRed('Cromwella:bundler: Failed to built one-chunk module for web: ' + moduleName));
                    if (err) console.error(err);
                    if (stats) console.error(stats?.toString({ colors: true }));
                }
                // console.log(stats?.toString({ colors: true }))
                done(true);
            });

        });



        // BUNDLE ANALYZE
        const chunkSizes: number[] = [];
        if (await fs.pathExists(chunksDir)) {
            const chunks = await fs.readdir(chunksDir);
            for (const name of chunks) {
                const chunkPath = resolve(chunksDir, name);
                if (/\.m?js$/.test(chunkPath)) {
                    const size = (await fs.stat(chunkPath)).size;
                    chunkSizes.push(size);
                }
            }
        }
        const libSize = (await fs.stat(moduleLibBuildPath)).size;
        const importerSize = (await fs.stat(moduleMainBuildPath)).size;
        const maxChunkSize = chunkSizes.length > 0 ? Math.max(...chunkSizes) : null;
        const chunksSumSize = chunkSizes.length > 0 ? chunkSizes.reduce((a, b) => a + b) : 0;
        // console.log(libSize, maxChunkSize, chunksSumSize, importerSize);

        let shouldAlwaysImportDefault = false;
        if (!maxChunkSize) {
            shouldAlwaysImportDefault = true;
        } else {
            if (0.9 * libSize < maxChunkSize + importerSize) {
                shouldAlwaysImportDefault = true;
            }
        }


        const metaInfoContent: TSciprtMetaInfo = await fs.readJSON(metaInfoPath);
        metaInfoContent.import = shouldAlwaysImportDefault ? 'lib' : 'chunks';
        await fs.writeFile(metaInfoPath, JSON.stringify(metaInfoContent, null, 4));

        bundleInfo.libSize = libSize;
        bundleInfo.importerSize = importerSize;
        bundleInfo.maxChunkSize = maxChunkSize;
        bundleInfo.chunksSumSize = chunksSumSize;

        // 3. THIRD BUILD PASS
        // Build module for Node.js.
        const nodeWebpackConfig = makeConfig(nodeWebpackConfigTemplate, nodeLibEntry, false);

        const nodeBuildCompiler = webpack(nodeWebpackConfig);

        await new Promise((done) => {

            nodeBuildCompiler.run(async (err, stats) => {

                if (stats && !stats.hasErrors() && !err && fs.existsSync(resolve(moduleBuildDir, moduleNodeBuidFileName))) {
                    console.log(colors.brightGreen('Cromwella:bundler: Successfully built module for Node.js: ' + moduleName));
                } else {
                    console.log(colors.brightRed('Cromwella:bundler: Failed to built module for Node.js: ' + moduleName));
                    if (err) console.error(err);
                    if (stats) console.error(stats?.toString({ colors: true }));
                }
                // console.log(stats?.toString({ colors: true }))
                done(true);
            });

        });

        // Build required modules recursively
        const bundledDepsPaths: string[] = [];
        if (webChunksSuccess) {
            if (Object.keys(filteredUsedExternals).length > 0) {
                console.log(colors.cyan(`Cromwella:bundler: Starting to build following used dependencies of module ${moduleName}: ${Object.keys(filteredUsedExternals).join(', ')}`));
                // console.log('collectedDependencies', collectedDependencies)
                for (const ext of Object.keys(filteredUsedExternals)) {
                    const version = collectedDependencies[ext];
                    if (version) {
                        const buildPath = await bundleNodeModuleRecursive(ext, version);
                        if (buildPath) bundledDepsPaths.push(buildPath);
                    }
                }
                console.log(colors.cyan(`Cromwella:bundler: All dependencies of module ${moduleName} has been built`));
            }
        }

        // Optimize meta bindings
        for (const depPath of bundledDepsPaths) {
            const depName = normalizePath(depPath).replace(normalizePath(buildDir) + '/', '');
            const depMetaPath = resolve(depPath, moduleMetaInfoFileName);
            // If dependency can be imported only as a whole, mark it as 'default' in meta of this module
            const depMetaInfo: TSciprtMetaInfo = await fs.readJSON(depMetaPath);
            if (depMetaInfo) {
                if (depMetaInfo.import === 'lib' && metaInfoContent.externalDependencies[depName]) {
                    metaInfoContent.externalDependencies[depName] = ['default'];
                }
            }

            // Add and/or merge dependency's dependencies into meta of this module
            const depExts = depMetaInfo.externalDependencies;
            const thisExts = metaInfoContent.externalDependencies;
            for (const depDepName of Object.keys(depExts)) {
                if (thisExts[depDepName]?.includes('default')) continue;

                const bindings = depExts[depDepName];
                if (!thisExts[depDepName])
                    thisExts[depDepName] = bindings;
                else {
                    bindings.forEach(usedKey => {
                        if (!thisExts[depDepName].includes(usedKey)) {
                            thisExts[depDepName].push(usedKey);
                        }
                    });
                    if (thisExts[depDepName].includes('default'))
                        thisExts[depDepName] = ['default'];
                }
            }
        }

        await fs.writeFile(metaInfoPath, isProduction ?
            JSON.stringify(metaInfoContent) : JSON.stringify(metaInfoContent, null, 4));
        await fs.writeFile(bundleInfoPath, JSON.stringify(bundleInfo, null, 4));


        // Cleanup generated
        if (isProduction) {
            if (await fs.pathExists(nodeLibEntry)) await fs.remove(nodeLibEntry);
            if (await fs.pathExists(libEntry)) await fs.remove(libEntry);
            if (await fs.pathExists(exportsGeneratedPath)) await fs.remove(exportsGeneratedPath);

            if (metaInfoContent.import === 'lib') {
                if (await fs.pathExists(chunksDir)) await fs.remove(chunksDir);
                if (await fs.pathExists(moduleMainBuildPath)) await fs.remove(moduleMainBuildPath);
            }
        }

        // Zip it
        const tempZipPath = resolve(buildDir, moduleArchiveFileName);
        const output = fs.createWriteStream(tempZipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        archive.pipe(output);
        archive.directory(moduleBuildDir, '/');
        await archive.finalize();

        await fs.move(tempZipPath, moduleArchivePath);


        console.log(colors.cyan(`Cromwella:bundler: Module: ${colors.brightCyan(`"${moduleName}"`)} has been ${colors.brightCyan('processed')}`));

        return moduleBuildDir;
    }

    for (const module of frontendDependencies) {
        if (module.version)
            await bundleNodeModuleRecursive(module.name, module.version);
    }

}

export const webWebpackConfig: Configuration = {
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
            minRemainingSize: 20000,
            chunks: 'all',
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
    // // Webpack 5:
    resolve: {
        fallback: {
            "https": false,
            'http': false,
            'stream': false,
            'tty': false,
            'net': false,
            'fs': false
        }
    },
    node: false,
    stats: 'errors-only'
    // stats: 'normal'
};

export const nodeWebpackConfigTemplate: Configuration = {
    target: 'node',
    output: {
        filename: moduleNodeBuidFileName,
        libraryTarget: 'commonjs2',
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
    resolve: {
        extensions: [".js", ".mjs"]
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
            },
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

