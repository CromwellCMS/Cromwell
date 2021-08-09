import typescript from "rollup-plugin-ts-compiler";
import { resolve } from 'path';
import fs from 'fs-extra';
import json from '@rollup/plugin-json';
import { isExternalForm } from '@cromwell/core-backend';

const buildDir = 'build';

const options = [
    {
        preserveModules: true,
        input: resolve(__dirname, "src/exports.ts"),
        output: [
            {
                dir: resolve(__dirname, buildDir),
                format: "cjs",
            }
        ],
        external: isExternalForm,
        plugins: [
            typescript({
                compilerOptions: {
                    module: 'ESNext',
                    declaration: true,
                    declarationMap: true,
                    declarationDir: resolve(__dirname, buildDir)
                },
                monorepo: true,
            }),
            json(),
        ]
    }
];

const bundlerPath = resolve(__dirname, "src/bundler/bundler.ts");
if (fs.pathExistsSync(bundlerPath)) {
    options.push({
        input: bundlerPath,
        output: [
            {
                dir: resolve(__dirname, 'bundler'),
                format: "cjs",
            }
        ],
        external: isExternalForm,
        plugins: [
            typescript({
                compilerOptions: {
                    module: 'ESNext',
                    declaration: true,
                    declarationMap: true,
                    declarationDir: resolve(__dirname, buildDir)
                },
                monorepo: true,
            }),
            json(),
        ]

    });
}


export default options;