import {
    logLevelMoreThan,
    TCmsEntity,
    TCromwellBlockData,
    TPageConfig,
    TThemeConfig,
    TThemeEntity,
    TThemeEntityInput,
} from '@cromwell/core';
import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';

import { GenericTheme } from '../helpers/genericEntities';
import { CmsService } from './cms.service';

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
        const cmsConfig = await this.cmsService.getConfig();
        if (cmsConfig?.themeName) {
            let theme = await this.findOne(cmsConfig.themeName)
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
        cmsConfig: TCmsEntity | undefined;
    }> {
        let themeConfig: TThemeConfig | null = null,
            userConfig: TThemeConfig | null = null;

        const cmsConfig = await this.cmsService.getConfig();
        if (cmsConfig?.themeName) {

            const theme = await this.findOne(cmsConfig.themeName)

            try {
                if (theme?.defaultSettings) themeConfig = JSON.parse(theme.defaultSettings);
            } catch (e) {
                if (logLevelMoreThan('detailed')) console.error(e)
            }
            try {
                if (theme?.settings) userConfig = JSON.parse(theme.settings);
            } catch (e) {
                if (logLevelMoreThan('detailed')) console.error(e)
            }
        }

        return {
            themeConfig,
            userConfig,
            cmsConfig
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
                    if (themeMod.componentId === userMod.componentId) {
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
        return config
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
     * config has no same blockId. If user has deleted some block, then should send mod
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

        let { themeConfig, userConfig, cmsConfig } = await this.readConfigs();

        // If userConfig is null, then theme is probably new and user has never saved mods. Create a new userConfig
        if (!userConfig) {
            userConfig = {
                name: themeConfig?.main.themeName ?? '',
                type: 'theme',
                main: { themeName: themeConfig?.main.themeName ?? '' },
                pages: []
            }
        }

        const oldUserPageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(userPageConfig.route, userConfig);
        const oldOriginalPageConfig: TPageConfig | undefined = this.getPageConfigFromThemeConfig(userPageConfig.route, themeConfig);

        // Remove recently deleted user's blocks from oldUserPageConfig if they aren't in theme's;
        let filteredUserPageConfig: TPageConfig = {
            ...userPageConfig,
            modifications: [...userPageConfig.modifications]
        };
        userPageConfig.modifications.forEach(mod => {
            if (mod.isDeleted) {
                let hasUserSameMod = false;

                oldUserPageConfig?.modifications.forEach(userMod => {
                    if (userMod.componentId === mod.componentId) hasUserSameMod = true;
                });
                // If hasUserSameMod === false, then mod exists only in theme's config
                if (!hasUserSameMod) {
                    // Just remove from user's config
                    if (oldUserPageConfig && oldUserPageConfig.modifications) {
                        oldUserPageConfig.modifications = oldUserPageConfig.modifications.filter(
                            userMode => userMode.componentId !== mod.componentId
                        )
                    }
                    filteredUserPageConfig.modifications = filteredUserPageConfig.modifications.filter(
                        userMode => userMode.componentId !== mod.componentId
                    )
                } else {
                    // optimize space for mode to leave only flag and id
                    filteredUserPageConfig.modifications = filteredUserPageConfig.modifications.map(userMode =>
                        userMode.componentId === mod.componentId ? {
                            componentId: mod.componentId,
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
        if (cmsConfig) {
            return this.saveThemeUserConfig(userConfig);
        }

        return false;

    }

    /**
     * Asynchronously reads theme's and user's configs and merge all pages info with modifications 
     * @param cb cb to return pages info
     */
    public async readAllPageConfigs(): Promise<TPageConfig[]> {
        if (logLevelMoreThan('detailed')) console.log('themeController::readAllPageConfigs');

        const { themeConfig, userConfig, cmsConfig } = await this.readConfigs();

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

}