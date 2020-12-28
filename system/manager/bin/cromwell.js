#!/usr/bin/env node
const { execSync } = require('child_process');
const { resolve } = require('path');

// check for node_modules installed
try {
    require.resolve('yargs-parser');
    require.resolve('@cromwell/core');
    require.resolve('node-cleanup');
    require.resolve('rimraf');
    require.resolve('symlink-dir');
} catch (e) {
    const packageJson = require('../package.json');
    const deps = packageJson.startupDependencies;
    const depsStr = Object.keys(deps).map(depName => `${depName}@${deps[depName]}`).join(' ');
    console.log('depsStr', depsStr)
    execSync(`npm i ${depsStr} --no-package-lock --no-save`,
        { shell: true, stdio: 'inherit', cwd: resolve(process.cwd()) });
}

execSync(`node --max-old-space-size=8192 ${resolve(__dirname, '../build/cli')} ${process.argv.slice(2).join(' ')}`,
    { shell: true, stdio: 'inherit' });