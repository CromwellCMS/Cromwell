module.exports = {
    type: "plugin",
    title: "Product showcase",
    icon: "static/icon_showcase.png",
    info: '',
    adminInputFile: "src/admin/index.tsx",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
    },
    defaultSettings: {
        size: 20
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-ts-compiler');
        const postcss = require('rollup-plugin-postcss');
        const { terser } = require('rollup-plugin-terser');
        return {
            main: {
                plugins: [
                    typescript(),
                    commonjs(),
                    postcss({
                        extract: false,
                        inject: true,
                    }),
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
                    postcss({
                        extract: false,
                        inject: true,
                    }),
                ]
            },
        }
    }
}