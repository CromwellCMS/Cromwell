import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import sass from "rollup-plugin-sass";
import typescript from "rollup-plugin-typescript2";
import packageJson from "./package.json";

export default [
    {
        input: "./src/index.ts",
        output: [
            {
                file: 'dist/index.js',
                format: "cjs",
                sourcemap: true
            },
            {
                file: 'es/index.js',
                format: "esm",
                sourcemap: true
            }
        ],
        external: ['next/link', "tslib"],
        plugins: [
            autoExternal(),
            resolve(),
            commonjs(),
            typescript({ useTsconfigDeclarationDir: true }),
            sass({
                insert: true
            })
        ]
    },
    {
        input: "./src/backend/index.ts",
        output: [
            {
                file: 'dist/backend/index.js',
                format: "cjs",
                sourcemap: true
            },
            {
                file: 'es/backend/index.js',
                format: "esm",
                sourcemap: true
            }
        ],
        external: ['next/link', "tslib"],
        plugins: [
            autoExternal(),
            resolve(),
            commonjs(),
            typescript({ useTsconfigDeclarationDir: true }),
            sass({
                insert: true
            })
        ]
    }
];