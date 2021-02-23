const { spawnSync, spawn } = require("child_process");
const resolve = require('path').resolve;
const fs = require('fs');

(async () => {

    const scriptName = process.argv[2] ? process.argv[2] : 'production';

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

    const managerStartupPath = resolve(projectRootDir, 'system/manager/startup.js');
    const cliStartupPath = resolve(projectRootDir, 'system/cli/startup.js');
    const cliDir = resolve(projectRootDir, 'system/cli');
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
    let didInstall = false;
    if (!hasNodeModules() || scriptName === 'build') {
        didInstall = true;

        if (scriptName === 'build') {
            // Force yarn to re-resolve packages (run install). Otherwise some modules may be left unlinked
            // For example, at circleci there won't be available cromwell cli if we don't run install
            if (fs.existsSync(backendNode_modules))
                fs.rmdirSync(backendNode_modules, { recursive: true });

            if (fs.existsSync(frontendNode_modules))
                fs.rmdirSync(frontendNode_modules, { recursive: true });
        }

        spawnSync(`npm i yarn -g`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
        spawnSync(`yarn install`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
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

    if (didInstall) {
        const readPackageJson = require('read-package-json-fast');
        const { linkBinsOfPackages } = require('@pnpm/link-bins');

        function warn(msg) { console.warn(msg) };
        const packages = [{
            manifest: readPackageJson(resolve(cliDir, 'package.json')),
            location: resolve(cliDir, 'package.json'),
        }];
        await linkBinsOfPackages(packages, 'node_modules/.bin', { warn });
    }

    // Check themes
    const themesDir = resolve(projectRootDir, 'themes');
    if (fs.existsSync(themesDir)) {
        const themes = fs.readdirSync(themesDir);
        for (let i = 0; i < themes.length; i++) {
            const theme = themes[i];
            const themeDir = resolve(themesDir, theme);
            if (!fs.existsSync(resolve(themeDir, 'build')) || scriptName === 'build') {
                console.log('\x1b[36m%s\x1b[0m', `Building ${theme} theme...`);
                spawnSync('npm run build', { shell: true, cwd: themeDir, stdio: 'inherit' });
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
            if (!fs.existsSync(resolve(pluginDir, 'build')) || scriptName === 'build') {
                console.log('\x1b[36m%s\x1b[0m', `Building ${plugin} plugin...`);
                spawnSync('npm run build', { shell: true, cwd: pluginDir, stdio: 'inherit' });
            }
        }
    }

    // Start system
    try {
        spawn(`node ${managerStartupPath} ${scriptName}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
    } catch (e) {
        console.log(e);
        console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Manager: Failed to Start system');
        throw new Error('Failed to Start system');
    }

})();