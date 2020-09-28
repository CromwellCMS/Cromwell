import { TPackage, TDependency, THoistedDeps, TNonHoisted, TLocalSymlink } from './types';
import { getHoistedDependencies } from './shared';
import fs from 'fs';
import { sync as rimraf } from 'rimraf';
import { sync as mkdirp } from 'mkdirp';
import { resolve } from 'path';
//@ts-ignore
import webpack, { Configuration } from 'webpack';

const isExternalForm = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');

const getGlobalModuleStr = (moduleName: string) => `CromwellStore.nodeModules.modules['${moduleName}']`;

export const bundler = (projectRootDir: string, installationMode: string,
    isProduction: boolean, forceInstall: boolean) => {


    const tempDir = resolve(projectRootDir, '.cromwell');
    const buildChunk = 'bundle';
    const buildDir = resolve(tempDir, buildChunk);
    const bundleEntry = resolve(projectRootDir, '.cromwell/bundle/main.js');

    const webpackConfig: Configuration = {
        mode: 'development',
        entry: bundleEntry,
        output: {
            filename: 'main.bundle.js',
            chunkFilename: '[name].bundle.js',
            path: buildDir,
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
        stats: {
            chunks: true,
            chunkModules: true,
            colors: false,
            modules: true,
            providedExports: true,
            source: false,
            usedExports: true,
            warnings: false,
            reasons: true,
        },
    };

    getHoistedDependencies(projectRootDir, isProduction, forceInstall, (packages: TPackage[],
        hoistedDependencies: THoistedDeps,
        hoistedDevDependencies: THoistedDeps) => {


        if (fs.existsSync(buildDir)) {
            rimraf(buildDir);
        }
        mkdirp(buildDir);

        let imports = '';

        const addImport = (namedImport: string, moduleName: string, path: string) => {
            path = path.replace(/\\/g, '/');
            imports += `
            '${namedImport}': async () => {
                if (didDefaultImport) return;
                return import('${path}').then(lib => {
                    ${namedImport === 'default' ? 'didDefaultImport = true;' : ''} 
                    ${getGlobalModuleStr(moduleName)}${namedImport !== 'default' ?
                    `['${namedImport}']` : ''} = _interopDefaultLegacy(lib);
                })
            },
            `;
        }

        hoistedDependencies.hoisted = {
            // '@material-ui/core': '',
            // 'jss': '',
            "hoist-non-react-statics": ""
        };


        const modulesExportKeys: Record<string, string[]> = {};

        const bundleNodeModuleRecursive = (moduleName: string) => {
            try {
                console.log(require.resolve(moduleName));
            } catch (e) {
                console.error('Cromwella:bundler: required module ' + moduleName + ' is not found');
                return;
            }
            const moduleBuildDir = resolve(buildDir, moduleName);
            if (fs.existsSync(moduleBuildDir)) {
                // module has been bundled is some other chain of recursive calls
                return;
            }
            // console.log('moduleBuildDir', moduleBuildDir);
            mkdirp(moduleBuildDir);

            imports = '';
            addImport('default', moduleName, moduleName);

            let exportKeys: string[] = [];
            // Create a file for each export so webpack could make chunks for each export
            try {
                let imported = require(moduleName);
                exportKeys = Object.keys(imported);

                if (!modulesExportKeys[moduleName]) modulesExportKeys[moduleName] = exportKeys;

                console.log(moduleName, exportKeys.length);
                exportKeys.forEach(exportKey => {
                    if (exportKey === 'default') return;

                    const exportContent = `
                    import {${exportKey}} from '${moduleName}'
                    export default ${exportKey};
                    `;

                    const exportContentPath = resolve(moduleBuildDir, exportKey);
                    mkdirp(exportContentPath);

                    fs.writeFileSync(resolve(exportContentPath, 'index.js'), exportContent);

                    addImport(exportKey, moduleName, exportContentPath)

                })
            } catch (e) { console.log('Cromwella:bundler:', moduleName, 'failed to require'); }


            // Get package.json to set all Dependencies as external and then transpile them same way
            // const externals: string[] = ['@material-ui/core'];
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
            import {Accordion, Tab} from '@material-ui/core';
            // import MuiiiiAccordion from '@material-ui/core';
            //function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }
            function _interopDefaultLegacy(lib) {
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

            CromwellStore.nodeModules.imports['Accordion'] = Accordion;
            // CromwellStore.nodeModules.imports['Tab'] = Tab;
            // CromwellStore.nodeModules.imports['MuiiiiAccordion'] = MuiiiiAccordion;

            // If we once used 'default' import (which is whole lib), don't let it to make any other imports
            let didDefaultImport = false;

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
            webpackConfig.output!.publicPath = `/${buildChunk}/${moduleName}/`;
            const compiler = webpack(webpackConfig);

            // { [moduleName]: namedExports }
            const usedExternals: Record<string, string[]> = {};

            let moduleStats: any[] = [];

            const shouldLogBuild = true;

            // Hard decryption of webpack's actually used modules (external)
            // < hard >
            compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
                compilation.hooks.afterOptimizeTree.tap('HelloCompilationPlugin', (modules: any) => {
                    if (shouldLogBuild) {
                        moduleStats = JSON.parse(cleanStringify(modules.map(module => ({
                            entryModule: {
                                dependencies: module?.entryModule?.dependencies?.map(dep => {
                                    const { name, request, userRequest, directImport, strictExportPresence, namespaceObjectAsContext, shorthand } = dep;
                                    return {
                                        name, request, userRequest, directImport,
                                    }
                                })
                            }
                        }))));
                    };
                    moduleStats = JSON.parse(cleanStringify(modules));
                    modules.forEach(module => {
                        module?.entryModule?.dependencies.forEach(dep => {
                            if (dep.directImport && dep.request && externals.includes(dep.request)) {
                                if (!usedExternals[dep.request]) usedExternals[dep.request] = [];
                                if (!modulesExportKeys[dep.request]) {
                                    try {
                                        let imported = require(dep.request);
                                        let exportKeys = Object.keys(imported);
                                        modulesExportKeys[dep.request] = exportKeys;
                                    } catch (e) { console.log('Cromwella:bundler:', dep.request, 'failed to require') }
                                }

                                const depName = modulesExportKeys[dep.request].includes(dep.name)
                                    ? dep.name : 'default';

                                if (!usedExternals[dep.request].includes(depName)) {
                                    usedExternals[dep.request].push(depName);
                                }
                            }
                        })
                    })
                    // if (module.external) {
                    //     let reqModuleName;
                    //     externals.forEach(ext => {
                    //         if (ext === module.userRequest) {
                    //             reqModuleName = ext;
                    //         }
                    //     });
                    //     if (reqModuleName) {
                    //         if (module.reasons.length === 1 && module.reasons[0].dependency) {
                    //             const dep = module.reasons[0].dependency;
                    //             if (reqModuleName === dep.request && reqModuleName === dep.userRequest) {
                    //                 if (!usedExternals[reqModuleName]) usedExternals[reqModuleName] = [];
                    //                 usedExternals[reqModuleName].push('default');
                    //             }
                    //         }
                    //         if (module.reasons.length > 1) {
                    //             module.reasons = module.reasons.slice(1, module.reasons.lenght);
                    //             module.reasons.forEach(reason => {
                    //                 if (reason.dependency && reason.dependency.request && reason.dependency.name
                    //                 ) {
                    //                     if (!usedExternals[reqModuleName]) usedExternals[reqModuleName] = [];
                    //                     if (reason.dependency.directImport) {
                    //                         if (!modulesExportKeys[reqModuleName]) {
                    //                             try {
                    //                                 let imported = require(reqModuleName);
                    //                                 let exportKeys = Object.keys(imported);
                    //                                 modulesExportKeys[reqModuleName] = exportKeys;
                    //                             } catch (e) { console.log('Cromwella:bundler:', reqModuleName, 'failed to require') }
                    //                         }
                    //                     }
                    //                     const depName = reason.dependency.directImport &&
                    //                         modulesExportKeys[reqModuleName].includes(reason.dependency.name)
                    //                         ? reason.dependency.name : 'default';

                    //                     if (!usedExternals[reqModuleName].includes(depName)) {
                    //                         usedExternals[reqModuleName].push(depName);
                    //                     }
                    //                 }
                    //             })
                    //         }
                    //     }
                    //     if (shouldLogBuild) {
                    //         moduleStats.push(JSON.parse(cleanStringify(module)))
                    //     };
                    //     // if (shouldLogBuild) {
                    //     //     moduleStats.push(JSON.parse(cleanStringify({
                    //     //         userRequest: module.userRequest,
                    //     //         type: module.type,
                    //     //         external: module.external,
                    //     //         request: module.request,
                    //     //         reasons: module.reasons.map(reas => {
                    //     //             const { name, request, userRequest, directImport, strictExportPresence, namespaceObjectAsContext, shorthand } = reas.dependency;
                    //     //             return {
                    //     //                 dependency: { name, request, userRequest, directImport, strictExportPresence, namespaceObjectAsContext, shorthand },
                    //     //                 module: {
                    //     //                     dependencies: reas.module.module.dependencies.map(dep => ({
                    //     //                         request: dep.request,
                    //     //                         userRequest: dep.userRequest,
                    //     //                         name: dep.name,
                    //     //                     }))
                    //     //                 }
                    //     //             }
                    //     //         })
                    //     //     })));
                    //     // }
                    // }
                });
            });
            // < / hard >

            // if (moduleName === 'hoist-non-react-statics') {
            compiler.run((err, stats) => {
                // console.log(JSON.stringify(stats.toJson(), null, 2));

                const jsonStats = stats.toJson();

                if (shouldLogBuild) {
                    const jsonStatsPath = resolve(moduleBuildDir, 'build_stats.json');
                    fs.writeFileSync(jsonStatsPath, JSON.stringify(moduleStats, null, 4));
                }

                Object.keys(usedExternals).forEach(extName => {
                    if (usedExternals[extName].includes('default')) {
                        usedExternals[extName] = ['default'];
                    }
                })

                console.log('moduleName', moduleName);
                console.log('externals', externals);
                console.log('usedExternals', JSON.stringify(usedExternals, null, 4));

                // Create meta info file with actually used dependencies
                const metaInfoPath = resolve(moduleBuildDir, 'meta.json');
                const metaInfoContent = { externalDependencies: usedExternals };
                fs.writeFileSync(metaInfoPath, JSON.stringify(metaInfoContent, null, 4));


                Object.keys(usedExternals).forEach(ext => {
                    bundleNodeModuleRecursive(ext);
                })
            });
            // }
        }


        Object.keys(hoistedDependencies.hoisted).map(moduleName => {
            bundleNodeModuleRecursive(moduleName);
        })

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