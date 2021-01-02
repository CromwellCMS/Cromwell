import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import packageJson from './package.json';
import { resolve } from 'path';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";

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
        input: resolve(__dirname, "src/cli.ts"),
        output: {
            file: resolve(__dirname, buildDir, 'cli.js'),
            format: "cjs",
        },
        external,
        plugins: [
            json(),
            commonjs(),
            typescript({
                module: "ESNext"
            }),
            terser(),
        ]
    },
];