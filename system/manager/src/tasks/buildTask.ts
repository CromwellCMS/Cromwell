import { TPluginConfig, TThemeConfig } from '@cromwell/core';
import { configFileName, getThemeRollupBuildDirByPath, getThemeNextBuildDirByPath } from '@cromwell/core-backend';
import { rollupConfigWrapper } from '@cromwell/cromwella';
import dateTime from 'date-time';
import { resolve } from 'path';
import prettyBytes from 'pretty-bytes';
import ms from 'pretty-ms';
import fs from 'fs-extra';
import { rollup, RollupWatcherEvent, watch as rollupWatch } from 'rollup';

import { rendererBuildAndSaveTheme, rendererStartWatchDev } from '../managers/rendererManager';
import { checkModules } from './checkModules';

const { handleError, bold, underline, cyan, stderr, green } = require('rollup/dist/shared/loadConfigFile.js');
const { relativeId } = require('rollup/dist/shared/rollup.js');

export const buildTask = async (watch?: boolean) => {
    const workingDir = process.cwd();

    const configPath = resolve(workingDir, configFileName);
    let config: TThemeConfig | TPluginConfig | undefined = undefined;
    let packageJson;
    try {
        config = require(configPath);
        packageJson = require(resolve(workingDir, 'package.json'));
    } catch (e) {
        console.error('Failed to read config at ' + configPath);
        console.error('Make sure config exists and valid');
        console.error(e);
    }
    let isConfigValid = false;
    if (config && config.type) {

        if (config.type === 'theme') {
            isConfigValid = true;

            await checkModules();

            // Clean old build
            // const rollupBuildDir = getThemeRollupBuildDirByPath(workingDir);
            // if (rollupBuildDir && await fs.pathExists(rollupBuildDir)) await fs.remove(rollupBuildDir);

            console.log(`Starting to pre-build ${config.type}...`);
            const rollupBuildSuccess = await rollupBuild(config, watch);

            if (!rollupBuildSuccess) {
                console.error(`Failed to pre-build ${config.type}`);
                return false;
            }
            console.log(`Successfully pre-build ${config.type}`);

            console.log('Running Next.js build...');

            if (watch) {
                await rendererStartWatchDev(config.name);

            } else {
                const nextBuildDir = getThemeNextBuildDirByPath(workingDir);
                if (nextBuildDir && await fs.pathExists(nextBuildDir)) await fs.remove(nextBuildDir);

                await rendererBuildAndSaveTheme(config.name)
            }
        }

        if (config.type === 'plugin') {
            isConfigValid = true;

            console.log(`Starting to build ${config.type}...`);
            const rollupBuildSuccess = await rollupBuild(config, watch);

            if (!rollupBuildSuccess) {
                console.error(`Failed to build ${config.type}`);
                return false;
            }
            console.log(`Successfully build ${config.type}`);
        }
    }

    if (!isConfigValid) {
        console.error('Error. Config must have "type" property with a value "theme" or "plugin"');

    }
}


const rollupBuild = async (config: TPluginConfig | TThemeConfig, watch?: boolean): Promise<boolean> => {
    if (!config) return false;
    let rollupBuildSuccess = false;
    try {
        const rollupConfig = await rollupConfigWrapper(config, watch);

        if (watch) {
            const watcher = rollupWatch(rollupConfig);

            rollupBuildSuccess = await new Promise(done => {
                watcher.on('event', onRollupEvent(done));
            })
        } else {

            for (const optionsObj of rollupConfig) {
                const bundle = await rollup(optionsObj);

                if (optionsObj?.output && Array.isArray(optionsObj?.output)) {
                    await Promise.all(optionsObj.output.map(bundle.write));

                } else if (optionsObj?.output && typeof optionsObj?.output === 'object') {
                    //@ts-ignore
                    await bundle.write(optionsObj.output)
                }
            }
            rollupBuildSuccess = true;
        }

    } catch (e) {
        console.log(e);
    }
    return rollupBuildSuccess;
}


// Copied from rollup's repo
const onRollupEvent = (done: (success: boolean) => void) => (event: RollupWatcherEvent) => {
    switch (event.code) {
        case 'ERROR':
            handleError(event.error, true);
            done(false);
            break;

        case 'BUNDLE_START':
            let input = event.input;
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
            done(true);
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
