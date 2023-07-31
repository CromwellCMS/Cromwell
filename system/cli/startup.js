const fs = require('fs-extra');
const { resolve } = require('path');
const { spawnSync } = require('child_process');

const localProjectRootDir = resolve(__dirname);
const buildScriptPath = resolve(localProjectRootDir, 'build/cli.js');

/**
 * @scriptName
 * production
 * development
 * check - build if previous build does not exist
 * buildService - build cli service
 */
const scriptName = process.argv[2];

const main = () => {
  const hasBuild = fs.existsSync(buildScriptPath);
  if (!hasBuild || scriptName === 'buildService') {
    console.log('\x1b[36m%s\x1b[0m', `Building CLI service...`);
    spawnSync('npm run build', { shell: true, cwd: localProjectRootDir, stdio: 'inherit' });
  }
};

main();
