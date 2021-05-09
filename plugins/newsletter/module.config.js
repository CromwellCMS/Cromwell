module.exports = {
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-ts-compiler');
        const { terser } = require('rollup-plugin-terser');
        return {
            main: {
                plugins: [
                    typescript({
                        monorepo: true,
                    }),
                    commonjs(),
                    terser()
                ]
            },
            backend: {
                plugins: [
                    typescript({
                        compilerOptions: {
                            target: 'ES2019'
                        },
                        monorepo: true,
                    }),
                    commonjs(),
                ]
            },
        }
    }
}