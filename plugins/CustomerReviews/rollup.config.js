import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import del from 'rollup-plugin-delete';
import cromwellConfig from './cromwell.config.json';
import { resolve } from 'path';

const distDir = resolve(__dirname, cromwellConfig.buildDir);

export default {
    input: 'src/index.ts',
    preserveModules: true,
    output: [
        {
            dir: distDir,
            format: "cjs",
            exports: "auto"
        }
    ],
    plugins: [
        del({ targets: distDir }),
        autoExternal(),
        nodeResolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true })
    ]
};