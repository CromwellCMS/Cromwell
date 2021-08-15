const { spawnSync } = require("child_process");
const { resolve } = require('path');
const normalizePath = require('normalize-path');
const fs = require('fs-extra');
const glob = require('glob');


const generate = async () => {
    spawnSync(`cd ${normalizePath(resolve(__dirname, '../../'))} && npx typedoc --options website/api-generator/typedoc.json`, { shell: true, stdio: 'inherit' });

    const apiDir = resolve(__dirname, '../docs/api')
    if (!fs.pathExistsSync(apiDir)) throw new Error('Failed to generate API');

    const files = await new Promise(done => {
        glob(`${normalizePath(apiDir)}/**/*.md`, (err, files) => {
            done(files);
        });
    })

    for (const file of files) {
        const fileName = file.split('/').pop();
        const content = fs.readFileSync(file).toString()
            .replace(new RegExp(`\\]\\(${fileName}\\)`, 'g'), ']')
            .replace(new RegExp(`\\]\\(${fileName}`, 'g'), '](');

        fs.outputFileSync(file, content);
    }
}

generate();
