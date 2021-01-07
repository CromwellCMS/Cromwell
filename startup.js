const spawnSync = require("child_process").spawnSync;
const resolve = require('path').resolve;
const fs = require('fs');

(() => {

    const isCoreBuilt = () => {
        return !(!fs.existsSync(resolve(coreDir, 'common/dist')) ||
            !fs.existsSync(resolve(coreDir, 'backend/dist')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/dist')) ||
            !fs.existsSync(resolve(coreDir, 'common/es')) ||
            !fs.existsSync(resolve(coreDir, 'backend/es')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/es')));
    }


    const projectRootDir = process.cwd();
    const coreDir = resolve(projectRootDir, 'system/core');
    const rootNodeModulesDir = resolve(projectRootDir, 'node_modules');

    const managerStartupPath = resolve(projectRootDir, 'system/manager/startup.js')
    const cliStartupPath = resolve(projectRootDir, 'system/cli/startup.js')

    const hasNodeModules = () => {
        return !(
            !fs.existsSync(rootNodeModulesDir) ||
            !fs.existsSync(resolve(coreDir, 'backend/node_modules')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/node_modules'))
        )
    }

    // Check node_modules
    if (!hasNodeModules()) {
        spawnSync(`yarn install`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
    }

    // Build core
    if (!isCoreBuilt()) {
        console.log('\x1b[36m%s\x1b[0m', 'Building Core...');
        try {
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'common'), stdio: 'inherit' });
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'backend'), stdio: 'inherit' });
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'frontend'), stdio: 'inherit' });
        } catch (e) {
            console.log(e);
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to build Core');
            return;
        }
        if (!isCoreBuilt()) {
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to build Core');
            return;
        }
    }

    // Build manager
    spawnSync(`node ${managerStartupPath} buildService`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });

    // Build cli
    spawnSync(`node ${cliStartupPath} buildService`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });


    // Check themes
    const themesDir = resolve(projectRootDir, 'themes');
    if (fs.existsSync(themesDir)) {
        const themes = fs.readdirSync(themesDir);
        for (let i = 0; i < themes.length; i++) {
            const theme = themes[i];
            const themeDir = resolve(themesDir, theme);
            if (!fs.existsSync(resolve(themeDir, 'build'))) {
                console.log('\x1b[36m%s\x1b[0m', `Building ${theme} theme...`);
                try {
                    spawnSync('npm run build', { shell: true, cwd: themeDir, stdio: 'inherit' });
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    // Check plugins
    const pluginsDir = resolve(projectRootDir, 'plugins');
    if (fs.existsSync(pluginsDir)) {
        const plugins = fs.readdirSync(pluginsDir);
        for (let i = 0; i < plugins.length; i++) {
            const plugin = plugins[i];
            const pluginDir = resolve(pluginsDir, plugin);
            if (!fs.existsSync(resolve(pluginDir, 'build'))) {
                console.log('\x1b[36m%s\x1b[0m', `Building ${plugin} plugin...`);
                try {
                    spawnSync('npm run build', { shell: true, cwd: pluginDir, stdio: 'inherit' });
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    // Start system
    try {
        spawnSync(`node ${managerStartupPath} start`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
    } catch (e) {
        console.log(e);
        console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Manager:Failed to Start system');
        return;
    }

})();