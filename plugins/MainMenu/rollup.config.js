import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';

export default {
    input: 'src/index.ts',
    preserveModules: true,
    output: [
        {
            dir: './es',
            format: "esm",
            // sourcemap: true
        }
    ],
    plugins: [
        json(),
        autoExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true })
    ]
};