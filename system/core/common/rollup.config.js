import { resolve } from 'path';
import autoExternal from 'rollup-plugin-auto-external';
// import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-ts-compiler';

const input = resolve(__dirname, 'src/_index.ts');
const external = ['next/link', "tslib"];
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
            }
        }),
        autoExternal(),
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
            ],
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