import autoExternal from "rollup-plugin-auto-external";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { resolve } from 'path';
import { rollupPluginCromwellFrontend } from '@cromwell/cromwella';
const cromwellConfig = require('./cromwell.config.js');

const distDir = resolve(__dirname, cromwellConfig.buildDir);

export default [
    {
        input: 'src/frontend/index.tsx',
        output: [
            {
                file: resolve(__dirname, cromwellConfig.frontendBundle),
                format: "iife",
                name: cromwellConfig.name,
            }
        ],
        plugins: [
            rollupPluginCromwellFrontend({
                type: 'plugin'
            }),
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    }
]