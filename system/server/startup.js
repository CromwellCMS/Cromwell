const fs = require('fs-extra');
const shell = require('shelljs');
const { resolve } = require('path');
const scriptName = process.argv[2];
const projectRootDir = resolve(__dirname, '../../').replace(/\\/g, '/');
const systemRootDir = resolve(__dirname, '../').replace(/\\/g, '/');
const serverRootDir = resolve(__dirname).replace(/\\/g, '/');
const buildDir = serverRootDir + '/build';

const main = async () => {

    const configPath = resolve(systemRootDir, 'cmsconfig.json');
    let config = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('renderer::server cannot read CMS config');


    if (scriptName === 'dev') {
        if (!fs.existsSync(buildDir)) {
            shell.cd(serverRootDir);
            shell.exec(`npx rollup -c`);
        }

        shell.cd(buildDir);
        shell.exec(`node ./generator.js`);
        shell.exec(`npx nodemon ./server.js`);
    }

    if (scriptName === 'build') {
        shell.cd(serverRootDir);
        shell.exec(`npx rollup -c`)
    }

    if (scriptName === 'prod') {
        if (!fs.existsSync(buildDir)) {
            shell.cd(serverRootDir);
            shell.exec(`npx rollup -c`)
        }

        shell.cd(buildDir);
        shell.exec(`node ./generator.js`);
        shell.exec(`node ./server.js`);
    }

}

main();