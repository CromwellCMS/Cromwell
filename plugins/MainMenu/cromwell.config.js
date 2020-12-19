const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
    name: "MainMenu",
    type: "plugin",
    adminInputFile: "src/admin/index.tsx",
    frontendInputFile: "src/frontend/index.tsx",
    rollupConfig: {
        main: {
            plugins: [
                commonjs(),
                typescript()
            ]
        }
    }
}