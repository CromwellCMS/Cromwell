module.exports = {
    type: "plugin",
    title: "Product filter",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    },
    defaultSettings: {
        productListId: "Category_ProductList"
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('@rollup/plugin-typescript');
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
                    typescript({ target: 'es2019' })
                ]
            },
        }
    }
}