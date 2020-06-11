const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withTM = require('next-transpile-modules')(['@cromwell/templates']);

module.exports = withPlugins([withTM, withSass], {
    pageExtensions: ['jsx', 'js', 'ts', 'tsx'],
    compress: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

        // if (!webpack.rules) webpack.rules = [];
        // webpack.rules = [
        //     ...webpack.rules,
        //     {
        //         test: /\.(js|jsx|ts|tsx)$/,
        //         loader: 'babel-loader',
        //         options: {
        //             presets: ["next/babel", "es2015", "stage-0"],
        //             plugins: [
        //                 "@babel/plugin-proposal-class-properties",
        //                 [
        //                     "@babel/plugin-proposal-decorators",
        //                     {
        //                         "legacy": true
        //                     }
        //                 ],
        //                 ["transform-decorators-legacy"]
        //             ]
        //         }
        //     },
        //     {
        //         test: /\.(js|jsx|ts|tsx)$/,
        //         use: 'ts-loader',
        //         exclude: /node_modules/,
        //     }
        // ]
        config.plugins.push(new webpack.IgnorePlugin(/myconfig\.ts/));
        return config;
    },
});