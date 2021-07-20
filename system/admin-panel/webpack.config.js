const path = require('path');
const localProjectDir = __dirname;
const webpack = require('webpack');
const resolveFrom = require('resolve-from');
const coreBackend = require('@cromwell/core-backend');

const styleLoaderPath = resolveFrom(coreBackend.getAdminPanelDir(), 'style-loader');
const cssLoaderPath = resolveFrom(coreBackend.getAdminPanelDir(), 'css-loader');
const sassLoaderPath = resolveFrom(coreBackend.getAdminPanelDir(), 'sass-loader');
const tsLoaderPath = resolveFrom(coreBackend.getAdminPanelDir(), 'ts-loader');
const buildMode = process.env.NODE_ENV || 'production';
const isProduction = buildMode === 'production';

const entry = [path.resolve(localProjectDir, 'src/index.ts')];
if (!isProduction) {
    entry.unshift('webpack-hot-middleware/client');
}

console.log('buildMode', buildMode)

module.exports = {
    mode: buildMode,
    target: "web",
    devtool: isProduction ? false : "source-map",
    entry: {
        webapp: entry
    },
    output: {
        path: path.resolve(localProjectDir, 'build'),
        filename: 'webapp.js',
        publicPath: '/admin/build/',
        chunkFilename: 'chunks' + '/[id].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx']
    },
    watchOptions: {
        ignored: ['build/**', '.cromwell/**', 'node_modules/**']
    },
    externals: [
        function ({ request }, callback) {
            if (request.startsWith('next')) {
                return callback(null, `root CromwellStore.nodeModules.modules['${request.replace(/\W/g, '_')}']`);
            }
            callback();
        },
    ],
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: tsLoaderPath
                    },
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    { loader: styleLoaderPath },
                    {
                        loader: cssLoaderPath, options: {
                            sourceMap: isProduction ? false : true,
                        }
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: styleLoaderPath },
                    {
                        loader: cssLoaderPath, options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            },
                        }
                    },
                    {
                        loader: sassLoaderPath, options: { sourceMap: isProduction ? false : true }
                    }
                ],
            },
        ]
    },
    plugins: isProduction ? [] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
}
