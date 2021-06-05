import {
    getRandStr,
    getStoreItem,
    sleep,
    TCCSModuleShortInfo,
    TCCSVersion,
    TCmsSettings,
    TCromwellBlockData,
    TPackageCromwellConfig,
    TPageConfig,
    TPageInfo,
    TThemeConfig,
    TThemeEntity,
    TThemeEntityInput,
} from '@cromwell/core';
import {
    configFileName,
    getCmsEntity,
    getCmsModuleInfo,
    getCmsSettings,
    getLogger,
    getModulePackage,
    getNodeModuleDir,
    getPublicThemesDir,
    runShellCommand,
} from '@cromwell/core-backend';
import { getCentralServerClient } from '@cromwell/core-frontend';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import decache from 'decache';
import fs from 'fs-extra';
import { resolve } from 'path';
import { getCustomRepository, getConnection } from 'typeorm';

import { GenericTheme } from '../helpers/genericEntities';
import { childSendMessage } from '../helpers/serverManager';
import { endTransaction, restartService, setPendingKill, startTransaction } from '../helpers/stateManager';
import { cmsServiceInst } from './cms.service';
import { pluginServiceInst } from './plugin.service';

const logger = getLogger();

export let themeServiceInst: ThemeService;

@Injectable()
export class ThemeService {

    constructor() {
        themeServiceInst = this;
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
                        logger.error(`Server: ${entity.name} is still updating after minute of runnig a new server instance. Setting isUpdating to false`);
                        await this.setIsUpdating(entity.name, false);
                    }
                }, 60000);
            }
        }
    }

    async findOne(themeName: string): Promise<TThemeEntity | undefined> {
        const themeRepo = getCustomRepository(GenericTheme.repository);
        return themeRepo.findOne({
            where: {
                name: themeName
            }
        });
    }

    public async saveEntity(theme: TThemeEntity): Promise<TThemeEntity | undefined> {
        const themeRepo = getCustomRepository(GenericTheme.repository);
        return themeRepo.save(theme);
    }

    public async createEntity(theme: TThemeEntityInput): Promise<TThemeEntity | undefined> {
        const themeRepo = getCustomRepository(GenericTheme.repository);
        return themeRepo.createEntity(theme);
    }

    public getAll(): Promise<TThemeEntity[]> {
        const themeRepo = getCustomRepository(GenericTheme.repository);
        return themeRepo.find();
    }

    private async setIsUpdating(name: string, updating: boolean) {
        try {
            const repo = getCustomRepository(GenericTheme.repository);
            const entity = await this.findOne(name);
            if (entity) {
                entity.isUpdating = updating;
                await repo.save(entity);
            }
        } catch (error) {
            logger.error(error);
        }
    }

    private async getIsUpdating(name: string) {
        try {
            return (await this.findOne(name))?.isUpdating;
        } catch (error) {
            logger.error(error);
        }
        return false;
    }


    /**
    * Asynchronously saves user's theme config by theme name from cmsConfig
    * @param cmsConfig 
    * @param cb 
    */
    public async saveThemeUserConfig(themeConfig: TThemeConfig): Promise<boolean> {
        const cmsSettings = await getCmsSettings();
        if (cmsSettings?.themeName) {
            const theme = await this.findOne(cmsSettings.themeName)
            if (theme) {
                theme.settings = JSON.stringify(themeConfig, null, 4);
                await this.saveEntity(theme);
                return true;
            }
        }
        return false;
    }

    /**
    * Asynchronously saves user's theme config by theme name from cmsConfig
    * @param cmsConfig 
    * @param cb 
    */
    public async saveThemeOriginalConfig(themeConfig: TThemeConfig): Promise<boolean> {
        const cmsSettings = await getCmsSettings();
        if (cmsSettings?.themeName) {
            const theme = await this.findOne(cmsSettings.themeName)
            if (theme) {
                theme.defaultSettings = JSON.stringify(themeConfig, null, 4);
                await this.saveEntity(theme);
                return true;
            }
        }
        return false;
    }


    /**
     * Asynchronously reads modifications in theme's original config from /themes 
     * and user's config from /modifications.
     * @param cb callback with both configs.
     */
    public async readConfigs(): Promise<{
        themeConfig: TThemeConfig | null;
        userConfig: TThemeConfig | null;
        cmsSettings: TCmsSettings | undefined;
        themeInfo: TPackageCromwellConfig | null;
    }> {
        let themeConfig: TThemeConfig | null = null,
            userConfig: TThemeConfig | null = null,
            themeInfo: TPackageCromwellConfig | null = null;

        const cmsSettings = await getCmsSettings();
        if (cmsSettings?.themeName) {

            const theme = await this.findOne(cmsSettings.themeName);

            if (!theme) {
                logger.error(`Current theme ${cmsSettings?.themeName} was not registered in DB`);
            }

            try {
                if (theme?.defaultSettings) themeConfig = JSON.parse(theme.defaultSettings);
            } catch (e) {
                getLogger(false).error(e);
            }
            try {
                if (theme?.settings) userConfig = JSON.parse(theme.settings);
            } catch (e) {
                getLogger(false).error(e);
            }

            try {
                if (theme?.moduleInfo) themeInfo = JSON.parse(theme.moduleInfo);
            } catch (e) {
                getLogger(false).error(e);
            }
        }

        return {
            themeConfig,
            userConfig,
            cmsSettings,
            themeInfo
        }
    }


    /**
     * Will add and overwrite theme's original modificators by user's modificators
     * @param themeMods 
     * @param userMods 
     */
    public mergeMods(themeMods?: TCromwellBlockData[], userMods?: TCromwellBlockData[]): TCromwellBlockData[] {
        const mods: TCromwellBlockData[] = (themeMods && Array.isArray(themeMods)) ? themeMods : [];
        if (userMods && Array.isArray(userMods)) {
            userMods.forEach(userMod => {
                let hasOriginaly = false;
                mods.forEach((themeMod, i) => {
                    if (themeMod.id === userMod.id) {
                        mods[i] = userMod;
                        hasOriginaly = true;
                    }
                })
                if (!hasOriginaly) {
                    mods.push(userMod);
                }
            })
        }
        return mods;
    }

    /**
     * Merges page canfigs from theme's original and user's files. 
     * Adds optionaly globalMods to the output.
     * @param themeConfig 
     * @param userConfig 
     * @param globalThemeMods 
     * @param globalUserMods 
     */
    public mergePages(themeConfig?: TPageConfig, userConfig?: TPageConfig,
        globalThemeMods?: TCromwellBlockData[], globalUserMods?: TCromwellBlockData[]): TPageConfig {
        // Merge global mods
        const globalModificators = this.mergeMods(globalThemeMods, globalUserMods);

        let mods = this.mergeMods(themeConfig?.modifications, userConfig?.modifications);

        // Merge pages' mods with global mods
        mods = this.mergeMods(globalModificators, mods);

        const config = Object.assign({}, themeConfig, userConfig);
        config.modifications = mods;
        return config;
    }

    public getPageConfigFromThemeConfig(themeConfig: TThemeConfig | undefined | null, pageRoute: string, pageId?: string): TPageConfig | undefined {
        if (themeConfig?.pages && Array.isArray(themeConfig.pages)) {
            for (const p of themeConfig.pages) {
                if (p.id === pageId) return p;
                if (p.route === pageRoute) return p;
            }
        }
    }

    /**
     * Read asynchronously configs for specified Page by pageRoute arg and merge them into one.
     * Output contains theme's original modificators overwritten and supplemented by user's modificators.
     * @param pageRoute original route of the page in theme dir
     * @param cb callback to return modifications
     */
    public async getPageConfig(pageRoute: string): Promise<TPageConfig> {
        const { themeConfig, userConfig } = await this.readConfigs();
        // Read user's page config 
        const userPageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(userConfig, pageRoute);

        // User could possibly modify page's slug (pageRoute), so we'll use ID from user config
        // (if it's set) to locate original page config
        const themePageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(themeConfig, pageRoute, userPageConfig?.id);

        // let themeMods: TCromwellBlockData[] | undefined = undefined, userMods: TCromwellBlockData[] | undefined = undefined;

        // Merge users's with theme's mods
        const pageConfig = this.mergePages(themePageConfig, userPageConfig, themeConfig?.globalModifications, userConfig?.globalModifications);

        return pageConfig;
    }

    /**
     * Saves userPageConfig into user's theme config. TPageInfo is just overwrited,
     * but modifications (TCromwellBlockData) are applied by an algorithm. New mods
     * overwrite current ones in user's config by blockId and are being added if user
     * config has no same blockId. If user has deleted some block, then should send a mod
     * with "isDeleted": true flag. If this mod is virtual and contains only in user's
     * config, then mod will be deleted. If mod contains in original config, then it will
     * be saved in user's config with this flag 
     * 
     * Modificators on userPageConfig (TCromwellBlockData) must contain only newly added 
     * mods or an empty array. It is not allowed to send all mods from "/theme/page" route 
     * because they contain merged mods from theme's config and we don't need to copy them 
     * into user's config that way. User's config should contain only user's uniques 
     * mods, so theme's original config can be updated by theme's authors in the future.
     * 
     * @param userConfig Page config with modifications to APPLY.
     */
    public async saveUserPageConfig(userPageConfig: TPageConfig): Promise<boolean> {
        if (!userPageConfig) {
            logger.error('Server::saveUserPageConfig: Invalid userPageConfig')
            return false;
        }
        if (!userPageConfig.route || userPageConfig.route === '') {
            logger.error('Server::saveUserPageConfig: Invalid userPageConfig, no route', JSON.stringify(userPageConfig));
            throw new HttpException("Invalid page config, no route", HttpStatus.NOT_ACCEPTABLE);
        }
        if (!userPageConfig.name || userPageConfig.name === '') {
            logger.error('Server::saveUserPageConfig: Invalid userPageConfig, no name', JSON.stringify(userPageConfig));
            throw new HttpException("Invalid page config, no name", HttpStatus.NOT_ACCEPTABLE);
        }
        if (!userPageConfig.modifications) {
            logger.error('Server::saveUserPageConfig: Invalid userPageConfig, no modifications', JSON.stringify(userPageConfig));
            return false;
        }

        const config = await this.readConfigs();
        let userConfig = config.userConfig;
        const cmsSettings = config.cmsSettings;

        // If userConfig is null, then theme is probably new and user has never saved mods. Create a new userConfig
        if (!userConfig) {
            userConfig = {
                pages: []
            }
        }
        if (!userConfig.pages) userConfig.pages = [];


        const oldUserPageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(userConfig, userPageConfig.route, userPageConfig.id);

        // Remove global mods that were changed to local
        for (const mod of userPageConfig.modifications) {
            if (!mod.global && userConfig.globalModifications) {
                for (const globalMod of userConfig.globalModifications) {
                    if (mod.id === globalMod.id) {
                        userConfig.globalModifications = userConfig.globalModifications?.filter(fmod => fmod.id !== mod.id);
                    }
                }
            }
        }

        // Merge global mods
        const globalMods: TCromwellBlockData[] = [];
        userPageConfig.modifications = userPageConfig.modifications.filter(mod => {
            if (mod.global) {
                globalMods.push(mod);
                return false;
            }
            return true;
        });
        userConfig.globalModifications = this.mergeMods(userConfig?.globalModifications, globalMods);

        // Remove recently deleted user's blocks from oldUserPageConfig if they aren't in theme's;
        const filteredUserPageConfig: TPageConfig = {
            ...userPageConfig,
            modifications: [...userPageConfig.modifications]
        };
        userPageConfig.modifications.forEach(mod => {
            if (mod.isDeleted) {
                let hasUserSameMod = false;

                oldUserPageConfig?.modifications.forEach(userMod => {
                    if (userMod.id === mod.id) hasUserSameMod = true;
                });
                // If hasUserSameMod === false, then mod exists only in theme's config
                if (!hasUserSameMod) {
                    // Just remove from user's config
                    if (oldUserPageConfig && oldUserPageConfig.modifications) {
                        oldUserPageConfig.modifications = oldUserPageConfig.modifications.filter(
                            userMode => userMode.id !== mod.id
                        )
                    }
                    filteredUserPageConfig.modifications = filteredUserPageConfig.modifications.filter(
                        userMode => userMode.id !== mod.id
                    )
                } else {
                    // compress info to leave only flag and id
                    filteredUserPageConfig.modifications = filteredUserPageConfig.modifications.map(userMode =>
                        userMode.id === mod.id ? {
                            id: mod.id,
                            isDeleted: true,
                            type: mod.type
                        } : userMode
                    )
                }
            }
        })

        // Merge the rest
        const pageConfig = this.mergePages(oldUserPageConfig, filteredUserPageConfig);

        let pageIndex: number | undefined;
        userConfig.pages.forEach((page, i) => {
            if (pageIndex !== undefined) return;
            if (page.id === pageConfig.id) pageIndex = i;
            if (page.route === pageConfig.route) pageIndex = i;
        });

        if (pageIndex !== undefined) {
            userConfig.pages[pageIndex] = pageConfig;
        } else {
            userConfig.pages.push(pageConfig);
        }

        // Save config
        if (cmsSettings) {
            return this.saveThemeUserConfig(userConfig);
        }

        return false;

    }

    /**
     * Asynchronously reads theme's and user's configs and merge all pages info with modifications 
     * @param cb cb to return pages info
     */
    public async readAllPageConfigs(): Promise<TPageConfig[]> {
        logger.log('themeController::readAllPageConfigs');

        const { themeConfig, userConfig } = await this.readConfigs();

        let pages: TPageConfig[] = [];
        if (themeConfig?.pages && Array.isArray(themeConfig.pages)) {
            pages = themeConfig.pages.filter(p => p.id);
        }
        const pageIds: string[] = [];
        pages.forEach(p => pageIds.push(p.id));

        if (userConfig && userConfig.pages && Array.isArray(userConfig.pages)) {
            userConfig.pages.forEach(p => {
                if (p.id) {
                    if (pageIds.includes(p.id)) {
                        const i = pageIds.indexOf(p.id);
                        pages[i] = this.mergePages(pages[i], p);
                    }
                    else {
                        pages.push(p);
                    }
                }
            })
        }
        // Merge global mods
        const globalModificators = this.mergeMods(themeConfig?.globalModifications, userConfig?.globalModifications);
        // Merge pages' mods with global mods
        pages.forEach(p => p.modifications = this.mergeMods(globalModificators, p.modifications));

        return pages;
    }

    public async getPagesInfo(): Promise<TPageInfo[]> {
        const out: TPageInfo[] = [];

        const pages = await this.readAllPageConfigs();

        pages.forEach(p => {
            const info: TPageInfo = {
                id: p.id,
                route: p.route,
                name: p.name,
                title: p.title,
                isDynamic: p.isDynamic,
                isVirtual: p.isVirtual,
            }
            out.push(info);
        });

        return out;
    }

    public async deletePage(pageRoute: string): Promise<boolean> {
        let page: TPageConfig | null = null;
        page = await this.getPageConfig(pageRoute);

        if (!page)
            throw new HttpException("Page was not found by pageRoute", HttpStatus.NOT_ACCEPTABLE);

        if (!page.isVirtual)
            throw new HttpException("Page cannot be deleted", HttpStatus.NOT_ACCEPTABLE);

        const configs = await this.readConfigs();

        if (configs.themeConfig?.pages) {
            configs.themeConfig.pages = configs.themeConfig.pages.filter(p => !p.isVirtual && !(p.route === page?.route && p.id === page?.id))
            await this.saveThemeOriginalConfig(configs.themeConfig);
        }

        if (configs.userConfig?.pages) {
            configs.userConfig.pages = configs.userConfig.pages.filter(p => !(p.route === page?.route && p.id === page?.id))
            await this.saveThemeUserConfig(configs.userConfig);
        }
        return true;
    }

    public async resetPage(pageRoute: string): Promise<boolean> {
        let page: TPageConfig | null = null;
        page = await this.getPageConfig(pageRoute);

        if (!page)
            throw new HttpException("Page was not found by pageRoute", HttpStatus.NOT_ACCEPTABLE);

        const configs = await this.readConfigs();

        if (configs.userConfig?.pages) {
            configs.userConfig.pages = configs.userConfig.pages.map(userPage => {
                if (page && userPage.route === page.route && userPage.id === page.id) {
                    userPage.modifications = [];
                }
                return userPage;
            })
            await this.saveThemeUserConfig(configs.userConfig);
        }

        return true;
    }

    public async getPluginsAtPage(pageRoute: string): Promise<Record<string, any>> {
        const out: Record<string, any> = {};

        const pageConfig = await this.getPageConfig(pageRoute);

        if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
            for (const mod of pageConfig.modifications) {
                const pluginName = mod?.plugin?.pluginName;
                if (pluginName) {
                    const pluginEntity = await pluginServiceInst.findOne(pluginName);
                    try {
                        const pluginConfig = Object.assign({}, mod?.plugin?.settings,
                            JSON.parse(pluginEntity?.settings ?? '{}'));
                        out[pluginName] = pluginConfig;
                    } catch (e) {
                        logger.error('Failed to parse plugin settings of ' + pluginName + e)
                    }
                }
            }
        }
        return out;
    }

    public async setActive(themeName: string): Promise<boolean> {
        const cms = await getCmsEntity();
        if (!cms) throw new HttpException('!cms entity', HttpStatus.INTERNAL_SERVER_ERROR);

        cms.themeName = themeName;
        await cms.save();
        await restartService('renderer');

        const cmsSettings = getStoreItem('cmsSettings');
        const timeout = (cmsSettings?.watchPoll ?? 2000) + 1000;
        await new Promise(done => setTimeout(done, timeout));
        return true;
    }


    public async activateTheme(themeName: string): Promise<boolean> {
        const themePath = await getNodeModuleDir(themeName);
        const themePckg = await getModulePackage(themeName);

        if (!themePckg?.version || !themePath) throw new HttpException('Failed to find package.json of the theme ' + themeName, HttpStatus.INTERNAL_SERVER_ERROR);


        // @TODO Execute install script


        // Read module info from package.json
        const moduleInfo = await getCmsModuleInfo(themeName);
        delete moduleInfo?.frontendDependencies;
        delete moduleInfo?.bundledDependencies;
        delete moduleInfo?.firstLoadedDependencies;

        // Read theme config
        let themeConfig;
        const filePath = resolve(themePath, configFileName);
        if (await fs.pathExists(filePath)) {
            try {
                decache(filePath);
            } catch (error) { }
            try {
                themeConfig = require(filePath);
            } catch (e) {
                logger.error(e);
            }
        }

        // Copy static content into public 
        const themePublicDir = resolve(themePath, 'static');
        if (await fs.pathExists(themePublicDir)) {
            try {
                const publicThemesDir = getPublicThemesDir();
                await fs.ensureDir(publicThemesDir);
                await fs.copy(themePublicDir, resolve(publicThemesDir, themeName));
            } catch (e) { logger.log(e) }
        }

        // Create DB entity
        const input: TThemeEntityInput = {
            name: themeName,
            slug: themeName,
            isInstalled: true,
            title: moduleInfo?.title,
            pageTitle: moduleInfo?.title
        };
        if (themeConfig) {
            try {
                input.defaultSettings = JSON.stringify(themeConfig);
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

        const themeRepo = getCustomRepository(GenericTheme.repository);
        let entity;

        // Update entity if already in DB
        try {
            entity = await themeRepo.getBySlug(themeName);
            if (entity) {
                entity = Object.assign({}, entity, input);
                await themeRepo.save(entity);
            }
        } catch (error) { }

        // Create new if not found
        if (!entity) {
            try {
                entity = await themeRepo.createEntity(input);
            } catch (e) {
                logger.error(e);
            }
        }

        if (entity) {
            return true;
        }
        return false;
    }

    async checkThemeUpdate(name: string): Promise<TCCSVersion | undefined> {
        const settings = await getCmsSettings();
        const isBeta = !!settings?.beta;
        const pckg = await getModulePackage(name);
        try {
            return await getCentralServerClient().checkThemeUpdate(
                name, pckg?.version ?? '0', isBeta);
        } catch (error) { }
    }

    async getThemeLatest(name: string): Promise<TCCSModuleShortInfo | undefined> {
        try {
            return await getCentralServerClient().getThemeInfo(name);
        } catch (error) { }
    }


    async handleThemeUpdate(themeName: string): Promise<boolean> {
        if (await this.getIsUpdating(themeName)) return false;

        const transactionId = getRandStr(8);
        startTransaction(transactionId);
        await this.setIsUpdating(themeName, true);

        let success = false;
        let error: any;
        try {
            success = await this.updateTheme(themeName)
        } catch (e) {
            error = e;
            success = false;
        }

        if (success) await cmsServiceInst.installModuleDependencies(themeName);
        await this.setIsUpdating(themeName, false);

        endTransaction(transactionId);

        if (!success) {
            throw new HttpException(error?.message, error?.status);
        }
        return true;
    }

    async updateTheme(themeName: string): Promise<boolean> {
        const pckgOld = await getModulePackage(themeName);
        if (!themeName || themeName === '' || !pckgOld?.version) throw new HttpException('Theme package not found', HttpStatus.INTERNAL_SERVER_ERROR);
        const oldVersion = pckgOld.version;

        const updateInfo = await this.checkThemeUpdate(themeName)
        if (!updateInfo || !updateInfo.packageVersion) throw new HttpException('No update available', HttpStatus.METHOD_NOT_ALLOWED);
        if (updateInfo.onlyManualUpdate) throw new HttpException(`Update failed: Cannot launch automatic update. Please update using npm install command and restart CMS`, HttpStatus.FORBIDDEN);

        await runShellCommand(`npm install ${themeName}@${updateInfo.packageVersion} -S --save-exact`, process.cwd());
        await sleep(1);

        const pckgNew = await getModulePackage(themeName);

        if (!pckgNew?.version) throw new HttpException('Theme package not found', HttpStatus.INTERNAL_SERVER_ERROR);
        if (!/^\d/.test(pckgNew.version)) pckgNew.version = pckgNew.version.substr(1);
        if (pckgNew.version !== updateInfo.packageVersion) {
            throw new HttpException('New version was not applied', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!updateInfo.restartServices) updateInfo.restartServices = [];
        const settings = await getCmsSettings();
        if (settings?.themeName === themeName)
            updateInfo.restartServices.push('renderer');

        for (const service of updateInfo.restartServices) {
            // Restarts entire service by Manager service
            await restartService(service);
        }
        await sleep(1);

        if ((updateInfo?.restartServices ?? []).includes('api-server')) {
            // Restart API server by Proxy manager via "Safe reload" and rollback possibility:
            const resp1 = await childSendMessage('make-new');
            if (resp1.message !== 'success') {
                // Rollback
                await runShellCommand(`npm install ${themeName}@${oldVersion} -S --save-exact`);
                await sleep(1);

                throw new HttpException('Could not start server with new theme', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                const resp2 = await childSendMessage('apply-new', resp1.payload);

                if (resp2.message !== 'success') throw new HttpException('Could not apply new server with new plugin', HttpStatus.INTERNAL_SERVER_ERROR);

                setPendingKill(2000);
            }

        }

        await this.activateTheme(themeName);
        return true;
    }


    async handleInstallTheme(themeName: string): Promise<boolean> {
        const transactionId = getRandStr(8);
        startTransaction(transactionId);

        let success = false;
        let error: any;
        try {
            success = await this.installTheme(themeName)
        } catch (e) {
            error = e;
            success = false;
        }

        if (success) await cmsServiceInst.installModuleDependencies(themeName);

        endTransaction(transactionId);

        if (!success) {
            throw new HttpException(error?.message, error?.status);
        }
        return true;
    }

    async installTheme(themeName: string): Promise<boolean> {
        const info = await this.getThemeLatest(themeName)
        if (!themeName || themeName === '' || !info || !info.packageVersion || !info.version) throw new HttpException('Theme was not found', HttpStatus.METHOD_NOT_ALLOWED);

        const settings = await getCmsSettings();
        const isBeta = !!settings?.beta;
        const version = isBeta ? (info.betaVersion ?? info.version) : info.version;

        await runShellCommand(`npm install ${themeName}@${version} -S --save-exact`);
        await sleep(1);

        const pckgNew = await getModulePackage(themeName);
        if (!pckgNew?.version) throw new HttpException('Theme package was not found', HttpStatus.INTERNAL_SERVER_ERROR);

        await this.activateTheme(themeName);
        return true;
    }



    async handleDeleteTheme(name: string): Promise<boolean> {
        if (await this.getIsUpdating(name)) return false;

        await this.setIsUpdating(name, true);
        const transactionId = getRandStr(8);
        startTransaction(transactionId);

        let success = false;
        let error: any;
        try {
            success = await this.deleteTheme(name)
        } catch (e) {
            error = e;
            success = false;
        }
        await this.setIsUpdating(name, false);
        endTransaction(transactionId);

        if (!success) {
            throw new HttpException(error?.message, error?.status);
        }
        return true;
    }

    private async deleteTheme(themeName: string): Promise<boolean> {
        const pckgOld = await getModulePackage(themeName);
        const oldVersion = pckgOld?.version;
        if (!themeName || themeName === '' || !oldVersion) throw new HttpException('Plugin package not found', HttpStatus.INTERNAL_SERVER_ERROR);

        await runShellCommand(`npm uninstall ${themeName} -S`);
        await sleep(1);

        const pckgNew = await getModulePackage(themeName);
        if (pckgNew) throw new HttpException(`Failed to remove theme's package`, HttpStatus.INTERNAL_SERVER_ERROR);

        const themeRepo = getCustomRepository(GenericTheme.repository);
        const entity = await this.findOne(themeName);
        if (entity?.id) await themeRepo.deleteEntity(entity.id);

        return true;
    }
}
