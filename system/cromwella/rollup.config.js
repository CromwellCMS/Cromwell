import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import packageJson from './package.json';
import { resolve } from 'path';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";

const external = id => {
    const exts = ['util', 'path', 'colors/safe', 'webpack', 'webpack/lib/ExternalModuleFactoryPlugin'];
    for (const ext of exts) if (id === ext) return true;
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

const plugins = [
    commonjs(),
    typescript({
        tsconfigOverride: {
            module: "ESNext"
        }
    }),
    json(),
    // terser()
]

const buildDir = 'build';

export default [
    {
        preserveModules: true,
        input: resolve(__dirname, "src/cli.ts"),
        output: [
            {
                dir: resolve(__dirname, buildDir),
                format: "cjs",
            }
        ],
        external,
        plugins: plugins
    },
    {
        input: resolve(__dirname, "src/browser.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'browser/importer.js'),
                format: "iife",
            }
        ],
        plugins: [
            typescript({
                tsconfigOverride: {
                    module: "ESNext",
                    lib: ["es5", "es6", "dom"],
                    target: "es5"
                }
            }),
            commonjs(),
            // terser()
        ]
    },
    {
        preserveModules: true,
        input: resolve(__dirname, "src/exports.ts"),
        output: [
            {
                dir: resolve(__dirname, buildDir),
                format: "cjs",
            }
        ],
        external,
        plugins: [
            typescript({
                tsconfigOverride: {
                    module: "ESNext",
                    declaration: true,
                    declarationMap: true,
                    rootDir: resolve(__dirname, 'src'),
                    declarationDir: resolve(__dirname, buildDir)
                }
            }),
            json(),
            // terser(),
        ]
    },
];