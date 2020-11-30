import { rollupConfigWrapper } from '@cromwell/cromwella';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from "autoprefixer";

const cromwellConfig = require('./cromwell.config.js');

export default rollupConfigWrapper({
    plugins: [
        commonjs(),
        typescript(),
        json(),
    ]
}, cromwellConfig, {
    adminPanel: {
        plugins: [
            commonjs(),
            typescript(),
            json(),
            postcss({
                extract: false,
                modules: true,
                writeDefinitions: false,
                inject: true,
                use: ['sass'],
            }),
        ]
    }
});