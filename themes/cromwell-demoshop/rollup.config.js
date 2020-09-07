import autoExternal from "rollup-plugin-auto-external";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import postcss from 'rollup-plugin-postcss';
import autoprefixer from "autoprefixer";
import alias from '@rollup/plugin-alias';
import del from 'rollup-plugin-delete';
import cromwellConfig from './cromwell.config.json';
import { resolve } from 'path';

const distDir = resolve(__dirname, cromwellConfig.appConfig.buildDir);

export default {
    input: './src/index.ts',
    preserveModules: true,
    output: [
        {
            dir: distDir,
            format: "cjs",
            exports: "auto"
        }
    ],
    external: ['react', 'react-dom', '@cromwell/core', '@cromwell/core-frontend', 'next/document', 'next/app', 'next/router'],
    plugins: [
        // del({ targets: distDir }),
        // image(),
        postcss({
            plugins: [
                autoprefixer(),
                // imageInliner({ assetPaths: ['src/images'], b64Svg: true }),
                // postcssAssets({ loadPaths: ['**'] })
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
        typescript({ useTsconfigDeclarationDir: true }),
    ]
};