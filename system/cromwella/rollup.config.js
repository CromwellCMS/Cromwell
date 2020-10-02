import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import packageJson from './package.json';
import { resolve } from 'path';
import json from '@rollup/plugin-json';

const external = id => {
    const exts = ['util', 'path', 'colors/safe', 'webpack'];
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
    nodeResolve({
        preferBuiltins: false
    }),
    commonjs(),
    typescript({
        module: "ESNext"
    }),
    json()
]

const buildDir = 'build';

export default [
    {
        input: resolve(__dirname, "src/installer.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'installer.js'),
                format: "cjs",
            }
        ],
        external,
        plugins: plugins
    },
    {
        input: resolve(__dirname, "src/bundler.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'bundler.js'),
                format: "cjs",
            }
        ],
        external,
        plugins: plugins
    },
    {
        input: resolve(__dirname, "src/cli.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'cli.js'),
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
                file: resolve(__dirname, '../../.cromwell/importer.js'),
                format: "iife",
            }
        ],
        plugins: [
            typescript({
                module: "ESNext",
                lib: ["es5", "es6", "dom"],
                target: "esnext"
            }),
            nodeResolve(),
            commonjs(),
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
            // nodeResolve({
            //     preferBuiltins: false
            // }),
            // commonjs(),
            typescript({
                module: "ESNext",
                declaration: true,
                declarationMap: true,
                rootDir: resolve(__dirname, 'src'),
                declarationDir: resolve(__dirname, buildDir)
            }),
            json()
        ]
    },
];