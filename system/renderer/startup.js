const fs = require('fs-extra');
const { spawn, spawnSync } = require('child_process');
const { resolve } = require('path');
const npmRunPath = require('npm-run-path');
const {
    getRendererDir, getRendererTempDir, getRendererBuildDir, readCMSConfigSync, rendererMessages
} = require('@cromwell/core-backend');
const yargs = require('yargs-parser');

const buildDir = getRendererBuildDir();
const tempDir = getRendererTempDir();
const rendererRootDir = getRendererDir();


/**
 * 'buildService' - compile "src" files into "build" dir
 * 'dev' - Next.js "dev" command. Will check if service is built
 * 'build' - Next.js "build" command. Will check if service is built
 * 'buildStart' - Run Next.js "build" command and then "start". Will check if service is built
 * 'prod' - Next.js "start" command. Will check if service is built and if Next.js has build
 */
const scriptName = process.argv[2];


const main = () => {
    const config = readCMSConfigSync();

    const isServiceBuilt = () => {
        return (fs.existsSync(buildDir)
            && fs.existsSync(resolve(buildDir, 'renderer.js'))
            && fs.existsSync(resolve(buildDir, 'generator.js')))
    }

    const buildService = () => {
        spawnSync(`rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: rendererRootDir, env: npmRunPath.env() });
    }

    const gen = async () => {
        const generator = require(resolve(buildDir, 'generator.js')).generator;
        const args = yargs(process.argv.slice(2));
        await generator({
            scriptName,
            targetThemeName: args.themeName,
            serverPort: args.serverPort,
        });
    }

    const build = async () => {
        if (process.send) process.send(rendererMessages.onBuildStartMessage);
        try {
            if (!isServiceBuilt()) {
                buildService();
            }
            await gen();
            await new Promise(done => {
                const proc = spawn(`next build`, [],
                    { shell: true, stdio: 'pipe', cwd: tempDir, env: npmRunPath.env() });

                if (proc.stderr && proc.stderr.on && proc.stderr.once) {
                    proc.stderr.on('data', (data) => {
                        console.log(data.toString ? data.toString() : data);
                    });
                }
                if (proc.stdout && proc.stdout.on) {
                    proc.stdout.on('data', (data) => {
                        console.log(data.toString ? data.toString() : data);
                    });
                }

                proc.on('close', () => {
                    done();
                })
            })

        } catch (e) {
            console.log(e);
        }
        if (process.send) process.send(rendererMessages.onBuildEndMessage);
    }

    const start = async () => {
        let proc;
        try {
            await gen();

            proc = spawn(`npx --no-install next start -p ${config.frontendPort}`, [],
                { shell: true, stdio: 'pipe', cwd: tempDir, env: npmRunPath.env() });
        } catch (e) {
            if (process.send) process.send(rendererMessages.onStartErrorMessage);
            console.log(e);
        }

        // @TODO: Make it somehow accept Next.js server's "on ready" event. Just a timeout for now...
        if (proc && proc.stdout) proc.stdout.once('data', (data) => {
            setTimeout(() => {
                console.log(data.toString ? data.toString() : data);
                if (process.send) process.send(rendererMessages.onStartMessage);
            }, 10);
        });

        if (proc && proc.stderr) proc.stderr.once('data', (data) => {
            console.log(data.toString ? data.toString() : data);
            if (process.send) process.send(rendererMessages.onStartErrorMessage);
        });

    }


    if (scriptName === 'buildService') {
        buildService();
        return;
    }

    if (scriptName === 'dev') {
        if (!isServiceBuilt()) {
            buildService();
        }

        (async () => {
            await gen();

            spawn(`next dev -p ${config.frontendPort}`, [],
                { shell: true, stdio: 'inherit', cwd: tempDir, env: npmRunPath.env() });
        })();
        return;
    }

    if (scriptName === 'build') {
        build();
        return;
    }

    if (scriptName === 'prod') {
        start();
        return;
    }

    if (scriptName === 'buildStart') {
        build().then(start);
        return;
    }

    if (scriptName === 'gen') {
        if (!isServiceBuilt()) {
            buildService();
        }
        gen();
        return;
    }
}

main();