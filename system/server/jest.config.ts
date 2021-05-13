import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@App/(.*)': '<rootDir>/src/$1'
  },
  // silent: false,
  testRegex: "/tests/.*\\.(test|spec)\\.[jt]sx?$",
  /** for circle ci free plan */
  maxWorkers: 1,
  maxConcurrency: 1,
  globals: {
    "ts-jest": {
    }
  },
  globalTeardown: "<rootDir>/tests/teardown.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};

export default config;
