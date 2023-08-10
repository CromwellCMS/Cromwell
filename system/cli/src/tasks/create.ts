import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import { resolve } from 'path';
import downloader from 'github-directory-downloader';

export const sleep = (time: number) => new Promise((done) => setTimeout(done, time * 1000));

export const createTask = async (name?: string, noInstall?: boolean, type?: string) => {
  if (!name) {
    console.error('You must provide App name, eg.: npx crw create my-app');
    return;
  }

  const dir = resolve(process.cwd(), name + '');
  await fs.ensureDir(dir);
  await fs.ensureDir(resolve(dir, 'static'));

  if (type === 't') type = 'theme';
  if (type === 'p') type = 'plugin';
  if (type !== 'theme' && type !== 'plugin') type = 'basic';

  if (type === 'basic') {
    await downloader('https://github.com/CromwellCMS/templates/tree/main/basic', dir, { muteLog: true });
  }

  if (type === 'theme') {
    await downloader('https://github.com/CromwellCMS/templates/tree/main/theme', dir, { muteLog: true });
  }

  if (type === 'plugin') {
    await downloader('https://github.com/CromwellCMS/templates/tree/main/plugin', dir, { muteLog: true });
  }

  if (!noInstall) {
    spawnSync(`npm i -g yarn`, [], { shell: true, stdio: 'inherit', cwd: dir });

    if (type === 'theme' || type === 'plugin') {
      spawnSync(`yarn`, [], { shell: true, stdio: 'inherit', cwd: dir });
    } else {
      spawnSync(
        `yarn add @cromwell/cms @cromwell/theme-store @cromwell/theme-blog @cromwell/plugin-main-menu @cromwell/plugin-newsletter @cromwell/plugin-product-filter @cromwell/plugin-product-showcase @cromwell/plugin-stripe @cromwell/plugin-paypal @cromwell/plugin-marqo --exact --non-interactive`,
        [],
        { shell: true, stdio: 'inherit', cwd: dir },
      );
    }
  }

  if (type === 'theme') {
    console.log(
      `\n Created Theme boilerplate. Run\x1b[36m cd ${name} && npx cromwell b -w\x1b[0m to start development server`,
    );
  }

  if (type === 'basic') {
    const pckg = await fs.readJSON(resolve(dir, 'package.json'));
    pckg.name = name;
    await fs.outputJSON(resolve(dir, 'package.json'), pckg, { spaces: 2 });

    console.log(
      `\n Created basic boilerplate. Run\x1b[36m cd ${name} && npx cromwell start\x1b[0m to launch Cromwell CMS`,
    );
  }
};
