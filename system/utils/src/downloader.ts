import { getStoreItem, moduleMetaInfoFileName, TFrontendDependency, TScriptMetaInfo } from '@cromwell/core';
import { getBundledModulesDir, getLogger } from '@cromwell/core-backend';
import colorsdef from 'colors/safe';
import extractZip from 'extract-zip';
import fs from 'fs-extra';
import moduleDownloader from 'github-directory-downloader';
import { glob } from 'glob';
import fetch from 'node-fetch';
import normalizePath from 'normalize-path';
import { dirname, resolve } from 'path';
import readline from 'readline';
import { promisify } from 'util';

import { collectFrontendDependencies, collectPackagesInfo, globPackages, parseFrontendDeps } from './shared';
import { TPackage } from './types';

const streamPipeline = promisify(require('stream').pipeline);
const colors: any = colorsdef;
const logger = getLogger();

export const downloader = async (options?: {
  rootDir?: string;
  packages?: TPackage[];
  targetModule?: string | TFrontendDependency;
}) => {
  let { rootDir, packages } = options ?? {};
  const { targetModule } = options ?? {};
  rootDir = rootDir ?? process.cwd();

  // Check for bundled modules
  let downloads = 0;
  let successfulDownloads = 0;

  let frontendDeps: TFrontendDependency[] = [];

  if (targetModule) {
    frontendDeps = await parseFrontendDeps([targetModule]);
  } else {
    // Collect frontendDependencies from all packages
    if (!packages) {
      const packagePaths = await globPackages(rootDir);
      packages = collectPackagesInfo(packagePaths);
    }
    if (!packages) {
      logger.error('No packages found');
      return;
    }
    frontendDeps = await collectFrontendDependencies(packages, true);
  }

  frontendDeps = frontendDeps.filter((dep) => {
    // @cromwell frontend dependencies already bundled with services
    if (dep.name.startsWith('@cromwell')) return false;

    return true;
  });

  const bundledModulesDir = normalizePath(getBundledModulesDir());

  await fs.ensureDir(bundledModulesDir);

  const processedDependencies: string[] = [];

  const downloadDepsRecursively = async (depName: string) => {
    if (processedDependencies.includes(depName)) return;
    processedDependencies.push(depName);
    const depDir = resolve(bundledModulesDir, depName);

    if (!(await fs.pathExists(depDir))) {
      readline.clearLine(process.stdout, -1);
      readline.clearLine(process.stdout, 0);
      process.stdout.write(colors.cyan(`Downloading frontend module: ${colors.brightCyan(depName)}`));
      readline.cursorTo(process.stdout, 0);

      downloads++;
      const success = await downloadBundleZipped(depName, bundledModulesDir);
      if (!success) {
        colors.cyan(`Downloading frontend module, second attempt: ${colors.brightCyan(depName)}`);
        const success2 = await downloadBundleZipped(depName, bundledModulesDir);
        if (!success2) return;
      }
      successfulDownloads++;
      // await downloadBundle(depName, bundledModulesDir);
    }

    let meta: TScriptMetaInfo;
    try {
      meta = require(resolve(depDir, moduleMetaInfoFileName));
      if (meta?.externalDependencies) {
        const subdeps = Object.keys(meta.externalDependencies);
        for (const subdep of subdeps) {
          await downloadDepsRecursively(subdep);
        }
      }
    } catch (e) {}
  };

  // Download in 10 parallel requests
  const requests = 10;

  await parallelFlows(requests, frontendDeps, (dep) => {
    const depName = `${dep.name}@${dep.version}`;
    return downloadDepsRecursively(depName);
  });

  // Cleanup unused dependencies
  const allDeps = glob.sync(bundledModulesDir + '/**/*.zip').map((zipPath) => {
    return normalizePath(dirname(zipPath)).replace(bundledModulesDir + '/', '');
  });
  for (const dep of allDeps) {
    if (!processedDependencies.includes(dep)) {
      await fs.remove(resolve(bundledModulesDir, dep));
    }
  }

  if (getStoreItem('environment')?.mode === 'dev') {
    if (downloads > 0) {
      readline.clearLine(process.stdout, -1);
      readline.clearLine(process.stdout, 0);
      // eslint-disable-next-line no-console
      console.log('\n');
      // eslint-disable-next-line no-console
      console.log(colors.cyan(`Downloaded ${successfulDownloads}/${downloads} modules`));
    }
  }
};

export const downloadBundle = async (moduleName: string, saveTo: string) => {
  const repo = 'https://github.com/CromwellCMS/bundled-modules/tree/master';
  const url = `${repo}/${moduleName}`;

  const stats = await moduleDownloader(url, resolve(saveTo, moduleName));

  if (!stats.success || stats.downloaded === 0) {
    logger.log(`Failed to download module ${moduleName}` + stats.error);
    await fs.remove(resolve(saveTo, moduleName));
  }
};

export const downloadBundleZipped = async (moduleName: string, saveTo: string): Promise<boolean> => {
  const repo = 'https://raw.githubusercontent.com/CromwellCMS/bundled-modules/master';
  const url = `${repo}/${moduleName}/module.zip`;

  let responseBody;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.statusText} for ${url}`);
    }
    responseBody = response.body;
  } catch (e) {
    logger.log(`Failed to download module ${moduleName}` + e);
    return false;
  }

  const moduleDir = resolve(saveTo, moduleName);
  const zipPath = resolve(moduleDir, 'module.zip');

  await fs.ensureDir(moduleDir);

  await streamPipeline(responseBody, fs.createWriteStream(zipPath));

  await new Promise((done) => setTimeout(done, 500));

  try {
    await extractZip(zipPath, { dir: moduleDir });
  } catch (err) {
    logger.error(`Failed to unzip module ${moduleName}` + err);
    await fs.remove(moduleDir);
    return false;
  }

  return true;
};

const parallelFlows = async <T>(flowQnt: number, items: T[], worker: (item: T) => Promise<any>) => {
  const statuses: Promise<any>[] = [];
  for (let i = 0; i < items.length; i++) {
    const num = i % flowQnt;
    if (statuses[num] as any) {
      await statuses[num];
    }
    const item = items[i];
    statuses[num] = worker(item);
  }

  await Promise.all(statuses);
};
