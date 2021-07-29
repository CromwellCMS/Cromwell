import {
    getRandStr,
    sleep,
    TCCSModuleShortInfo,
    TCCSVersion,
    TFrontendBundle,
    TPluginConfig,
    TPluginEntity,
    TPluginEntityInput,
    TScriptMetaInfo,
} from '@cromwell/core';
import {
    buildDirName,
    configFileName,
    GenericPlugin,
    getCmsModuleInfo,
    getCmsSettings,
    getLogger,
    getMetaInfoPath,
    getModulePackage,
    getModuleStaticDir,
    getNodeModuleDir,
    getPluginAdminBundlePath,
    getPluginAdminCjsPath,
    getPluginFrontendBundlePath,
    getPluginFrontendCjsPath,
    getPublicPluginsDir,
    readPluginsExports,
    runShellCommand,
} from '@cromwell/core-backend';
import { getCentralServerClient } from '@cromwell/core-frontend';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import decache from 'decache';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import { Container, Service } from 'typedi';
import { getConnection, getCustomRepository } from 'typeorm';

import { serverFireAction } from '../helpers/serverFireAction';
import { childSendMessage } from '../helpers/serverManager';
import {
    endTransaction,
    restartService,
    setPendingKill,
    setPendingRestart,
    startTransaction,
} from '../helpers/stateManager';
import { CmsService } from './cms.service';

const logger = getLogger();

@Injectable()
@Service()
export class PluginService {

    private get cmsService() {
        return Container.get(CmsService);
    }

    constructor() {
        this.init();
    }

    private async init() {
        await sleep(1);
        if (!getConnection()?.isConnected) return;

        const entities = await this.getAll();
        for (const entity of entities) {
            if (await this.getIsUpdating(entity.name)) {
                // Limit updating time in case if previous server instance
                // crashed and was unable to set isUpdating to false
                setTimeout(async () => {
                    if (await this.getIsUpdating(entity.name)) {
                        logger.error(`Server: ${entity.name} is still updating after minute of running a new server instance. Setting isUpdating to false`);
                        await this.setIsUpdating(entity.name, false);
                    }
                }, 60000);
            }
        }
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

    private async setIsUpdating(pluginName: string, updating: boolean) {
        try {
            const pluginRepo = getCustomRepository(GenericPlugin.repository);
            const entity = await this.findOne(pluginName);
            if (entity) {
                entity.isUpdating = updating;
                await pluginRepo.save(entity);
            }
        } catch (error) {
            logger.error(error);
        }
    }

    private async getIsUpdating(pluginName: string) {
        try {
            return (await this.findOne(pluginName))?.isUpdating;
        } catch (error) {
            logger.error(error);
        }
        return false;
    }

    public async getPluginConfig(pluginName: string) {
        const plugin = await this.findOne(pluginName);

        if (!plugin) {
            throw new HttpException('pluginName not found', HttpStatus.NOT_FOUND);
        }

        let defaultSettings;
        let settings;
        try {
            if (plugin.defaultSettings) defaultSettings = JSON.parse(plugin.defaultSettings);
        } catch (e) {
            getLogger(false).error(e);
        }
        try {
            if (plugin.settings) settings = JSON.parse(plugin.settings);
        } catch (e) {
            getLogger(false).error(e);
        }

        return Object.assign({}, defaultSettings, settings);
    }

    public async savePluginConfig(pluginName: string, input: any) {
        const plugin = await this.findOne(pluginName);

        if (!plugin) {
            throw new HttpException(`Plugin ${pluginName} was not found`, HttpStatus.NOT_FOUND);
        }

        plugin.settings = typeof input === 'string' ? input : JSON.stringify(input);
        await this.save(plugin);
        return true;
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
            logger.error('Failed to resolve plugin directory of: ' + pluginName + ". Probably plugin was used in module config by name but wasn't installed in node_modules");
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

                let meta: TScriptMetaInfo | undefined;
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

    async handlePluginUpdate(pluginName: string): Promise<boolean> {
        if (await this.getIsUpdating(pluginName)) return false;

        const transactionId = getRandStr(8);
        startTransaction(transactionId);
        await this.setIsUpdating(pluginName, true);

        let success = false;
        let error: any;
        try {
            success = await this.updatePlugin(pluginName)
        } catch (e) {
            error = e;
            success = false;
        }

        if (success) await this.cmsService.installModuleDependencies(pluginName);
        await this.setIsUpdating(pluginName, false);

        endTransaction(transactionId);

        if (!success) {
            logger.error('Failed to update plugin: ', error?.message, error);
            throw new HttpException(error?.message, error?.status);
        }
        return true;
    }

    async updatePlugin(pluginName: string): Promise<boolean> {
        const pluginPckgOld = await getModulePackage(pluginName);
        if (!pluginName || pluginName === '' || !pluginPckgOld?.version) throw new HttpException('Plugin package not found', HttpStatus.INTERNAL_SERVER_ERROR);
        const oldVersion = pluginPckgOld.version;

        const updateInfo = await this.checkPluginUpdate(pluginName)
        if (!updateInfo || !updateInfo.packageVersion) throw new HttpException('No update available', HttpStatus.METHOD_NOT_ALLOWED);
        if (updateInfo.onlyManualUpdate) throw new HttpException(`Update failed: Cannot launch automatic update. Please update using npm install command and restart CMS`, HttpStatus.FORBIDDEN);

        await runShellCommand(`npm install ${pluginName}@${updateInfo.packageVersion} -S --save-exact`, process.cwd());
        await sleep(1);

        const pluginPckgNew = await getModulePackage(pluginName);

        if (!pluginPckgNew?.version) throw new HttpException('Plugin package not found', HttpStatus.INTERNAL_SERVER_ERROR);
        if (!/^\d/.test(pluginPckgNew.version)) pluginPckgNew.version = pluginPckgNew.version.substr(1);
        if (pluginPckgNew.version !== updateInfo.packageVersion) {
            throw new HttpException('New version was not applied', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        for (const service of (updateInfo?.restartServices ?? [])) {
            // Restarts entire service by Manager service
            await restartService(service);
        }
        await sleep(1);

        if ((updateInfo?.restartServices ?? []).includes('api-server')) {
            // Restart API server by Proxy manager via "Safe reload" and rollback possibility:
            const resp1 = await childSendMessage('make-new');
            if (resp1.message !== 'success') {
                // Rollback
                await runShellCommand(`npm install ${pluginName}@${oldVersion} -S --save-exact`);
                await sleep(1);

                throw new HttpException('Could not start server with new plugin', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                const resp2 = await childSendMessage('apply-new', resp1.payload);

                if (resp2.message !== 'success') throw new HttpException('Could not apply new server with new plugin', HttpStatus.INTERNAL_SERVER_ERROR);

                setPendingKill(2000);
            }

        }

        await this.activatePlugin(pluginName);
        return true;
    }


    async handleInstallPlugin(pluginName: string): Promise<boolean> {
        if (await this.getIsUpdating(pluginName)) return false;

        const transactionId = getRandStr(8);
        startTransaction(transactionId);

        let success = false;
        let error: any;
        try {
            success = await this.installPlugin(pluginName)
        } catch (e) {
            error = e;
            success = false;
        }

        if (success) await this.cmsService.installModuleDependencies(pluginName);

        endTransaction(transactionId);

        if (!success) {
            logger.error('Failed to install plugin: ', error?.message, error);
            throw new HttpException(error?.message, error?.status);
        }
        return true;
    }

    async installPlugin(pluginName: string): Promise<boolean> {
        const info = await this.getPluginLatest(pluginName);
        if (!pluginName || pluginName === '' || !info || !info.packageVersion || !info.version) throw new HttpException('Plugin was not found', HttpStatus.METHOD_NOT_ALLOWED);

        const settings = await getCmsSettings();
        const isBeta = !!settings?.beta;
        const version = isBeta ? (info.betaVersion ?? info.version) : info.version;

        await runShellCommand(`npm install ${pluginName}@${version} -S --save-exact`);
        await sleep(1);

        const pluginPckgNew = await getModulePackage(pluginName);
        if (!pluginPckgNew?.version) throw new HttpException('Plugin package was not found', HttpStatus.INTERNAL_SERVER_ERROR);

        const pluginExports = (await readPluginsExports()).find(p => p.pluginName === pluginName);
        if (!pluginExports) throw new HttpException('Plugin in not a CMS module', HttpStatus.INTERNAL_SERVER_ERROR);

        if (pluginExports.backendPath && await fs.pathExists(pluginExports.backendPath)) {
            // If plugin has backend, we need to apply it by restarting API server
            // Using "Safe reload" will switch to a new server only if it successfully started:
            const resp1 = await childSendMessage('make-new');
            if (resp1.message !== 'success') {
                // Rollback
                await runShellCommand(`npm uninstall ${pluginName} -S`);
                await sleep(1);

                throw new HttpException('Could not start server with the new plugin', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                const resp2 = await childSendMessage('apply-new', resp1.payload);

                if (resp2.message !== 'success') throw new HttpException('Could not start server with the new plugin', HttpStatus.INTERNAL_SERVER_ERROR);

                setPendingKill(2000);
            }
        }

        await this.activatePlugin(pluginName);
        return true;
    }


    public async activatePlugin(pluginName: string): Promise<boolean> {
        const pluginPath = await getNodeModuleDir(pluginName);
        const pluginPckg = await getModulePackage(pluginName);

        if (!pluginPckg?.version || !pluginPath) throw new HttpException('Failed to find package.json of the plugin ' + pluginName, HttpStatus.INTERNAL_SERVER_ERROR);


        // @TODO Execute install script

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
                decache(filePath);
            } catch (error) { }
            try {
                pluginConfig = require(filePath);
            } catch (e) {
                logger.error(e);
            }
        }
        const defaultSettings = pluginConfig?.defaultSettings;

        // Copy static content into public 
        const pluginStaticDir = await getModuleStaticDir(pluginName)
        if (pluginStaticDir && await fs.pathExists(pluginStaticDir)) {
            try {
                const publicPluginsDir = getPublicPluginsDir();
                await fs.ensureDir(publicPluginsDir);
                await fs.copy(pluginStaticDir, resolve(publicPluginsDir, pluginName));
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

                await serverFireAction('update_plugin', { pluginName });
            }
        } catch (error) { }

        // Create new if not found
        if (!entity) {
            try {
                entity = await pluginRepo.createEntity(input);

                await serverFireAction('install_plugin', { pluginName });
            } catch (e) {
                logger.error(e);
            }
        }

        if (entity) {
            return true;
        }
        return false;
    }


    async handleDeletePlugin(pluginName: string): Promise<boolean> {
        if (await this.getIsUpdating(pluginName)) return false;

        const transactionId = getRandStr(8);
        startTransaction(transactionId);
        await this.setIsUpdating(pluginName, true);

        let success = false;
        let error: any;
        try {
            success = await this.deletePlugin(pluginName);
        } catch (e) {
            error = e;
            success = false;
        }
        await this.setIsUpdating(pluginName, false);
        endTransaction(transactionId);

        if (!success) {
            throw new HttpException(error?.message, error?.status);
        }
        return true;
    }

    private async deletePlugin(pluginName: string): Promise<boolean> {
        const pluginPckgOld = await getModulePackage(pluginName);
        const oldVersion = pluginPckgOld?.version;
        if (!pluginName || pluginName === '' || !oldVersion) throw new HttpException('Plugin package not found', HttpStatus.INTERNAL_SERVER_ERROR);

        const pluginExports = (await readPluginsExports()).find(p => p.pluginName === pluginName);
        if (!pluginExports) throw new HttpException('Plugin in not a CMS module', HttpStatus.INTERNAL_SERVER_ERROR);

        await runShellCommand(`npm uninstall ${pluginName} -S`);
        await sleep(1);

        const pluginPckgNew = await getModulePackage(pluginName);
        if (pluginPckgNew) throw new HttpException(`Failed to remove plugin's package`, HttpStatus.INTERNAL_SERVER_ERROR);

        if (pluginExports.backendPath) {
            setPendingRestart(1000);
        }

        const pluginRepo = getCustomRepository(GenericPlugin.repository);
        const entity = await this.findOne(pluginName);
        if (entity?.id) await pluginRepo.deleteEntity(entity.id);

        await serverFireAction('uninstall_plugin', { pluginName });

        return true;
    }

}
