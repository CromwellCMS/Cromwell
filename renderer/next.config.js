const { exec } = require("child_process");
const crypto = require("crypto");

module.exports = {
    generateBuildId: async () => {
        let buildId = crypto.randomBytes(10).toString('hex');
        console.log('buildId1', buildId);
        await new Promise((resolve, reject) => {
            exec("git rev-parse HEAD", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    resolve();
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    resolve();
                    return;
                }
                console.log(`stdout: ${stdout}`);
                buildId = stdout;
                resolve();
            });
        })

        console.log('buildId', buildId);
        return buildId;
    },
}