import { TFrontendDependency, TSciprtMetaInfo } from '@cromwell/core';
import { getLogger } from '@cromwell/core-backend';
import colorsdef from 'colors/safe';
import extractZip from 'extract-zip';
import fs from 'fs-extra';
import moduleDownloader from 'github-directory-downloader';
import fetch from 'node-fetch';
import { resolve } from 'path';
import readline from 'readline';
import { promisify } from 'util';

import { moduleMetaInfoFileName } from './constants';
import {
    collectFrontendDependencies,
    collectPackagesInfo,
    getBundledModulesDir,
    globPackages,
    parseFrontendDeps,
} from './shared';
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

    const bundledModulesDir = getBundledModulesDir();

    await fs.ensureDir(bundledModulesDir);

    const dowloadDepsRecursively = async (depName: string) => {
        const depDir = resolve(bundledModulesDir, depName);
        if (await fs.pathExists(depDir)) return;

        readline.clearLine(process.stdout, -1);
        readline.clearLine(process.stdout, 0);
        process.stdout.write(colors.cyan(`Cromwell:: Downloading frontend module: ${colors.brightCyan(depName)}`));
        readline.cursorTo(process.stdout, 0);

        downloads++;
        const success = await downloadBundleZipped(depName, bundledModulesDir);
        if (!success) {
            colors.cyan(`Cromwell:: Downloading frontend module, second attempt: ${colors.brightCyan(depName)}`)
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
        } catch (e) { }
    }

    // Download in 10 parallel requests
    const requests = 10;

    await parallelFlows(requests, frontendDeps, (dep) => {
        const depName = `${dep.name}@${dep.version}`;
        return dowloadDepsRecursively(depName);
    })

    if (downloads > 0) {
        readline.clearLine(process.stdout, -1);
        readline.clearLine(process.stdout, 0);
        console.log('\n')
        console.log(colors.cyan(`Cromwell:: Downloaded ${successfulDownloads}/${downloads} modules`));
    }
}


export const downloadBundle = async (moduleName: string, saveTo: string) => {
    const repo = 'https://github.com/CromwellCMS/bundled-modules/tree/master';
    const url = `${repo}/${moduleName}`;

    const stats = await moduleDownloader(url, resolve(saveTo, moduleName));

    if (!stats.success || stats.downloaded === 0) {
        logger.error(`Failed to download module ${moduleName}` + stats.error);
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
        logger.error(`Failed to download module ${moduleName}` + e);
        return false;
    }

    const moduleDir = resolve(saveTo, moduleName);
    const zipPath = resolve(moduleDir, 'module.zip');

    await fs.ensureDir(moduleDir);

    await streamPipeline(responseBody, fs.createWriteStream(zipPath));

    await new Promise(done => setTimeout(done, 500));

    try {
        await extractZip(zipPath, { dir: moduleDir });
    } catch (err) {
        logger.error(`Failed to unzip module ${moduleName}` + err);
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