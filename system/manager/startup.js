const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, execSync } = require('child_process');
const { getCromwellaBuildDir, getCromwellaDir, getRendererBuildDir, getRendererDir } = require('@cromwell/core-backend');

const localProjectRootDir = resolve(__dirname);
const buildScriptPath = resolve(localProjectRootDir, 'build/index.js');

/**
  * @scriptName
  * production
  * development
  * winDev - start dev environment in Windows OS
  */
const scriptName = process.argv[2];

const main = async () => {

  const cromwellaDir = getCromwellaDir();
  const cromwellaBuildDir = getCromwellaBuildDir();

  if (cromwellaBuildDir && !fs.existsSync(cromwellaBuildDir)) {
    execSync('npm run build', { shell: true, cwd: cromwellaDir, stdio: 'inherit' });
  }

  const rendererDir = getRendererDir();
  const rendererBuildDir = getRendererBuildDir();

  if (rendererBuildDir && !fs.existsSync(rendererBuildDir)) {
    execSync('npm run buildRenderer', { shell: true, cwd: rendererDir, stdio: 'inherit' });
  }

  if (!fs.existsSync(buildScriptPath)) {
    console.log('\x1b[36m%s\x1b[0m', `Building Manager service...`);
    execSync('npm run build', { shell: true, cwd: localProjectRootDir, stdio: 'inherit' });
  }

  if (scriptName === 'buildService') return;

  const { startSystem } = require('./build/index');
  startSystem();
}

main();