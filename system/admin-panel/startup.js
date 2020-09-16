const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync, fork } = require('child_process');
const { adminPanelMessages } = require('@cromwell/core-backend');
const { appBuildProd, localProjectDir } = require('./src/constants');
const buildDir = resolve(localProjectDir, 'build');
const tempDir = resolve(localProjectDir, '.cromwell');

// 'buildService' | 'build' | 'dev' | 'prod'
const scriptName = process.argv[2];

const main = async () => {

    const gen = () => {
        spawnSync(`node ./generator.js`, [],
            { shell: true, stdio: 'inherit', cwd: buildDir });
    }

    const isServiceBuilt = () => {
        return (fs.existsSync(buildDir)
            && fs.existsSync(resolve(buildDir, 'server.js'))
            && fs.existsSync(resolve(buildDir, 'generator.js'))
        )
    }

    const buildService = () => {
        spawnSync(`npx rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        spawnSync(`node ./webpack.js buildService`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });
    }

    const buildWebApp = async () => {
        if (process.send) process.send(adminPanelMessages.onBuildStartMessage);

        if (!isServiceBuilt()) {
            buildService();
        }
        gen();
        await new Promise(res => {
            const proc = spawn(`node ./webpack.js buildWeb`, [],
                { shell: true, stdio: 'pipe', cwd: localProjectDir });

            if (proc.stderr && proc.stderr.on && proc.stderr.once) {
                proc.stderr.on('data', (data) => {
                    console.log(data.toString ? data.toString() : data);
                });
                proc.stderr.once('data', (data) => {
                    if (process.send) process.send(adminPanelMessages.onBuildErrorMessage);
                });
            }
            if (proc.stdout && proc.stdout.on) {
                proc.stdout.on('data', (data) => {
                    console.log(data.toString ? data.toString() : data);
                });
            }

            proc.on('close', () => {
                res();
            });
        });

        if (process.send) process.send(adminPanelMessages.onBuildEndMessage);
    }

    if (scriptName === 'gen') {
        gen();
        return;
    }

    if (scriptName === 'buildService') {
        buildService();
        return;
    }

    if (scriptName === 'build') {
        buildWebApp();
        return;
    }

    if (scriptName === 'dev') {
        if (!isServiceBuilt()) {
            buildService();
        }
        gen();

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        spawn(`node ./webpack.js buildService watch development`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        spawn(`node ./server.js development`, [],
            { shell: true, stdio: 'inherit', cwd: buildDir });

        return;
    }

    if (scriptName === 'prod') {
        if (!isServiceBuilt() || !fs.existsSync(tempDir) || !fs.existsSync(appBuildProd)) {
            await buildWebApp();
        }

        const serverProc = fork(`./server.js`, ['production'],
            { shell: true, stdio: 'inherit', cwd: buildDir });

        serverProc.on('message', (message) => {
            if (process.send) process.send(message);
        });
        return;
    }
}

main();