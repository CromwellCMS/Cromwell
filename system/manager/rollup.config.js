import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { isAbsolute, resolve } from 'path';
import typescript from 'rollup-plugin-ts-compiler';

const external = (id) => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);

const buildDir = 'build';

export default [
  {
    input: resolve(__dirname, 'src/index.ts'),
    output: {
      dir: resolve(__dirname, buildDir),
      format: 'cjs',
    },
    external,
    plugins: [
      typescript({
        compilerOptions: {
          module: 'ESNext',
          declaration: true,
          declarationMap: true,
          declarationDir: resolve(__dirname, buildDir),
        },
        monorepo: true,
      }),
      json(),
      commonjs(),
    ],
  },
];
