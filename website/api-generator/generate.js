const { spawnSync } = require('child_process');
const { resolve } = require('path');
const normalizePath = require('normalize-path');
const fs = require('fs-extra');
const glob = require('glob');

const generate = async () => {
  // Core API
  spawnSync(
    `cd ${normalizePath(
      resolve(__dirname, '../../'),
    )} && npx typedoc --options website/api-generator/core/typedoc.json`,
    { shell: true, stdio: 'inherit' },
  );

  const coreConfig = fs.readJsonSync(resolve(__dirname, './core/typedoc.json'));
  const coreDir = resolve(__dirname, './core', coreConfig.out);
  await processFiles({ apiDir: coreDir });

  fs.outputJSONSync(resolve(coreDir, './_category_.json'), {
    label: 'API',
    position: 4,
  });

  // Toolkits
  spawnSync(
    `cd ${normalizePath(
      resolve(__dirname, '../../'),
    )} && npx typedoc --options website/api-generator/toolkits/typedoc.json`,
    { shell: true, stdio: 'inherit' },
  );

  const toolkitsConfig = fs.readJsonSync(resolve(__dirname, './toolkits/typedoc.json'));
  const toolkitsDir = resolve(__dirname, './toolkits', toolkitsConfig.out);
  await processFiles({ apiDir: toolkitsDir, canAppendTitle: false });

  // Copy generated docs of toolkits into `docs` dir for website bundler
  const toolkitNames = ['commerce'];
  const appendTexts = {
    commerce: '---\n' + 'title: Commerce\n' + 'sidebar_position: 2\n' + '---\n\n',
  };

  for (const toolkitName of toolkitNames) {
    const toolkitPath = resolve(toolkitsDir, './modules', `${toolkitName}.md`);
    if (fs.pathExistsSync(toolkitPath)) {
      const appendText = appendTexts[toolkitName];
      let content = fs.readFileSync(toolkitPath);
      if (appendText) {
        content = appendText + content;
      }

      content = content.replace(new RegExp(`\\# Module\\:.*\n`, 'g'), '');

      fs.outputFileSync(toolkitPath, content);
      fs.copyFileSync(toolkitPath, resolve(__dirname, `../docs/toolkits/${toolkitName}.md`));
    }
  }
};

const processFiles = async ({ apiDir, canAppendTitle = true }) => {
  if (!fs.pathExistsSync(apiDir)) throw new Error('Failed to generate API');

  const files = await new Promise((done) => {
    glob(`${normalizePath(apiDir)}/**/*.md`, (err, files) => {
      if (err) console.error(err);
      done(files);
    });
  });

  for (const file of files) {
    const fileName = file.split('/').pop();
    let content = fs
      .readFileSync(file)
      .toString()
      // Remove links in files to themselves
      .replace(new RegExp(`\\]\\(${fileName}\\)`, 'g'), ']')
      // Same as before but for links with anchors, we want to leave
      // only anchors and remove file name
      .replace(new RegExp(`\\]\\(${fileName}`, 'g'), '](');

    const firstLine = new RegExp(`^\\[\\@cromwell.*\n`).exec(content)?.[0];

    content = content
      // Remove text `[@cromwell/root]` at the beginning
      .replace(new RegExp(`^\\[\\@cromwell.*\n`, 'g'), '');

    if (canAppendTitle) {
      let title;
      if (firstLine) {
        const chunks = firstLine.split('/');
        title = chunks[chunks.length - 1].trim();
      }

      if (title) {
        content = '---\n' + `title: ${title}\n` + '---\n\n' + content;
      }
    }

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
};

generate();
