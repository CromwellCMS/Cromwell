import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import packageJson from './package.json';
const { resolve } = require('path');

const external = id => {
    console.log('id', id)
    const exts = ['tslib', 'util', 'path'];

    for (const ext of exts) if (id === ext) return true;

    // for (const pack of Object.keys(packageJson.dependencies)) {
    //     if (id === pack) {
    //         return true;
    //     }
    // }
}


const buildDir = 'build';

export default [
    {
        input: resolve(__dirname, "src/lerna.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'lerna.js'),
                format: "cjs",
            }
        ],
        external,
        plugins: [
            nodeResolve({
                // preferBuiltins: false
            }),
            commonjs(),
            typescript(),
        ]
    },
];