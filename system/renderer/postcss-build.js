const fs = require("fs-extra")
const postcss = require("postcss")
const atImport = require("postcss-import")
const path = require('path');

const presetEnv = require('postcss-preset-env')
const postcssNesting = require('postcss-nesting')
const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')
const postcssNestedAncestors = require('postcss-nested-ancestors')

// css to be processed
const css = fs.readFileSync(path.join(__dirname, 'src/css/index.pcss'), "utf8")

// process css
postcss()
    .use(atImport())
    .use(presetEnv())
    .use(postcssNesting())
    .use(autoprefixer())
    .use(postcssNested())
    .use(postcssNestedAncestors())
    .process(css, {
        // `from` option is needed here
        from: 'src/css/index.pcss'
    })
    .then((result) => {
        const output = result.css
        fs.outputFileSync(path.join(__dirname, 'build/editor-styles.css'), output);
    })