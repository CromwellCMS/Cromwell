const path = require('path');
const webpack = require('webpack');
const resolveFrom = require('resolve-from');
const { getAdminPanelDir } = require('@cromwell/core-backend/dist/helpers/paths');
const styleLoaderPath = resolveFrom(getAdminPanelDir(), 'style-loader');
const cssLoaderPath = resolveFrom(getAdminPanelDir(), 'css-loader');
const sassLoaderPath = resolveFrom(getAdminPanelDir(), 'sass-loader');
const postCSSLoaderPath = resolveFrom(getAdminPanelDir(), 'postcss-loader');
const buildMode = process.env.NODE_ENV || 'production';
const isProduction = buildMode === 'production';
const styleLoaderOptions = {
    attributes: { 'data-meta': 'crw-admin-style' }
}

const entry = [path.resolve(__dirname, 'src/index.ts')];
if (!isProduction) {
    entry.unshift('webpack-hot-middleware/client');
}

// console.log('Admin panel build mode:', buildMode)

module.exports = {
    mode: buildMode,
    target: "web",
    devtool: isProduction ? false : "source-map",
    entry: {
        webapp: entry
    },
    output: {
        path: path.resolve(__dirname, 'build'),
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
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "swc-loader",
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript"
                            }
                        }
                    }
                },
                // use: [
                //     {
                //         loader: resolveFrom(getAdminPanelDir(), 'ts-loader');
                //     },
                // ]
            },
            {
                test: /\.css$/i,
                use: [
                    { loader: styleLoaderPath, options: styleLoaderOptions },
                    {
                        loader: cssLoaderPath, options: {
                            sourceMap: isProduction ? false : true,
                        }
                    },
                    {
                        loader: postCSSLoaderPath
                    }
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: styleLoaderPath, options: styleLoaderOptions },
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
