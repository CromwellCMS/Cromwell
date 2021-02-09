module.exports = {
    type: "plugin",
    title: "Product filter",
    icon: "static/icon_funnel.png",
    frontendInputFile: "src/frontend/index.tsx",
    adminInputFile: "src/admin/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    },
    defaultSettings: {
        productListId: "Category_ProductList"
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-ts');
        const { terser } = require('rollup-plugin-terser');
        const ts = require('typescript');
        const { tsCompilerPlugin } = require('@cromwell/cromwella');
        return {
            main: {
                plugins: [
                    tsCompilerPlugin(),
                    commonjs(),
                    // typescript(),
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
            },
        }
    }
}