import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import packageJson from './package.json';
import { resolve, isAbsolute } from 'path';
import { terser } from "rollup-plugin-terser";

const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);

export default [
    {
        input: resolve(__dirname, "src/main.ts"),
        output: [
            {
                file: resolve(__dirname, 'build/server.js'),
                format: "cjs",
            }
        ],
        external: external,
        plugins: [
            // autoExternal(),
            nodeResolve(),
            commonjs(),
            typescript({
                module: "ESNext"
            }),
            // terser()
        ]
    }
];