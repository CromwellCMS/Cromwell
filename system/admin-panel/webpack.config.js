const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const packageJson = require('./package.json');
const { appBuildDev, appBuildProd, contentDir, localProjectBuildDir, projectRootDir, localProjectDir } = require('./src/constants');
const buildDir = 'admin';

/**
 * Returns Webpack config object
 * @param {*} scriptName buildService | buildWeb
 * @param {*} buildMode  'production' | 'development'
 */
const getConfig = (scriptName, buildMode) => {
    const isBuildingService = scriptName === 'buildService';
    const isProduction = buildMode === 'production';
    return {
        mode: buildMode,
        target: isBuildingService ? "node" : "web",
        devtool: isProduction ? false : "source-map",
        entry: isBuildingService ? path.resolve(localProjectDir, 'src/app.ts') :
            path.resolve(localProjectBuildDir, `index.js`),
        output: isBuildingService ? {
            libraryTarget: 'commonjs',
            library: 'AdminPanel',
            path: path.resolve(localProjectBuildDir, buildDir),
            filename: 'app.js'
        } : {
                path: isProduction ? appBuildProd : appBuildDev,
                filename: isProduction
                    ? '[name].[contenthash:8].js'
                    : '[name].js',
                publicPath: '/',
            },
        resolve: {
            extensions: isBuildingService ? [".js", "jsx", ".ts", ".tsx"] : [".js"],
            alias: {
                CromwellImports: path.resolve(localProjectDir, '.cromwell/imports'),
            }
        },
        module: {
            rules: [].concat(
                [{
                    test: /\.css$/i,
                    use: [
                        { loader: 'style-loader' },
                        {
                            loader: 'css-loader', options: {
                                sourceMap: true
                            }
                        }
                    ],
                }],
                isBuildingService ? [
                    {
                        test: /\.ts(x?)$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: "ts-loader"
                            }
                        ]
                    },
                    // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                    // {
                    //     enforce: "pre",
                    //     test: /\.js$/,
                    //     loader: "source-map-loader"
                    // },
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
                ] : []
            )
        },
        plugins: isBuildingService ? [] : [
            new CopyPlugin({
                patterns:
                    isProduction ?
                        [{
                            from: `${projectRootDir}/node_modules/react/umd/react.production.min.js`,
                        },
                        {
                            from: `${projectRootDir}/node_modules/react-dom/umd/react-dom.production.min.js`,
                        }] :
                        [{
                            from: `${projectRootDir}/node_modules/react/umd/react.development.js`,
                        },
                        {
                            from: `${projectRootDir}/node_modules/react/umd/react.profiling.min.js`,
                        },
                        {
                            from: `${projectRootDir}/node_modules/react-dom/umd/react-dom.development.js`,
                        },
                        {
                            from: `${projectRootDir}/node_modules/react-dom/umd/react-dom.profiling.min.js`,
                        }]
            }),
            new HtmlWebpackPlugin(Object.assign(
                {
                    filename: `index.html`,
                    template: path.resolve(localProjectDir, './public/index.html'),
                },
                isProduction
                    ? {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                        reactSrc: '/react.production.min.js',
                        reactDOMSrc: '/react-dom.production.min.js',
                        reactProfilingSrc: '',
                        reactDOMProfilingSrc: ''
                    }
                    : {
                        reactSrc: '/react.development.js',
                        reactDOMSrc: '/react-dom.development.js',
                        // reactProfilingSrc: '/react.profiling.min.js',
                        // reactDOMProfilingSrc: '/react-dom.profiling.min.js'
                    }
            ))
        ],
        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: Object.assign({
            "react": "React",
            "react-dom": "ReactDOM",
        }, isBuildingService ?
            Object.assign({
                "CromwellImports": "CromwellImports", "react": "react",
                "react-dom": "react-dom",
            },
                ...Object.keys(packageJson.dependencies).map(key => ({ [key]: key })),
                ...Object.keys(packageJson.devDependencies).map(key => ({ [key]: key }))
            ) : {}
        )
    }
}

module.exports = { getConfig };