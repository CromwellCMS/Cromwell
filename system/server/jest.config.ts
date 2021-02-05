import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  silent: false,
  testRegex: "/__tests__/.*\\.(test|spec)\\.[jt]sx?$",
  maxConcurrency: 1,
  globals: {
    "ts-jest": {
      "experimental": true,
      "compilerHost": true
    }
  },
  setupFiles: ["<rootDir>/__tests__/setup.ts"],
  globalTeardown: "<rootDir>/__tests__/teardown.ts"

};

export default config;
