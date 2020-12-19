const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
    name: "ProductFilter",
    type: "plugin",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    },
    defaultSettings: {
        productListId: "Category_ProductList"
    },
    rollupConfig: {
        main: {
            plugins: [
                commonjs(),
                typescript()
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