import { TPackage, TDependency, THoistedDeps, TNonHoisted, TLocalSymlink } from './types';
import { getHoistedDependencies } from './shared';
import fs from 'fs';
import { sync as rimraf } from 'rimraf';
import { sync as mkdirp } from 'mkdirp';
import { resolve } from 'path';
import webpack, { Configuration } from 'webpack';

const isExternalForm = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');

const getGlobalModuleStr = (moduleName: string) => `window.Cromwell.modules['${moduleName}']`;

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
        }
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
                return import('${path}').then(lib => {
                    ${getGlobalModuleStr(moduleName)}['${namedImport}'] = lib;
                }).catch(error =>  logError(error, "import { ${namedImport} } from '${moduleName}'"));
            },
            `;
        }

        hoistedDependencies.hoisted = {
            '@material-ui/core': '',
            // "hoist-non-react-statics": ""
        };

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

            // Create a file for each export so webpack could make chunks for each export
            try {
                let imported = require(moduleName);

                console.log(moduleName, Object.keys(imported).length);
                Object.keys(imported).forEach(exportKey => {
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
            const isServer = () => (typeof window === 'undefined');
            const logError = (e, libName) => console.error('Cromwella:bundler: An error occurred while loading the library: ' + libName, e);
            
            if (!isServer()) {
                if (!window.Cromwell) window.Cromwell = {};
                if (!window.Cromwell.imports) window.Cromwell.imports = {};
                if (!window.Cromwell.modules) window.Cromwell.modules = {};
                if (!${getGlobalModuleStr(moduleName)}) ${getGlobalModuleStr(moduleName)} = {};
            
                window.Cromwell.imports['${moduleName}'] = {
                    ${imports}
                }
            }
                    `;

            const libEntry = resolve(moduleBuildDir, 'generated.js');
            fs.writeFileSync(libEntry, content);



            webpackConfig.externals = Object.assign({}, ...externals.map(ext => ({
                [ext]: `${getGlobalModuleStr(ext)}['default']`
            })));
            console.log(JSON.stringify(webpackConfig.externals, null, 2));

            webpackConfig.entry = libEntry;
            webpackConfig.output!.path = moduleBuildDir;
            webpackConfig.output!.publicPath = `/${buildChunk}/${moduleName}/`;
            const compiler = webpack(webpackConfig);

            const usedExternals: string[] = [];

            // if (moduleName === 'hoist-non-react-statics') {
            compiler.run((err, stats) => {
                // console.log(JSON.stringify(stats.toJson(), null, 2));

                // Read actually used modules (external)
                const jsonStats = stats.toJson();
                jsonStats.chunks?.forEach(chunk => {
                    chunk.modules?.forEach(chunkModule => {
                        if (chunkModule.id && typeof chunkModule.id === 'string' &&
                            isExternalForm(chunkModule.id)) {
                            if (!externals.includes(chunkModule.id)) {
                                console.error(`Error: Module ${moduleName} used dependency ${chunkModule.id}, but it wasn't found in package.json, so dependency wasn't marked as external and was bundled!`)
                            } else {
                                usedExternals.push(chunkModule.id)
                            }
                        }
                    })
                })
                // const toText = () => stats.toJson({
                //     chunks: false,
                // })
                // if (stats.hasErrors()) {
                //     console.error(toText());
                // } else {
                //     console.log(toText());
                // }

                console.log('usedExternals', usedExternals);


                // Create meta info file with actually used dependencies
                const metaInfoPath = resolve(moduleBuildDir, 'meta.json');
                const metaInfoContent = `
                {
                    "externalDependencies": [${usedExternals.reduce((prev, curr, i) =>
                    (prev += `"${curr}"`) + (i < usedExternals.length - 1 ? ',\n' : ''), '')}]
                }
                `
                fs.writeFileSync(metaInfoPath, metaInfoContent);


                usedExternals.forEach(ext => {
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


