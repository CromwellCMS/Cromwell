const { spawnSync } = require('child_process');

const port = process.env.PORT || 80;

spawnSync(`yarn cromwell start -p ${port}`, { shell: true, cwd: process.cwd(), stdio: 'inherit' });
