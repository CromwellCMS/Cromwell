module.exports = {
  defaultSettings: {
    stripeApiKey: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
    enabled: true,
  },
  rollupConfig: () => {
    const commonjs = require('@rollup/plugin-commonjs');
    const typescript = require('rollup-plugin-ts-compiler');
    const { terser } = require('rollup-plugin-terser');
    return {
      main: {
        plugins: [
          typescript({
            monorepo: true,
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
    };
  },
};
