module.exports = {
    type: "plugin",
    title: "Product showcase",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
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
                    typescript({ tsconfigOverride: { target: 'es2019' } })
                ]
            },
        }
    }
}