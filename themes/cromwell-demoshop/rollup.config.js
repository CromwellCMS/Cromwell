import { rollupConfigWrapper } from '@cromwell/cromwella';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const cromwellConfig = require('./cromwell.config.js');

export default rollupConfigWrapper({
    plugins: [
        commonjs(),
        typescript(),
        json(),
    ]
}, cromwellConfig);