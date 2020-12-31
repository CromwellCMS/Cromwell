module.exports = {
    type: "plugin",
    frontendInputFile: "src/frontend/index.tsx",
    adminInputFile: "src/admin/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('@rollup/plugin-typescript');
        return {
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

            }
        }
    }
}