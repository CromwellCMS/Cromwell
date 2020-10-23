import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import postcss from 'rollup-plugin-postcss';
import autoprefixer from "autoprefixer";
import alias from '@rollup/plugin-alias';
import { rollupConfigWrapper } from '@cromwell/cromwella';
import json from '@rollup/plugin-json';
const cromwellConfig = require('./cromwell.config.js');

// const configDistPath = resolve(__dirname, 'cromwell.config.js');

export default rollupConfigWrapper({
    plugins: [
        postcss({
            plugins: [
                autoprefixer(),
            ],
            extract: false,
            modules: true,
            writeDefinitions: false,
            inject: true,
            use: ['sass'],
        }),
        alias({
            entries: [
                // Workaround for proper import (for next.js) of style-inject which is automatically imported by rollup-plugin-postcss
                { find: /^.*\/node_modules\/style-inject\/dist\/style-inject\.es\.js/, replacement: 'style-inject' },
            ]
        }),
        commonjs(),
        typescript(),
        json(),
    ]
}, cromwellConfig);

    // {
    //     input: resolve(__dirname, 'src/cromwell.config.ts'),
    //     output: {
    //         file: configDistPath,
    //         format: "cjs",
    //     },
    //     plugins: [
    //         typescript(),
    //     ]
    // },
    // {
    //     input: resolve(__dirname, 'src/test.ts'),
    //     output: {
    //         file: configDistPath + 'test.js',
    //         format: "cjs",
    //     },
    //     plugins: [
    //         rollupPluginCromwellFrontend(),
    //         typescript(),
    //         commonjs(),
    //         json(),
    //         nodeResolve()
    //     ]
    // }
