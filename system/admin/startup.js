const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, spawnSync } = require('child_process');
const { getAdminPanelServiceBuildDir, getAdminPanelDir } = require('@cromwell/core-backend/dist/helpers/paths');
const yargs = require('yargs-parser');

// 'build' | 'dev' | 'prod'
const scriptName = process.argv[2];

const main = () => {
  const args = yargs(process.argv.slice(2));
  const buildDir = getAdminPanelServiceBuildDir();

  const isServerBuilt = () => {
    if (fs.existsSync(buildDir)) {
      return fs.existsSync(resolve(buildDir, 'server.js'));
    }
  };

  const buildServer = () => {
    // Cleanup old build
    const fs = require('fs-extra');
    fs.removeSync(getAdminPanelServiceBuildDir());

    spawnSync(`npx --no-install rollup -c`, [], { shell: true, stdio: 'inherit', cwd: __dirname });
  };

  const buildWebApp = () => {
    spawnSync('npx next build', [], { shell: true, stdio: 'inherit', cwd: __dirname });
  };

  if (scriptName === 'build') {
    buildServer();
    buildWebApp();
    return;
  }

  if (scriptName === 'dev') {
    if (!isServerBuilt()) {
      buildServer();
    }

    spawn(`node ${resolve(buildDir, 'server.js')}`, ['development', args.port ? '--port=' + args.port : ''], {
      shell: true,
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { NODE_ENV: 'development' },
    });

    return;
  }

  if (scriptName === 'prod') {
    if (!isServerBuilt()) {
      buildServer();
    }
    if (!fs.existsSync(resolve(getAdminPanelDir(), 'build/.next'))) {
      buildWebApp();
    }

    require(resolve(buildDir, 'server.js'));
  }
};

main();
