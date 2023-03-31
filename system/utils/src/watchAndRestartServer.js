const watchAndRestartServer = ({ port, compileCommand, compileDir, buildOutputDir, buildServerPath, serverArgs }) => {
  const chokidar = require('chokidar');
  const tcpPortUsed = require('tcp-port-used');
  const treeKill = require('tree-kill');
  const { spawn } = require('child_process');
  const fs = require('fs-extra');

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

    await tcpPortUsed.waitUntilFree(port, 100, 5000).catch(console.error);

    if (fs.pathExistsSync(buildServerPath)) {
      childProc = spawn(`node ${buildServerPath}`, serverArgs || [], {
        shell: true,
        stdio: 'inherit',
        cwd: process.cwd(),
      });
    }

    isRestarting = false;
    if (scheduledRestart) {
      scheduledRestart = false;
      restartServer();
    }
  };

  restartServer();

  const watcher = chokidar.watch(`${buildOutputDir}/**/*.js`, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
  });
  watcher.on('add', restartServer).on('change', restartServer);

  const compileProc = spawn(compileCommand, [], { shell: true, stdio: 'pipe', cwd: compileDir });

  // eslint-disable-next-line no-console
  compileProc.stdout.on('data', (buff) => console.log(buff && buff.toString ? buff.toString() : buff));
  compileProc.stderr.on('data', (buff) => console.error(buff && buff.toString ? buff.toString() : buff));
};

module.exports = {
  watchAndRestartServer,
};
