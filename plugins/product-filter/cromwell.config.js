module.exports = {
    defaultSettings: {
        listId: "Category_ProductList"
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-ts-compiler');
        const { terser } = require('rollup-plugin-terser');
        const { resolve } = require('path');
        return {
            main: {
                plugins: [
                    typescript({
                        compilerOptions: {
                            declaration: true,
                            declarationDir: resolve(__dirname, 'build/types')
                        },
                        monorepo: true,
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
        }
    }
}