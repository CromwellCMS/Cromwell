import { sleep, TModuleConfig, TPackageCromwellConfig } from '@cromwell/core';
import {
    getCmsModuleConfig,
    getCmsModuleInfo,
    getLogger,
    getRendererTempDir,
    getThemeNextBuildDirByPath,
} from '@cromwell/core-backend';
import { rollupConfigWrapper } from '@cromwell/utils';
import dateTime from 'date-time';
import fs from 'fs-extra';
import prettyBytes from 'pretty-bytes';
import ms from 'pretty-ms';
import { OutputOptions, rollup, RollupWatcherEvent, watch as rollupWatch } from 'rollup';

import { rendererBuildAndSaveTheme, rendererStartWatchDev } from '../managers/rendererManager';
import { checkDepenencies, checkModules } from './checkModules';

const { handleError, bold, underline, cyan, stderr, green } = require('rollup/dist/shared/loadConfigFile.js');
const { relativeId } = require('rollup/dist/shared/rollup.js');
const logger = getLogger(false);

export const buildTask = async (watch?: boolean, port?: string) => {
    const workingDir = process.cwd();

    const moduleInfo = await getCmsModuleInfo();
    const moduleConfig = await getCmsModuleConfig();
    await checkDepenencies();

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

        await checkModules();

        // Clean old build
        const rendererTempDir = getRendererTempDir();
        if (rendererTempDir && await fs.pathExists(rendererTempDir)) {
            await fs.remove(rendererTempDir);
            await sleep(0.1);
        }

        console.log(`Starting to pre-build ${moduleInfo.type}...`);
        const rollupBuildSuccess = await rollupBuild(moduleInfo, moduleConfig, watch);

        if (!rollupBuildSuccess) {
            console.error(`Failed to pre-build ${moduleInfo.type}`);
            return false;
        }
        console.log(`Successfully pre-built ${moduleInfo.type}`);

        console.log('Running Next.js build...');

        if (watch) {
            await rendererStartWatchDev(moduleInfo.name, port);

        } else {
            const nextBuildDir = getThemeNextBuildDirByPath(workingDir);
            if (nextBuildDir && await fs.pathExists(nextBuildDir)) await fs.remove(nextBuildDir);

            await rendererBuildAndSaveTheme(moduleInfo.name)
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


const rollupBuild = async (moduleInfo: TPackageCromwellConfig, moduleConfig?: TModuleConfig, watch?: boolean): Promise<boolean> => {
    if (!moduleInfo || !moduleInfo.type) return false;
    let rollupBuildSuccess = false;
    try {
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
            })
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


// Copied from rollup's repo
const onRollupEvent = (done?: (success: boolean) => void) => (event: RollupWatcherEvent) => {
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
    Object.keys(timings).forEach(label => {
        const appliedColor =
            label[0] === '#' ? (label[1] !== '#' ? underline : bold) : (text: string) => text;
        const [time, memory, total] = timings[label];
        const row = `${label}: ${time.toFixed(0)}ms, ${prettyBytes(memory)} / ${prettyBytes(total)}`;
        console.info(appliedColor(row));
    });
}
