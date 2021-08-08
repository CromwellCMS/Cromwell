import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.s?css$": "identity-obj-proxy",
    },
    silent: false,

    
    testRegex: "/(tests|src)/.*\\.(test|spec)\\.[jt]sx?$",
    /** for circle ci free plan */
    testTimeout: 10000,
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
    setupFilesAfterEnv: ["<rootDir>/setup.ts"]
};

export default config;
