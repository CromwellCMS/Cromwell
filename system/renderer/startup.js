const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync } = require('child_process');
// const projectRootDir = resolve(__dirname, '../../').replace(/\\/g, '/');
const systemRootDir = resolve(__dirname, '../').replace(/\\/g, '/');
const rendererRootDir = resolve(__dirname).replace(/\\/g, '/');
const buildDir = rendererRootDir + '/build';
const tempDir = rendererRootDir + '/.cromwell';

/**
 * 'buildService' - compile "src" files into "build" dir
 * 'dev' - Next.js "dev" command. Will check if service is built
 * 'build' - Next.js "build" command. Will check if service is built
 * 'buildStart' - Run Next.js "build" command and then "start". Will check if service is built
 * 'prod' - Next.js "start" command. Will check if service is built and if Next.js has build
 */
const scriptName = process.argv[2];

const main = async () => {

    const configPath = resolve(systemRootDir, 'cmsconfig.json');
    let config = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('renderer::server cannot read CMS config');

    const buildService = () => {
        spawnSync(`npx rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: rendererRootDir });
    }

    const gen = () => {
        spawnSync(`node ./generator.js`, [],
            { shell: true, stdio: 'inherit', cwd: buildDir });
    }

    const build = () => {
        if (!fs.existsSync(buildDir)) {
            buildService();
        }
        gen();
        spawnSync(`npx next build`, [],
            { shell: true, stdio: 'inherit', cwd: tempDir });
    }

    const start = () => {
        if (!fs.existsSync(`${tempDir}/.next/static`)
            || !fs.existsSync(`${tempDir}/.next/BUILD_ID`)
            || !fs.existsSync(`${tempDir}/.next/build-manifest.json`)
            || !fs.existsSync(`${tempDir}/.next/prerender-manifest.json`)
        ) {
            build();
        }

        spawn(`npx next start -p ${config.frontendPort}`, [],
            { shell: true, stdio: 'inherit', cwd: tempDir });
    }


    if (scriptName === 'buildService') {
        buildService();
        return;
    }

    if (scriptName === 'dev') {
        if (!fs.existsSync(buildDir)) {
            buildService();
        }
        gen();

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: rendererRootDir });

        spawn(`npx next dev -p ${config.frontendPort}`, [],
            { shell: true, stdio: 'inherit', cwd: tempDir });

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
        build();
        start();
        return;
    }




}

main();