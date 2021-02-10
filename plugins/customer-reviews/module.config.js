module.exports = {
    type: "plugin",
    title: "Customer reviews",
    frontendInputFile: "src/frontend/index.tsx",
    adminInputFile: "src/admin/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const typescript = require('rollup-plugin-ts');
        const { terser } = require('rollup-plugin-terser');
        const ts = require('typescript');
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
                    typescript({
                        tsconfig: resolvedConfig => ({
                            ...resolvedConfig,
                            target: ts.ScriptTarget.ES2019
                        })
                    })
                ]

            }
        }
    }
}