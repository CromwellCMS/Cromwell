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


    const projectRootDir = __dirname;
    const coreDir = resolve(projectRootDir, 'system/core');
    const rootNodeModulesDir = resolve(projectRootDir, 'node_modules');

    const rendererBuild = resolve(projectRootDir, 'system/renderer/build');
    const serverBuild = resolve(projectRootDir, 'system/server/build');
    const adminPanelBuild = resolve(projectRootDir, 'system/admin-panel/build');
    const managerBuild = resolve(projectRootDir, 'system/manager/build');
    const cromwellaBuild = resolve(projectRootDir, 'system/cromwella/build');

    const hasNodeModules = () => {
        return !(
            !fs.existsSync(rootNodeModulesDir) ||
            !fs.existsSync(resolve(coreDir, 'backend/node_modules')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/node_modules'))
        )
    }


    // Check node_modules
    if (!hasNodeModules()) {

        // Check builds of services to define which mode of Cromwella to run (dev | prod)
        // If all builds are persisting then will use prod mode (install only dependencies), 
        // otherwise it'll need to build services using dev mode and installing devDependencies additionally

        const isProd = true;

        if (!fs.existsSync(rendererBuild) ||
            !fs.existsSync(serverBuild) ||
            !fs.existsSync(adminPanelBuild) ||
            !fs.existsSync(managerBuild) ||
            !fs.existsSync(cromwellaBuild) ||
            !isCoreBuilt()
        ) isProd = false;

        const mode = isProd ? 'production' : 'development';
        const modeStr = mode === 'production' ? '--prod' : '';

        // Install pnpm
        console.log('\x1b[36m%s\x1b[0m', `Installing pnpm...`);
        spawnSync(`npm i pnpm -g`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });

        try {
            console.log('\x1b[36m%s\x1b[0m', `Installing modules via pnpm...`);
            spawnSync(`pnpm i ${modeStr}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
            if (!hasNodeModules()) throw new Error();
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', `Cromwell::startup. Error during ${command} command`);
            console.log(e);
            try {
                console.log('\x1b[36m%s\x1b[0m', 'Cromwell::startup. Running pnpm install, second attempt');
                spawnSync(`pnpm i ${modeStr}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
                if (!hasNodeModules()) throw new Error();
            } catch (e) {
                console.log(e);
                console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to install node_modules');
                return;
            }
        }
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

    const crowellaProjectDir = resolve(projectRootDir, 'system/cromwella');
    const crowellaPath = resolve(crowellaProjectDir, 'build/cli.js');

    // Build Cromwella if it is not built
    if (!fs.existsSync(crowellaPath)) {
        try {
            spawnSync(`npm run build`, {
                shell: true, cwd: crowellaProjectDir,
                stdio: 'inherit'
            });
            if (!fs.existsSync(crowellaPath)) {
                throw new Error();
            }
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to build Cromwella');
            console.log(e);
            return;
        }
    }


    // Check themes
    const themesDir = resolve(projectRootDir, 'themes');
    if (fs.existsSync(themesDir)) {
        const themes = fs.readdirSync(themesDir);
        for (const i = 0; i < themes.length; i++) {
            const theme = themes[i];
            const themeDir = resolve(themesDir, theme);
            if (!fs.existsSync(resolve(themeDir, '.cromwell'))) {
                console.log('\x1b[36m%s\x1b[0m', `Building ${theme} theme...`);
                spawnSync('npm run build', { shell: true, cwd: themeDir, stdio: 'inherit' });
            }
        }
    }

    // Check plugins
    const pluginsDir = resolve(projectRootDir, 'plugins');
    if (fs.existsSync(pluginsDir)) {
        const plugins = fs.readdirSync(pluginsDir);
        for (const i = 0; i < plugins.length; i++) {
            const plugin = plugins[i];
            const pluginDir = resolve(pluginsDir, plugin);
            if (!fs.existsSync(resolve(pluginDir, '.cromwell'))) {
                console.log('\x1b[36m%s\x1b[0m', `Building ${plugin} plugin...`);
                spawnSync('npm run build', { shell: true, cwd: pluginDir, stdio: 'inherit' });
            }
        }
    }

    const managerPath = resolve(projectRootDir, 'system/manager/startup.js')
    // Start system
    try {
        spawnSync(`node ${managerPath} production`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
    } catch (e) {
        console.log(e);
        console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Manager:Failed to Start system');
        return;
    }

})();