module.exports = {
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
        const typescript = require('rollup-plugin-ts-compiler');
        const { terser } = require('rollup-plugin-terser');
        return {
            main: {
                plugins: [
                    typescript(),
                    commonjs(),
                    // terser()
                ]
            },
            backend: {
                plugins: [
                    typescript({
                        compilerOptions: {
                            target: 'ES2019'
                        }
                    }),
                    commonjs(),
                ]
            },
        }
    }
}