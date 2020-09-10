const isRunning = require('is-running');
const { execSync, exec } = require('child_process');

const winKillPid = (pid) => {
    if (isRunning(pid)) {
        console.log(`Taskkill /PID ${pid}`);
        try {
            execSync(`Taskkill /PID ${pid} /F /T`);
        } catch (e) { console.log(e) }
    }
}

module.exports = {
    winKillPid
}