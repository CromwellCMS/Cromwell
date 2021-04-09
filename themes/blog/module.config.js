module.exports = {
    palette: {
        "primaryColor": "#9900CC"
    },
    globalCss: [
        "react-toastify/dist/ReactToastify.css",
        '../styles/global.scss'
    ],
    headHtml: "<link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap\" rel=\"stylesheet\" /><link href=\"https://unpkg.com/reset-css/reset.css\" rel=\"stylesheet\" /><meta name=\"viewport\" content=\"width=device-width\"><meta property=\"og:appConfig_headHtml\" content=\"blah_blah\" key=\"blah_blah\" />",
    pages: [
        {
            "route": "index",
            "name": "index",
            "title": "Home page",
            "modifications": []
        }
    ],
    globalModifications: [
        {
            "type": "plugin",
            "id": "header_main_menu",
            "plugin": {
                "pluginName": "@cromwell/plugin-main-menu"
            }
        }
    ],
    plugins: {
        "ProductShowcase": {
            "options": {}
        },
        "ProductShowcaseDemo": {
            "options": {}
        }
    },
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const json = require('@rollup/plugin-json');
        const postcss = require('rollup-plugin-postcss');
        const { terser } = require('rollup-plugin-terser');
        const typescript = require('rollup-plugin-ts-compiler');

        // All plugins below will be instantiated for every output options (pages, admin panel, etc)
        // But rollup-plugin-ts-compiler with shared state object will have only one instance across all compilations.
        // We can do that only if we don't need to use different tsconfigs for outputs.
        // Shared state will decrease compile time in N times for every output.  
        const tsSharedState = {};

        const getDefaultPlugins = () => [
            typescript({
                sharedState: tsSharedState,
                monorepo: true,
            }),
            commonjs(),
            json(),
            // terser()
        ];

        return {
            main: {
                plugins: [
                    ...getDefaultPlugins(),
                ]
            },
            adminPanel: {
                plugins: [
                    ...getDefaultPlugins(),
                    postcss({
                        extract: false,
                        modules: true,
                        writeDefinitions: false,
                        inject: true,
                        use: ['sass'],
                    }),
                ]
            }
        }
    },
}