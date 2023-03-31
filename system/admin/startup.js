const fs = require('fs-extra');
const { resolve } = require('path');
const { spawnSync } = require('child_process');
const { getAdminPanelServiceBuildDir, getAdminPanelDir } = require('@cromwell/core-backend/dist/helpers/paths');
const yargs = require('yargs-parser');

// 'build' | 'dev' | 'prod'
const scriptName = process.argv[2];

const main = () => {
  const args = yargs(process.argv.slice(2));
  const buildDir = getAdminPanelServiceBuildDir();
  const buildServerPath = resolve(buildDir, 'server.js');
  const serverCompileDir = resolve(getAdminPanelDir(), 'server');

  const isServerBuilt = () => {
    return fs.pathExistsSync(buildServerPath);
  };

  const buildServer = () => {
    // Cleanup old build
    fs.removeSync(buildDir);

    spawnSync(`npx --no-install tsc --project server/tsconfig.json --outDir ${buildDir}`, [], {
      shell: true,
      stdio: 'inherit',
      cwd: serverCompileDir,
    });
  };

  const buildWebApp = () => {
    spawnSync('npx next build', [], { shell: true, stdio: 'inherit', cwd: __dirname });
  };

  if (scriptName === 'build') {
    buildServer();
    buildWebApp();
  }

  if (scriptName === 'dev') {
    const { watchAndRestartServer } = require('@cromwell/utils/src/watchAndRestartServer');

    fs.ensureDirSync(buildDir);
    if (fs.pathExistsSync(buildServerPath)) fs.removeSync(buildServerPath);

    watchAndRestartServer({
      port: args.port || 4064,
      compileCommand: `npx --no-install tsc --project server/tsconfig.json --outDir ${buildDir} --watch`,
      compileDir: serverCompileDir,
      buildOutputDir: buildDir,
      buildServerPath: buildServerPath,
      serverArgs: ['development', args.port ? '--port=' + args.port : ''],
    });
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
