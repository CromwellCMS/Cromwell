import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import packageJson from './package.json';
import { resolve, isAbsolute } from 'path';

const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);
// const external = id => {
//     if (id.includes('.cromwell/imports') || id.includes('cromwell/plugins') || id === 'tslib' ||
//         id.startsWith('next/'))
//         return true;
//     for (const pack of Object.keys(packageJson.dependencies)) {
//         if (id === pack) {
//             return true;
//         }
//     }
// }

export default [
    {
        // preserveModules: true,
        input: resolve(__dirname, "src/server.ts"),
        output: [
            {
                file: resolve(__dirname, 'build/server.js'),
                // dir: './build',
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
        ]
    }
];