const fs = require('fs-extra');
const { spawn, spawnSync } = require('child_process');
const { resolve } = require('path');
const npmRunPath = require('npm-run-path');
const { setStoreItem } = require('@cromwell/core');
const {
    getRendererDir, getRendererTempDir, getRendererTempDevDir, getRendererBuildDir, readCMSConfigSync, rendererMessages, getLogger
} = require('@cromwell/core-backend');
const yargs = require('yargs-parser');

const buildDir = getRendererBuildDir();
const rendererRootDir = getRendererDir();
const logger = getLogger();


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

    setStoreItem('environment', {
        mode: config.env || scriptName === 'dev' ? 'dev' : 'prod',
    });

    const args = yargs(process.argv.slice(2));

    const isServiceBuilt = () => {
        return (fs.existsSync(buildDir)
            && fs.existsSync(resolve(buildDir, 'renderer.js'))
            && fs.existsSync(resolve(buildDir, 'generator.js')))
    }

    const buildService = () => {
        spawnSync(`node postcss-build`, [],
            { shell: true, stdio: 'inherit', cwd: rendererRootDir, env: npmRunPath.env() });

        spawnSync(`rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: rendererRootDir, env: npmRunPath.env() });
    }

    const gen = async () => {
        const generator = require(resolve(buildDir, 'generator.js')).generator;
        await generator({
            scriptName,
            targetThemeName: args.themeName,
            serverPort: args.serverPort,
        });
    }

    const build = async () => {
        if (process.send) process.send(rendererMessages.onBuildStartMessage);
        try {
            const tempDir = getRendererTempDevDir();

            if (!isServiceBuilt()) {
                buildService();
            }
            await gen();
            await new Promise(done => {
                const proc = spawn(`next build`, [],
                    { shell: true, stdio: 'pipe', cwd: tempDir, env: npmRunPath.env() });

                if (proc.stderr && proc.stderr.on) {
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
            logger.error(e);
        }
        if (process.send) process.send(rendererMessages.onBuildEndMessage);
    }

    const start = async () => {
        try {
            await gen();
            const port = args.port || config.frontendPort;
            const tempDir = getRendererTempDir();
            const startNextServer = require(resolve(buildDir, 'server.js')).startNextServer;

            const success = await startNextServer({
                port,
                dir: tempDir,
                dev: false,
            });

            if (success) process.send(rendererMessages.onStartMessage);
            else process.send(rendererMessages.onStartErrorMessage);

        } catch (e) {
            if (process.send) process.send(rendererMessages.onStartErrorMessage);
            logger.error(e);
        }
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
            const port = args.port || 4256;
            const tempDir = getRendererTempDevDir();
            const startNextServer = require(resolve(buildDir, 'server.js')).startNextServer;

            await startNextServer({
                port,
                dir: tempDir,
                dev: true,
            });
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