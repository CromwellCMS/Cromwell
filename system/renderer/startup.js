const fs = require('fs-extra');
const shell = require('shelljs');
const { resolve } = require('path');
const { spawn } = require('child_process');
const scriptName = process.argv[2];
const projectRootDir = resolve(__dirname, '.../../').replace(/\\/g, '/');
const systemRootDir = resolve(__dirname, '../').replace(/\\/g, '/');
const rendererRootDir = resolve(__dirname).replace(/\\/g, '/');
const buildDir = rendererRootDir + '/build';
const pagesDir = rendererRootDir + '/.cromwell';

const main = async () => {

    const configPath = resolve(systemRootDir, 'cmsconfig.json');
    let config = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('renderer::server cannot read CMS config');

    const buildRenderer = () => {
        shell.cd(rendererRootDir);
        shell.exec(`npx rollup -c`);
    }

    const build = () => {
        if (!fs.existsSync(buildDir)) {
            buildRenderer();
        }

        shell.cd(buildDir);
        shell.exec(`node ./generator.js`);
        shell.cd(pagesDir);
        shell.exec(`npx next build`);
    }


    if (scriptName === 'buildRenderer') {
        buildRenderer();
        return;
    }

    if (scriptName === 'dev') {
        if (!fs.existsSync(buildDir)) {
            buildRenderer();
            shell.cd(buildDir);
            shell.exec(`node ./generator.js`);
        }

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: rendererRootDir });

        spawn(`node ${buildDir}/generator.js`, [],
            { shell: true, stdio: 'inherit', cwd: rendererRootDir });

        spawn(`npx next dev -p ${config.frontendPort}`, [],
            { shell: true, stdio: 'inherit', cwd: pagesDir });

        return;
    }

    if (scriptName === 'build') {
        build();
        return;
    }

    if (scriptName === 'prod') {
        if (!fs.existsSync(`${pagesDir}/.next/static`)
            || !fs.existsSync(`${pagesDir}/.next/BUILD_ID`)
            || !fs.existsSync(`${pagesDir}/.next/build-manifest.json`)
            || !fs.existsSync(`${pagesDir}/.next/prerender-manifest.json`)
        ) {
            build();
        }

        shell.cd(pagesDir);
        shell.exec(`npx next start -p ${config.frontendPort}`);
        return;
    }

}

main();