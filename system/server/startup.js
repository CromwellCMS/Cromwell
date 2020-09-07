const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync, fork } = require('child_process');
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

    const buildServer = () => {
        spawnSync(`npx rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });
    }

    if (scriptName === 'dev') {
        if (!fs.existsSync(buildDir)) {
            buildServer();
        }

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });

        spawnSync(`node ${buildDir}/generator.js`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });

        spawn(`npx nodemon --watch ${buildDir} ${buildDir}/server.js`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });
    }

    if (scriptName === 'build') {
        buildServer();
    }

    if (scriptName === 'prod') {
        if (!fs.existsSync(buildDir)) {
            buildServer();
        }

        spawnSync(`node ./generator.js`, [],
            { shell: true, stdio: 'inherit', cwd: buildDir });

        const serverProc = fork(resolve(buildDir, `server.js`));

        serverProc.on('message', (message) => {
            if (message === 'ready') {
                if (process.send) process.send('ready');
            }
        });
    }

}

main();