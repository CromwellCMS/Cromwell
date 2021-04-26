import { TFrontendBundle, TPluginEntity, TSciprtMetaInfo } from '@cromwell/core';
import { TPluginConfig, TPluginEntityInput } from '@cromwell/core';
import {
    buildDirName,
    getMetaInfoPath,
    getPluginAdminBundlePath,
    getPluginAdminCjsPath,
    getPluginFrontendBundlePath,
    getPluginFrontendCjsPath,
    serverLogFor,
    getCmsModuleInfo,
    getLogger,
    incrementServiceVersion,
} from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { configFileName, getPublicPluginsDir, getNodeModuleDir } from '@cromwell/core-backend';
import decache from 'decache';
import symlinkDir from 'symlink-dir';
import { GenericPlugin } from '../helpers/genericEntities';

const logger = getLogger('detailed');


@Injectable()
export class PluginService {

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
        logger.log('PluginService::getPluginBundle');
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

        const pluginDir = await getNodeModuleDir(pluginName);
        if (!pluginDir) {
            serverLogFor('errors-only', 'Failed to resolve plugin directory of: ' + pluginName + ". Probably plugin was used in module cofig by name but wasn't installed in node_modules", 'Error');
            return;
        }
        const filePath = pathGetter(resolve(pluginDir, buildDirName));

        let cjsPath: string | undefined = cjsPathGetter?.(
            resolve(pluginDir, buildDirName));
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


    public async installPlugin(pluginName: string): Promise<boolean> {
        const pluginPath = await getNodeModuleDir(pluginName);
        if (pluginPath && await fs.pathExists(pluginPath)) {

            // @TODO Execute install script


            // Read module info from package.json
            const moduleInfo = getCmsModuleInfo(pluginName);
            delete moduleInfo?.frontendDependencies;
            delete moduleInfo?.bundledDependencies;

            // Read plugin config
            let pluginConfig: TPluginConfig | undefined;
            const filePath = resolve(pluginPath, configFileName);
            if (await fs.pathExists(filePath)) {
                try {
                    // decache(filePath);
                    pluginConfig = require(filePath);
                } catch (e) {
                    console.error(e);
                }
            }
            const defaultSettings = pluginConfig?.defaultSettings;

            // Copy static content into public 
            const pluginPublicDir = resolve(pluginPath, 'static');
            if (await fs.pathExists(pluginPublicDir)) {
                try {
                    const publicPluginsDir = getPublicPluginsDir();
                    await fs.ensureDir(publicPluginsDir);
                    await fs.copy(pluginPublicDir, resolve(publicPluginsDir, pluginName));
                } catch (e) { console.log(e) }
            }


            // Check for admin bundle
            let hasAdminBundle = false;
            const bundle = await this.getPluginBundle(pluginName, 'admin');
            if (bundle) hasAdminBundle = true;

            // Create DB entity
            const input: TPluginEntityInput = {
                name: pluginName,
                slug: pluginName,
                title: moduleInfo?.title,
                pageTitle: moduleInfo?.title,
                isInstalled: true,
                hasAdminBundle
            };
            if (defaultSettings) {
                try {
                    input.defaultSettings = JSON.stringify(defaultSettings);
                    input.settings = JSON.stringify(defaultSettings);
                } catch (e) {
                    console.error(e);
                }
            }

            if (moduleInfo) {
                try {
                    input.moduleInfo = JSON.stringify(moduleInfo);
                } catch (e) {
                    console.error(e);
                }
            }

            const pluginRepo = getCustomRepository(GenericPlugin.repository);
            let entity;
            try {
                entity = await pluginRepo.createEntity(input);
            } catch (e) {
                console.error(e)
            }

            await incrementServiceVersion('serverPlugin');

            if (entity) {
                return true;
            }
        }

        return false;
    }
}