import { getServerBuildPath, getServerBuildProxyPath } from '@cromwell/core-backend';
import nodeResolve from '@rollup/plugin-node-resolve';
import { isAbsolute, resolve } from 'path';
import typescript from 'rollup-plugin-ts-compiler';

const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && !isAbsolute(id);

const sharedState = {};

export default [
    {
        input: resolve(__dirname, "src/main.ts"),
        output: [
            {
                file: getServerBuildPath(),
                format: "cjs",
            }
        ],
        external: external,
        plugins: [
            typescript({
                monorepo: true,
                sharedState
            }),
            nodeResolve({
                extensions: ['js', 'ts'],
                preferBuiltins: false,
            }),
        ],
        watch: {
            clearScreen: false,
            buildDelay: 1000,
            exclude: [
                'node_modules/**',
                'build/**',
                '.cromwell/**',
            ],
            include: 'src/**/*.ts'
        }
    },
    {
        input: resolve(__dirname, "src/proxy.ts"),
        output: [
            {
                file: getServerBuildProxyPath(),
                format: "cjs",
            }
        ],
        external: external,
        plugins: [
            typescript({
                monorepo: true,
                sharedState,
            }),
            nodeResolve({
                extensions: ['js', 'ts'],
                preferBuiltins: false,
            }),
        ],
        watch: {
            clearScreen: false,
            buildDelay: 1000,
            exclude: [
                'node_modules/**',
                'build/**',
                '.cromwell/**',
            ],
            include: 'src/**/*.ts'
        }
    }
];