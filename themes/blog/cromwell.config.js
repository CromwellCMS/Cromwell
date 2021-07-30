module.exports = {
    palette: {
        "primaryColor": "#9900CC"
    },
    globalCss: [
        "react-toastify/dist/ReactToastify.css",
        '../styles/global.scss'
    ],
    headHtml: "<link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;900&display=swap\" rel=\"stylesheet\" /><meta name=\"viewport\" content=\"width=device-width\"><meta property=\"og:appConfig_headHtml\" content=\"blah_blah\" key=\"blah_blah\" />",
    defaultPages: {
        index: 'index',
        post: 'post/[slug]',
        tag: 'tag/[slug]',
        pages: 'pages/[slug]',
    },
    pages: [
        {
            id: "index",
            route: "index",
            name: "Home",
            title: "Home page",
            modifications: []
        },
        {
            id: "post/[slug]",
            route: "post/[slug]",
            name: "Post",
            title: "Post page",
            modifications: []
        },
        {
            id: "tag/[slug]",
            route: "tag/[slug]",
            name: "Tag",
            title: "Tag page",
            modifications: []
        },
        {
            id: "search",
            route: "search",
            name: "Search",
            title: "Search page",
            modifications: []
        },
        {
            id: "pages/contacts",
            route: "pages/contacts",
            name: "Contacts",
            title: "Contacts",
            isVirtual: true,
            modifications: [
                {
                    "id": "_c7ibjr09hrpi",
                    "type": "HTML",
                    "isVirtual": true,
                    "parentId": "PagesGenericPage",
                    "index": 0,
                    "style": {
                        "padding": "20px",
                        "backgroundColor": "#fff",
                        "borderRadius": "5px"
                    },
                    "html": {
                        "innerHTML": "<h1>Contact Information</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\n<ul>\n<li><p><strong>Email:</strong> contact@example.com</p></li>\n<li><p><strong>Phone:</strong> +1 (234) 567-89-00</p></li>\n<li><p><strong>Address:</strong> Lorem ipsum dolor sit amet</p></li>\n</ul>"
                    }
                },
                {
                    "id": "PagesGenericPage",
                    "type": "container",
                    "editorStyles": {
                        "maxWidth": 700,
                        "align": "center",
                        "offsetTop": 20,
                        "offsetBottom": 20
                    }
                }
            ]
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
                    terser({
                        compress: {
                            side_effects: false,
                            negate_iife: false,
                        }
                    }),
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