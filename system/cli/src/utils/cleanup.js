const fs = require('fs-extra');
const { resolve, join } = require("path");

const projectRootDir = process.cwd();
const systemDir = resolve(projectRootDir, 'system')


const folders = [
    join(systemDir, 'core/backend/node_modules'),
    join(systemDir, 'core/common/node_modules'),
    join(systemDir, 'core/frontend/node_modules'),
    join(systemDir, 'core/backend/dist'),
    join(systemDir, 'core/common/dist'),
    join(systemDir, 'core/frontend/dist'),
    join(systemDir, 'core/backend/es'),
    join(systemDir, 'core/common/es'),
    join(systemDir, 'core/frontend/es'),
    join(systemDir, 'server/node_modules'),
    join(systemDir, 'server/.cromwell'),
    join(systemDir, 'server/build'),
    join(systemDir, 'renderer/node_modules'),
    join(systemDir, 'renderer/build'),
    join(systemDir, 'renderer/.cromwell'),
    join(systemDir, 'admin-panel/.cromwell'),
    join(systemDir, 'admin-panel/node_modules'),
    join(systemDir, 'admin-panel/build'),
    join(systemDir, 'manager/.cromwell'),
    join(systemDir, 'manager/node_modules'),
    join(systemDir, 'manager/build'),
    join(systemDir, 'utils/.cromwell'),
    join(systemDir, 'utils/node_modules'),
    join(systemDir, 'utils/build'),
    join(systemDir, 'cli/.cromwell'),
    join(systemDir, 'cli/node_modules'),
    join(systemDir, 'cli/build'),
    join(systemDir, '.cromwell'),
    join(systemDir, 'core/backend/package-lock.json'),
    join(systemDir, 'core/common/package-lock.json'),
    join(systemDir, 'core/frontend/package-lock.json'),
    join(systemDir, 'server/package-lock.json'),
    join(systemDir, 'renderer/package-lock.json'),
    join(systemDir, 'utils/package-lock.json'),
    join(systemDir, 'manager/package-lock.json'),

    join(projectRootDir, 'package-lock.json'),
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

