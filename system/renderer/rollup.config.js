import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import packageJson from './package.json';
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
                format: "cjs",
            }
        ],
        external,
        plugins: [
            // autoExternal(),
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: "ESNext"
                    }
                }
            }),
        ]
    },
    {
        // preserveModules: true,
        input: resolve(__dirname, "src/generator.ts"),
        watch: false,
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
                tsconfigOverride: {
                    compilerOptions: {
                        module: "ESNext"
                    }
                }
            }),
        ]
    },
];