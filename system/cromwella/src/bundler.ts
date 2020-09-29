import { TPackage, TDependency, THoistedDeps, TNonHoisted, TLocalSymlink, TCromwellaConfig, TAdditionalExports } from './types';
import { globPackages, getCromwellaConfigSync } from './shared';
import { buildDirChunk, jsOperators, moduleMainBuidFileName, moduleMetaInfoFileName } from './constants';
import fs from 'fs';
import { sync as rimraf } from 'rimraf';
import { sync as mkdirp } from 'mkdirp';
import colorsdef from 'colors/safe';
const colors: any = colorsdef;
import { resolve, dirname, isAbsolute } from 'path';
//@ts-ignore
import webpack, { Configuration } from 'webpack';

/**
 * Cromwella Bundler
 * Bundles frontend node_modules
 */

const isExternalForm = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);

const getGlobalModuleStr = (moduleName: string) => `CromwellStore.nodeModules.modules['${moduleName}']`;

export const bundler = (projectRootDir: string, installationMode: string,
    isProduction: boolean, forceInstall: boolean) => {

    const tempDir = resolve(projectRootDir, '.cromwell');
    const buildDir = resolve(tempDir, buildDirChunk);
    const moduleChunksBuildDirChunk = 'chunks';
    const moduleGeneratedFileName = 'generated.js';
    const moduleExportsDirChunk = 'generated';

    const cromwellaConfig = getCromwellaConfigSync(projectRootDir);

    const commonWebpackConfig: Configuration = {
        mode: isProduction ? 'production' : 'development',
        target: 'web',
        output: {
            filename: moduleMainBuidFileName,
            chunkFilename: moduleChunksBuildDirChunk + '/[name].bundle.js',
            path: buildDir,
            libraryTarget: 'var'
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
                    test: /\.m?js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: ["transform-commonjs"]
                        }
                    }
                },
                {
                    test: /\.css$/i,
                    use: [
                        { loader: 'style-loader' },
                        {
                            loader: 'css-loader', options: {
                                sourceMap: true
                            }
                        }
                    ],
                }
            ]
        },
        node: {
            fs: 'empty'
        }
        // stats: 'errors-only'
    };

    globPackages(projectRootDir, isProduction, forceInstall, async (packages: TPackage[],
        hoistedDependencies: THoistedDeps,
        hoistedDevDependencies: THoistedDeps) => {


        if (fs.existsSync(buildDir)) {
            rimraf(buildDir);
        }
        mkdirp(buildDir);

        // Collect frontendDependencies from all packages 
        const frontendDependencies = cromwellaConfig?.frontendDependencies ?? [];

        packages.forEach(pckg => {
            if (pckg.path) {
                const cromwellConfigPath = resolve(dirname(pckg.path), 'cromwell.config.json');
                if (fs.existsSync(cromwellConfigPath)) {
                    let pckgConfig;
                    try {
                        pckgConfig = JSON.parse(fs.readFileSync(cromwellConfigPath).toString());
                    } catch (e) {
                        console.log(e);
                    }

                    if (pckgConfig && pckgConfig.frontendDependencies && Array.isArray(pckgConfig.frontendDependencies)) {
                        console.log('cromwellConfigPath', cromwellConfigPath);
                        pckgConfig.frontendDependencies.forEach(dep => {
                            if (!frontendDependencies.includes(dep)) {
                                frontendDependencies.push(dep);
                            }
                        })

                    }


                }
            }
        });

        const moduleExternals: Record<string, string[]> = {};
        const moduleBuiltins: Record<string, string[]> = {};
        const modulesExcludeExports: Record<string, string[]> = {};
        const modulesAdditionalExports: Record<string, TAdditionalExports[]> = {};

        frontendDependencies.forEach(dep => {
            if (typeof dep === 'object') {
                if (dep.builtins) {
                    moduleBuiltins[dep.name] = dep.builtins;
                }
                if (dep.externals) {
                    moduleBuiltins[dep.name] = dep.externals;
                }
                if (dep.excludeExports) {
                    modulesExcludeExports[dep.name] = dep.excludeExports;
                }
                if (dep.addExports) {
                    modulesAdditionalExports[dep.name] = dep.addExports;
                }
            }
        })

        let imports = '';

        const addImport = (namedImport: string, moduleName: string, path: string, saveAsModules?: string[]) => {
            let importPath = path.replace(/\\/g, '/');
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
                importPath = require.resolve(moduleName).replace(/\\/g, '/');
                globalPropName = 'default';
            }

            imports += `
            '${importerKey}': () => {
                startImport(() => {
                    handleImport(import('${importPath}'), '${globalPropName}' ${saveAsModulesStr});
                });
            },
            `;
        }

        console.log(colors.cyan(`Cromwella:bundler: Found ${frontendDependencies.length} frontend modules to build: ${frontendDependencies.join(', ')}\n`));

        const modulesExportKeys: Record<string, string[]> = {};
        const getModuleExportKeys = (moduleName: string): string[] | undefined => {
            let exportKeys: string[] | undefined;
            if (!modulesExportKeys[moduleName]) {
                try {
                    let imported = require(moduleName);
                    exportKeys = Object.keys(imported);
                    if (!exportKeys.includes('default')) exportKeys.unshift('default');
                    modulesExportKeys[moduleName] = exportKeys;
                } catch (e) {
                    modulesExportKeys[moduleName] = [];
                    console.log(colors.brightYellow(`Cromwella:bundler: Failed to require() module: ${moduleName}`));
                }
            } else {
                exportKeys = modulesExportKeys[moduleName];
            }
            return exportKeys;
        }

        const bundleNodeModuleRecursive = async (moduleName: string) => {
            let modulePath: string | undefined;
            try {
                modulePath = require.resolve(moduleName).replace(/\\/g, '/');
            } catch (e) {
                console.log(colors.brightYellow('Cromwella:bundler: required module ' + moduleName + ' is not found'));
            }

            const moduleBuildDir = resolve(buildDir, moduleName);
            const libEntry = resolve(moduleBuildDir, moduleGeneratedFileName);

            if (fs.existsSync(libEntry)) {
                // module has been bundled is some other chain of recursive calls
                return;
            }

            console.log(colors.brightCyan(`Cromwella:bundler: Starting build module: ${moduleName} from path: ${modulePath}`));

            mkdirp(moduleBuildDir);

            imports = '';


            // Create a file for each export so webpack could make chunks for each export
            const handleExportKey = (exportKey: string, exportPath: string, importType?: 'default' | 'named', saveAsModules?: string[]) => {
                const excludeExports = modulesExcludeExports[moduleName];
                if (excludeExports && excludeExports.includes(exportKey)) return;


                const exportContentPath = resolve(moduleBuildDir, moduleExportsDirChunk, exportKey);
                addImport(exportKey, moduleName, exportContentPath, saveAsModules);

                if (jsOperators.includes(exportKey)) return;

                const importStr = importType === 'default' ? exportKey : `{${exportKey}}`;
                const exportContent = `
                import ${importStr} from '${exportPath}'
                export default ${exportKey};
                `;

                mkdirp(exportContentPath);
                fs.writeFileSync(resolve(exportContentPath, 'index.js'), exportContent);
            }

            const exportKeys = getModuleExportKeys(moduleName);

            if (exportKeys && modulePath) {
                console.log(colors.cyan(`Cromwella:bundler: Found ${exportKeys.length} exports for module ${moduleName}`));

                for (const exportKey of exportKeys) {
                    handleExportKey(exportKey, modulePath);
                }
            }

            const aditionalExports = modulesAdditionalExports[moduleName];
            if (aditionalExports) {
                aditionalExports.forEach(key => {
                    const path = key.path ?? modulePath;
                    if (path) handleExportKey(key.name, path, key.importType, key.saveAsModules)
                });
            }

            // Get package.json to set all Dependencies as external and then transpile them same way
            const packageExternals: string[] = [];
            if (moduleExternals[moduleName]) {
                moduleExternals[moduleName].forEach(ext => packageExternals.push(ext));
            }

            try {
                const moduleJson = require(`${moduleName}/package.json`);
                if (!moduleJson) throw moduleJson;

                if (moduleJson.dependencies) {
                    Object.keys(moduleJson.dependencies).forEach(depName => {
                        packageExternals.push(depName);
                    })
                }
                if (moduleJson.peerDependencies) {
                    Object.keys(moduleJson.peerDependencies).forEach(depName => {
                        packageExternals.push(depName);
                    })
                }
            } catch (e) {
                console.error(colors.brightYellow('Cromwella:bundler:: Failed to read package.json dependencies of module: ' + moduleName));
            }


            let content = `
            const moduleName = '${moduleName}';
            const _interopDefaultLegacy = (lib) => {
                if (lib && typeof lib === 'object' && 'default' in lib &&
                    Object.keys(lib).length === 1) {
                    return lib.default;
                }
                return lib;
            }

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

            if (!CromwellStore.nodeModules.imports) CromwellStore.nodeModules.imports = {};
            if (!CromwellStore.nodeModules.modules) CromwellStore.nodeModules.modules = {};
            if (!${getGlobalModuleStr(moduleName)}) {
                const module = {};
                ${getGlobalModuleStr(moduleName)} = module;
                // ${getGlobalModuleStr(moduleName)}.default = module 
            }

            // If we once used 'default' import (which is whole lib), don't let it to make any other imports
            let didDefaultImport = false;

            const startImport = (cb) => {
                if (didDefaultImport) return;
                cb();
            }

            const handleImport = ((promise, importName, saveAsModules) => {
                if (didDefaultImport) return;
                if (importName === 'default') {
                    didDefaultImport = true;
                }
                promise.then(lib => {
                    if (importName === 'default') {
                        CromwellStore.nodeModules.modules[moduleName] = _interopDefaultLegacy(lib);
                    } else {
                        if (didDefaultImport) return;
                        CromwellStore.nodeModules.modules[moduleName][importName] = _interopDefaultLegacy(lib);
                    }
                    if (saveAsModules && Array.isArray(saveAsModules)) {
                        saveAsModules.forEach(modName => {
                            CromwellStore.nodeModules.modules[modName] = _interopDefaultLegacy(lib);
                        })
                    }
                })
            })

            CromwellStore.nodeModules.imports['${moduleName}'] = {
                ${imports}
            }
            `;

            fs.writeFileSync(libEntry, content);


            // console.log(JSON.stringify(webpackConfig.externals, null, 2));
            const webpackConfig = Object.assign({}, commonWebpackConfig);
            webpackConfig.output = Object.assign({}, commonWebpackConfig.output);
            webpackConfig.entry = libEntry;
            webpackConfig.output!.library = moduleName.replace(/\W/g, '_');
            webpackConfig.output!.path = resolve(moduleBuildDir);
            webpackConfig.output!.publicPath = `/${buildDirChunk}/${moduleName}/`;


            // { [moduleName]: namedExports }
            const usedExternals: Record<string, string[]> = {};

            let moduleStats: any[] = [];

            const shouldLogBuild = false;


            const runCompiler = async (externals: string[], shouldBuildExternals: boolean) => {
                webpackConfig.externals = Object.assign({}, ...externals.map(ext => ({
                    [ext]: `${getGlobalModuleStr(ext)}`
                })));
                // console.log('externals', externals);
                const compiler = webpack(webpackConfig);

                if (shouldBuildExternals) {
                    // Decryption of webpack's actually used modules to define externals list
                    compiler.hooks.normalModuleFactory.tap('CromwellaBundlerPlugin', factory => {
                        factory.hooks.parser.for('javascript/auto').tap('CromwellaBundlerPlugin', (parser, options) => {
                            parser.hooks.importSpecifier.tap('CromwellaBundlerPlugin', (statement, source: string, exportName: string, identifierName: string) => {

                                if (!isExternalForm(source)) return;

                                if (moduleBuiltins[moduleName] && moduleBuiltins[moduleName].includes(source)) return;

                                const exportKeys = getModuleExportKeys(source);

                                if (!exportName && identifierName && exportKeys) {
                                    if (exportKeys.includes(identifierName)) exportName = identifierName;
                                    else exportName = 'default';
                                }
                                // if (source === 'react-dom' && moduleName === '@material-ui/core') console.log('react-dom', source, exportName, identifierName, JSON.stringify(statement, null, 2));

                                if (!exportKeys || exportKeys.length === 0) return;

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
                            });
                        });
                    });
                }

                await new Promise((done) => {

                    compiler.run(async (err, stats) => {

                        if (shouldLogBuild) {
                            // const jsonStats = stats?.toString({ colors: true });
                            // console.log(jsonStats);

                            const jsonStatsPath = resolve(moduleBuildDir, 'build_stats.json');
                            fs.writeFileSync(jsonStatsPath, JSON.stringify(moduleStats, null, 4));
                        }

                        // Optimize used externals:
                        // If has "default" key with any other, leave only "default"
                        Object.keys(usedExternals).forEach(extName => {
                            if (usedExternals[extName].includes('default')) {
                                usedExternals[extName] = ['default'];
                            }
                        });
                        // If imported more than 80% of keys, replace them by one "default"
                        Object.keys(usedExternals).forEach(extName => {
                            if (usedExternals[extName].length > modulesExportKeys[extName].length * 0.8) {
                                usedExternals[extName] = ['default'];
                            }
                        });

                        // Used from package.json
                        const filteredUsedExternals = {};
                        Object.keys(usedExternals).forEach(extName => {
                            if (packageExternals.includes(extName)) {
                                filteredUsedExternals[extName] = usedExternals[extName];
                            }
                        })

                        // Create meta info file with actually used dependencies
                        const metaInfoPath = resolve(moduleBuildDir, moduleMetaInfoFileName);
                        const metaInfoContent = { externalDependencies: filteredUsedExternals };
                        fs.writeFileSync(metaInfoPath, JSON.stringify(metaInfoContent, null, 4));

                        if (!stats.hasErrors() && !err && fs.existsSync(resolve(moduleBuildDir, moduleMainBuidFileName))) {
                            console.log(colors.brightGreen('Cromwella:bundler: Successfully built module: ' + moduleName));
                            // console.log(colors.cyan('usedExternals: \n' + JSON.stringify(usedExternals, null, 4)));
                            if (shouldBuildExternals && Object.keys(filteredUsedExternals).length > 0) {
                                console.log(colors.cyan(`Cromwella:bundler: Starting to build following used dependencies of module ${moduleName}: ${Object.keys(filteredUsedExternals).join(', ')}`));
                                for (const ext of Object.keys(filteredUsedExternals)) {
                                    await bundleNodeModuleRecursive(ext);
                                }
                                console.log(colors.cyan(`Cromwella:bundler: All dependencies of module ${moduleName} has been built`));
                            }
                        } else {
                            console.log(colors.brightRed('Cromwella:bundler: Failed to built module: ' + moduleName));
                            if (err) console.error(err)
                            if (stats) console.error(stats?.toString({ colors: true }))
                        }
                        // console.log(stats?.toString({ colors: true }))
                        done();
                    });

                })
            }

            await runCompiler(packageExternals, true);

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
                console.log(colors.brightYellow(`Cromwella:bundler: All listed modules have been bundled with ${moduleName} and hence are not reusable for other modules. This may cause bloating of bundles. Please configure encountered externals.`));

                // // Run build second time with newly found externals: (probably don't need that)
                // console.log(colors.cyan(`Cromwella:bundler: Runnig build for second time to build with the new externals`));
                // rimraf(resolve(moduleBuildDir, moduleChunksBuildDirChunk));
                // rimraf(resolve(moduleBuildDir, moduleMainBuidFileName));
                // await runCompiler([...packageExternals, ...notIncludedExts], false);
            }

            console.log(colors.brightCyan(`Cromwella:bundler: Module: ${moduleName} has been processed`));

        }

        for (const module of frontendDependencies) {
            if (typeof module === 'object') {
                await bundleNodeModuleRecursive(module.name);

            } else {
                await bundleNodeModuleRecursive(module);
            }
        }
    });
}



function cleanStringify(object) {
    if (object && typeof object === 'object') {
        object = copyWithoutCircularReferences([object], object);
    }
    return JSON.stringify(object);
    function copyWithoutCircularReferences(references, object) {
        var cleanObject = {};
        Object.keys(object).forEach(function (key) {
            var value = object[key];
            if (value && typeof value === 'object') {
                if (references.indexOf(value) < 0) {
                    references.push(value);
                    cleanObject[key] = copyWithoutCircularReferences(references, value);
                    references.pop();
                } else {
                    cleanObject[key] = '###_Circular_###';
                }
            } else if (typeof value !== 'function') {
                cleanObject[key] = value;
            }
        });
        return cleanObject;
    }
}
