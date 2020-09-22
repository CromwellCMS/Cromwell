import { TPackage, TDependency, THoistedDeps, TNonHoisted, TLocalSymlink } from './types';
import { getHoistedDependencies } from './shared';
import fs from 'fs';
import { sync as rimraf } from 'rimraf';
import { sync as mkdirp } from 'mkdirp';
import { resolve } from 'path';
import webpack, { Configuration } from 'webpack';

export const bundler = (projectRootDir: string, installationMode: string,
    isProduction: boolean, forceInstall: boolean) => {

    const tempDir = resolve(projectRootDir, '.cromwell/bundle');
    const bundleEntry = resolve(projectRootDir, '.cromwell/bundle/main.js');

    const webpackConfig: Configuration = {
        mode: 'production',
        entry: bundleEntry,
        output: {
            filename: '[name].bundle.js',
            path: tempDir,
        },
        optimization: {
            splitChunks: {
                minSize: 20000,
                maxSize: 100000,
                chunks: 'all',
                name: (module, chunks, cacheGroupKey) => {
                    const moduleFileName = module.identifier().replace(/\\/g, '/').split('/').reduceRight(item => item);
                    // console.log('moduleFileName', moduleFileName);
                    if (moduleFileName === 'main.js') return moduleFileName;
                    const allChunksNames = chunks.map((item) => item.name).join('~');
                    return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                }
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

        let imports = ''

        Object.keys(hoistedDependencies.hoisted).map(moduleName => {
            imports += `
            '${moduleName}': () => {
                import('${moduleName}').then(lib => {
                    const libName = '${moduleName}';
                    window.Cromwell.modules[libName] = lib;
                }).catch(error => 'Cromwella:bundler: An error occurred while loading the library: ' + libName);
            },
            `;
        })


        const content = `
const isServer = () => (typeof window === 'undefined');

if (!isServer()) {
    if (!window.Cromwell) window.Cromwell = {};

    window.Cromwell.modules = {};

    window.Cromwell.imports = {
        ${imports}
    }
}
        `;


        if (fs.existsSync(tempDir)) {
            rimraf(tempDir);
        }
        mkdirp(tempDir);

        fs.writeFileSync(bundleEntry, content);


        const compiler = webpack(webpackConfig);

        compiler.run((err, stats) => {
            const toText = () => stats.toString({
                chunks: false,
                colors: true
            })
            if (stats.hasErrors()) {
                console.error(toText());
            } else {
                console.log(toText());
            }
        });
    });
}


