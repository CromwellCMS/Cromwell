module.exports = {
    frontendInputFile: "src/frontend/index.tsx",
    adminInputFile: "src/admin/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-ts');
        const { terser } = require('rollup-plugin-terser');
        const ts = require('typescript');
        const { tsCompilerPlugin } = require('@cromwell/utils');
        return {
            main: {
                plugins: [
                    tsCompilerPlugin(),
                    commonjs(),
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
                    // })
                ]

            }
        }
    }
}