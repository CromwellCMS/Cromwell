const fs = require('fs-extra');
const { resolve } = require('path');
const { spawn, execSync } = require('child_process');
const localProjectRootDir = resolve(__dirname);
const buildScriptPath = resolve(localProjectRootDir, 'build/manager.js');

/**
  * @scriptName
  * production
  * development
  * winDev - start dev environment in Windows OS
  */
const scriptName = process.argv[2];

const main = () => {

    if (!fs.existsSync(buildScriptPath)) {
        console.log('\x1b[36m%s\x1b[0m', `Building Manager service...`);
        execSync('npm run build', { shell: true, cwd: localProjectRootDir, stdio: 'inherit' });
    }

    execSync(`node ${buildScriptPath} ${scriptName}`, { shell: true, cwd: localProjectRootDir, stdio: 'inherit' });
}

main();