import {
    sleep,
    TCCSModuleShortInfo,
    TCCSVersion,
    TFrontendBundle,
    TPluginConfig,
    TPluginEntity,
    TPluginEntityInput,
    TSciprtMetaInfo,
} from '@cromwell/core';
import {
    buildDirName,
    configFileName,
    getCmsModuleInfo,
    getCmsSettings,
    getLogger,
    getMetaInfoPath,
    getModulePackage,
    getNodeModuleDir,
    getPluginAdminBundlePath,
    getPluginAdminCjsPath,
    getPluginFrontendBundlePath,
    getPluginFrontendCjsPath,
    getPublicPluginsDir,
    runShellComand,
} from '@cromwell/core-backend';
import { getCentralServerClient } from '@cromwell/core-frontend';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import requireFromString from 'require-from-string';
import { getCustomRepository } from 'typeorm';

import { GenericPlugin } from '../helpers/genericEntities';
import { childSendMessage } from '../helpers/serverManager';

const logger = getLogger();

export let pluginServiceInst: PluginService;

@Injectable()
export class PluginService {

    constructor() {
        pluginServiceInst = this;
    }

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
            logger.error('Failed to resolve plugin directory of: ' + pluginName + ". Probably plugin was used in module cofig by name but wasn't installed in node_modules");
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
                logger.error("Failed to read plugin's settings", e);
            }
        }
        return out;
    }


    async checkPluginUpdate(pluginName: string): Promise<TCCSVersion | undefined> {
        const settings = await getCmsSettings();
        const isBeta = !!settings?.beta;
        const pckg = await getModulePackage(pluginName);
        try {
            return await getCentralServerClient().checkPluginUpdate(
                pluginName, pckg?.version ?? '0', isBeta);
        } catch (error) { }
    }

    async getPluginLatest(pluginName: string): Promise<TCCSModuleShortInfo | undefined> {
        try {
            return await getCentralServerClient().getPluginInfo(
                pluginName);
        } catch (error) { }
    }


    async updatePlugin(pluginName: string) {
        const pluginPckgOld = await getModulePackage(pluginName);
        if (!pluginPckgOld?.version) throw new HttpException('Plugin package not found', HttpStatus.INTERNAL_SERVER_ERROR);
        const oldVersion = pluginPckgOld.version;

        const updateInfo = await this.checkPluginUpdate(pluginName)
        if (!updateInfo || !updateInfo.packageVersion) throw new HttpException('No update available', HttpStatus.METHOD_NOT_ALLOWED);

        await runShellComand(`npm install ${pluginName}@${updateInfo.packageVersion} -S --save-exact`);
        await sleep(1);

        const pluginPckgNew = await getModulePackage(pluginName);
        if (!pluginPckgNew?.version) throw new HttpException('Plugin package not found', HttpStatus.INTERNAL_SERVER_ERROR);
        if (!/^\d/.test(pluginPckgNew.version)) pluginPckgNew.version = pluginPckgNew.version.substr(1);
        if (pluginPckgNew.version !== updateInfo.packageVersion) {
            throw new HttpException('New version was not applied', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const resp = await childSendMessage('make-new');
        if (resp.message !== 'success') {
            // Rollback
            await runShellComand(`npm install ${pluginName}@${oldVersion} -S --save-exact`);
            await sleep(1);

            throw new HttpException('Could not start server with new plugin', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            const resp2 = await childSendMessage('apply-new');

            if (resp2.message !== 'success') throw new HttpException('Could not start server with new plugin', HttpStatus.INTERNAL_SERVER_ERROR);

            await this.activatePlugin(pluginName);

            setTimeout(() => {
                childSendMessage('kill-me');
            }, 3000);
        }

        return true;
    }

    async installPlugin(pluginName: string) {
        const info = await this.getPluginLatest(pluginName)
        if (!info || !info.packageVersion || !info.version) throw new HttpException('Plugin was not found', HttpStatus.METHOD_NOT_ALLOWED);

        const settings = await getCmsSettings();
        const isBeta = !!settings?.beta;
        const version = isBeta ? (info.betaVersion ?? info.version) : info.version;

        await runShellComand(`npm install ${pluginName}@${version} -S --save-exact`);
        await sleep(1);

        const pluginPckgNew = await getModulePackage(pluginName);
        if (!pluginPckgNew?.version) throw new HttpException('Plugin package was not found', HttpStatus.INTERNAL_SERVER_ERROR);


        const resp1 = await childSendMessage('make-new');
        if (resp1.message !== 'success') {
            // Rollback
            await runShellComand(`npm uninstall ${pluginName} -S`);
            await sleep(1);

            throw new HttpException('Could not start server with the new plugin', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            const resp2 = await childSendMessage('apply-new', resp1.payload);

            if (resp2.message !== 'success') throw new HttpException('Could not start server with the new plugin', HttpStatus.INTERNAL_SERVER_ERROR);

            await this.activatePlugin(pluginName);

            setTimeout(() => {
                childSendMessage('kill-me');
            }, 3000);
        }

        return true;
    }


    public async activatePlugin(pluginName: string): Promise<boolean> {
        const pluginPath = await getNodeModuleDir(pluginName);
        const pluginPckg = await getModulePackage(pluginName);

        if (!pluginPckg?.version || !pluginPath) throw new HttpException('Failed to find package.json of the plugin ' + pluginName, HttpStatus.INTERNAL_SERVER_ERROR);

        // Read module info from package.json
        const moduleInfo = await getCmsModuleInfo(pluginName);
        delete moduleInfo?.frontendDependencies;
        delete moduleInfo?.bundledDependencies;
        delete moduleInfo?.firstLoadedDependencies;

        // Read plugin config
        let pluginConfig: TPluginConfig | undefined;
        const filePath = resolve(pluginPath, configFileName);
        if (await fs.pathExists(filePath)) {
            try {
                const content = (await fs.readFile(filePath)).toString();
                pluginConfig = requireFromString(content, filePath);
            } catch (e) {
                logger.error(e);
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
            } catch (e) { logger.log(e) }
        }

        // Check for admin bundle
        let hasAdminBundle = false;
        const bundle = await this.getPluginBundle(pluginName, 'admin');
        if (bundle) hasAdminBundle = true;

        // Create DB entity
        const input: TPluginEntityInput = {
            name: pluginName,
            version: pluginPckg.version,
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
                logger.error(e);
            }
        }

        if (moduleInfo) {
            try {
                input.moduleInfo = JSON.stringify(moduleInfo);
            } catch (e) {
                logger.error(e);
            }
        }

        const pluginRepo = getCustomRepository(GenericPlugin.repository);
        let entity;

        // Update entity if already in DB
        try {
            entity = await pluginRepo.getBySlug(pluginName);
            if (entity) {
                entity = Object.assign({}, entity, input);
                await pluginRepo.save(entity);
            }
        } catch (error) { }

        // Create new if not found
        if (!entity) {
            try {
                entity = await pluginRepo.createEntity(input);
            } catch (e) {
                logger.error(e)
            }
        }

        if (entity) {
            return true;
        }
        return false;
    }
}