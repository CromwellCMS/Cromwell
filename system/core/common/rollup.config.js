import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
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
        external: ['next/link', "tslib"],
        plugins: [
            autoExternal(),
            nodeResolve(),
            commonjs(),
            typescript({ useTsconfigDeclarationDir: true })
        ]
    }
];