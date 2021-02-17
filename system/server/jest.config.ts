import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@App/(.*)': '<rootDir>/src/$1'
  },
  // silent: false,
  testRegex: "/tests/.*\\.(test|spec)\\.[jt]sx?$",
  maxConcurrency: 2,
  globals: {
    "ts-jest": {
    }
  },
  globalTeardown: "<rootDir>/tests/teardown.ts"
};

export default config;
