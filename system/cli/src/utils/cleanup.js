const fs = require('fs-extra');
const { resolve } = require("path");

const projectRootDir = process.cwd();
const systemDir = resolve(projectRootDir, 'system')


const folders = [
    systemDir + '\\core\\backend\\node_modules',
    systemDir + '\\core\\common\\node_modules',
    systemDir + '\\core\\frontend\\node_modules',
    systemDir + '\\core\\backend\\dist',
    systemDir + '\\core\\common\\dist',
    systemDir + '\\core\\frontend\\dist',
    systemDir + '\\core\\backend\\es',
    systemDir + '\\core\\common\\es',
    systemDir + '\\core\\frontend\\es',

    systemDir + '\\server\\node_modules',
    systemDir + '\\server\\.cromwell',
    systemDir + '\\server\\build',

    systemDir + '\\renderer\\node_modules',
    systemDir + '\\renderer\\build',
    systemDir + '\\renderer\\.cromwell',

    systemDir + '\\admin-panel\\.cromwell',
    systemDir + '\\admin-panel\\node_modules',
    systemDir + '\\admin-panel\\build',

    systemDir + '\\manager\\.cromwell',
    systemDir + '\\manager\\node_modules',
    systemDir + '\\manager\\build',

    systemDir + '\\cromwella\\.cromwell',
    systemDir + '\\cromwella\\node_modules',
    systemDir + '\\cromwella\\build',

    systemDir + '\\.cromwell',

    // projectRootDir + '\\node_modules',

    // Files
    systemDir + '\\core\\backend\\package-lock.json',
    systemDir + '\\core\\common\\package-lock.json',
    systemDir + '\\core\\frontend\\package-lock.json',
    systemDir + '\\server\\package-lock.json',
    systemDir + '\\renderer\\package-lock.json',
    systemDir + '\\cromwella\\package-lock.json',
    systemDir + '\\manager\\package-lock.json',
    projectRootDir + '\\package-lock.json',

]

// Add themes
var themesDir = resolve(projectRootDir, 'themes');
if (fs.existsSync(themesDir)) {
    var themes = fs.readdirSync(themesDir);
    for (var i = 0; i < themes.length; i++) {
        var theme = themes[i];
        var themeDir = resolve(themesDir, theme);
        folders.push(resolve(themeDir, 'node_modules'));
        folders.push(resolve(themeDir, 'package-lock.json'));
        folders.push(resolve(themeDir, '.cromwell'));
        folders.push(resolve(themeDir, 'build'));
    }
}

// Check plugins
var pluginsDir = resolve(projectRootDir, 'plugins');
if (fs.existsSync(pluginsDir)) {
    var plugins = fs.readdirSync(pluginsDir);
    for (var i = 0; i < plugins.length; i++) {
        var plugin = plugins[i];
        var pluginDir = resolve(pluginsDir, plugin);
        folders.push(resolve(pluginDir, 'node_modules'));
        folders.push(resolve(pluginDir, 'package-lock.json'));
        folders.push(resolve(pluginDir, '.cromwell'));
        folders.push(resolve(pluginDir, 'build'));
    }
}

// console.log(folders);
// console.log(files);


folders.forEach(path => {
    if (fs.pathExistsSync(path)) {
        console.log('Removing: ' + path);
        try {
            fs.removeSync(path);
        } catch (e) { console.log(e) }
    }
})

