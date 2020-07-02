import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import postcss from 'rollup-plugin-postcss-modules';
import autoprefixer from "autoprefixer";

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
            postcss({
                plugins: [autoprefixer()],
                extract: false,
                writeDefinitions: false,
                use: ['sass'],
            }),
            typescript(),
            // resolve({
            //     dedupe: ['@material-ui/icons']
            // }),
            commonjs()
        ]
    }
];