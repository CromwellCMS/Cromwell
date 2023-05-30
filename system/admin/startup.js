const fs = require('fs-extra');
const { resolve, join } = require('path');
const { spawnSync, spawn } = require('child_process');
const { getAdminPanelServiceBuildDir, getAdminPanelDir } = require('@cromwell/core-backend/dist/helpers/paths');
const yargs = require('yargs-parser');
const normalizePath = require('normalize-path');

// 'build' | 'dev' | 'prod'
const scriptName = process.argv[2];

const main = () => {
  const args = yargs(process.argv.slice(2));
  const buildDir = normalizePath(getAdminPanelServiceBuildDir());
  const buildStartupPath = resolve(buildDir, 'startup.js');
  const startupCompileDir = resolve(getAdminPanelDir(), 'src/startup');

  const isStartupBuilt = () => {
    return fs.pathExistsSync(buildStartupPath);
  };

  const buildStartupScript = () => {
    // Cleanup old build
    fs.removeSync(buildDir);

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
    spawnSync('npx next build', [], { shell: true, stdio: 'inherit', cwd: __dirname });
  };

  if (scriptName === 'build') {
    buildStartupScript();
    buildWebApp();
  }

  if (scriptName === 'dev') {
    fs.ensureDirSync(buildDir);

    const startupProc = spawn(
      `npx --no-install tsx watch ${normalizePath(join(startupCompileDir, 'startup.ts'))} development`,
      [],
      {
        shell: true,
        // detached: true,
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

    spawn(`next dev -p ${args.port || 4064}`, { shell: true, cwd: getAdminPanelDir(), stdio: 'inherit' });
  }

  if (scriptName === 'prod') {
    if (!isStartupBuilt()) {
      buildStartupScript();
    }
    if (!fs.existsSync(resolve(getAdminPanelDir(), 'build/.next'))) {
      buildWebApp();
    }

    spawnSync(`node ${normalizePath(buildStartupPath)} production`);
    spawnSync(`next -p ${args.port || 4064}`, { shell: true, cwd: getAdminPanelServiceBuildDir(), stdio: 'inherit' });
  }
};

main();
