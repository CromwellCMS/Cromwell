const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const postcss = require('rollup-plugin-postcss');

module.exports = {
    type: 'theme',
    main: {
        themeName: "@cromwell/theme-blog",
        title: "Blog",
        previewImage: "static/blog.png",
        description: "Simple blog website",
        palette: {
            "primaryColor": "#9900CC"
        },
        globalCss: [
            "react-toastify/dist/ReactToastify.css",
            '../styles/global.scss'
        ],
        headHtml: "<link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap\" rel=\"stylesheet\" /><link href=\"https://unpkg.com/reset-css/reset.css\" rel=\"stylesheet\" /><meta name=\"viewport\" content=\"width=device-width\"><meta property=\"og:appConfig_headHtml\" content=\"blah_blah\" key=\"blah_blah\" />"
    },
    pages: [
        {
            "route": "index",
            "name": "index",
            "title": "Home page",
            "modifications": []
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
        const typescript = require('rollup-plugin-ts');

        const getDefaultPlugins = () => [
            commonjs(),
            json(),
            typescript(),
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
                    postcss({
                        extract: false,
                        modules: true,
                        writeDefinitions: false,
                        inject: true,
                        use: ['sass'],
                    }),
                    ...getDefaultPlugins(),
                ]
            }
        }
    },
}