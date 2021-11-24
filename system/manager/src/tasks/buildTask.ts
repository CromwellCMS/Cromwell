import { sleep, TModuleConfig, TPackageCromwellConfig } from '@cromwell/core';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import {
    buildDirName,
    getCmsModuleConfig,
    getCmsModuleInfo,
    getNodeModuleDir,
    getRendererTempDevDir,
    getThemeAdminPanelDir,
    getThemeBuildDir,
    getThemeNextBuildDirByPath,
    getThemeRollupBuildDir,
    getThemeTempAdminPanelDir,
} from '@cromwell/core-backend/dist/helpers/paths';
import { purgeNextJsFileCache } from '@cromwell/renderer/build/server';
import fs from 'fs-extra';
import { resolve } from 'path';
import { OutputOptions, RollupWatcherEvent } from 'rollup';

import { rendererRunBuild, rendererStartWatchDev } from '../managers/rendererManager';
import { checkDependencies } from './checkModules';

const logger = getLogger(false);

export const buildTask = async (watch?: boolean, port?: string) => {
    const workingDir = process.cwd();
    const moduleInfo = await getCmsModuleInfo();
    const moduleConfig = await getCmsModuleConfig();
    await checkDependencies();

    const errorExample = `
    {
        "name": "cromwell-plugin-your-plugin",
        "version": "1.0.0",
        "dependencies": {},
        "cromwell" : {
            "type": "plugin"
        }
    }`;

    if (!moduleInfo) {
        logger.error('package.json must have "cromwell" property. Eg.:' + errorExample);
        return;
    }

    if (!moduleInfo?.name) {
        logger.error('cromwell config in package.json must have "name" property. Eg.:' + errorExample);
        return;
    }

    if (!moduleInfo?.type) {
        logger.error('cromwell config in package.json must have "type" property. Eg.:' + errorExample);
        return;
    }

    if (moduleInfo.type !== 'theme' && moduleInfo.type !== 'plugin') {
        logger.error('"type" property of cromwell config in package.json must have either "plugin" or "theme" value. Eg.:' + errorExample);
        return;
    }

    if (moduleInfo.type === 'theme') {
        // Clean old build
        const rendererTempDir = getRendererTempDevDir();

        if (rendererTempDir && await fs.pathExists(rendererTempDir)) {
            await fs.remove(rendererTempDir);
            await sleep(0.1);
        }

        if (watch) {
            await rendererStartWatchDev(moduleInfo.name, port);

        } else {
            const nextBuildDir = getThemeNextBuildDirByPath(workingDir);
            if (nextBuildDir && await fs.pathExists(nextBuildDir)) await fs.remove(nextBuildDir);

            await rendererBuildAndSaveTheme(moduleInfo.name);
        }
    }

    if (moduleInfo.type === 'plugin') {
        console.log(`Starting to build ${moduleInfo.type}...`);
        const rollupBuildSuccess = await rollupBuild(moduleInfo, moduleConfig, watch);

        if (!rollupBuildSuccess) {
            console.error(`Failed to build ${moduleInfo.type}`);
            return false;
        }
        console.log(`Successfully build ${moduleInfo.type}`);
    }
}


export const rendererBuildAndSaveTheme = async (themeModuleName: string): Promise<boolean> => {
    const tempDir = getRendererTempDevDir();
    const themeDir = await getNodeModuleDir(themeModuleName);
    if (!themeDir) return false;
    const tempNextDir = resolve(tempDir, '.next');

    const buildSuccess = await rendererRunBuild(themeModuleName);
    if (!buildSuccess) return false;

    // Clean old build
    const themeBuildDir = await getThemeBuildDir(themeModuleName);
    if (themeBuildDir && await fs.pathExists(themeBuildDir)) {
        try {
            await fs.remove(themeBuildDir);
        } catch (e) {
            logger.error(e);
        }
        await sleep(0.1);
    }

    const themeBuildNextDir = resolve(themeDir, buildDirName, '.next');
    await sleep(0.1);
    try {
        if (await fs.pathExists(themeBuildNextDir)) await fs.remove(themeBuildNextDir);
    } catch (e) {
        logger.error(e);
    }
    await sleep(0.2);

    // Remove cache
    const nextCacheDir = resolve(tempNextDir, 'cache');
    if (await fs.pathExists(nextCacheDir)) await fs.remove(nextCacheDir);
    await sleep(0.1);

    // Remove generated HTML & JSON since either they generated with Theme
    // author's data or with no data at all, in any case, end-user will
    // have to re-generate them all.
    const nextPagesDir = resolve(tempNextDir, 'server/pages');
    await purgeNextJsFileCache(nextPagesDir);
    await sleep(0.1);

    await fs.move(tempNextDir, themeBuildNextDir);
    await sleep(0.2);

    const themeRollupBuildDir = await getThemeRollupBuildDir(themeModuleName);
    const themeTempAdminBuildDir = getThemeTempAdminPanelDir();
    const adminBuildDir = await getThemeAdminPanelDir(themeModuleName);

    if (themeRollupBuildDir) {
        if (await fs.pathExists(themeRollupBuildDir)) await fs.remove(themeRollupBuildDir);
        await sleep(0.2);

        if (themeTempAdminBuildDir && adminBuildDir &&
            await fs.pathExists(themeTempAdminBuildDir)) {
            await fs.move(themeTempAdminBuildDir, adminBuildDir);
        }
    }

    await fs.remove(tempDir);
    await sleep(0.1);

    logger.log('RendererManager:: successfully saved theme');
    return true;
}


const rollupBuild = async (moduleInfo: TPackageCromwellConfig, moduleConfig?: TModuleConfig, watch?: boolean): Promise<boolean> => {
    if (!moduleInfo || !moduleInfo.type) return false;
    let rollupBuildSuccess = false;
    const { rollup, watch: rollupWatch } = require('rollup');

    try {
        const { rollupConfigWrapper } = require('@cromwell/utils');
        const rollupConfig = await rollupConfigWrapper(moduleInfo, moduleConfig, watch);

        if (rollupConfig.length === 0) {
            logger.error('Failed to find input files');
            return false;
        }

        if (watch) {
            const watcher = rollupWatch(rollupConfig);

            let eventHandler = onRollupEvent;
            if (moduleInfo.type === 'theme') {
                eventHandler = onRollupEventShort;
            }
            rollupBuildSuccess = await new Promise(done => {
                watcher.on('event', eventHandler(done));
            });
        } else {

            for (const optionsObj of rollupConfig) {
                const outputFiles: (string | undefined)[] = []

                if (optionsObj?.output && Array.isArray(optionsObj?.output)) {
                    optionsObj.output.forEach(out => {
                        outputFiles.push(out.dir ?? out.file);
                    });
                } else if (optionsObj?.output && typeof optionsObj?.output === 'object') {
                    outputFiles.push((optionsObj.output as OutputOptions).dir ?? (optionsObj.output as OutputOptions).file)
                }

                onRollupEvent()({
                    code: 'BUNDLE_START',
                    input: optionsObj.input,
                    output: (outputFiles.filter(Boolean) as string[])
                });
                const dateStart = Date.now();

                const bundle = await rollup(optionsObj);

                if (optionsObj?.output && Array.isArray(optionsObj?.output)) {
                    await Promise.all(optionsObj.output.map(bundle.write));

                } else if (optionsObj?.output && typeof optionsObj?.output === 'object') {
                    await bundle.write(optionsObj.output as OutputOptions)
                }

                const dateEnd = Date.now();

                onRollupEvent()({
                    code: 'BUNDLE_END',
                    input: optionsObj.input,
                    output: (outputFiles.filter(Boolean) as string[]),
                    result: bundle,
                    duration: (dateEnd - dateStart)
                });

                await bundle.close();
            }
            rollupBuildSuccess = true;
        }

    } catch (e) {
        logger.error(e);
    }
    return rollupBuildSuccess;
}

let handleError, bold, underline, cyan, stderr, green, relativeId, dateTime, prettyBytes, ms;

const requireDevDeps = () => {
    if (!handleError || !bold) {
        const loadConfigFile = require('rollup/dist/shared/loadConfigFile.js');
        handleError = loadConfigFile.handleError;
        bold = loadConfigFile.bold;
        underline = loadConfigFile.underline;
        cyan = loadConfigFile.cyan;
        stderr = loadConfigFile.stderr;
        green = loadConfigFile.green;
        relativeId = loadConfigFile.relativeId;
        const rollupShared = require('rollup/dist/shared/rollup.js');
        relativeId = rollupShared.relativeId

        dateTime = require('date-time');
        prettyBytes = require('pretty-bytes');
        ms = require('pretty-ms');
    }
}

// Copied from rollup's repo
const onRollupEvent = (done?: (success: boolean) => void) => (event: RollupWatcherEvent) => {
    requireDevDeps();

    let input = (event as any)?.input;
    switch (event.code) {
        case 'ERROR':
            handleError(event.error, true);
            done?.(false);
            break;

        case 'BUNDLE_START':
            if (typeof input !== 'string') {
                input = Array.isArray(input)
                    ? input.join(', ')
                    : Object.keys(input as Record<string, string>)
                        .map(key => (input as Record<string, string>)[key])
                        .join(', ');
            }
            stderr(
                cyan(`bundles ${bold(input)} → ${bold(event.output.map(relativeId).join(', '))}...`)
            );
            break;

        case 'BUNDLE_END':
            stderr(
                green(
                    `created ${bold(event.output.map(relativeId).join(', '))} in ${bold(
                        ms(event.duration)
                    )}`
                )
            );
            if (event.result && event.result.getTimings) {
                printTimings(event.result.getTimings());
            }
            break;

        case 'END':
            stderr(`\n[${dateTime()}] waiting for changes...`);
            done?.(true);
    }
}


const onRollupEventShort = (done?: (success: boolean) => void) => (event: RollupWatcherEvent) => {
    requireDevDeps();
    switch (event.code) {
        case 'ERROR':
            handleError(event.error, true);
            done?.(false);
            break;

        case 'BUNDLE_START':
            stderr('wait  - compiling...');
            break;

        case 'BUNDLE_END':
            break;

        case 'END':
            done?.(true);
    }
}

function printTimings(timings: any) {
    requireDevDeps();
    Object.keys(timings).forEach(label => {
        const appliedColor =
            label[0] === '#' ? (label[1] !== '#' ? underline : bold) : (text: string) => text;
        const [time, memory, total] = timings[label];
        const row = `${label}: ${time.toFixed(0)}ms, ${prettyBytes(memory)} / ${prettyBytes(total)}`;
        console.info(appliedColor(row));
    });
}
