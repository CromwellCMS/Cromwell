const path = require('path');
const { CromwellWebpackPlugin } = require('@cromwell/cromwella');
const localProjectDir = __dirname;

const getConfig = (buildMode = 'production') => {
    const isProduction = buildMode === 'production';

    return {
        mode: buildMode,
        target: "web",
        // devtool: isProduction ? false : "source-map",
        devtool: false,
        entry: path.resolve(localProjectDir, 'src/index.ts'),
        output: {
            path: path.resolve(localProjectDir, 'build'),
            // filename: isProduction
            //     ? 'webapp.[contenthash:8].js'
            //     : 'webapp.js',
            filename: 'webapp.js',
            chunkFilename: 'chunks' + '/[name].bundle.js'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', 'jsx']
        },
        optimization: {
            splitChunks: {
                minSize: 20000,
                chunks: 'all',
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
                },
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader"
                        }
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        { loader: 'style-loader' },
                        {
                            loader: 'css-loader', options: {
                                sourceMap: true,
                                modules: {
                                    localIdentName: '[local]_[hash:base64:5]'
                                },
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                config: {
                                    path: 'postcss.config.js'
                                }
                            }
                        },
                        {
                            loader: 'sass-loader', options: { sourceMap: true }
                        }
                    ],
                },
            ]
        },
        plugins: [
            new CromwellWebpackPlugin({
                moduleName: '@cromwell/admin-panel',
                moduleBuiltins: {
                    '@cromwell/admin-panel': [
                        '@cromwell/cromwella/build/importer.js'
                    ]
                }
            })
        ],
    }
}

module.exports = getConfig();