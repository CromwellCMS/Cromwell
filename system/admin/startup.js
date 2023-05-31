const fs = require('fs-extra');
const { resolve, join } = require('path');
const { spawnSync, spawn } = require('child_process');
const {
  getAdminPanelServiceBuildDir,
  getAdminPanelDir,
  getAdminPanelTempDir,
} = require('@cromwell/core-backend/dist/helpers/paths');
const yargs = require('yargs-parser');
const normalizePath = require('normalize-path');
const { adminPanelMessages } = require('@cromwell/core-backend/dist/helpers/constants');
const { getLogger } = require('@cromwell/core-backend/dist/helpers/logger');

// 'build' | 'dev' | 'prod'
const scriptName = process.argv[2];

const logger = getLogger();

const main = async () => {
  const args = yargs(process.argv.slice(2));
  const buildDir = normalizePath(getAdminPanelServiceBuildDir());
  const buildStartupPath = resolve(buildDir, 'startup.js');
  const startupCompileDir = resolve(getAdminPanelDir(), 'src/startup');
  const nextBuildDir = resolve(getAdminPanelDir(), 'build/.next');
  const nextTempBuildDir = resolve(getAdminPanelDir(), '.next');

  const isStartupBuilt = () => {
    return fs.pathExistsSync(buildStartupPath);
  };
  const isAdminBuilt = () => {
    return fs.pathExistsSync(join(nextBuildDir, 'BUILD_ID'));
  };

  const buildStartupScript = () => {
    // Cleanup old build
    if (fs.pathExistsSync(buildStartupPath)) fs.removeSync(buildStartupPath);

    spawnSync(
      `npx --no-install tsc --outDir ${buildDir} --project ${normalizePath(join(startupCompileDir, 'tsconfig.json'))}`,
      [],
      {
        shell: true,
        stdio: 'inherit',
        cwd: startupCompileDir,
      },
    );
  };

  const buildWebApp = () => {
    logger.info('Building Admin app...');
    if (fs.pathExistsSync(nextTempBuildDir)) fs.removeSync(nextTempBuildDir);
    if (fs.pathExistsSync(nextBuildDir)) fs.removeSync(nextBuildDir);

    spawnSync('npx --no-install next build', [], { shell: true, stdio: 'inherit', cwd: __dirname });

    setTimeout(() => {
      if (fs.pathExistsSync(join(nextTempBuildDir, 'BUILD_ID'))) {
        fs.moveSync(nextTempBuildDir, nextBuildDir);
      } else {
        if (fs.pathExistsSync(nextTempBuildDir)) {
          logger.error('Failed to build Admin');
          fs.removeSync(nextTempBuildDir);
        }
      }
    }, 200);
  };

  const runDev = () => {
    fs.ensureDirSync(buildDir);

    const startupProc = spawn(
      `npx --no-install tsx watch ${normalizePath(join(startupCompileDir, 'startup.ts'))} development`,
      [],
      {
        shell: true,
        stdio: 'pipe',
      },
    );

    const buffToText = (buff) => {
      let str = buff && buff.toString ? buff.toString() : buff;
      str = str.replace(/\033\[[ABCD]/g, '');
      // eslint-disable-next-line no-control-regex
      str = str.replace(/\x1b[abcd]/g, '');
      return str;
    };

    // eslint-disable-next-line no-console
    startupProc.stdout.on('data', (buff) => console.log(buffToText(buff)));
    startupProc.stderr.on('data', (buff) => console.error(buffToText(buff)));

    setTimeout(() => {
      if (process.send) process.send(adminPanelMessages.onStartMessage);
    }, 1000);

    spawn(`npx --no-install next dev -p ${args.port || 4064}`, {
      shell: true,
      cwd: getAdminPanelDir(),
      stdio: 'inherit',
    });
  };

  const runProd = async () => {
    if (!isStartupBuilt()) {
      buildStartupScript();
    }
    if (!isAdminBuilt()) {
      buildWebApp();
      await new Promise((res) => setTimeout(res, 2000));
    }

    if (process.send) process.send(adminPanelMessages.onStartMessage);

    spawnSync(`node ${normalizePath(buildStartupPath)} production`, {
      shell: true,
      stdio: 'inherit',
    });
    spawnSync(`npx --no-install next start -p ${args.port || 4064}`, {
      shell: true,
      cwd: getAdminPanelTempDir(),
      stdio: 'inherit',
    });
  };

  if (scriptName === 'build') {
    await buildStartupScript();
    await buildWebApp();
  }

  if (scriptName === 'dev') {
    await runDev();
  }

  if (scriptName === 'prod') {
    await runProd();
  }
};

main().catch(() => {
  if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
});
