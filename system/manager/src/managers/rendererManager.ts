import { startService, closeService } from './baseManager';
import { resolve } from 'path';
import config from '../config';
const { projectRootDir, cacheKeys, servicesEnv } = config;

const rendererStartupPath = resolve(projectRootDir, 'system/renderer/startup.js');

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
