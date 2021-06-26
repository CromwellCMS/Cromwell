import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import { resolve } from 'path';
import downloader from 'github-directory-downloader';

export const sleep = (time: number) => new Promise(done => setTimeout(done, time * 1000));

export const createTask = async (name?: string, noInstall?: boolean, type?: string) => {
  if (!name) {
    console.error('You must provide App name, eg.: npx crw create my-app')
    return;
  }

  const dir = resolve(process.cwd(), name + '');
  await fs.ensureDir(dir);


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
    if (type === 'theme' || type === 'plugin') {

      spawnSync(`npm i`, [], { shell: true, stdio: 'inherit', cwd: dir });

      spawnSync(`npm update @cromwell/cms @cromwell/core @cromwell/core-frontend @cromwell/core-backend @rollup/plugin-commonjs @rollup/plugin-json rollup-plugin-postcss rollup-plugin-terser rollup-plugin-ts-compiler -D`
        , [], { shell: true, stdio: 'inherit', cwd: dir });

    } else {
      spawnSync(`npm i --save-exact`, [], { shell: true, stdio: 'inherit', cwd: dir });

      spawnSync(`npm update @cromwell/cms @cromwell/theme-store @cromwell/theme-blog @cromwell/plugin-main-menu @cromwell/plugin-newsletter @cromwell/plugin-product-filter @cromwell/plugin-product-showcase --save-exact`
        , [], { shell: true, stdio: 'inherit', cwd: dir });
    }
  }


  if (type === 'theme') {
    console.log(`\n Created Theme boilerplate. Run\x1b[36m cd ${name} && npx cromwell b -w\x1b[0m to start development server`)
  }
}
