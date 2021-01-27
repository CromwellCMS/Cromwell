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
        const typescript = require('rollup-plugin-typescript2');
        const { terser } = require('rollup-plugin-terser');
        return {
            main: {
                plugins: [
                    commonjs(),
                    typescript(),
                    // terser()
                ]
            },
            backend: {
                plugins: [
                    commonjs(),
                    typescript({ tsconfigOverride: { compilerOptions: { target: 'es2019' } } })
                ]
            },
        }
    }
}