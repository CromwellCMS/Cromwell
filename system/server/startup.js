const fs = require('fs-extra');
const { spawnSync } = require('child_process');
const {
  getServerDir,
  getServerBuildProxyPath,
  getServerBuildDir,
} = require('@cromwell/core-backend/dist/helpers/paths');
const { serverMessages } = require('@cromwell/core-backend/dist/helpers/constants');
const normalizePath = require('normalize-path');

// 'build' | 'prod' | 'dev'
const scriptName = process.argv[2];
const serverRootDir = getServerDir();
const buildDir = normalizePath(getServerBuildDir());
const buildProxyPath = getServerBuildProxyPath();

const buildServer = () => {
  const npmRunPath = require('npm-run-path');
  spawnSync(`npx --no-install rollup -c`, [], {
    shell: true,
    stdio: 'inherit',
    cwd: serverRootDir,
    env: npmRunPath.env(),
  });
};

const isServiceBuild = () => {
  return fs.existsSync(buildProxyPath);
};

const runDevScript = () => {
  if (!isServiceBuild()) {
    buildServer();
  }
  const { watchAndRestartServer } = require('@cromwell/utils/src/watchAndRestartServer');

  const yargs = require('yargs-parser');
  const port = process.env.API_PORT || Number(yargs(process.argv.slice(2))) || 4016;

  watchAndRestartServer({
    port,
    compileCommand: `npx --no-install rollup -cw`,
    compileDir: serverRootDir,
    buildOutputDir: buildDir,
    buildServerPath: buildProxyPath,
    serverArgs: process.argv.slice(2),
  });

  setTimeout(() => {
    process.send(serverMessages.onStartMessage);
  }, 3000);
};

const main = () => {
  if (scriptName === 'dev') {
    runDevScript();
  }

  if (scriptName === 'build') {
    buildServer();
  }

  if (scriptName === 'prod') {
    if (!isServiceBuild()) {
      buildServer();
    }

    require(buildProxyPath);
  }
};

main();
