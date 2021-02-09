module.exports = {
    type: "plugin",
    title: "Product showcase",
    icon: "static/icon_showcase.png",
    info: '',
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-ts');
        const postcss = require('rollup-plugin-postcss');
        const { terser } = require('rollup-plugin-terser');
        const ts = require('typescript');
        const { tsCompilerPlugin } = require('@cromwell/cromwella');
        return {
            main: {
                plugins: [
                    tsCompilerPlugin(),
                    commonjs(),
                    postcss({
                        extract: false,
                        inject: true,
                    }),
                    // terser()
                ]
            },
            backend: {
                plugins: [
                    tsCompilerPlugin({
                        compilerOptions: {
                            target: ts.ScriptTarget.ES2019
                        }
                    }),
                    commonjs(),
                    // typescript({
                    //     tsconfig: resolvedConfig => ({
                    //         ...resolvedConfig,
                    //         target: ts.ScriptTarget.ES2019
                    //     })
                    // }),
                    postcss({
                        extract: false,
                        inject: true,
                    }),
                ]
            },
        }
    }
}