import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-ts";
import packageJson from './package.json';
import json from '@rollup/plugin-json';
import fs from 'fs-extra';
import ts from 'typescript';
const { resolve } = require('path');

const external = id => {
    const exts = ['tslib', 'util', 'path'];

    for (const ext of exts) if (id === ext) return true;

    if (id.includes('.cromwell/imports') || id.includes('cromwell/plugins')
        || id.includes('cromwell/themes'))
        return true;

    for (const pack of Object.keys(packageJson.dependencies)) {
        if (id === pack) {
            return true;
        }
    }

    for (const pack of Object.keys(packageJson.devDependencies)) {
        if (id === pack) {
            return true;
        }
    }
}

const buildDir = 'build';
const typeScriptOptions = {
    module: ts.ModuleKind.ESNext,
    rootDir: resolve(__dirname, 'src'),
    allowJs: true,
    outDir: resolve(__dirname, buildDir)
};

fs.ensureDirSync(resolve(__dirname, buildDir));

export default [
    {
        // preserveModules: true,
        input: resolve(__dirname, "src/server.ts"),
        output: [
            {
                // file: resolve(__dirname, buildDir, 'server.js'),
                dir: resolve(__dirname, buildDir),
                format: "cjs",
            }
        ],
        external,
        plugins: [
            json(),
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
            typescript({
                tsconfig: resolvedConfig => ({ ...resolvedConfig, ...typeScriptOptions })
            }),
        ]
    },
    {
        // preserveModules: true,
        input: resolve(__dirname, "src/compiler.ts"),
        output: [
            {
                // file: resolve(__dirname, buildDir, 'server.js'),
                dir: resolve(__dirname, buildDir),
                format: "cjs",
            }
        ],
        external,
        plugins: [
            json(),
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
            typescript({
                tsconfig: resolvedConfig => ({ ...resolvedConfig, ...typeScriptOptions })
            }),
        ]
    },
];