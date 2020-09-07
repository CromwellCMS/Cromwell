import autoExternal from "rollup-plugin-auto-external";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import postcss from 'rollup-plugin-postcss';
import autoprefixer from "autoprefixer";
import alias from '@rollup/plugin-alias';
import cromwellConfig from './cromwell.config.json';
import { resolve } from 'path';

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
    external: ['react', 'react-dom', '@cromwell/core', '@cromwell/core-frontend', 'next/document', 'next/app', 'next/router'],
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
        autoExternal(),
        nodeResolve(),
        commonjs(),
        typescript()
    ]
};