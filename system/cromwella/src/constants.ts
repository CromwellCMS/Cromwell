import { Configuration } from 'webpack';


export const buildDirChunk = 'built_modules';

export const moduleMainBuidFileName = 'main.bundle.js';
export const moduleMetaInfoFileName = 'meta.json';

export const jsOperators = ['let', 'var', 'const', 'function', 'class', 'delete',
    'import', 'export', 'default', 'typeof', 'in', 'of', 'instanceof', 'void'];


export const cromwellStoreModulesPath = 'CromwellStore.nodeModules.modules';
export const cromwellStoreImportsPath = 'CromwellStore.nodeModules.imports';
export const getGlobalModuleStr = (moduleName: string) => `${cromwellStoreModulesPath}['${moduleName}']`;

const moduleChunksBuildDirChunk = 'chunks';

export const commonWebpackConfig: Configuration = {
    target: 'web',
    output: {
        filename: moduleMainBuidFileName,
        chunkFilename: moduleChunksBuildDirChunk + '/[name].bundle.js',
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
    stats: 'errors-only'
};

export const parseImportsWebpackConfig: Configuration = {
    mode: "development",
    output: {
        filename: 'temp_' + moduleMainBuidFileName
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
            }
        ]
    },
    stats: 'errors-only'
}