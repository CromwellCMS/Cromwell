import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '@App/(.*)': '<rootDir>/src/$1',
        "\\.s?css$": "identity-obj-proxy",
    },
    silent: false,
    testTimeout: 10000,
    testRegex: "/(tests|src)/.*\\.(test|spec)\\.[jt]sx?$",
    maxWorkers: 1,
    maxConcurrency: 1,
    globals: {
        "ts-jest": {
        }
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    globalTeardown: "<rootDir>/tests/teardown.ts",
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"]
};

export default config;
