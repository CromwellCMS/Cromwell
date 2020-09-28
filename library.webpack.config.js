const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    context: process.cwd(),
    mode: 'production',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.less', '.css'],
        modules: [__dirname, 'node_modules']
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: '.cromwell/build/library/[name].json'
        })
    ],
    entry: [
        'react',
        '@material-ui/core',
        '@material-ui/styles',
        '@material-ui/icons'
    ],
    optimization: {
        minimize: false,
        // minimizer: [new TerserPlugin()],
        splitChunks: {
            minSize: 20000,
            maxSize: 100000,
            chunks: 'all',
        },
    },
    output: {
        filename: '[name]_dll.js',
        chunkFilename: '[name]_chunk_dll.js',
        path: path.resolve(__dirname, '.cromwell/build/library'),
        library: '[name]'
    },
    // module: {
    //     rules: [
    //         {
    //             test: /\.m?js$/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: ['@babel/preset-env']
    //                 }
    //             }
    //         }
    //     ]
    // }

};