import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { rollupConfigWrapper } from '@cromwell/cromwella';
const cromwellConfig = require('./cromwell.config.js');

export default rollupConfigWrapper({
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript()
    ]
}, cromwellConfig);