const fs = require('fs-extra');
const { resolve, join } = require("path");

/**
 * Dev tool. Supposed to be used in Cromwell monorepo
 */
const projectRootDir = process.cwd();
const systemDir = resolve(projectRootDir, 'system');


const folders = [
    join(systemDir, 'core/backend/node_modules'),
    join(systemDir, 'core/common/node_modules'),
    join(systemDir, 'core/frontend/node_modules'),
    join(systemDir, 'server/node_modules'),
    join(systemDir, 'renderer/node_modules'),
    join(systemDir, 'admin-panel/node_modules'),
    join(systemDir, 'manager/node_modules'),
    join(systemDir, 'utils/node_modules'),
    join(systemDir, 'cli/node_modules'),
    join(projectRootDir, 'website/node_modules'),

]

// Add themes
var themesDir = resolve(projectRootDir, 'themes');
if (fs.existsSync(themesDir)) {
    var themes = fs.readdirSync(themesDir);
    for (var i = 0; i < themes.length; i++) {
        var theme = themes[i];
        var themeDir = resolve(themesDir, theme);
        folders.push(resolve(themeDir, 'node_modules'));
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

