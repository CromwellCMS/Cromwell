module.exports = {
  defaultSettings: {
    client_id: 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
    client_secret: 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM',
    mode: 'sandbox',
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
