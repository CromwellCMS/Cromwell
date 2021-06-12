const { spawnSync, spawn } = require("child_process");
const resolve = require('path').resolve;
const fs = require('fs');
const cryptoRandomString = require('crypto-random-string');

const ormconfigPath = resolve(process.cwd(), 'ormconfig.json');
const spawnOpts = { shell: true, cwd: process.cwd(), stdio: 'inherit' };
let ormConfig;

if (!fs.existsSync(ormconfigPath)) {
    const rootPassword = cryptoRandomString({ length: 14 });
    ormConfig = {
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: rootPassword,
        database: 'cromwell'
    }

    fs.writeFileSync(ormconfigPath, JSON.stringify(ormConfig, null, 2));
} else {
    ormConfig = JSON.parse(fs.readFileSync(ormconfigPath).toString());
}

if (!ormConfig.password) throw new Error('!ormConfig.password');


const main = async () => {

    await new Promise(done => {
        const proc = spawn(`export MARIADB_ROOT_PASSWORD=${ormConfig.password} && export MARIADB_DATABASE=cromwell && /usr/local/bin/docker-entrypoint.sh mysqld`, [],
            { shell: true, stdio: 'pipe', cwd: process.cwd() });

        // Limit 8 sec
        setTimeout(() => {
            console.error('Error. Cromwell docker entrypoint: Exceeded timeout in waiting for DB to start')
            done();
        }, 8000);

        // Await for 'ready for connections' message
        if (proc.stderr && proc.stderr.on && proc.stderr.once) {
            proc.stderr.on('data', (data) => {
                const msg = data.toString ? data.toString() : data;

                if (msg.includes('ready for connections')) done();
                console.log(msg);
            });
        }
        if (proc.stdout && proc.stdout.on) {
            proc.stdout.on('data', (data) => {
                const msg = data.toString ? data.toString() : data;
                if (msg.includes('ready for connections')) done();
                console.log(msg);
            });
        }
    });

    spawnSync(`/usr/sbin/nginx -c /nginx.conf`, spawnOpts);

    spawn(`npx --no-install crw s`, spawnOpts);
}

main();