import autoExternal from "rollup-plugin-auto-external";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";


export default {
    input: 'src/index.ts',
    preserveModules: true,
    output: [
        {
            dir: './es',
            format: "esm",
            // sourcemap: true
        }
    ],
    // external: id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
    // external: id => {
    //     if (/material/.test(id))
    //         console.log(id);
    // },
    plugins: [
        autoExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true })
    ]
};