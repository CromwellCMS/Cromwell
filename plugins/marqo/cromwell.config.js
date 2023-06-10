module.exports = {
  defaultSettings: {
    marqo_url: '',
    index_name: '',
    secret: '',
  },
  rollupConfig: () => {
    const commonjs = require('@rollup/plugin-commonjs');
    const typescript = require('rollup-plugin-ts-compiler');
    const { terser } = require('rollup-plugin-terser');

    return {
      backend: {
        plugins: [
          typescript({
            monorepo: true,
            compilerOptions: {
              target: 'ES2019',
            },
          }),
          commonjs(),
        ],
      },
      main: {
        plugins: [
          typescript({
            monorepo: true,
            compilerOptions: {
              target: 'es5',
            },
          }),
          commonjs(),
          terser({
            compress: {
              side_effects: false,
              negate_iife: false,
            },
          }),
        ],
      },
    };
  },
};
