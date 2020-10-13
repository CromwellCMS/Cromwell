import autoExternal from "rollup-plugin-auto-external";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import cromwellConfig from './cromwell.config.js';
import { resolve } from 'path';
import packageJson from './package.json';
import { rollupPluginCromwellFrontend } from '@cromwell/cromwella';


const distDir = resolve(__dirname, cromwellConfig.buildDir);

export default [
    {
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
            autoExternal(),
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    },
    {
        input: 'src/frontend/index.tsx',
        output: [
            {
                file: resolve(distDir, 'frontend.js'),
                format: "iife",
                name: 'CustomerReviews',
                exports: 'named'
            }
        ],
        plugins: [
            rollupPluginCromwellFrontend({
                dependencies: Object.keys(packageJson.dependencies)
            }),
            // autoExternal(),
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    }
];
