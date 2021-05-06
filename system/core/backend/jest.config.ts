import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '@App/(.*)': '<rootDir>/src/$1',
        "\\.s?css$": "identity-obj-proxy",
    },
    // silent: false,
    testRegex: "/(tests|src)/.*\\.(test|spec)\\.[jt]sx?$",
    maxConcurrency: 1,
    globals: {
        "ts-jest": {
        }
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"]
};

export default config;
