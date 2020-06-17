import autoExternal from "rollup-plugin-auto-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import sass from "rollup-plugin-sass";
import commonjs from "@rollup/plugin-commonjs";
import packageJson from "./package.json";

const files = [
    'pages/index.tsx',
    'pages/product.tsx',
    'customPages/some_page.tsx'
]
export default files.map(f => {
    return {
        input: "src/" + f,
        output: [
            {
                file: packageJson.main + '/' + f.replace(/\.tsx?$/, '.js'),
                format: "cjs",
                // sourcemap: true
            },
            {
                file: packageJson.module + '/' + f.replace(/\.tsx?$/, '.js'),
                format: "esm",
                // sourcemap: true
            }
        ],
        plugins: [
            autoExternal(),
            resolve(),
            commonjs(),
            typescript({ useTsconfigDeclarationDir: true }),
            sass({
                insert: true
            })
        ]
    };
}) 