import { TCmsConfig, TThemeConfig } from '@cromwell/core';
import fs from 'fs-extra';
import shell from 'shelljs';
//@ts-ignore
import lnk from 'lnk';
import { resolve } from 'path';
const scriptName = process.env.SCRIPT;
const projectRootDir = resolve(__dirname, '../../../').replace(/\\/g, '/');
const rendererRootDir = resolve(__dirname, '../').replace(/\\/g, '/');

const main = async () => {

    const configPath = resolve(__dirname, '../', '../', 'cmsconfig.json');
    let config: TCmsConfig | undefined = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('renderer::server cannot read CMS config');

    // Link public dir in root to renderer's public dir for Next.js server
    if (!fs.existsSync(`${rendererRootDir}/public`)) {
        lnk([`${projectRootDir}/public`], `${rendererRootDir}`)
    }

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