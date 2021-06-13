const { spawnSync, spawn } = require("child_process");
const resolve = require('path').resolve;
const fs = require('fs-extra');

const cmsconfigPath = resolve(process.cwd(), 'cmsconfig.json');
const spawnOpts = { shell: true, cwd: process.cwd(), stdio: 'inherit' };

const cmsConfig = {
    orm: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    }
}
fs.outputFileSync(cmsconfigPath, JSON.stringify(cmsConfig));

if (!cmsConfig.orm.type) throw new Error('You must provide DB_TYPE as environment variable');
if (!cmsConfig.orm.host) throw new Error('You must provide DB_HOST as environment variable');
if (!cmsConfig.orm.port) throw new Error('You must provide DB_PORT as environment variable');
if (!cmsConfig.orm.database) throw new Error('You must provide DB_DATABASE as environment variable');
if (!cmsConfig.orm.username) throw new Error('You must provide DB_USER as environment variable');
if (!cmsConfig.orm.password) throw new Error('You must provide DB_PASSWORD as environment variable');


if (!fs.pathExistsSync('/app/nginx/nginx.conf')) {
    fs.copyFileSync('/app/nginx.conf', '/app/nginx/nginx.conf')
}

const main = async () => {
    spawnSync(`/usr/sbin/nginx -c /app/nginx/nginx.conf`, spawnOpts);

    spawn(`npx crw s ${process.env.INIT ? '--init' : ''}`, spawnOpts);
}

main();