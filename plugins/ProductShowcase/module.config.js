module.exports = {
    type: "plugin",
    title: "Product showcase",
    icon: "static/icon_showcase.png",
    info: '',
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-typescript2');
        const postcss = require('rollup-plugin-postcss');
        const { terser } = require('rollup-plugin-terser');
        return {
            main: {
                plugins: [
                    commonjs(),
                    typescript(),
                    postcss({
                        extract: false,
                        inject: true,
                    }),
                    // terser()
                ]
            },
            backend: {
                plugins: [
                    commonjs(),
                    typescript({ tsconfigOverride: { compilerOptions: { target: 'es2019' } } }),
                    postcss({
                        extract: false,
                        inject: true,
                    }),
                ]
            },
        }
    }
}