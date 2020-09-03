const fs = require('fs-extra');
const shell = require('shelljs');
const { resolve } = require('path');
const scriptName = process.argv[2];
const projectRootDir = resolve(__dirname, '.../../').replace(/\\/g, '/');
const systemRootDir = resolve(__dirname, '../').replace(/\\/g, '/');
const rendererRootDir = resolve(__dirname).replace(/\\/g, '/');
const buildDir = rendererRootDir + '/build';
const pagesDir = rendererRootDir + '/.cromwell';

const main = async () => {

    const configPath = resolve(systemRootDir, 'cmsconfig.json');
    let config = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('renderer::server cannot read CMS config');

    const buildRenderer = () => {
        shell.cd(rendererRootDir);
        shell.exec(`npx rollup -c`);
    }

    if (scriptName === 'buildRenderer') {
        buildRenderer();
    }

    if (scriptName === 'dev') {
        if (!fs.existsSync(buildDir)) {
            buildRenderer();
        }

        shell.cd(buildDir);
        shell.exec(`node ./generator.js`);
        shell.cd(pagesDir);
        shell.exec(`npx next dev -p ${config.frontendPort}`);
    }

    if (scriptName === 'build') {
        if (!fs.existsSync(buildDir)) {
            buildRenderer();
        }

        shell.cd(buildDir);
        shell.exec(`node ./generator.js`)
        shell.cd(pagesDir);
        shell.exec(`npx next build`);
    }

    if (scriptName === 'start') {
        if (!fs.existsSync(buildDir)) {
            buildRenderer();
        }

        shell.cd(pagesDir);
        shell.exec(`npx next start -p ${config.frontendPort}`);
    }

}

main();