import {
    logFor,
    TCmsSettings,
    TCromwellBlockData,
    TPackageCromwellConfig,
    TPageConfig,
    TThemeConfig,
    TThemeEntity,
    TThemeEntityInput,
} from '@cromwell/core';
import { configFileName, getNodeModuleDir, getPublicThemesDir, serverLogFor, getCmsModuleInfo, getLogger } from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import decache from 'decache';
import fs from 'fs-extra';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';
import { getCustomRepository } from 'typeorm';

import { GenericTheme } from '../helpers/genericEntities';
import { CmsService } from './cms.service';

const logger = getLogger('detailed');

@Injectable()
export class ThemeService {

    constructor(
        private readonly cmsService: CmsService,
    ) { }

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


    /**
    * Asynchronously saves user's theme config by theme name from cmsConfig
    * @param cmsConfig 
    * @param cb 
    */
    public async saveThemeUserConfig(themeConfig: TThemeConfig): Promise<boolean> {
        const cmsSettings = await this.cmsService.getSettings();
        if (cmsSettings?.themeName) {
            let theme = await this.findOne(cmsSettings.themeName)
            if (theme) {
                theme.settings = JSON.stringify(themeConfig, null, 4);
                this.saveEntity(theme);
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

        const cmsSettings = await this.cmsService.getSettings();
        if (cmsSettings?.themeName) {

            const theme = await this.findOne(cmsSettings.themeName);

            if (!theme) {
                serverLogFor('errors-only', `Current theme ${cmsSettings?.themeName} was not registered in DB`, 'Error');
            }

            try {
                if (theme?.defaultSettings) themeConfig = JSON.parse(theme.defaultSettings);
            } catch (e) {
                logger.log(e, console.error);
            }
            try {
                if (theme?.settings) userConfig = JSON.parse(theme.settings);
            } catch (e) {
                logger.log(e, console.error);
            }

            try {
                if (theme?.moduleInfo) themeInfo = JSON.parse(theme.moduleInfo);
            } catch (e) {
                logger.log(e, console.error);
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

    public getPageConfigFromThemeConfig(pageRoute: string, themeConfig: TThemeConfig | undefined | null): TPageConfig | undefined {
        if (themeConfig && themeConfig.pages && Array.isArray(themeConfig.pages)) {
            for (const p of themeConfig.pages) {
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

        // let themeMods: TCromwellBlockData[] | undefined = undefined, userMods: TCromwellBlockData[] | undefined = undefined;
        // Read theme's original modificators 
        const themePageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(pageRoute, themeConfig);
        // Read user's custom modificators 
        const userPageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(pageRoute, userConfig);
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
            console.error('Server::saveUserPageConfig: Invalid userPageConfig')
            return false;
        }
        if (!userPageConfig.route) {
            console.error('Server::saveUserPageConfig: Invalid userPageConfig, no route', JSON.stringify(userPageConfig));
            return false;
        }
        if (!userPageConfig.modifications) {
            console.error('Server::saveUserPageConfig: Invalid userPageConfig, no modifications', JSON.stringify(userPageConfig));
            return false;
        }

        let { themeConfig, userConfig, cmsSettings } = await this.readConfigs();

        // If userConfig is null, then theme is probably new and user has never saved mods. Create a new userConfig
        if (!userConfig) {
            userConfig = {
                pages: []
            }
        }
        if (!userConfig?.pages) userConfig.pages = [];


        const oldUserPageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(userPageConfig.route, userConfig);
        const oldOriginalPageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(userPageConfig.route, themeConfig);

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
        let filteredUserPageConfig: TPageConfig = {
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

        const { themeConfig, userConfig, cmsSettings } = await this.readConfigs();

        let pages: TPageConfig[] = [];
        if (themeConfig && themeConfig.pages && Array.isArray(themeConfig.pages)) {
            pages = themeConfig.pages;
        }
        const pageRoutes: string[] = [];
        pages.forEach(p => pageRoutes.push(p.route));

        if (userConfig && userConfig.pages && Array.isArray(userConfig.pages)) {
            userConfig.pages.forEach(p => {
                if (pageRoutes.includes(p.route)) {
                    const i = pageRoutes.indexOf(p.route);
                    pages[i] = this.mergePages(pages[i], p);
                }
                else {
                    pages.push(p);
                }
            })
        }
        // Merge global mods
        const globalModificators = this.mergeMods(themeConfig?.globalModifications, userConfig?.globalModifications);
        // Merge pages' mods with global mods
        pages.forEach(p => p.modifications = this.mergeMods(globalModificators, p.modifications));

        return pages;
    }


    public async installTheme(themeName: string): Promise<boolean> {
        const themePath = await getNodeModuleDir(themeName);
        if (themePath) {

            // @TODO Execute install script



            // Read theme config
            let themeConfig;
            const filePath = resolve(themePath, configFileName);
            if (await fs.pathExists(filePath)) {
                try {
                    // decache(filePath);
                    themeConfig = require(filePath);
                } catch (e) {
                    console.error(e);
                }
            }

            // Read module info from package.json
            const moduleInfo = getCmsModuleInfo(themeName);
            delete moduleInfo?.frontendDependencies;
            delete moduleInfo?.bundledDependencies;

            // Make symlink for public static content
            const themePublicDir = resolve(themePath, 'static');
            if (await fs.pathExists(themePublicDir)) {
                try {
                    const publicThemesDir = getPublicThemesDir();
                    await fs.ensureDir(publicThemesDir);
                    await symlinkDir(themePublicDir, resolve(publicThemesDir, themeName))
                } catch (e) { console.log(e) }
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


            try {
                const entity = await this.createEntity(input)
                if (entity) {
                    return true;
                }
            } catch (e) {
                console.error(e)
            }
        }

        return false;
    }
}