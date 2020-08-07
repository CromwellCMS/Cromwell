import autoExternal from "rollup-plugin-auto-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import sass from "rollup-plugin-sass";
import commonjs from "@rollup/plugin-commonjs";
import del from 'rollup-plugin-delete';


export default {
    input: 'src/index.ts',
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
    plugins: [
        del({ targets: './es/*' }),
        autoExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true }),
        sass({
            insert: true
        })
    ]
};