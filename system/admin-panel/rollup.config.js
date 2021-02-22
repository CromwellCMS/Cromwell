import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { resolve } from 'path';
import typescript from 'rollup-plugin-ts-compiler';
import packageJson from './package.json';

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

fs.ensureDirSync(resolve(__dirname, buildDir));

const sharedState = {};

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
            typescript({
                sharedState
            }),
            json(),
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
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
            typescript({
                sharedState
            }),
            json(),
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
        ]
    },
];