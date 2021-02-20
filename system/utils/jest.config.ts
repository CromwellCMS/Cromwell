import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: "node",
    moduleNameMapper: {
        '@App/(.*)': '<rootDir>/src/$1',
    },
    testRegex: "/(tests|src)/.*rollup\\.(test|spec)\\.[jt]sx?$",
    maxConcurrency: 2,
    silent: false,
    globals: {
        "ts-jest": {
        }
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "js", "json", "node"],
    // setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"]
};

export default config;
