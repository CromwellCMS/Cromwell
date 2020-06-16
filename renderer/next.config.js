const { exec } = require("child_process");
const crypto = require("crypto");
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    compress: false,
    generateEtags: false,
    generateBuildId: async () => {
        let buildId = crypto.randomBytes(10).toString('hex');
        console.log('buildId', buildId);
        await new Promise((resolve) => {
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
    env: {
        isProd: isProd,
    },
}