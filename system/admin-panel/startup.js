const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync, fork } = require('child_process');
const { getAdminPanelServiceBuildDir } = require('@cromwell/core-backend');
const localProjectDir = __dirname;

// 'build' | 'dev' | 'prod'
const scriptName = process.argv[2];

const main = () => {

    const buildDir = getAdminPanelServiceBuildDir();

    const isServiceBuilt = () => {
        return (fs.existsSync(buildDir)
            && fs.existsSync(resolve(buildDir, 'server.js'))
            && fs.existsSync(resolve(buildDir, 'webapp.js'))
        )
    }

    const buildService = () => {
        spawnSync(`npx --no-install rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        spawnSync(`npx --no-install cross-env NODE_ENV=development npx webpack`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });
    }

    if (scriptName === 'build') {
        buildService();
        return;
    }

    if (scriptName === 'dev') {
        if (!isServiceBuilt()) {
            buildService();
        }

        spawn(`node ${resolve(buildDir, 'server.js')}`, ['development'],
            { shell: true, stdio: 'inherit', cwd: process.cwd(), env: { NODE_ENV: 'development' } });

        return;
    }

    if (scriptName === 'prod') {
        if (!isServiceBuilt()) {
            buildService();
        }

        const serverProc = fork(resolve(buildDir, 'server.js'), ['production'],
            { stdio: 'inherit', cwd: process.cwd() });

        serverProc.on('message', (message) => {
            if (process.send) process.send(message);
        });
        return;
    }
}

main();