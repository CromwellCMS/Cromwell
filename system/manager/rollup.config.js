import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
const { resolve } = require('path');

const external = id => {
    const exts = ['util', 'path'];
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
        input: resolve(__dirname, "src/cromwella.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'cromwella.js'),
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
                module: "ESNext"
            }),
        ]
    },
];