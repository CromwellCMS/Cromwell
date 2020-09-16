const path = require('path');
const { adminPanelMessages, getAdminPanelDir, getAdminPanelServiceBuildDir,
    getAdminPanelWebBuildDev, getAdminPanelWebBuildProd, getAdminPanelWebStaticDir,
    getAdminPanelWebPublicDir, getAdminPanelGeneratorOutDir } = require('@cromwell/core-backend');

const projectRootDir = path.resolve(__dirname, '../../../');
const localProjectDir = path.resolve(__dirname, '../');

const localProjectBuildDir = getAdminPanelServiceBuildDir(projectRootDir);
const appBuildDev = getAdminPanelWebBuildDev(projectRootDir);
const appBuildProd = getAdminPanelWebBuildProd(projectRootDir);
const staticDir = getAdminPanelWebStaticDir(projectRootDir);
const publicStaticDir = getAdminPanelWebPublicDir(projectRootDir);
const generatorOutDir = getAdminPanelGeneratorOutDir(projectRootDir);

module.exports = {
    projectRootDir: projectRootDir.replace(/\\/g, '/'),
    localProjectDir,
    localProjectBuildDir,
    appBuildDev,
    appBuildProd,
    staticDir,
    publicStaticDir,
    generatorOutDir
}