import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-ts";
import packageJson from './package.json';
import { rollupPluginCromwellFrontend } from '@cromwell/utils';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";
import ts from 'typescript';

const { resolve } = require('path');

const external = id => {
    const exts = ['tslib', 'util', 'path'];

    if (id.includes('.cromwell/imports') || id.includes('cromwell/plugins')
        || id.includes('cromwell/themes'))
        return true;

    for (const ext of exts) if (id === ext) return true;

    for (const pack of Object.keys(packageJson.dependencies)) {
        if (id === pack) {
            return true;
        }
    }
}

const buildDir = 'build';

export default [
    {
        // preserveModules: true,
        input: resolve(__dirname, "src/index.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'renderer.js'),
                // dir: './build',
                format: "esm",
            }
        ],
        external,
        plugins: [
            // autoExternal(),
            rollupPluginCromwellFrontend({ generateMeta: false }),
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
            typescript({
                tsconfig: resolvedConfig => ({
                    ...resolvedConfig,
                    module: ts.ModuleKind.ESNext
                })
            }),
            json(),
            // terser()
        ]
    },
    {
        // preserveModules: true,
        input: resolve(__dirname, "src/generator.ts"),
        // watch: false,
        output: [
            {
                file: resolve(__dirname, buildDir, 'generator.js'),
                // dir: './build',
                format: "cjs",
            }
        ],
        external,
        plugins: [
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
            typescript({
                tsconfig: resolvedConfig => ({
                    ...resolvedConfig,
                    module: ts.ModuleKind.ESNext
                })
            }),
            // terser(),
        ]
    },
];