const withPlugins = require('next-compose-plugins');
const config = require('./cmsconfig.json');
const withTM = require('next-transpile-modules')([config.templateName]);

module.exports = withPlugins([withTM], {
    pageExtensions: ['jsx', 'js', 'ts', 'tsx'],
    compress: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // if (!webpack.rules) webpack.rules = [];
        // webpack.rules.push({
        //     test: /\.(js|jsx|ts|tsx)$/,
        //     loader: 'babel',
        //     query: {
        //         cacheDirectory: true,
        //         plugins: ["transform-decorators-legacy", "transform-class-properties"],
        //         presets: ['es2015', 'stage-0', 'react']
        //     }
        // })

        return config
    },
});