import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@App/(.*)': '<rootDir>/src/$1',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@pages/(.*)': '<rootDir>rc/router-pages/$1',
    '@hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@helpers/(.*)': '<rootDir>/src/helpers/$1',
    '@redux/(.*)': '<rootDir>/src/redux/$1',
    '@constants/(.*)': '<rootDir>/src/constants/$1',
    '\\.s?css$': 'identity-obj-proxy',
  },
  silent: false,
  testRegex: '/(tests|src)/.*\\.(test|spec)\\.[jt]sx?$',
  /** for circle ci free plan */
  maxWorkers: 1,
  maxConcurrency: 1,
  globals: {
    'ts-jest': {},
  },
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react'],
          '@babel/preset-typescript',
        ],
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.tsx'],
  transformIgnorePatterns: ['node_modules/(?!pretty-bytes|module2|etc)'],
};

export default config;
