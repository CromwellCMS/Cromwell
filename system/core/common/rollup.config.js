import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
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
            declaration: true, declarationMap: true, rootDir: resolve(__dirname, 'src'),
            declarationDir: resolve(__dirname, pkg.module)
        } : {};
    return [
        autoExternal(),
        nodeResolve(),
        commonjs(),
        typescript(typeScriptOptions),
        terser(),
    ];
};

export default [
    {
        input,
        output: getOutput('cjs'),
        plugins: getPlugins('cjs'),
        external,
    },
    {
        input,
        output: getOutput('esm'),
        plugins: getPlugins('esm'),
        external,
    },
];