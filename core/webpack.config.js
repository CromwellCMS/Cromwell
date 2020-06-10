const path = require('path');
const buildMode = process.env.NODE_ENV;
const watch = process.env.WATCH ? Boolean(process.env.WATCH) : false;

if (buildMode !== 'development' && buildMode !== 'production')
    throw (`NODE_ENV variable value incorrect - "${buildMode}"\nCorrect values is "development" and "production"`);


module.exports = [
    buildMode === 'development' ? 'source-map' : false
].map(devtool => ({
    mode: buildMode,
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'cromwell-core.js',
        library: 'cromwellCore',
        libraryTarget: 'umd',
        umdNamedDefine: true 
    },
    target: "node",
    watch: watch,
    devtool,
    optimization: {
        runtimeChunk: true
    },
    // externals: [
    //     "next",
    //     "react",
    //     "react-dom",
    //     "react-scripts",
    //     "graphql-request"
    // ],
    externals: {
        next: 'next',
        "next/link": "nextLink",
        react: 'react',
        "react-dom": "ReactDOM",
        "graphql-request": "graphqlRequest",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", "jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        removeComments: false
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    }
}));