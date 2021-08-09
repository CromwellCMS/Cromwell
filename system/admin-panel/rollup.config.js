import { isExternalForm } from '@cromwell/core-backend';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { resolve } from 'path';
import typescript from 'rollup-plugin-ts-compiler';

const buildDir = 'build';

fs.ensureDirSync(resolve(__dirname, buildDir));

const sharedState = {};
const compilerOptions = {
    declaration: true,
    declarationMap: true,
    declarationDir: resolve(__dirname, buildDir, 'types')
};
const tsOptions = {
    monorepo: true,
    compilerOptions,
    sharedState,
}

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
        external: isExternalForm,
        plugins: [
            typescript(tsOptions),
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
        external: isExternalForm,
        plugins: [
            typescript(tsOptions),
            json(),
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
        ]
    },
];