import { logFor, TFrontendBundle, TPluginEntity, TSciprtMetaInfo } from '@cromwell/core';
import {
    buildDirName,
    getMetaInfoPath,
    getPluginAdminBundlePath,
    getPluginAdminCjsPath,
    getPluginFrontendBundlePath,
    getPluginFrontendCjsPath,
} from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';

import { GenericPlugin } from '../helpers/genericEntities';
import { projectRootDir } from '../constants';


@Injectable()
export class PluginService {

    public pluginsPath = resolve(projectRootDir, 'plugins');

    public async findOne(pluginName: string): Promise<TPluginEntity | undefined> {
        const pluginRepo = getCustomRepository(GenericPlugin.repository);
        return pluginRepo.findOne({
            where: {
                name: pluginName
            }
        });
    }

    public async save(plugin: TPluginEntity): Promise<TPluginEntity | undefined> {
        const pluginRepo = getCustomRepository(GenericPlugin.repository);
        return pluginRepo.save(plugin);
    }

    public getAll(): Promise<TPluginEntity[]> {
        const pluginRepo = getCustomRepository(GenericPlugin.repository);
        return pluginRepo.find();
    }


    /**
     * Reads files of a plugin in frontend or admin directory.
     * @param pluginName 
     * @param pathGetter 
     */
    public async getPluginBundle(pluginName: string, bundleType: 'admin' | 'frontend'): Promise<TFrontendBundle | undefined> {
        logFor('detailed', 'PluginService::getPluginBundle');
        let out: TFrontendBundle | undefined = undefined;
        let pathGetter: ((distDir: string) => string) | undefined = undefined;
        let cjsPathGetter: ((distDir: string) => string) | undefined = undefined;

        if (bundleType === 'admin') {
            pathGetter = getPluginAdminBundlePath;
            cjsPathGetter = getPluginAdminCjsPath;
        }
        if (bundleType === 'frontend') {
            pathGetter = getPluginFrontendBundlePath;
            cjsPathGetter = getPluginFrontendCjsPath;
        }
        if (!pathGetter) return;

        const filePath = pathGetter(resolve(this.pluginsPath, pluginName, buildDirName));

        let cjsPath: string | undefined = cjsPathGetter?.(
            resolve(this.pluginsPath, pluginName, buildDirName));
        if (cjsPath) cjsPath = normalizePath(cjsPath);

        if (cjsPath && !(await fs.pathExists(cjsPath))) cjsPath = undefined;
        if (await fs.pathExists(filePath)) {
            try {
                const source = (await fs.readFile(filePath)).toString();

                let meta: TSciprtMetaInfo | undefined;
                if (await fs.pathExists(getMetaInfoPath(filePath))) {
                    try {
                        meta = JSON.parse((await fs.readFile(getMetaInfoPath(filePath))).toString());
                    } catch (e) { }
                }

                out = {
                    source,
                    meta,
                    cjsPath
                }
            } catch (e) {
                console.error("Failed to read plugin's settings", e);
            }
        }
        return out;
    }
}