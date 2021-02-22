import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-ts-compiler";
import { resolve } from 'path';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";
import { isAbsolute } from 'path';

const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);

const buildDir = 'build';

export default [
    {
        input: resolve(__dirname, "src/cli.ts"),
        output: {
            file: resolve(__dirname, buildDir, 'cli.js'),
            format: "cjs",
        },
        external,
        plugins: [
            typescript({
                compilerOptions: {
                    module: 'ESNext'
                }
            }),
            json(),
            commonjs(),
            // terser(),
        ]
    },
];