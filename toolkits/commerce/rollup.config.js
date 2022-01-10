import commonjs from '@rollup/plugin-commonjs';
import { isAbsolute, resolve, basename } from 'path';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-ts-compiler';
import stringHash from "string-hash";

const external = id => {
    return !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);
}

const input = resolve(__dirname, 'src/index.ts');

const getOutput = (format = 'esm') => {
    if (format === 'esm') {
        return { dir: resolve(__dirname, 'es'), format, sourcemap: true, exports: 'auto' };
    }
    return { dir: resolve(__dirname, 'dist'), format, exports: 'auto' };
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
            modules: {
                generateScopedName: function (name, filename) {
                    const hash = stringHash(`@cromwell/commerce_${basename(filename)}`).toString(36).substr(0, 5);
                    return `ccom_${name}_${hash}`;
                },
            },
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