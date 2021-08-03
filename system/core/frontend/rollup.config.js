import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { isAbsolute, resolve } from 'path';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-ts-compiler';
// import { terser } from 'rollup-plugin-terser';

const external = id => {
    return !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);
}

const input = resolve(__dirname, 'src/_index.ts');
// const external = ['next/link', 'next/head', 'next/dynamic', 'next/document', "tslib"];

const getOutput = (format = 'esm') => {
    if (format === 'esm') {
        return { dir: resolve(__dirname, 'es'), format, sourcemap: true, };
    }
    return { file: resolve(__dirname, 'dist/index.js'), format };
};

const sharedState = {};

const getPlugins = () => {
    return [
        typescript({
            sharedState,
            compilerOptions: {
                declaration: true,
                declarationMap: true,
                declarationDir: resolve(__dirname, 'es')
            },
            monorepo: true,
        }),
        nodeResolve(),
        commonjs(),
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
        plugins: getPlugins(),
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
        plugins: getPlugins(),
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