const fs = require('fs-extra');
const { resolve, join } = require('path');

/**
 * Dev tool. Supposed to be used in Cromwell monorepo
 */
const projectRootDir = process.cwd();
const systemDir = resolve(projectRootDir, 'system');

const folders = [];
const addFolder = (folderName) => fs.pathExistsSync(folderName) && folders.push(folderName);

for (const folder of [
  join(systemDir, 'core/backend/.cromwell'),
  join(systemDir, 'core/frontend/.cromwell'),

  join(systemDir, 'core/backend/node_modules'),
  join(systemDir, 'core/common/node_modules'),
  join(systemDir, 'core/frontend/node_modules'),

  join(systemDir, 'core/backend/dist'),
  join(systemDir, 'core/common/dist'),
  join(systemDir, 'core/frontend/dist'),

  join(systemDir, 'core/backend/es'),
  join(systemDir, 'core/common/es'),
  join(systemDir, 'core/frontend/es'),

  join(systemDir, 'core/backend/package-lock.json'),
  join(systemDir, 'core/common/package-lock.json'),
  join(systemDir, 'core/frontend/package-lock.json'),

  join(systemDir, 'core/backend/.tsbuildinfo'),
  join(systemDir, 'core/common/.tsbuildinfo'),
  join(systemDir, 'core/frontend/.tsbuildinfo'),

  join(systemDir, 'server/node_modules'),
  join(systemDir, 'server/.cromwell'),
  join(systemDir, 'server/build'),
  join(systemDir, 'server/.tsbuildinfo'),
  join(systemDir, 'server/package-lock.json'),

  join(systemDir, 'renderer/node_modules'),
  join(systemDir, 'renderer/build'),
  join(systemDir, 'renderer/.cromwell'),
  join(systemDir, 'renderer/.tsbuildinfo'),
  join(systemDir, 'renderer/package-lock.json'),

  join(systemDir, 'admin/.cromwell'),
  join(systemDir, 'admin/.next'),
  join(systemDir, 'admin/node_modules'),
  join(systemDir, 'admin/build'),
  join(systemDir, 'admin/.tsbuildinfo'),
  join(systemDir, 'admin/package-lock.json'),

  join(systemDir, 'manager/.cromwell'),
  join(systemDir, 'manager/node_modules'),
  join(systemDir, 'manager/build'),
  join(systemDir, 'manager/.tsbuildinfo'),
  join(systemDir, 'manager/package-lock.json'),

  join(systemDir, 'utils/.cromwell'),
  join(systemDir, 'utils/node_modules'),
  join(systemDir, 'utils/build'),
  join(systemDir, 'utils/.tsbuildinfo'),
  join(systemDir, 'utils/package-lock.json'),

  join(systemDir, 'cli/.cromwell'),
  join(systemDir, 'cli/node_modules'),
  join(systemDir, 'cli/build'),
  join(systemDir, 'cli/.tsbuildinfo'),
  join(systemDir, 'cli/package-lock.json'),

  join(projectRootDir, 'website/.docusaurus'),
  join(projectRootDir, 'website/build'),
  join(projectRootDir, 'website/node_modules'),
  join(projectRootDir, 'website/.tsbuildinfo'),
  join(projectRootDir, 'website/package-lock.json'),

  join(systemDir, '.cromwell'),

  join(projectRootDir, 'package-lock.json'),
  join(projectRootDir, 'lerna-debug.log'),
  join(projectRootDir, '.cromwell/server'),
  join(projectRootDir, '.cromwell/renderer'),
  join(projectRootDir, '.cromwell/manager'),
  join(projectRootDir, '.cromwell/admin'),
])
  addFolder(folder);

// Add themes

const themesDir = resolve(projectRootDir, 'themes');
if (fs.existsSync(themesDir)) {
  const themes = fs.readdirSync(themesDir);
  for (let i = 0; i < themes.length; i++) {
    const theme = themes[i];
    const themeDir = resolve(themesDir, theme);
    addFolder(resolve(themeDir, 'node_modules'));
    addFolder(resolve(themeDir, 'package-lock.json'));
    addFolder(resolve(themeDir, '.cromwell'));
    addFolder(resolve(themeDir, 'build'));
    addFolder(resolve(themeDir, '.tsbuildinfo'));
  }
}

// Check plugins
const pluginsDir = resolve(projectRootDir, 'plugins');
if (fs.existsSync(pluginsDir)) {
  const plugins = fs.readdirSync(pluginsDir);
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    const pluginDir = resolve(pluginsDir, plugin);
    addFolder(resolve(pluginDir, 'node_modules'));
    addFolder(resolve(pluginDir, 'package-lock.json'));
    addFolder(resolve(pluginDir, '.cromwell'));
    addFolder(resolve(pluginDir, 'build'));
    addFolder(resolve(pluginDir, '.tsbuildinfo'));
  }
}

// Check toolkits
const toolkitsDir = resolve(projectRootDir, 'toolkits');
if (fs.existsSync(toolkitsDir)) {
  const toolkits = fs.readdirSync(toolkitsDir);
  for (let i = 0; i < toolkits.length; i++) {
    const toolkit = toolkits[i];
    const toolkitDir = resolve(toolkitsDir, toolkit);
    addFolder(resolve(toolkitDir, 'node_modules'));
    addFolder(resolve(toolkitDir, 'package-lock.json'));
    addFolder(resolve(toolkitDir, '.cromwell'));
    addFolder(resolve(toolkitDir, 'build'));
    addFolder(resolve(toolkitDir, '.tsbuildinfo'));
    addFolder(resolve(toolkitDir, 'es'));
    addFolder(resolve(toolkitDir, 'dist'));
  }
}

// console.log(folders);
// console.log(files);

folders.forEach((path) => {
  if (fs.pathExistsSync(path)) {
    console.log('Removing: ' + path);
    try {
      fs.removeSync(path);
    } catch (e) {
      console.log(e);
    }
  }
});
