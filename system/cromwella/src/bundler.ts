import { TPackage, TDependency, THoistedDeps, TNonHoisted, TLocalSymlink } from './types';
import { globPackages, getCromwellaConfigSync } from './shared';
import { buildDirChunk, jsOperators } from './constants';
import fs from 'fs';
import { sync as rimraf } from 'rimraf';
import { sync as mkdirp } from 'mkdirp';
import colors from 'colors/safe';
import { resolve, dirname } from 'path';
//@ts-ignore
import webpack, { Configuration } from 'webpack';


/**
 * Cromwella Bundler
 * Bundles frontend node_modules
 */

const isExternalForm = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');

const getGlobalModuleStr = (moduleName: string) => `CromwellStore.nodeModules.modules['${moduleName}']`;

export const bundler = (projectRootDir: string, installationMode: string,
    isProduction: boolean, forceInstall: boolean) => {

    const tempDir = resolve(projectRootDir, '.cromwell');
    const buildDir = resolve(tempDir, buildDirChunk);

    const cromwellaConfig = getCromwellaConfigSync(projectRootDir);

    const webpackConfig: Configuration = {
        mode: isProduction ? 'production' : 'development',
        target: 'web',
        output: {
            filename: 'main.bundle.js',
            chunkFilename: '[name].bundle.js',
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

        let imports = '';

        const addImport = (namedImport: string, moduleName: string, path: string) => {
            path = path.replace(/\\/g, '/');

            // Properties exported via "module.exports" can be the same as JS operators, we cannot code-split them
            // with current implementation via "import { prop } from '...';"
            // so just replace for 'default' to include whole lib instead.
            if (jsOperators.includes(namedImport)) {
                path = require.resolve(moduleName).replace(/\\/g, '/');
                imports += `
                '${namedImport}': () => {
                    startImport(() => {
                        handleImport(import('${path}'), 'default');
                    });
                },
                `;
                return;
            }

            imports += `
            '${namedImport}': () => {
                startImport(() => {
                    handleImport(import('${path}'), '${namedImport}');
                });
            },
            `;
        }

        console.log(colors.cyan(`Cromwella:bundler: Found ${frontendDependencies.length} frontend modules to build: ${frontendDependencies.join(', ')}\n`));

        const modulesExportKeys: Record<string, string[]> = {};

        const bundleNodeModuleRecursive = async (moduleName: string) => {
            let modulePath: string;
            try {
                modulePath = require.resolve(moduleName).replace(/\\/g, '/');
                console.log(colors.cyan(`Cromwella:bundler: Starting build module: ${moduleName} from path: ${modulePath}`));
            } catch (e) {
                console.error('Cromwella:bundler: required module ' + moduleName + ' is not found');
                return;
            }
            const moduleBuildDir = resolve(buildDir, moduleName);
            if (fs.existsSync(moduleBuildDir)) {
                // module has been bundled is some other chain of recursive calls
                return;
            }

            mkdirp(moduleBuildDir);

            imports = '';
            addImport('default', moduleName, modulePath);

            let exportKeys: string[] = [];
            // Create a file for each export so webpack could make chunks for each export
            try {
                if (!modulesExportKeys[moduleName]) {
                    let imported = require(moduleName);
                    exportKeys = Object.keys(imported);
                    modulesExportKeys[moduleName] = exportKeys;
                } else {
                    exportKeys = modulesExportKeys[moduleName];
                }

                console.log(colors.cyan(`Cromwella:bundler: found ${exportKeys.length} exports for module ${moduleName}`));

                exportKeys.forEach(exportKey => {
                    if (exportKey === 'default') return;

                    const exportContentPath = resolve(moduleBuildDir, exportKey);
                    addImport(exportKey, moduleName, exportContentPath);

                    if (jsOperators.includes(exportKey)) return;

                    const exportContent = `
                    import {${exportKey}} from '${modulePath}'
                    export default ${exportKey};
                    `;

                    mkdirp(exportContentPath);
                    fs.writeFileSync(resolve(exportContentPath, 'index.js'), exportContent);
                })
            } catch (e) { console.log('Cromwella:bundler:', moduleName, 'failed to require'); }


            // Get package.json to set all Dependencies as external and then transpile them same way
            const externals: string[] = [];

            try {
                const moduleJson = require(`${moduleName}/package.json`);
                if (!moduleJson) throw moduleJson;

                if (moduleJson.dependencies) {
                    Object.keys(moduleJson.dependencies).forEach(depName => {
                        externals.push(depName);
                    })
                }
                if (moduleJson.peerDependencies) {
                    Object.keys(moduleJson.peerDependencies).forEach(depName => {
                        externals.push(depName);
                    })
                }
            } catch (e) {
                console.error('Cromwella:bundler:: Failed to read dependencies of module: ' + moduleName);
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
            if (!${getGlobalModuleStr(moduleName)}) ${getGlobalModuleStr(moduleName)} = {};

            // If we once used 'default' import (which is whole lib), don't let it to make any other imports
            let didDefaultImport = false;

            const startImport = (cb) => {
                if (didDefaultImport) return;
                cb();
            }

            const handleImport = ((promise, importName) => {
                if (didDefaultImport) return;
                if (importName === 'default') {
                    didDefaultImport = true;
                }
                promise.then(lib => {
                    if (importName === 'default') {
                        CromwellStore.nodeModules.modules[moduleName] = _interopDefaultLegacy(lib);
                    } else {
                        CromwellStore.nodeModules.modules[moduleName][importName] = _interopDefaultLegacy(lib);
                    }
                })
            })

            CromwellStore.nodeModules.imports['${moduleName}'] = {
                ${imports}
            }
            `;

            const libEntry = resolve(moduleBuildDir, 'generated.js');
            fs.writeFileSync(libEntry, content);



            webpackConfig.externals = Object.assign({}, ...externals.map(ext => ({
                [ext]: `${getGlobalModuleStr(ext)}`
            })));
            // console.log(JSON.stringify(webpackConfig.externals, null, 2));

            webpackConfig.entry = libEntry;
            webpackConfig.output!.library = moduleName.replace(/\W/g, '_');
            webpackConfig.output!.path = moduleBuildDir;
            webpackConfig.output!.publicPath = `/${buildDirChunk}/${moduleName}/`;
            const compiler = webpack(webpackConfig);

            // { [moduleName]: namedExports }
            const usedExternals: Record<string, string[]> = {};

            let moduleStats: any[] = [];

            const shouldLogBuild = false;


            // Decryption of webpack's actually used modules (externals)
            compiler.hooks.normalModuleFactory.tap('CromwellaBundlerPlugin', factory => {
                factory.hooks.parser.for('javascript/auto').tap('CromwellaBundlerPlugin', (parser, options) => {
                    parser.hooks.importSpecifier.tap('CromwellaBundlerPlugin', (statement, source, exportName, identifierName) => {
                        if (!externals.includes(source)) return;

                        if (!modulesExportKeys[source]) {
                            let imported = require(source);
                            modulesExportKeys[source] = Object.keys(imported);
                        }

                        if (!usedExternals[source]) usedExternals[source] = [];

                        if (exportName && modulesExportKeys[source].includes(exportName) &&
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


            await new Promise((done) => {

                compiler.run(async (err, stats) => {

                    if (shouldLogBuild) {
                        const jsonStats = stats?.toString({ colors: true });
                        console.log(jsonStats);


                        const jsonStatsPath = resolve(moduleBuildDir, 'build_stats.json');
                        fs.writeFileSync(jsonStatsPath, JSON.stringify(moduleStats, null, 4));

                        console.log('externals', externals);
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


                    // Create meta info file with actually used dependencies
                    const metaInfoPath = resolve(moduleBuildDir, 'meta.json');
                    const metaInfoContent = { externalDependencies: usedExternals };
                    fs.writeFileSync(metaInfoPath, JSON.stringify(metaInfoContent, null, 4));


                    if (stats.hasErrors()) {
                        console.log(colors.red('Cromwella:bundler: Failed to built module: ' + moduleName));
                        console.error(stats?.toString({ colors: true }))
                    } else {
                        console.log(colors.green('Cromwella:bundler: Successfully built module: ' + moduleName));
                        // console.log(colors.cyan('usedExternals: \n' + JSON.stringify(usedExternals, null, 4)));
                        if (usedExternals && Object.keys(usedExternals).length > 0) {
                            console.log(colors.cyan(`Cromwella:bundler: starting to build following used dependencies of module ${moduleName}: ${Object.keys(usedExternals).join(', ')}`));
                            for (const ext of Object.keys(usedExternals)) {
                                await bundleNodeModuleRecursive(ext);
                            }
                        }
                    }
                    done();
                });

            })
        }

        for (const moduleName of frontendDependencies) {
            await bundleNodeModuleRecursive(moduleName);
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
