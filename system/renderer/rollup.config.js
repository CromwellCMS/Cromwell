import { isExternalForm } from '@cromwell/core-backend';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-ts-compiler';

const { resolve } = require('path');

const buildDir = 'build';

const typescriptOptions = {
    compilerOptions: {
        module: 'ESNext',
        declaration: true,
        declarationMap: true,
        declarationDir: resolve(__dirname, buildDir)
    },
    sharedState: {},
    monorepo: true,
}

export default [
    {
        // preserveModules: true,
        input: resolve(__dirname, "src/index.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'renderer.js'),
                // dir: './build',
                format: "esm",
            }
        ],
        external: (ext) => {
            if (ext === './generated-imports') return true;
            return isExternalForm(ext)
        },
        plugins: [
            typescript(typescriptOptions),
            commonjs(),
            json(),
        ]
    },
    {
        input: resolve(__dirname, "src/generator.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'generator.js'),
                format: "cjs",
            }
        ],
        external: isExternalForm,
        plugins: [
            typescript(typescriptOptions),
            commonjs(),
        ]
    },
    {
        input: resolve(__dirname, "src/server.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'server.js'),
                format: "cjs",
            }
        ],
        external: isExternalForm,
        plugins: [
            typescript(typescriptOptions),
            commonjs(),
        ]
    },
    {
        input: resolve(__dirname, "src/generated-imports.ts"),
        output: [
            {
                file: resolve(__dirname, buildDir, 'generated-imports.js'),
                format: "cjs",
            }
        ],
        external: isExternalForm,
        plugins: [
            typescript(typescriptOptions),
            commonjs(),
        ]
    },
];