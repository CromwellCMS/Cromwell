const { resolve } = require('path');
const {
    getRendererDir, getRendererTempDir,getRendererBuildDir
} = require('@cromwell/core-backend');

const projectRootDir = resolve(__dirname, '../../');
const buildDir = getRendererBuildDir(projectRootDir);
const tempDir = getRendererTempDir(projectRootDir);
const rendererRootDir = getRendererDir(projectRootDir);


module.exports = {
    projectRootDir,
    buildDir,
    tempDir,
    rendererRootDir
}