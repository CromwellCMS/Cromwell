const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, execSync } = require('child_process');
const { getUtilsBuildDir, getUtilsDir, getRendererBuildDir, getRendererDir } = require('@cromwell/core-backend');

const localProjectRootDir = resolve(__dirname);
const buildScriptPath = resolve(localProjectRootDir, 'build/index.js');

/**
  * @scriptName
  * production
  * development
  * check - build if previous build does not exist
  * buildService - build manager service
  * build - build all services
  * winDev - start dev environment in Windows OS
  */
const scriptName = process.argv[2];

const main = async () => {

  const utilsDir = getUtilsDir();
  const utilsBuildDir = getUtilsBuildDir();

  if (utilsBuildDir && (!fs.existsSync(utilsBuildDir) || scriptName === 'buildService')) {
    execSync('npm run build', { shell: true, cwd: utilsDir, stdio: 'inherit' });
  }

  const rendererDir = getRendererDir();
  const rendererBuildDir = getRendererBuildDir();

  if (rendererBuildDir && (!fs.existsSync(rendererBuildDir) || scriptName === 'buildService')) {
    execSync('npm run buildService', { shell: true, cwd: rendererDir, stdio: 'inherit' });
  }

  if (!fs.existsSync(buildScriptPath) || scriptName === 'buildService') {
    console.log('\x1b[36m%s\x1b[0m', `Building Manager service...`);
    execSync('npm run build', { shell: true, cwd: localProjectRootDir, stdio: 'inherit' });
  }

  if (scriptName === 'buildService' || scriptName === 'check') return;

  const { startSystem } = require('./build/index');
  startSystem(scriptName);
}

main();