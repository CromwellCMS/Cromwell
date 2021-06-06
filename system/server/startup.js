const fs = require('fs-extra');
const { spawn, spawnSync } = require('child_process');
const { getServerDir, serverMessages, getServerBuildProxyPath, getServerBuildDir } = require('@cromwell/core-backend');
const normalizePath = require('normalize-path');

// 'build' | 'prod' | 'dev'
const scriptName = process.argv[2];
const serverRootDir = getServerDir();
const buildDir = normalizePath(getServerBuildDir());
const buildProxyPath = getServerBuildProxyPath();

const main = () => {

    const buildServer = () => {
        spawnSync(`npx --no-install rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: serverRootDir });
    }

    const isServiceBuild = () => {
        return (fs.existsSync(buildProxyPath))
    }


    if (scriptName === 'dev') {
        if (!isServiceBuild()) {
            buildServer();
        }

        spawn(`npx --no-install nodemon --watch ${buildDir} ${buildProxyPath} ${process.argv.slice(2).join(' ')}`, [],
            { shell: true, stdio: 'inherit', cwd: process.cwd() });

        const rollupProc = spawn(`npx --no-install rollup -cw`, [],
            { shell: true, stdio: 'pipe', cwd: serverRootDir });

        rollupProc.stdout.on('data', buff => console.log((buff && buff.toString) ? buff.toString() : buff));
        rollupProc.stderr.on('data', buff => console.log((buff && buff.toString) ? buff.toString() : buff));

        setTimeout(() => {
            process.send(serverMessages.onStartMessage);
        }, 3000)
    }

    if (scriptName === 'build') {
        buildServer();
    }

    if (scriptName === 'prod') {
        if (!isServiceBuild()) {
            buildServer();
        }

        require(buildProxyPath);
    }

}

main();