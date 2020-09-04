const fs = require('fs-extra');
const shell = require('shelljs');
const { resolve } = require('path');
const { spawn } = require('child_process');
const { appBuildProd, localProjectDir } = require('./src/constants');
const projectRootDir = resolve(__dirname, '../../').replace(/\\/g, '/');
const systemRootDir = resolve(__dirname, '../').replace(/\\/g, '/');
const adminRootDir = resolve(__dirname).replace(/\\/g, '/');
const buildDir = adminRootDir + '/build';
const scriptName = process.argv[2];
const tempDir = adminRootDir + '/.cromwell';

const main = async () => {

    const gen = () => {
        shell.cd(buildDir);
        shell.exec(`node ./generator.js`);
    }

    const buildAdmin = () => {
        shell.cd(adminRootDir);
        shell.exec(`npx rollup -c`);
        shell.exec(`npx cross-env SCRIPT=buildAdmin npx webpack`);
    }

    const buildApp = () => {
        if (!fs.existsSync(buildDir)) {
            buildAdmin();
        }
        gen();
        shell.cd(adminRootDir);
        shell.exec(`npx cross-env SCRIPT=production npx webpack`)
    }

    if (scriptName === 'gen') {
        gen();
        return;
    }

    if (scriptName === 'buildAdmin') {
        buildAdmin();
        return;
    }

    if (scriptName === 'build') {
        buildApp();
        return;
    }

    if (scriptName === 'dev') {
        if (!fs.existsSync(buildDir)) {
            buildAdmin();
        }
        gen();

        spawn(`npx cross-env SCRIPT=buildAdmin npx webpack --watch`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        spawn(`node ${buildDir}/server.js development`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        return;
    }

    if (scriptName === 'prod') {
        if (!fs.existsSync(appBuildProd)) {
            buildApp();
        }
        shell.cd(buildDir);
        shell.exec(`node ./server.js production`);
        return;
    }
}

main();