import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import packageJson from './package.json';
import { resolve } from 'path';
import json from '@rollup/plugin-json';

const external = id => {
    const exts = ['util', 'path'];
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
        input: resolve(__dirname, "src/manager.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'manager.js'),
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
                module: "ESNext"
            }),
        ]
    },
];