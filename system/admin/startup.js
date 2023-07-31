const fs = require('fs-extra');
const { resolve, join } = require('path');
const { spawnSync, spawn } = require('child_process');
const { getAdminPanelServiceBuildDir, getAdminPanelDir } = require('@cromwell/core-backend/dist/helpers/paths');
const yargs = require('yargs-parser');
const normalizePath = require('normalize-path');
const { adminPanelMessages } = require('@cromwell/core-backend/dist/helpers/constants');
const { getLogger } = require('@cromwell/core-backend/dist/helpers/logger');

// 'build' | 'dev' | 'prod' | 'types'
const scriptName = process.argv[2];

const logger = getLogger();

const main = async () => {
  const args = yargs(process.argv.slice(2));
  const port = args.port || 4064;
  const buildDir = normalizePath(getAdminPanelServiceBuildDir());
  const buildServerPath = resolve(buildDir, 'server.js');
  const startupCompileDir = resolve(getAdminPanelDir(), 'src/startup');
  const nextBuildDir = resolve(getAdminPanelDir(), 'build/.next');
  const nextTempBuildDir = resolve(getAdminPanelDir(), '.next');

  const isServerBuilt = () => {
    return fs.pathExistsSync(buildServerPath);
  };
  const isAdminBuilt = () => {
    return fs.pathExistsSync(join(nextBuildDir, 'BUILD_ID'));
  };

  const buildServerScript = () => {
    // Cleanup old build
    if (fs.pathExistsSync(buildServerPath)) fs.removeSync(buildServerPath);

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

    spawnSync('npx --no-install next build --no-lint', [], { shell: true, stdio: 'inherit', cwd: __dirname });

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

  const outputDeclarations = () => {
    const declarationsBuildDir = join(buildDir, 'types');

    if (fs.pathExistsSync(declarationsBuildDir)) fs.removeSync(declarationsBuildDir);

    spawn(
      `npx --no-install tsc --declaration --emitDeclarationOnly --noEmit null -p ${normalizePath(
        join(getAdminPanelDir(), 'tsconfig.json'),
      )} --outDir ${normalizePath(declarationsBuildDir)}`,
      [],
      {
        cwd: getAdminPanelDir(),
        shell: true,
        stdio: 'inherit',
      },
    );
  };

  const runDev = () => {
    fs.ensureDirSync(buildDir);

    const serverProc = spawn(
      `npx --no-install tsx watch ${normalizePath(join(startupCompileDir, 'server.ts'))} development`,
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
    serverProc.stdout.on('data', (buff) => console.log(buffToText(buff)));
    serverProc.stderr.on('data', (buff) => console.error(buffToText(buff)));

    setTimeout(() => {
      if (process.send) process.send(adminPanelMessages.onStartMessage);
    }, 1000);

    spawn(`npx --no-install next dev -p ${port}`, {
      shell: true,
      cwd: getAdminPanelDir(),
      stdio: 'inherit',
    });
  };

  const runProd = async () => {
    if (args.r) {
      fs.removeSync(buildServerPath);
    }

    if (!isServerBuilt()) {
      buildServerScript();
    }
    if (!isAdminBuilt()) {
      buildWebApp();
      await new Promise((res) => setTimeout(res, 2000));
    }

    if (process.send) process.send(adminPanelMessages.onStartMessage);

    spawnSync(`node ${normalizePath(buildServerPath)} production --port ${port}`, {
      shell: true,
      stdio: 'inherit',
    });
  };

  if (scriptName === 'build') {
    outputDeclarations();
    buildServerScript();
    await buildWebApp();
  }

  if (scriptName === 'dev') {
    await runDev();
  }

  if (scriptName === 'prod') {
    await runProd();
  }

  if (scriptName === 'types') {
    outputDeclarations();
  }
};

main().catch((e) => {
  logger.error(e);
  if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
});
