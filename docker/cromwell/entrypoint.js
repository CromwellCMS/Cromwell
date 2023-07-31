const { spawnSync, spawn } = require('child_process');
const resolve = require('path').resolve;
const fs = require('fs-extra');

const cmsConfigPath = resolve(process.cwd(), 'cmsconfig.json');
const spawnOpts = { shell: true, cwd: process.cwd(), stdio: 'inherit' };
let cmsConfig;

if (process.env.DB_TYPE && process.env.DB_DATABASE) {
  cmsConfig = {
    orm: {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  };
  fs.outputFileSync(cmsConfigPath, JSON.stringify(cmsConfig));
} else if (fs.existsSync(cmsConfigPath)) {
  cmsConfig = fs.readJSONSync(cmsConfigPath);
} else {
  cmsConfig = {
    orm: {
      type: 'sqlite',
      database: '.cromwell/server/db.sqlite3',
    },
  };
  fs.outputFileSync(cmsConfigPath, JSON.stringify(cmsConfig));
}

if (!cmsConfig.orm.type)
  throw new Error('You must provide DB_TYPE as environment variable or orm.type in cmsconfig.json');
if (!cmsConfig.orm.database)
  throw new Error('You must provide DB_DATABASE as environment variable or orm.database in cmsconfig.json');

if (!fs.pathExistsSync('/app/nginx/nginx.conf')) {
  fs.copyFileSync('/app/nginx.conf', '/app/nginx/nginx.conf');
}

const main = async () => {
  spawnSync(`/usr/sbin/nginx -c /app/nginx/nginx.conf`, spawnOpts);
  spawn(`npx crw s ${process.env.INIT ? '--init' : ''}`, spawnOpts);
};

main();
