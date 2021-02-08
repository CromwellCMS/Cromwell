import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@App/(.*)': '<rootDir>/src/$1'
  },
  // silent: false,
  testRegex: "/__tests__/.*\\.(test|spec)\\.[jt]sx?$",
  // maxConcurrency: 1,
  globals: {
    "ts-jest": {
    }
  },
  globalTeardown: "<rootDir>/__tests__/teardown.ts"
};

export default config;
