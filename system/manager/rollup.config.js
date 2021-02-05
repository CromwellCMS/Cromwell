import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-ts";
import packageJson from './package.json';
import { resolve } from 'path';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";
import { dirname, isAbsolute } from 'path';
import ts from 'typescript';

// const external = id => {
//     const exts = ['util', 'path'];
//     for (const ext of exts) if (id === ext) return true;
//     for (const pack of Object.keys(packageJson.dependencies)) {
//         if (id === pack) {
//             return true;
//         }
//     }
// }
const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);


const buildDir = 'build';

export default [
    {
        input: resolve(__dirname, "src/index.ts"),
        output: {
            dir: resolve(__dirname, buildDir),
            format: "cjs",
        },
        external,
        plugins: [
            json(),
            commonjs(),
            typescript({
                tsconfig: resolvedConfig => ({
                    ...resolvedConfig,
                    module: ts.ModuleKind.ESNext,
                    declaration: true,
                    declarationMap: true,
                    declarationDir: resolve(__dirname, buildDir)
                })
            }),
            // terser(),
        ]
    },
];