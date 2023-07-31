import commonjs from '@rollup/plugin-commonjs';
import { isAbsolute, resolve, basename } from 'path';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-ts-compiler';
import stringHash from 'string-hash';
// import { terser } from 'rollup-plugin-terser';

const external = (id) => {
  return !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);
};

const input = resolve(__dirname, 'src/_index.ts');
// const external = ['next/link', 'next/head', 'next/dynamic', 'next/document', "tslib"];

const getOutput = (format = 'esm') => {
  if (format === 'esm') {
    return { dir: resolve(__dirname, 'es'), format, sourcemap: true };
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
        declarationDir: resolve(__dirname, 'dist'),
      },
      monorepo: true,
    }),
    commonjs(),
    postcss({
      extract: true,
      modules: {
        generateScopedName: function (name, filename) {
          const hash = stringHash(`@cromwell/core-frontend_${basename(filename)}`)
            .toString(36)
            .substr(0, 5);
          return `ccf_${hash}_${name}`;
        },
      },
      writeDefinitions: false,
      inject: false,
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
    preserveModules: true,
    external,
    watch: {
      clearScreen: false,
      buildDelay: 1000,
      exclude: ['node_modules/**', 'dist/**', 'es/**'],
    },
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
      exclude: ['node_modules/**', 'dist/**', 'es/**'],
    },
  },
];
