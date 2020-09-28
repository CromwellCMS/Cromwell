#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const { resolve } = require('path');

execSync(`node --max-old-space-size=8192 ${resolve(__dirname, '../build/cli')} ${process.argv.slice(2).join(' ')}`,
    { shell: true, stdio: 'inherit' });