module.exports = {
    type: "plugin",
    title: "Product showcase",
    icon: "static/icon_showcase.png",
    info: '',
    defaultSettings: {
        size: 20
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-ts-compiler');
        const { terser } = require('rollup-plugin-terser');
        return {
            main: {
                plugins: [
                    typescript({
                        monorepo: true
                    }),
                    commonjs(),
                    terser({
                        compress: {
                            side_effects: false,
                            negate_iife: false,
                        }
                    }),
                ]
            },
            backend: {
                plugins: [
                    typescript({
                        monorepo: true,
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