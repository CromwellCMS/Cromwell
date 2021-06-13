const { spawnSync, spawn } = require("child_process");
const resolve = require('path').resolve;
const fs = require('fs');
const cryptoRandomString = require('crypto-random-string');

const cmsconfigPath = resolve(process.cwd(), 'cmsconfig.json');
const spawnOpts = { shell: true, cwd: process.cwd(), stdio: 'inherit' };
let cmsConfig;
let isNew = false;

if (!fs.existsSync(cmsconfigPath)) {
    isNew = true;
    const rootPassword = cryptoRandomString({ length: 20, type: 'base64' });
    cmsConfig = {
        orm: {
            type: 'mariadb',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: rootPassword,
            database: 'cromwell'
        }
    }
    fs.writeFileSync(cmsconfigPath, JSON.stringify(cmsConfig, null, 2));
} else {
    cmsConfig = JSON.parse(fs.readFileSync(cmsconfigPath).toString());
}

if (!cmsConfig.orm.password) throw new Error('!cmsConfig.orm.password');


const main = async () => {

    await new Promise(done => {
        const mariadbProc = spawn(`export MARIADB_ROOT_PASSWORD=${cmsConfig.orm.password} && export MARIADB_DATABASE=cromwell && /usr/local/bin/docker-entrypoint.sh mysqld`, [],
            { shell: true, stdio: 'pipe', cwd: process.cwd() });

        let completed = false;
        let readyCounter = 0;

        // Limit 10 sec
        setTimeout(() => {
            if (completed) return;
            console.error('Error. Cromwell docker entrypoint: Exceeded timeout while waiting for DB to start')
            completed = true;
            done();
        }, 10000);

        const omMessage = (data) => {
            const msg = data.toString ? data.toString() : data;
            console.log(msg);

            if (msg.includes('ready for connections') && !completed) {
                if (isNew) {
                    readyCounter++;
                    if (readyCounter > 1) {
                        completed = true;
                        done();
                    }
                } else {
                    completed = true;
                    done();
                }
            }
        }

        // Await for 'ready for connections' message
        if (mariadbProc.stderr && mariadbProc.stderr.on) {
            mariadbProc.stderr.on('data', omMessage);
        }
        if (mariadbProc.stdout && mariadbProc.stdout.on) {
            mariadbProc.stdout.on('data', omMessage);
        }
    });

    spawnSync(`/usr/sbin/nginx -c /app/nginx.conf`, spawnOpts);

    spawn(`npx crw s ${isNew ? '--init' : ''}`, spawnOpts);
}

main();