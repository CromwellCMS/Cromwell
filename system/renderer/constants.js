const { resolve } = require('path');
const {
    getRendererDir, getRendererTempDir, getRendererBuildDir
} = require('@cromwell/core-backend');

const buildDir = getRendererBuildDir();
const tempDir = getRendererTempDir();
const rendererRootDir = getRendererDir();


module.exports = {
    buildDir,
    tempDir,
    rendererRootDir
}