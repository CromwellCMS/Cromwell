const path = require('path');

export const appBuildDev = path.resolve(__dirname, './.cromwell/static/build/dev');
export const appBuildProd = path.resolve(__dirname, './.cromwell/static/build/prod');
export const staticDir = path.resolve(__dirname, './.cromwell/static');
export const publicStaticDir = path.resolve(__dirname, './.cromwell/static/public');
export const projectRootDir = path.resolve(__dirname, '../../').replace(/\\/g, '/');
