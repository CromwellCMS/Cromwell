const { spawnSync, spawn } = require("child_process");
const resolve = require('path').resolve;
const fs = require('fs');
const cryptoRandomString = require('crypto-random-string');

const cmsconfigPath = resolve(process.cwd(), 'cmsconfig.json');
const spawnOpts = { shell: true, cwd: process.cwd(), stdio: 'inherit' };
let cmsConfig;

if (!fs.existsSync(cmsconfigPath)) {
    const rootPassword = cryptoRandomString({ length: 14 });
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

        // Limit 8 sec
        setTimeout(() => {
            if (completed) return;
            console.error('Error. Cromwell docker entrypoint: Exceeded timeout in waiting for DB to start')
            done();
        }, 8000);

        // Await for 'ready for connections' message
        if (mariadbProc.stderr && mariadbProc.stderr.on) {
            mariadbProc.stderr.on('data', (data) => {
                const msg = data.toString ? data.toString() : data;

                if (msg.includes('ready for connections') && !completed) {
                    completed = true;
                    done();
                }

                console.log(msg);
            });
        }
        if (mariadbProc.stdout && mariadbProc.stdout.on) {
            mariadbProc.stdout.on('data', (data) => {
                const msg = data.toString ? data.toString() : data;
                if (msg.includes('ready for connections') && !completed) {
                    completed = true;
                    done();
                }
                console.log(msg);
            });
        }
    });

    spawnSync(`/usr/sbin/nginx -c /app/nginx.conf`, spawnOpts);

    spawn(`npx --no-install crw s`, spawnOpts);
}

main();