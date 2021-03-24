import { resolve } from 'path';
import autoExternal from 'rollup-plugin-auto-external';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-ts-compiler';
import pkg from './package.json';

const input = resolve(__dirname, 'src/index.ts');
const external = ["tslib"];
const getOutput = (format = 'esm') => {
    if (format === 'esm') {
        return { dir: resolve(__dirname, pkg.module), format, sourcemap: true, };
    }
    return { file: resolve(__dirname, pkg.main), format };
};
const sharedState = {};

const getPlugins = () => {
    return [
        typescript({
            sharedState,
            compilerOptions: {
                declaration: true,
                declarationMap: true,
                declarationDir: resolve(__dirname, pkg.module)
            },
            monorepo: true,
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
        }
    },
];