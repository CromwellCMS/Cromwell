// import typescript from 'rollup-plugin-ts';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import autoprefixer from 'autoprefixer';
import { resolve, isAbsolute } from 'path';
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const external = id => {
    if (id === 'swiper/swiper-bundle.min.css') return false;

    return !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);
}

const input = resolve(__dirname, 'src/index.ts');
// const external = ['next/link', 'next/head', 'next/dynamic', 'next/document', "tslib"];

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
        nodeResolve(),
        commonjs(),
        // typescript({
        //     tsconfig: resolvedConfig => ({ ...resolvedConfig, ...typeScriptOptions })
        // }),
        typescript({
            tsconfigOverride: { compilerOptions: typeScriptOptions }
        }),
        postcss({
            extract: false,
            modules: true,
            writeDefinitions: false,
            inject: true,
            use: ['sass'],
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
            ]
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