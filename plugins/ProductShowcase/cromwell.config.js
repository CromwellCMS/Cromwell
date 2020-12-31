module.exports = {
    type: "plugin",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
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
            },
        }
    }
}