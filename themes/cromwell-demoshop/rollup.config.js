import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import postcss from 'rollup-plugin-postcss';
import autoprefixer from "autoprefixer";
import alias from '@rollup/plugin-alias';
import cromwellConfig from './cromwell.config.json';
import { resolve } from 'path';
import { rollupPluginCromwellFrontend } from '@cromwell/cromwella';
import json from '@rollup/plugin-json';

const distDir = resolve(__dirname, cromwellConfig.appConfig.buildDir);

export default {
    input: resolve(__dirname, 'src/index.ts'),
    preserveModules: true,
    output: [
        {
            dir: distDir,
            format: "esm",
        }
    ],
    plugins: [
        rollupPluginCromwellFrontend(),
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
};