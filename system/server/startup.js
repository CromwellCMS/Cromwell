const fs = require('fs-extra');
const { spawnSync, spawn } = require('child_process');
const { getServerDir, getServerBuildProxyPath } = require('@cromwell/core-backend/dist/helpers/paths');
const { serverMessages } = require('@cromwell/core-backend/dist/helpers/constants');
const { reportProcessPid } = require('@cromwell/core-backend/dist/helpers/shell');

// 'build' | 'prod' | 'dev'
const scriptName = process.argv[2];
const serverRootDir = getServerDir();
const buildProxyPath = getServerBuildProxyPath();

const buildServer = () => {
  const npmRunPath = require('npm-run-path');
  spawnSync(`npx --no-install rollup -c ./rollup-prod.config.js`, [], {
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

  const spawnOptions = { shell: true, stdio: 'pipe' };

  const processes = [
    spawn(`npx --no-install rollup -c ./rollup-dev.config.js -w`, [], { ...spawnOptions, cwd: serverRootDir }),
    spawn(
      `npx tsx watch --tsconfig ./system/server/tsconfig.json ./system/server/src/main.ts`,
      process.argv.slice(2),
      spawnOptions,
    ),
    spawn(
      `npx tsx watch --tsconfig ./system/server/tsconfig.json ./system/server/src/proxy.ts `,
      process.argv.slice(2),
      spawnOptions,
    ),
  ];

  const buffToText = (buff) => {
    let str = buff && buff.toString ? buff.toString() : buff;
    // Remove some terminal control characters
    str = str.replace(/\033\[[ABCD]/g, '');
    // eslint-disable-next-line no-control-regex
    str = str.replace(/\x1b[abcd]/g, '');
    return str;
  };

  for (const proc of processes) {
    // eslint-disable-next-line no-console
    proc.stdout.on('data', (buff) => console.log(buffToText(buff)));
    proc.stderr.on('data', (buff) => console.error(buffToText(buff)));
    proc.on('message', process.send);
  }

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

reportProcessPid('server_startup');
