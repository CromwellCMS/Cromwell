import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import autoprefixer from "autoprefixer";
import postcss from 'rollup-plugin-postcss';
import { resolve } from 'path';

export default [
    {
        input: resolve(__dirname, "src/index.ts"),
        output: [
            {
                file: resolve(__dirname, 'dist/index.js'),
                format: "cjs",
                sourcemap: true
            },
            {
                file: resolve(__dirname, 'es/index.js'),
                format: "esm",
                sourcemap: true
            }
        ],
        external: ['next/link', 'next/head', "tslib"],
        plugins: [
            autoExternal(),
            postcss({
                plugins: [autoprefixer()],
                extract: false,
                inject: true,
                writeDefinitions: false,
                autoModules: true,
                use: ['sass'],
            }),
            typescript(),
            nodeResolve(),
            commonjs()
        ]
    }
];