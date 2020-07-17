import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import autoprefixer from "autoprefixer";
import postcss from 'rollup-plugin-postcss';

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
            resolve(),
            commonjs()
        ]
    }
];