var spawnSync = require("child_process").spawnSync;
var path = require('path');
var resolve = path.resolve;
var fs = require('fs');

(function () {

    function copyFileSync(source, target) {
        var targetFile = target;
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }
    function copyFolderRecursiveSync(source, target) {
        var files = [];
        var targetFolder = target;
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }
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

    function isCoreBuilt() {
        return !(!fs.existsSync(resolve(coreDir, 'common/dist')) ||
            !fs.existsSync(resolve(coreDir, 'backend/dist')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/dist')) ||
            !fs.existsSync(resolve(coreDir, 'common/es')) ||
            !fs.existsSync(resolve(coreDir, 'backend/es')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/es')));
    }

    var projectRootDir = __dirname;
    var coreDir = resolve(projectRootDir, 'system/core');

    // Check node_modules
    if (!fs.existsSync(resolve(projectRootDir, 'node_modules')) ||
        !fs.existsSync(resolve(coreDir, 'backend/node_modules')) ||
        !fs.existsSync(resolve(coreDir, 'frontend/node_modules'))
    ) {

        const managerDir = resolve(projectRootDir, 'system/manager');
        const managerBuildDir = resolve(managerDir, 'build');
        const crowellaPath = resolve(managerBuildDir, 'cromwella.js');

        // Build Cromwella if it is not built
        if (!fs.existsSync(crowellaPath)) {
            // Install Manager modules
            console.log('\x1b[36m%s\x1b[0m', 'Installing Cromwella...');
            try {
                spawnSync(`npm install`, { shell: true, cwd: managerDir, stdio: 'inherit' });
            } catch (e) {
                console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Error during "npm install" command');
                console.log(e);
                try {
                    console.log('\x1b[36m%s\x1b[0m', 'Cromwell::startup. Installing lerna, second attempt');
                    spawnSync(`npm install`, { shell: true, cwd: managerDir, stdio: 'inherit' });
                } catch (e) {
                    console.log(e);
                    console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to install lerna');
                    return;
                }
            }
            try {
                spawnSync(`npm run build`, { shell: true, cwd: managerDir, stdio: 'inherit' });
            } catch (e) {
                console.log(e);
            }
        }

        // Check builds of services to define which mode of Cromwella to run (dev | prod)
        // If all builds are persisting then will use prod mode (install only dependencies), 
        // otherwise it'll need to build services using dev mode and installing devDependencies additionally
        var rendererBuild = resolve(projectRootDir, 'system/renderer/build');
        var serverBuild = resolve(projectRootDir, 'system/server/build');
        var adminPanelBuild = resolve(projectRootDir, 'system/admin-panel/build');

        var isProd = true;

        if (!fs.existsSync(rendererBuild) ||
            !fs.existsSync(serverBuild) ||
            !fs.existsSync(adminPanelBuild) ||
            !isCoreBuilt()
        ) isProd = false;

        var mode = isProd ? 'prod' : 'dev';

        // Run Cromwella
        console.log('\x1b[36m%s\x1b[0m', `Running Cromwella bootstrap...`);
        console.log('crowellaPath', crowellaPath)
        try {
            spawnSync(`node ${crowellaPath} ${mode}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', `Cromwell::startup. Error during ${command} command`);
            console.log(e);
            try {
                console.log('\x1b[36m%s\x1b[0m', 'Cromwell::startup. Running Cromwella bootstrap, second attempt');
                spawnSync(`node ${crowellaPath}`, { shell: true, cwd: projectRootDir, stdio: 'inherit' });
            } catch (e) {
                console.log(e);
                console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Failed to bootstrap');
                return;
            }
        }

        if (
            !fs.existsSync(resolve(coreDir, 'backend/node_modules')) ||
            !fs.existsSync(resolve(coreDir, 'frontend/node_modules'))) {
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Cromwella bootstrap command has been processed but node_modules have not been added in one of Core package');
            return;
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
    }

    var hasPublicDir = true;
    var cmsConfig;
    if (!fs.existsSync(resolve(projectRootDir, 'public'))) {
        hasPublicDir = false;
        var cmsConfigPath = resolve(projectRootDir, 'system/cmsconfig.json');
        try {
            cmsConfig = JSON.parse(fs.readFileSync(cmsConfigPath).toString());
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup Failed to read CMS config');
            console.log(e);
        }
    }

    // Check themes
    var themesDir = resolve(projectRootDir, 'themes');
    if (fs.existsSync(themesDir)) {
        var themes = fs.readdirSync(themesDir);
        for (var theme of themes) {
            var themeDir = resolve(themesDir, theme);
            var configPath = resolve(themeDir, 'cromwell.config.json');
            try {
                var config = JSON.parse(fs.readFileSync(configPath).toString());
                if (config && config.appConfig && config.appConfig.pagesDir) {
                    if (!fs.existsSync(resolve(themeDir, config.appConfig.pagesDir))) {
                        console.log('\x1b[36m%s\x1b[0m', `Building ${theme} theme...`);
                        spawnSync('npm run build', { shell: true, cwd: themeDir, stdio: 'inherit' });
                    }

                    // Check if current project root dir has no public folder and copy media from theme
                    if (!hasPublicDir && config.themeInfo && config.themeInfo.themeName
                        && fs.existsSync(resolve(themeDir, 'public'))) {
                        copyFolderRecursiveSync(resolve(themeDir, 'public'),
                            resolve(projectRootDir, `public/themes/${config.themeInfo.themeName}`));
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    // Check plugins
    var pluginsDir = resolve(projectRootDir, 'plugins');
    if (fs.existsSync(pluginsDir)) {
        var plugins = fs.readdirSync(pluginsDir);
        for (var plugin of plugins) {
            var pluginDir = resolve(pluginsDir, plugin);
            var configPath = resolve(pluginDir, 'cromwell.config.json');
            try {
                var config = JSON.parse(fs.readFileSync(configPath).toString());
                if (config && config.buildDir) {
                    if (!fs.existsSync(resolve(pluginDir, config.buildDir))) {
                        console.log('\x1b[36m%s\x1b[0m', `Building ${plugin} plugin...`);
                        spawnSync('npm run build', { shell: true, cwd: pluginDir, stdio: 'inherit' });
                    }
                }

                // Check if current project root dir has no public folder and copy media from theme
                if (!hasPublicDir && config.name && fs.existsSync(resolve(pluginDir, 'public'))) {
                    copyFolderRecursiveSync(resolve(pluginDir, 'public'),
                        resolve(projectRootDir, `public/plugins/${config.name}`));
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    // Start system
    try {
        spawnSync('node ./system/manager/src/manager.js start', { shell: true, cwd: projectRootDir, stdio: 'inherit' });
    } catch (e) {
        console.log(e);
        console.log('\x1b[31m%s\x1b[0m', 'Cromwell::startup. Manager:Failed to Start system');
        return;
    }

})();