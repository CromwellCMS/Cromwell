const { spawnSync } = require('child_process');

const port = process.env.PORT || 80;

spawnSync(`npx --no-install cromwell s -p ${port}`,
    { shell: true, cwd: process.cwd(), stdio: 'inherit' });
