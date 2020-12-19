const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
    name: "CustomerReviews",
    type: "plugin",
    frontendInputFile: "src/frontend/index.tsx",
    adminInputFile: "src/admin/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
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