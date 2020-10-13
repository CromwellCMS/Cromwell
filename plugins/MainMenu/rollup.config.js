import autoExternal from "rollup-plugin-auto-external";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';
import cromwellConfig from './cromwell.config.js';
import { resolve } from 'path';

const distDir = resolve(__dirname, cromwellConfig.buildDir);

export default {
    input: 'src/index.ts',
    preserveModules: true,
    output: [
        {
            dir: distDir,
            format: "cjs",
            exports: "auto"
        }
    ],
    plugins: [
        json(),
        autoExternal(),
        nodeResolve(),
        commonjs(),
        typescript()
    ]
};