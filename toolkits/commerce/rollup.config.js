import commonjs from '@rollup/plugin-commonjs';
import { isAbsolute, resolve } from 'path';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-ts-compiler';

const external = id => {
    return !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);
}

const input = resolve(__dirname, 'src/index.ts');

const getOutput = (format = 'esm') => {
    if (format === 'esm') {
        return { dir: resolve(__dirname, 'es'), format, sourcemap: true, };
    }
    return { dir: resolve(__dirname, 'dist'), format };
};

const sharedState = {};

const getPlugins = () => {
    return [
        typescript({
            sharedState,
            compilerOptions: {
                declaration: true,
                declarationMap: true,
                declarationDir: resolve(__dirname, 'dist')
            },
            monorepo: true,
        }),
        commonjs(),
        postcss({
            extract: true,
            modules: true,
            writeDefinitions: false,
            inject: false,
            use: ['sass'],
        }),
    ];
};

export default [
    {
        input,
        output: getOutput('cjs'),
        plugins: getPlugins(),
        preserveModules: true,
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
        preserveModules: true,
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