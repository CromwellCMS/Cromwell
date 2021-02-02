import { TSciprtMetaInfo } from '@cromwell/core';
import { getLogger, serverLogFor } from '@cromwell/core-backend';
import colorsdef from 'colors/safe';
import extractZip from 'extract-zip';
import fs from 'fs-extra';
import moduleDownloader from 'github-directory-downloader';
import fetch from 'node-fetch';
import { resolve } from 'path';
import { promisify } from 'util';
import decompress from 'decompress';

import { moduleMetaInfoFileName } from './constants';
import { collectFrontendDependencies, collectPackagesInfo, getBundledModulesDir, globPackages } from './shared';
import { TPackage } from './types';

const streamPipeline = promisify(require('stream').pipeline);
const colors: any = colorsdef;
const logger = getLogger('errors-only');

export const downloader = async (projectRootDir?: string, pckgs?: TPackage[]) => {
    projectRootDir = projectRootDir ?? process.cwd();
    let packages: TPackage[] = [];
    if (!pckgs) {
        const packagePaths = await globPackages(projectRootDir);
        packages = collectPackagesInfo(packagePaths);
    } else packages = pckgs;

    // Check for bundled modules

    if (!packages) {
        logger.error('No packages found');
        return;
    }
    let downloads = 0;
    let successfulDownloads = 0;

    const frontendDeps = collectFrontendDependencies(packages, true);

    const bundledModulesDir = getBundledModulesDir();

    await fs.ensureDir(bundledModulesDir);

    const dowloadDepsRecursively = async (depName: string) => {
        const depDir = resolve(bundledModulesDir, depName);
        if (await fs.pathExists(depDir)) return;

        process.stdout.clearLine(-1);
        process.stdout.clearLine(0);
        process.stdout.write(colors.cyan(`Cromwella:: Downloading frontend module: ${colors.brightCyan(depName)}`));
        process.stdout.cursorTo(0);

        downloads++;
        const success = await downloadBundleZipped(depName, bundledModulesDir);
        if (!success) {
            colors.cyan(`Cromwella:: Downloading frontend module, second attempt: ${colors.brightCyan(depName)}`)
            const success2 = await downloadBundleZipped(depName, bundledModulesDir);
            if (!success2) return;
        }
        successfulDownloads++;
        // await downloadBundle(depName, bundledModulesDir);

        let meta: TSciprtMetaInfo;
        try {
            meta = require(resolve(depDir, moduleMetaInfoFileName));
            if (meta?.externalDependencies) {
                const subdeps = Object.keys(meta.externalDependencies);
                for (const subdep of subdeps) {

                    const subdepDir = resolve(bundledModulesDir, subdep);
                    if (!await fs.pathExists(subdepDir)) {
                        await dowloadDepsRecursively(subdep);
                    }
                }
            }
        } catch (e) { };
    }

    // Download in 10 parallel requests
    const requests = 10;

    await parallelFlows(requests, frontendDeps, (dep) => {
        const depName = `${dep.name}@${dep.version}`;
        return dowloadDepsRecursively(depName);
    })

    if (downloads > 0) {
        process.stdout.clearLine(-1);
        process.stdout.clearLine(0);
        console.log('\n')
        console.log(colors.cyan(`Cromwella:: Downloaded ${successfulDownloads}/${downloads} modules`));
    }
}


export const downloadBundle = async (moduleName: string, saveTo: string) => {
    const repo = 'https://github.com/CromwellCMS/bundled-modules/tree/master';
    const url = `${repo}/${moduleName}`;

    const stats = await moduleDownloader(url, resolve(saveTo, moduleName));

    if (!stats.success || stats.downloaded === 0) {
        serverLogFor('errors-only', `Failed to download module ${moduleName}` + stats.error, 'Error');
        await fs.remove(resolve(saveTo, moduleName));
    }
}

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
        serverLogFor('errors-only', `Failed to download module ${moduleName}` + e, 'Error');
        return false;
    }

    const moduleDir = resolve(saveTo, moduleName);
    const zipPath = resolve(moduleDir, 'module.zip');

    await fs.ensureDir(moduleDir);

    await streamPipeline(responseBody, fs.createWriteStream(zipPath));

    try {
        await decompress(zipPath, moduleDir)
        // await extractZip(zipPath, { dir: moduleDir })
    } catch (err) {
        serverLogFor('errors-only', `Failed to unzip module ${moduleName}` + err, 'Error');
        await fs.remove(moduleDir);
        return false;
    }

    return true;
}


const parallelFlows = async <T>(flowQnt: number, items: T[], worker: (item: T) => Promise<any>) => {
    const statuses: Promise<any>[] = [];
    for (let i = 0; i < items.length; i++) {
        const num = i % flowQnt;
        if (statuses[num]) {
            await statuses[num];
        }
        const item = items[i];
        statuses[num] = worker(item);
    }

    await Promise.all(statuses);
}