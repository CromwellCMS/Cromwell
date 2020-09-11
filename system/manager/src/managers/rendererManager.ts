import { startService, closeService } from './baseManager';
import { resolve } from 'path';
import config from '../config';
import fs from 'fs-extra';
import {
    getThemeDirSync, saveCMSConfigSync, getCMSConfigSync,
    getRendererDir, getRendererTempDir, getRendererTempNextDir,
    getRendererSavedBuildDirByTheme
} from '@cromwell/core-backend';
const { projectRootDir, cacheKeys, servicesEnv } = config;

const rendererDir = getRendererDir(projectRootDir);
const rendererTempDir = getRendererTempDir(projectRootDir);
const rendererStartupPath = resolve(rendererDir, 'startup.js');

type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';

export const startRenderer = () => {
    if (servicesEnv.renderer) {
        startService(rendererStartupPath, cacheKeys.renderer, [servicesEnv.renderer])
    }
}

export const closeRenderer = (cb?: () => void) => {
    closeService(cacheKeys.renderer, cb);
}

export const buildAndStart = (cb?: () => void) => {
    closeService(cacheKeys.renderer, () => {
        const commad: TRendererCommands = 'buildStart';
        startService(rendererStartupPath, cacheKeys.renderer, [commad]);
        if (cb) cb();
    });
}

export const changeThemeSync = (themeName: string, cb?: () => void): boolean => {
    const themeDir = getThemeDirSync(projectRootDir, themeName);
    const config = getCMSConfigSync(projectRootDir);
    console.log('rendererManager:: changeThemeSync', themeName, themeDir);
    if (themeDir && config) {
        const currentThemeName = config.themeName;
        const newThemeName = themeName;

        const currentArchiveBuildDir = getRendererSavedBuildDirByTheme(projectRootDir, currentThemeName);
        const newArchiveBuildDir = getRendererSavedBuildDirByTheme(projectRootDir, newThemeName);
        // Check for older build of current theme and delete
        if (fs.existsSync(currentArchiveBuildDir)) {
            console.log('rendererManager:: removing current archive: ' + currentArchiveBuildDir);
            fs.removeSync(currentArchiveBuildDir);
        }
        // Archive build of current theme
        const nextBuildDir = getRendererTempNextDir(projectRootDir);
        if (fs.existsSync(nextBuildDir)) {
            console.log(`rendererManager:: archiving current build ${nextBuildDir} to: ${currentArchiveBuildDir}`);
            fs.copySync(nextBuildDir, currentArchiveBuildDir);
        }
        // Delete current build of the theme
        if (fs.existsSync(nextBuildDir)) {
            console.log(`rendererManager:: removing current build ${nextBuildDir}`);
            fs.removeSync(nextBuildDir);
        }

        let hasBuilt = false;
        // Unarchive old build of the new theme if exists
        if (fs.existsSync(newArchiveBuildDir)) {
            console.log(`rendererManager:: unarchiving old build of a new theme ${newArchiveBuildDir}`);
            fs.copySync(newArchiveBuildDir, nextBuildDir);
            fs.removeSync(newArchiveBuildDir);
            hasBuilt = true;
        }

        // Save into CMS config
        config.themeName = themeName;
        console.log(`rendererManager:: saving CMS config with themeName: ${newThemeName}`)
        saveCMSConfigSync(projectRootDir, config);

        closeRenderer(() => {
            if (hasBuilt) {
                startRenderer();
            } else {
                buildAndStart()
            }
        });

        return true;
    }
    return false;
}