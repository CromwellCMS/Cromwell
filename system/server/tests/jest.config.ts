import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  silent: false,
  testRegex: '/.*\\.(test|spec)\\.[jt]sx?$',
  /** for circle ci free plan */
  maxWorkers: 1,
  maxConcurrency: 1,
  globals: {
    'ts-jest': {},
  },
  testTimeout: 10000,
  globalTeardown: '<rootDir>/teardown.ts',
  globalSetup: '<rootDir>/setup.ts',
  setupFilesAfterEnv: ['<rootDir>/setup-files.ts'],
};

export default config;
