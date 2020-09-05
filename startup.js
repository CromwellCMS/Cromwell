const { spawnSync } = require("child_process");
const path = require('path');
const { resolve } = path;
const fs = require('fs');

(() => {
    const projectRootDir = __dirname;
    const coreDir = resolve(projectRootDir, 'system/core');
    const cmsConfigPath = resolve(projectRootDir, 'system/cmsconfig.json');
    let cmsConfig;
    try {
        cmsConfig = JSON.parse(fs.readFileSync(cmsConfigPath).toString());
    } catch (e) {
        console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup Failed to read cmsconfig');
        console.log(e);
    }

    // Check node_modules
    if (!fs.existsSync(resolve(projectRootDir, 'node_modules'))) {
        console.log('\x1b[36m%s\x1b[0m', 'Installing lerna...');

        try {
            spawnSync(`npm install`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Error during "npm install" command');
            console.log(e);
            try {
                console.log('\x1b[36m%s\x1b[0m', 'Cromwell::startup. Installing lerna, second attempt');
                spawnSync(`npm install`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
            } catch (e) {
                console.log(e);
                console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to install lerna');
                return;
            }
        }
    }

    // Check core
    if (!fs.existsSync(resolve(coreDir, 'common/node_modules')) ||
        !fs.existsSync(resolve(coreDir, 'backend/node_modules')) ||
        !fs.existsSync(resolve(coreDir, 'frontend/node_modules'))) {
        console.log('\x1b[36m%s\x1b[0m', 'Running lerna bootstrap...');
        const command = 'npx lerna bootstrap --hoist';
        try {
            spawnSync(command, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', `Cromwell::startup. Error during ${command} command`);
            console.log(e);
            try {
                console.log('\x1b[36m%s\x1b[0m', 'Cromwell::startup. Running lerna bootstrap, second attempt');
                spawnSync(command, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
            } catch (e) {
                console.log(e);
                console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to bootstrap');
                return;
            }
        }

        if (!fs.existsSync(resolve(coreDir, 'common/node_modules')) ||
            !fs.existsSync(resolve(coreDir, 'backend/node_modules')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/node_modules'))) {
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Lerna bootstrap command has been processed but node_modules have not been added in one of the Core package');
            return;
        }
    }

    // Build core
    if (!fs.existsSync(resolve(coreDir, 'common/dist')) ||
        !fs.existsSync(resolve(coreDir, 'backend/dist')) ||
        !fs.existsSync(resolve(coreDir, 'frontend/dist')) ||
        !fs.existsSync(resolve(coreDir, 'common/es')) ||
        !fs.existsSync(resolve(coreDir, 'backend/es')) ||
        !fs.existsSync(resolve(coreDir, 'frontend/es'))) {
        console.log('\x1b[36m%s\x1b[0m', 'Building Core...');
        try {
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'common'), stdio: 'inherit' });
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'backend'), stdio: 'inherit' });
            spawnSync('npm run build', { shell: true, cwd: resolve(coreDir, 'frontend'), stdio: 'inherit' });
        } catch (e) {
            console.log(e);
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to build core');
            return;
        }
    }

    // Check themes
    const themesDir = resolve(projectRootDir, 'themes');
    if (fs.existsSync(themesDir)) {
        const themes = fs.readdirSync(themesDir);
        for (const theme of themes) {
            const themeDir = resolve(themesDir, theme);
            const configPath = resolve(themeDir, 'cromwell.config.json');
            try {
                const config = JSON.parse(fs.readFileSync(configPath).toString());
                if (config && config.appConfig && config.appConfig.pagesDir) {
                    if (!fs.existsSync(resolve(themeDir, config.appConfig.pagesDir))) {
                        console.log('\x1b[36m%s\x1b[0m', `Building ${theme} theme...`);
                        spawnSync('npm run build', { shell: true, cwd: themeDir, stdio: 'inherit' });
                    }
                    // Check if current and copy images
                    if (cmsConfig && cmsConfig.themeName && config.themeInfo &&
                        cmsConfig.themeName === config.themeInfo.themeName &&
                        !fs.existsSync(resolve(projectRootDir, 'public')) &&
                        fs.existsSync(resolve(themeDir, 'public'))) {
                        copyFolderRecursiveSync(resolve(themeDir, 'public'), resolve(projectRootDir))
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    // Check plugins
    const pluginsDir = resolve(projectRootDir, 'plugins');
    if (fs.existsSync(pluginsDir)) {
        const plugins = fs.readdirSync(pluginsDir);
        for (const plugin of plugins) {
            const pluginDir = resolve(pluginsDir, plugin);
            const configPath = resolve(pluginDir, 'cromwell.config.json');
            try {
                const config = JSON.parse(fs.readFileSync(configPath).toString());
                if (config && config.buildDir) {
                    if (!fs.existsSync(resolve(pluginDir, config.buildDir))) {
                        console.log('\x1b[36m%s\x1b[0m', `Building ${plugin} plugin...`);
                        spawnSync('npm run build', { shell: true, cwd: pluginDir, stdio: 'inherit' });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }


    // Start system
    try {
        spawnSync('node ./system/manager/manager.js start', { shell: true, cwd: projectRootDir, stdio: 'inherit' });
    } catch (e) {
        console.log(e);
        console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to Start system');
        return;
    }
})();



function copyFileSync(source, target) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}