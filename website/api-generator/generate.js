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
            // Remove links in files to themselves
            .replace(new RegExp(`\\]\\(${fileName}\\)`, 'g'), ']')
            // Same as before but for links with anchors we want to leave only anchors
            // and remove file name
            .replace(new RegExp(`\\]\\(${fileName}`, 'g'), '](')

        // Make links to other files relative by adding './'
        const chunks = content.split('](');
        if (content.length > 1) {
            for (let i = 1; i < chunks.length; i++) {
                if (!/^\w/.test(chunks[i])) continue;
                if (chunks[i].startsWith('http')) continue;
                chunks[i] = './' + chunks[i];
            }
        }
        fs.outputFileSync(file, chunks.join(']('));
    }
}

generate();
