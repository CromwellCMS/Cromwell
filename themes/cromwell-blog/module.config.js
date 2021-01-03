const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');

module.exports = {
    name: "cromwell-blog",
    type: 'theme',
    main: {
        themeName: "cromwell-blog",
        title: "Blog",
        previewImage: "static/blog.png",
        description: "Simple blog website",
        palette: {
            "primaryColor": "#9900CC"
        },
        globalCss: [
            "react-toastify/dist/ReactToastify.css"
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
    rollupConfig: {
        main: {
            plugins: [
                commonjs(),
                typescript(),
                json(),
            ]
        },
        adminPanel: {
            plugins: [
                commonjs(),
                typescript(),
                json(),
                postcss({
                    extract: false,
                    modules: true,
                    writeDefinitions: false,
                    inject: true,
                    use: ['sass'],
                }),
            ]
        }
    },
}