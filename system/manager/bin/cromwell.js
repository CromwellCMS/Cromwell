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
    execSync(`yarn install`,
        { shell: true, stdio: 'inherit', cwd: resolve(process.cwd()) });
}

execSync(`node --max-old-space-size=8192 ${resolve(__dirname, '../build/cli')} ${process.argv.slice(2).join(' ')}`,
    { shell: true, stdio: 'inherit' });