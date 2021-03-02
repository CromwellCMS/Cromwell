import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: "node",
    moduleNameMapper: {
        '@App/(.*)': '<rootDir>/src/$1',
    },
    testRegex: "/(tests|src)/.*\\.(test|spec)\\.[jt]sx?$",
    maxConcurrency: 2,
    silent: false,
    globals: {
        "ts-jest": {
        }
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testTimeout: 10000,
    moduleFileExtensions: ["ts", "js", "json", "node"],
    // setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"]
};

export default config;
