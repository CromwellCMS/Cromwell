import autoExternal from "rollup-plugin-auto-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import sass from "rollup-plugin-sass";
import commonjs from "@rollup/plugin-commonjs";
// import postcss from 'rollup-plugin-postcss-modules';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from "autoprefixer";

export default {
    input: './src/index.ts',
    preserveModules: true,
    output: [
        {
            dir: './es',
            format: "esm",
            // sourcemap: true
        },
        {
            dir: './dist',
            format: "cjs",
            // sourcemap: true
        }
    ],
    external: ['style-inject', 'style-inject/dist', 'style-inject/dist/style-inject.es.js'],
    plugins: [
        autoExternal(),
        postcss({
            plugins: [autoprefixer()],
            extract: false,
            modules: true,
            writeDefinitions: false,
            inject: false,
            use: ['sass'],
        }),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true }),
    ]
};