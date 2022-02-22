const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync } = require('child_process');
const { getAdminPanelServiceBuildDir } = require('@cromwell/core-backend/dist/helpers/paths');
const yargs = require('yargs-parser');

// 'build' | 'dev' | 'prod'
const scriptName = process.argv[2];

const main = () => {
    const args = yargs(process.argv.slice(2));
    const buildDir = getAdminPanelServiceBuildDir();

    const isServiceBuilt = () => {
        if (fs.existsSync(buildDir)) {
            const files = fs.readdirSync(buildDir);
            const webapp = files.find(file => file.startsWith('webapp') && file.endsWith('.js'));
            return webapp && fs.existsSync(resolve(buildDir, 'server.js'))
        }
    }

    const buildService = (dev = false) => {
        spawnSync(`npx --no-install rollup -c`, [],
            { shell: true, stdio: 'inherit', cwd: __dirname });

        if (dev) return;
        spawnSync('npx webpack', [],
            { shell: true, stdio: 'inherit', cwd: __dirname });
    }

    if (scriptName === 'build') {
        buildService();
        return;
    }

    if (scriptName === 'dev') {
        if (!isServiceBuilt()) {
            buildService(true);
        }

        spawn(`node ${resolve(buildDir, 'server.js')}`,
            ['development', args.port ? '--port=' + args.port : ''],
            { shell: true, stdio: 'inherit', cwd: process.cwd(), env: { NODE_ENV: 'development' } });

        return;
    }

    if (scriptName === 'prod') {
        if (!isServiceBuilt()) {
            buildService();
        }

        require(resolve(buildDir, 'server.js'));
    }
}

main();