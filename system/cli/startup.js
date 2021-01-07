const fs = require('fs-extra');
const { resolve } = require('path');
const { spawnSync } = require('child_process');

const localProjectRootDir = resolve(__dirname);
const buildScriptPath = resolve(localProjectRootDir, 'build/cli.js');


const main = async () => {

  if (!fs.existsSync(buildScriptPath)) {
    console.log('\x1b[36m%s\x1b[0m', `Building CLI service...`);
    spawnSync('npm run build', { shell: true, cwd: localProjectRootDir, stdio: 'inherit' });

    spawnSync(`npm link`, { shell: true, cwd: localProjectRootDir, stdio: 'inherit' });
  }
}

main();