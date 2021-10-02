const { spawnSync, spawn } = require("child_process");
const resolve = require('path').resolve;
const projectRootDir = process.cwd();
let fs = require('fs');

(async () => {

    const scriptName = process.argv[2] ? process.argv[2] : 'production';
    const noInstall = process.argv.includes('--no-install')
    const onlySystem = process.argv.includes('--system')

    const isCoreBuilt = () => {
        return !(!fs.existsSync(resolve(coreDir, 'common/dist')) ||
            !fs.existsSync(resolve(coreDir, 'backend/dist')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/dist')) ||
            !fs.existsSync(resolve(coreDir, 'common/es')) ||
            !fs.existsSync(resolve(coreDir, 'backend/es')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/es')));
    }


    const coreDir = resolve(projectRootDir, 'system/core');
    const rootNodeModulesDir = resolve(projectRootDir, 'node_modules');

    const managerStartupPath = resolve(projectRootDir, 'system/manager/startup.js');
    const cliStartupPath = resolve(projectRootDir, 'system/cli/startup.js');
    const backendNode_modules = resolve(coreDir, 'backend/node_modules');
    const frontendNode_modules = resolve(coreDir, 'frontend/node_modules');

    const hasNodeModules = () => {
        return !(
            !fs.existsSync(rootNodeModulesDir) ||
            !fs.existsSync(backendNode_modules) ||
            !fs.existsSync(frontendNode_modules)
        )
    }

    // Check node_modules
    if ((!hasNodeModules() || scriptName === 'build') && !noInstall) {
        spawnSync(`npm i --workspaces --force`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });

        fs = require('fs-extra');
        // For some reason npm duplicates @nestjs packages which leads to
        // multiple instances in one app, so Server unable to compile and run.
        // Clean them manually
        try {
            fs.removeSync(resolve(projectRootDir, 'system/core/backend/node_modules'));
            fs.removeSync(resolve(projectRootDir, 'system/server/node_modules'));
        } catch (error) {
            console.error(error);
        }
    } else {
        fs = require('fs-extra');
    }

    // Build core
    if (!isCoreBuilt() || scriptName === 'build') {
        console.log('\x1b[36m%s\x1b[0m', 'Building Core...');
        try {
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'common'), stdio: 'inherit' });
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'backend'), stdio: 'inherit' });
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'frontend'), stdio: 'inherit' });
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

    // Build manager
    const managerCommand = scriptName === 'build' ? 'buildService' : 'check';
    spawnSync(`node ${managerStartupPath} ${managerCommand}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });

    // Build cli
    spawnSync(`node ${cliStartupPath} ${managerCommand}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });

    // Check themes
    const themesDir = resolve(projectRootDir, 'themes');
    if (!onlySystem && fs.existsSync(themesDir)) {
        const themes = fs.readdirSync(themesDir);
        for (let i = 0; i < themes.length; i++) {
            const theme = themes[i];
            const themeDir = resolve(themesDir, theme);
            if (fs.existsSync(resolve(themeDir, 'package.json'))) {
                if (!fs.existsSync(resolve(themeDir, 'build')) || scriptName === 'build') {
                    console.log('\x1b[36m%s\x1b[0m', `Building ${theme} theme...`);
                    spawnSync('npm run build', { shell: true, cwd: themeDir, stdio: 'inherit' });
                }
            }
        }
    }

    if (scriptName === 'build') {
        spawnSync(`node ${managerStartupPath} ${scriptName}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
    }

    // Check plugins
    const pluginsDir = resolve(projectRootDir, 'plugins');
    if (!onlySystem && fs.existsSync(pluginsDir)) {
        const plugins = fs.readdirSync(pluginsDir);
        for (let i = 0; i < plugins.length; i++) {
            const plugin = plugins[i];
            const pluginDir = resolve(pluginsDir, plugin);
            if (fs.existsSync(resolve(pluginDir, 'package.json'))) {
                if (!fs.existsSync(resolve(pluginDir, 'build')) || scriptName === 'build') {
                    console.log('\x1b[36m%s\x1b[0m', `Building ${plugin} plugin...`);
                    spawnSync('npm run build', { shell: true, cwd: pluginDir, stdio: 'inherit' });
                }
            }
        }
    }

    // Start system
    if (scriptName !== 'build') {
        try {
            spawn(`node ${managerStartupPath} ${scriptName}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
        } catch (e) {
            console.log(e);
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Manager: Failed to Start system');
            throw new Error('Failed to Start system');
        }
    }

})();