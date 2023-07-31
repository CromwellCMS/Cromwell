import { isAbsolute, resolve } from 'path';
import typescript from 'rollup-plugin-ts-compiler';

const external = (id) => {
  return !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);
};

const input = resolve(__dirname, 'src/_index.ts');
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
  ];
};

export default [
  {
    input,
    output: getOutput('cjs'),
    plugins: getPlugins(),
    external,
    preserveModules: true,
    watch: {
      clearScreen: false,
      buildDelay: 1000,
    },
  },
  {
    input,
    output: getOutput('esm'),
    plugins: getPlugins(),
    external,
    preserveModules: true,
    watch: {
      clearScreen: false,
      buildDelay: 1000,
    },
  },
];
