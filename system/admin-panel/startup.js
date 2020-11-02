const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync, fork } = require('child_process');
const { adminPanelMessages } = require('@cromwell/core-backend');
const localProjectDir = __dirname;
const buildDir = resolve(localProjectDir, 'build');
const tempDir = resolve(localProjectDir, '.cromwell');

// 'buildService' | 'build' | 'dev' | 'prod'
const scriptName = process.argv[2];

const main = async () => {

    const isServiceBuilt = () => {
        return (fs.existsSync(buildDir)
            && fs.existsSync(resolve(buildDir, 'server.js'))
            && fs.existsSync(resolve(buildDir, 'webapp.js'))
        )
    }

    const buildService = () => {
        spawnSync(`npx rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        spawnSync(`npx cross-env NODE_ENV=development npx webpack`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });
    }


    if (scriptName === 'buildService') {
        buildService();
        return;
    }

    if (scriptName === 'dev') {
        if (!isServiceBuilt()) {
            buildService();
        }

        spawn(`node ./build/server.js development`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        return;
    }

    if (scriptName === 'prod') {
        if (!isServiceBuilt()) {
            buildService();
        }

        const serverProc = fork(`./build/server.js`, ['production'],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        serverProc.on('message', (message) => {
            if (process.send) process.send(message);
        });
        return;
    }
}

main();