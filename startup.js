const { spawnSync, spawn } = require('child_process');
const resolve = require('path').resolve;
const projectRootDir = process.cwd();
let fs = require('fs');

(async () => {
  const scriptName = process.argv[2] ? process.argv[2] : 'production';
  const noInstall = process.argv.includes('--no-install');
  const onlySystem = process.argv.includes('--system');
  const spawnOpts = { shell: true, stdio: 'inherit' };

  const isCoreBuilt = () => {
    return !(
      !fs.existsSync(resolve(coreDir, 'common/dist')) ||
      !fs.existsSync(resolve(coreDir, 'backend/dist')) ||
      !fs.existsSync(resolve(coreDir, 'frontend/dist')) ||
      !fs.existsSync(resolve(coreDir, 'common/es')) ||
      !fs.existsSync(resolve(coreDir, 'backend/es')) ||
      !fs.existsSync(resolve(coreDir, 'frontend/es'))
    );
  };

  const coreDir = resolve(projectRootDir, 'system/core');
  const rootNodeModulesDir = resolve(projectRootDir, 'node_modules');

  const managerStartupPath = resolve(projectRootDir, 'system/manager/startup.js');
  const adminStartupPath = resolve(projectRootDir, 'system/admin/startup.js');
  const serverStartupPath = resolve(projectRootDir, 'system/server/startup.js');
  const cliStartupPath = resolve(projectRootDir, 'system/cli/startup.js');
  const backendNode_modules = resolve(coreDir, 'backend/node_modules');
  const frontendNode_modules = resolve(coreDir, 'frontend/node_modules');

  const hasNodeModules = () => {
    return !(
      !fs.existsSync(rootNodeModulesDir) ||
      !fs.existsSync(backendNode_modules) ||
      !fs.existsSync(frontendNode_modules)
    );
  };

  // Check node_modules
  if ((!hasNodeModules() || scriptName === 'build') && !noInstall) {
    spawnSync(`npm i -g yarn`, spawnOpts);
    spawnSync(`yarn`, spawnOpts);

    fs = require('fs-extra');
  } else {
    fs = require('fs-extra');
  }

  // Build core
  if (!isCoreBuilt() || scriptName === 'build') {
    console.log('\x1b[36m%s\x1b[0m', 'Building Core...');
    try {
      spawnSync('npm run build', {
        shell: true,
        cwd: resolve(coreDir, 'common'),
        stdio: 'inherit',
      });
      spawnSync('npm run build', {
        shell: true,
        cwd: resolve(coreDir, 'backend'),
        stdio: 'inherit',
      });
      spawnSync('npm run build', {
        shell: true,
        cwd: resolve(coreDir, 'frontend'),
        stdio: 'inherit',
      });
    } catch (e) {
      console.log(e);
      console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to build Core');
      throw new Error('Failed to build Core');
    }
    if (!isCoreBuilt()) {
      console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to build Core');
      throw new Error('Failed to build Core');
    }
  }

  // Builds manager, renderer and utils
  const managerCommand = scriptName === 'build' ? 'buildService' : 'check';
  spawnSync(`node ${managerStartupPath} ${managerCommand}`, {
    shell: true,
    cwd: projectRootDir,
    stdio: 'inherit',
  });

  // Build cli
  spawnSync(`node ${cliStartupPath} ${managerCommand}`, {
    shell: true,
    cwd: projectRootDir,
    stdio: 'inherit',
  });

  if (scriptName === 'build') {
    // Build server
    spawnSync(`node ${serverStartupPath} build`, {
      shell: true,
      cwd: projectRootDir,
      stdio: 'inherit',
    });
    // Build admin
    spawnSync(`node ${adminStartupPath} build`, {
      shell: true,
      cwd: projectRootDir,
      stdio: 'inherit',
    });
  }

  const buildAllPackagesInDir = (dir, buildDirName = 'build', pckgType) => {
    if (onlySystem || !fs.existsSync(dir)) return;
    const packages = fs.readdirSync(dir);
    for (let i = 0; i < packages.length; i++) {
      const pckg = packages[i];
      const pckgDir = resolve(dir, pckg);
      if (fs.existsSync(resolve(pckgDir, 'package.json'))) {
        if (!fs.existsSync(resolve(pckgDir, buildDirName)) || scriptName === 'build') {
          console.log('\x1b[36m%s\x1b[0m', `Building ${pckg} ${pckgType ?? ''}...`);
          spawnSync('npm run build', {
            shell: true,
            cwd: pckgDir,
            stdio: 'inherit',
          });
        }
      }
    }
  };

  // Check toolkits
  buildAllPackagesInDir(resolve(projectRootDir, 'toolkits'), 'dist', 'toolkit');

  // Check themes
  buildAllPackagesInDir(resolve(projectRootDir, 'themes'), 'build', 'theme');

  // Check plugins
  buildAllPackagesInDir(resolve(projectRootDir, 'plugins'), 'build', 'plugin');

  // Start system
  if (scriptName !== 'build') {
    try {
      spawn(`node ${managerStartupPath} ${scriptName}`, {
        shell: true,
        cwd: projectRootDir,
        stdio: 'inherit',
      });
    } catch (e) {
      console.log(e);
      console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Manager: Failed to Start system');
      throw new Error('Failed to Start system');
    }
  }
})();
