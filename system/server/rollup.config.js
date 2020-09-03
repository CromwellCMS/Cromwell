import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import packageJson from './package.json';

// const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');
const external = id => {
    if (id.includes('.cromwell/imports') || id.includes('cromwell/plugins') || id === 'tslib')
        return true;
    for (const pack of Object.keys(packageJson.dependencies)) {
        if (id === pack) {
            return true;
        }
    }
}

export default [
    {
        // preserveModules: true,
        input: "./src/server.ts",
        output: [
            {
                file: 'build/server.js',
                // dir: './build',
                format: "cjs",
            }
        ],
        external: external,
        plugins: [
            // autoExternal(),
            resolve(),
            commonjs(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: "ESNext"
                    }
                }
            }),
        ]
    },
    {
        // preserveModules: true,
        input: "./src/generator.ts",
        output: [
            {
                file: 'build/generator.js',
                format: "cjs",
            }
        ],
        external: external,
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: "ESNext"
                    }
                }
            }),
        ]
    }
];