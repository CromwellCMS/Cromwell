import typescript from 'rollup-plugin-ts';
import { resolve } from 'path';
import autoExternal from 'rollup-plugin-auto-external';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const input = resolve(__dirname, 'src/index.ts');
const external = ['next/link', "tslib"];
const getOutput = (format = 'esm') => {
    if (format === 'esm') {
        return { dir: resolve(__dirname, pkg.module), format, sourcemap: true, };
    }
    return { file: resolve(__dirname, pkg.main), format };
};
const getPlugins = (format = 'esm') => {
    const typeScriptOptions = format === 'esm' ?
        {
            declaration: true,
            declarationMap: true,
            declarationDir: resolve(__dirname, pkg.module)
        } : {};

    return [
        autoExternal(),
        typescript({
            tsconfig: resolvedConfig => ({ ...resolvedConfig, ...typeScriptOptions })
        }),
        // terser(),
    ];
};

export default [
    {
        input,
        output: getOutput('cjs'),
        plugins: getPlugins('cjs'),
        external,
        watch: {
            clearScreen: false,
            buildDelay: 1000,
            exclude: [
                'node_modules/**',
                'dist/**',
                'es/**',
            ],
        }
    },
    {
        input,
        output: getOutput('esm'),
        plugins: getPlugins('esm'),
        external,
        watch: {
            clearScreen: false,
            buildDelay: 1000,
            exclude: [
                'node_modules/**',
                'dist/**',
                'es/**',
            ]
        }
    },
];