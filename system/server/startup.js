const fs = require('fs-extra');
const { spawn, spawnSync } = require('child_process');
const {
  getServerDir,
  getServerBuildProxyPath,
  getServerBuildDir,
} = require('@cromwell/core-backend/dist/helpers/paths');
const { serverMessages } = require('@cromwell/core-backend/dist/helpers/constants');
const normalizePath = require('normalize-path');
const npmRunPath = require('npm-run-path');
const chokidar = require('chokidar');
const tcpPortUsed = require('tcp-port-used');
const treeKill = require('tree-kill');
const yargs = require('yargs-parser');

// 'build' | 'prod' | 'dev'
const scriptName = process.argv[2];
const serverRootDir = getServerDir();
const buildDir = normalizePath(getServerBuildDir());
const buildProxyPath = getServerBuildProxyPath();

const main = () => {
  const buildServer = () => {
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

  if (scriptName === 'dev') {
    if (!isServiceBuild()) {
      buildServer();
    }

    let isThrottled = false;
    let scheduledRestart = false;
    let isRestarting = false;
    let childProc;

    const restartServer = async () => {
      if (isThrottled) return;
      isThrottled = true;
      if (isRestarting) {
        scheduledRestart = true;
        return;
      }
      isRestarting = true;
      setTimeout(() => {
        isThrottled = false;
      }, 300);

      console.warn('Restarting server');
      if (childProc) treeKill(childProc.pid, 'SIGTERM');

      const port = process.env.API_PORT || Number(yargs(process.argv.slice(2))) || 4016;
      await tcpPortUsed.waitUntilFree(port, 100, 5000).catch(console.error);

      childProc = spawn(`node ${buildProxyPath} ${process.argv.slice(2).join(' ')}`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: process.cwd(),
      });

      isRestarting = false;
      if (scheduledRestart) {
        scheduledRestart = false;
        restartServer();
      }
    };

    restartServer();

    const watcher = chokidar.watch(`${buildDir}/**/*.js`, {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true,
    });
    watcher.on('add', restartServer).on('change', restartServer);

    const rollupProc = spawn(`npx --no-install rollup -cw`, [], { shell: true, stdio: 'pipe', cwd: serverRootDir });

    // eslint-disable-next-line no-console
    rollupProc.stdout.on('data', (buff) => console.log(buff && buff.toString ? buff.toString() : buff));
    rollupProc.stderr.on('data', (buff) => console.error(buff && buff.toString ? buff.toString() : buff));

    setTimeout(() => {
      process.send(serverMessages.onStartMessage);
    }, 3000);
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
