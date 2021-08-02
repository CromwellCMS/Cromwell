import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: "jsdom",
    moduleNameMapper: {
        '@App/(.*)': '<rootDir>/src/$1',
        "\\.s?css$": "identity-obj-proxy",
    },
    // silent: false,
    testRegex: "/(tests|src)/.*\\.(test|spec)\\.[jt]sx?$",
    /** for circle ci free plan */
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
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"]
};

export default config;
