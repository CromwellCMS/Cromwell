import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-ts";
import { resolve } from 'path';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";
import { isAbsolute } from 'path';
import ts from 'typescript';

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
            json(),
            commonjs(),
            typescript({
                tsconfig: resolvedConfig => ({ ...resolvedConfig, module: ts.ModuleKind.ESNext })
            }),
            // terser(),
        ]
    },
];