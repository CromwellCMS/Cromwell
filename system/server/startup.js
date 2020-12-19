const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync, fork } = require('child_process');
const scriptName = process.argv[2];
const serverRootDir = resolve(__dirname);
const buildDir = resolve(serverRootDir, 'build');

const main = async () => {

    const buildServer = () => {
        spawnSync(`npx rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });
    }

    const isServiceBuild = () => {
        return (fs.existsSync(resolve(buildDir, 'server.js')))
    }

    if (scriptName === 'dev') {
        if (!isServiceBuild()) {
            buildServer();
        }

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });

        spawn(`npx nodemon --watch ${buildDir} ${buildDir}/server.js ${process.argv.slice(2).join(' ')}`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });
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