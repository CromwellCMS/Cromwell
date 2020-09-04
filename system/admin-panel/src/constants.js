const path = require('path');

const projectRootDir = path.resolve(__dirname, '../../../');
const localProjectDir = path.resolve(__dirname, '../');
const localProjectBuildDir = path.resolve(__dirname, '../build');
const appBuildDev = path.resolve(localProjectDir, '.cromwell/static/build/dev');
const appBuildProd = path.resolve(localProjectDir, '.cromwell/static/build/prod');
const staticDir = path.resolve(localProjectDir, '.cromwell/static');
const publicStaticDir = path.resolve(localProjectDir, '.cromwell/static/public');
const generatorOutDir = path.resolve(localProjectDir, '.cromwell/imports');

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