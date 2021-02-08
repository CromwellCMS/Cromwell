const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync, fork } = require('child_process');
const { getServerDir } = require('@cromwell/core-backend');
const normalizePath = require('normalize-path');

const scriptName = process.argv[2];
const serverRootDir = getServerDir();
const buildDir = normalizePath(resolve(serverRootDir, 'build'));

const main = async () => {

    const buildServer = () => {
        spawnSync(`npx --no-install rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });
    }

    const isServiceBuild = () => {
        return (fs.existsSync(resolve(buildDir, 'server.js')))
    }


    if (scriptName === 'dev') {
        if (!isServiceBuild()) {
            buildServer();
        }

        spawn(`npx --no-install nodemon --watch ${buildDir} ${buildDir}/server.js ${process.argv.slice(2).join(' ')}`, [],
            { shell: true, stdio: 'inherit', cwd: process.cwd() });

        const rollupProc = spawn(`npx --no-install rollup -cw`, [],
            { shell: true, stdio: 'pipe', cwd: serverRootDir });

        rollupProc.stdout.on('data', buff => console.log((buff && buff.toString) ? buff.toString() : buff));
        rollupProc.stderr.on('data', buff => console.log((buff && buff.toString) ? buff.toString() : buff));
    }

    if (scriptName === 'build') {
        buildServer();
    }

    if (scriptName === 'prod') {
        if (!isServiceBuild()) {
            buildServer();
        }

        const serverProc = fork(resolve(buildDir, `server.js`));

        serverProc.on('message', (message) => {
            if (process.send) process.send(message);
        });
    }

}

main();