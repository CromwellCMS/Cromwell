const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync } = require('child_process');
const { appBuildProd, localProjectDir } = require('./src/constants');
const adminRootDir = resolve(__dirname).replace(/\\/g, '/');
const buildDir = resolve(adminRootDir, 'build');
const tempDir = resolve(adminRootDir, '.cromwell');
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

    const buildAdminService = () => {
        spawnSync(`npx rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: adminRootDir });

        spawnSync(`npx cross-env SCRIPT=buildAdmin npx webpack`, [],
            { shell: true, stdio: 'inherit', cwd: adminRootDir });
    }

    const buildWebApp = () => {
        if (!isServiceBuilt()) {
            buildAdminService();
        }
        gen();
        spawnSync(`npx cross-env SCRIPT=production npx webpack`, [],
            { shell: true, stdio: 'inherit', cwd: adminRootDir });
    }

    if (scriptName === 'gen') {
        gen();
        return;
    }

    if (scriptName === 'buildService') {
        buildAdminService();
        return;
    }

    if (scriptName === 'build') {
        buildWebApp();
        return;
    }

    if (scriptName === 'dev') {
        if (!isServiceBuilt()) {
            buildAdminService();
        }
        gen();

        spawn(`npx cross-env SCRIPT=buildAdmin npx webpack --watch`, [],
            { shell: true, stdio: 'inherit', cwd: localProjectDir });

        spawn(`node ./server.js development`, [],
            { shell: true, stdio: 'inherit', cwd: buildDir });

        return;
    }

    if (scriptName === 'prod') {
        if (!isServiceBuilt()) {
            buildWebApp();
        }

        if (!fs.existsSync(tempDir) || !fs.existsSync(appBuildProd)) {
            gen();
        }
        spawn(`node ./server.js production`, [],
            { shell: true, stdio: 'inherit', cwd: buildDir });
        return;
    }
}

main();