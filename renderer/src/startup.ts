import { TCmsConfig, TThemeConfig } from '@cromwell/core';
import fs from 'fs-extra';
import shell from 'shelljs';
import { resolve } from 'path';
const scriptName = process.env.SCRIPT;

const main = async () => {

    const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
    let config: TCmsConfig | undefined = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('renderer::server cannot read CMS config');


    if (scriptName === 'dev') {
        shell.exec(`npx next dev -p ${config.frontendPort}`);
    }

    if (scriptName === 'build') {
        shell.exec('npx next build');
    }

    if (scriptName === 'start') {
        shell.exec(`npx next start -p ${config.frontendPort}`);
    }

}

main();