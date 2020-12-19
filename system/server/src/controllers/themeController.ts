import {
    logLevelMoreThan,
    TCmsConfig,
    TCromwellBlockData,
    TFrontendBundle,
    TPageConfig,
    TPageInfo,
    TThemeConfig,
    TThemeEntityInput,
    TThemeMainConfig,
} from '@cromwell/core';
import { buildDirName, getThemeDir, readCMSConfig } from '@cromwell/core-backend';
import decache from 'decache';
import { Router } from 'express';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';
import { getCustomRepository } from 'typeorm';

import { projectRootDir } from '../constants';
import { GenericTheme } from '../helpers/genericEntities';
import { getPluginEntity } from './pluginsController';

export const getThemeController = (): Router => {
    const themeController = Router();

    const settingsPath = resolve(projectRootDir, 'settings');


    // < HELPERS >

    /**
     * Asynchronously saves user's theme config by theme name from cmsConfig
     * @param cmsConfig 
     * @param cb 
     */
    const saveThemeUserConfig = async (themeConfig: TThemeConfig, cmsConfig: TCmsConfig): Promise<boolean> => {
        if (cmsConfig?.themeName) {
            const themeRepo = getCustomRepository(GenericTheme.repository);
            let theme = await themeRepo.findOne({
                where: {
                    name: cmsConfig?.themeName
                }
            });
            if (theme) {
                theme.settings = JSON.stringify(themeConfig, null, 4);
                await themeRepo.save(theme);
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
    const readConfigs = async (): Promise<{
        themeConfig: TThemeConfig | null;
        userConfig: TThemeConfig | null;
        cmsConfig?: TCmsConfig;
    }> => {
        let themeConfig: TThemeConfig | null = null,
            userConfig: TThemeConfig | null = null;

        // Read CMS config, because theme can be changed
        const cmsConfig = await readCMSConfig(projectRootDir);
        if (cmsConfig?.themeName) {

            const themeRepo = getCustomRepository(GenericTheme.repository);
            const theme = await themeRepo.findOne({
                where: {
                    name: cmsConfig?.themeName
                }
            });

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
    const mergeMods = (themeMods?: TCromwellBlockData[], userMods?: TCromwellBlockData[]): TCromwellBlockData[] => {
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
    const mergePages = (themeConfig?: TPageConfig, userConfig?: TPageConfig,
        globalThemeMods?: TCromwellBlockData[], globalUserMods?: TCromwellBlockData[]): TPageConfig => {
        // Merge global mods
        const globalModificators = mergeMods(globalThemeMods, globalUserMods);

        let mods = mergeMods(themeConfig?.modifications, userConfig?.modifications);

        // Merge pages' mods with global mods
        mods = mergeMods(globalModificators, mods);

        const config = Object.assign({}, themeConfig, userConfig);
        config.modifications = mods;
        return config
    }

    const getPageConfigFromThemeConfig = (pageRoute: string, themeConfig: TThemeConfig | undefined | null): TPageConfig | undefined => {
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
    const getPageConfig = async (pageRoute: string): Promise<TPageConfig> => {
        const { themeConfig, userConfig } = await readConfigs();

        // let themeMods: TCromwellBlockData[] | undefined = undefined, userMods: TCromwellBlockData[] | undefined = undefined;
        // Read theme's original modificators 
        const themePageConfig: TPageConfig | undefined = getPageConfigFromThemeConfig(pageRoute, themeConfig);
        // Read user's custom modificators 
        const userPageConfig: TPageConfig | undefined = getPageConfigFromThemeConfig(pageRoute, userConfig);
        // Merge users's with theme's mods
        const pageConfig = mergePages(themePageConfig, userPageConfig, themeConfig?.globalModifications, userConfig?.globalModifications);

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
    const saveUserPageConfig = async (userPageConfig: TPageConfig): Promise<boolean> => {
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

        let { themeConfig, userConfig, cmsConfig } = await readConfigs();

        // If userConfig is null, then theme is probably new and user has never saved mods. Create a new userConfig
        if (!userConfig) {
            userConfig = {
                name: themeConfig?.main.themeName ?? '',
                type: 'theme',
                main: { themeName: themeConfig?.main.themeName ?? '' },
                pages: []
            }
        }

        const oldUserPageConfig: TPageConfig | undefined = getPageConfigFromThemeConfig(userPageConfig.route, userConfig);
        const oldOriginalPageConfig: TPageConfig | undefined = getPageConfigFromThemeConfig(userPageConfig.route, themeConfig);

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
        const pageConfig = mergePages(oldUserPageConfig, filteredUserPageConfig);

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
            return saveThemeUserConfig(userConfig, cmsConfig);
        }

        return false;

    }

    /**
     * Asynchronously reads theme's and user's configs and merge all pages info with modifications 
     * @param cb cb to return pages info
     */
    const readAllPageConfigs = async (): Promise<TPageConfig[]> => {
        if (logLevelMoreThan('detailed')) console.log('themeController::readAllPageConfigs');

        const { themeConfig, userConfig, cmsConfig } = await readConfigs();

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
                    pages[i] = mergePages(pages[i], p);
                }
                else {
                    pages.push(p);
                }
            })
        }
        // Merge global mods
        const globalModificators = mergeMods(themeConfig?.globalModifications, userConfig?.globalModifications);
        // Merge pages' mods with global mods
        pages.forEach(p => p.modifications = mergeMods(globalModificators, p.modifications));

        return pages;
    }


    // < HELPERS />

    // < API Methods />


    /**
     * @swagger
     * 
     * /theme/page:
     *   get:
     *     description: Returns merged page config for specified Page by pageRoute in query param. Output contains theme's original modificators overwritten by user's modificators.
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: pageRoute
     *         description: page route from theme's config
     *         in: query
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: page config
     */
    themeController.get(`/page`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('themeController::/page');
        let out: TPageConfig | null = null;
        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            out = await getPageConfig(pageRoute)
        }
        res.send(out);
    });

    /**
     * @swagger
     * 
     * /theme/page:
     *   post:
     *     description: Saves page config for specified Page by pageRoute in query param. Modificators (TCromwellBlockData) must contain only newly added mods or an empty array. It is not allowed to send all mods from /theme/page route because they contain mods from theme's config and we don't need to copy them into user's config that way.
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: TPageConfig
     *         description: PageConfig to save in userThemeConfig
     *         in: body
     *         required: true
     *         type: object
     *     responses:
     *       200:
     *         description: success
     */
    themeController.post(`/page`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('themeController::post /page');
        let input: TPageConfig | null = req.body;
        if (input && typeof input === 'object') {
            const success = await saveUserPageConfig(input);
            res.send(success);
        } else {
            res.send(false);
        }
    })

    /**
     * @swagger
     * 
     * /theme/plugins:
     *   get:
     *     description: Returns plugins' configs at specified Page by pageRoute in query param. Output contains theme's original modificators overwritten by user's modificators.
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: pageRoute
     *         description: page route from theme's config
     *         in: query
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: plugins' configs
     */
    themeController.get(`/plugins`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('themeController::/plugins');
        const out: Record<string, any> = {};

        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            const pageConfig = await getPageConfig(pageRoute);

            if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
                for (const mod of pageConfig.modifications) {
                    const pluginName = mod?.plugin?.pluginName;
                    if (pluginName) {
                        const pluginEntity = await getPluginEntity(pluginName);
                        const pluginConfig = Object.assign({}, mod?.plugin?.settings, pluginEntity?.settings);
                        out[pluginName] = pluginConfig;
                    }
                };
            }
        }
        res.send(out);
    })

    /**
     * @swagger
     * 
     * /theme/plugin-names:
     *   get:
     *     description: Returns array of plugin names at all pages.
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: plugin names
     */
    themeController.get(`/plugin-names`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('themeController::/plugin-names');
        const out: string[] = [];

        const pages = await readAllPageConfigs();
        pages.forEach(p => {
            p.modifications.forEach(mod => {
                if (mod.type === 'plugin' && mod.plugin && mod.plugin.pluginName && !out.includes(mod.plugin.pluginName)) {
                    out.push(mod.plugin.pluginName);
                }
            })
        });

        res.send(out);
    })

    /**
     * @swagger
     * 
     * /theme/pages/info:
     *   get:
     *     description: Returns all pages' metainfo without modificators.
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: pages info
     */
    themeController.get(`/pages/info`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('themeController::/pages/info');
        const out: TPageInfo[] = [];
        const { themeConfig, userConfig, cmsConfig } = await readConfigs();

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
                    pages[i] = Object.assign({}, pages[i], p);
                }
                else {
                    pages.push(p);
                }
            })
        }
        pages.forEach(p => {
            const info: TPageInfo = {
                route: p.route,
                name: p.name,
                title: p.title,
                isDynamic: p.isDynamic
            }
            out.push(info);
        });

        res.send(out);
    })


    /**
     * @swagger
     * 
     * /theme/pages/configs:
     *   get:
     *     description: Returns all pages with merged modifications.
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: pages configs
     */
    themeController.get(`/pages/configs`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('themeController::/pages/configs');
        const pages = await readAllPageConfigs();
        res.send(pages);
    })


    /**
     * @swagger
     * 
     * /theme/main-config:
     *   get:
     *     description: Returns merged app config.
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: app config
     */
    themeController.get(`/main-config`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('themeController::/main-config');
        let out: TThemeMainConfig;
        const { themeConfig, userConfig, cmsConfig } = await readConfigs();

        out = Object.assign({}, themeConfig?.main, userConfig?.main);
        res.send(out);
    })


    /**
     * @swagger
     * 
     * /theme/custom-config:
     *   get:
     *     description: Returns merged custom app configs.
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: app custom config
     */
    themeController.get(`/custom-config`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('themeController::/custom-config');
        let out: Record<string, any> = {};
        const { themeConfig, userConfig, cmsConfig } = await readConfigs();

        out = Object.assign(out, themeConfig?.themeCustomConfig, userConfig?.themeCustomConfig);
        res.send(out);
    });


    /**
     * @swagger
     * 
     * /theme/page-bundle:
     *   get:
     *     description: Returns page's admin panel bundle from theme dir
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/javascript
     *     parameters:
     *       - name: pageRoute
     *         description: page route from theme's config
     *         in: query
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: bundle
     */
    themeController.get(`/page-bundle`, async (req, res) => {
        if (logLevelMoreThan('detailed')) console.log('themeController::/page-bundle');
        let out: TFrontendBundle | null = null;

        const pageRoute = req.query?.pageRoute;
        if (pageRoute && pageRoute !== "" && typeof pageRoute === 'string') {
            const cmsConfig = await readCMSConfig(projectRootDir);
            if (cmsConfig && cmsConfig.themeName) {
                const pagePath = resolve(projectRootDir, 'themes', cmsConfig.themeName, buildDirName, 'admin', pageRoute);
                const pagePathBunle = normalizePath(pagePath) + '.js';
                if (await fs.pathExists(pagePathBunle)) {
                    out = {};
                    try {
                        out.source = (await fs.readFile(pagePathBunle)).toString();
                    } catch (e) {
                        console.log('Failed to read page file at: ' + pagePathBunle);
                    }

                    const pageMetaInfoPath = pagePathBunle + '_meta.json';
                    if (await fs.pathExists(pageMetaInfoPath)) {
                        try {
                            if (out) out.meta = await fs.readJSON(pageMetaInfoPath);
                        } catch (e) {
                            console.log('Failed to read meta of page at: ' + pageMetaInfoPath);
                        }
                    }
                    res.send(out);
                    return;
                }
            }
        };
        res.status(404).send("Invalid pluginName")
    });


    /**
     * @swagger
     * 
     * /theme/install/{themeName}:
     *   get:
     *     description: Installs downloaded theme
     *     tags: 
     *       - Theme
     *     produces:
     *       - application/javascript
     *     parameters:
     *       - name: themeName
     *         description: Name of a Theme to install.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: success
     */
    themeController.get(`/install/:themeName`, async (req, res) => {
        if (logLevelMoreThan('detailed')) console.log('themeController::/install/:themeName');
        const themeName = req.params?.themeName;
        if (themeName && themeName !== "") {
            const themePath = await getThemeDir(projectRootDir, themeName);
            if (themePath) {

                // @TODO Execute install script



                // Read theme config
                let themeConfig;
                const filePath = resolve(themePath, 'cromwell.config.js');
                if (await fs.pathExists(filePath)) {
                    try {
                        decache(filePath);
                        themeConfig = require(filePath);
                    } catch (e) {
                        console.error(e);
                    }
                }

                // Make symlink for public static content
                const themePublicDir = resolve(themePath, 'public');
                if (await fs.pathExists(themePublicDir)) {
                    try {
                        const publicThemesDir = resolve(projectRootDir, 'public/themes');
                        await fs.ensureDir(publicThemesDir);
                        await symlinkDir(themePublicDir, resolve(publicThemesDir, themeName))
                    } catch (e) { console.log(e) }
                }

                // Create DB entity
                const input: TThemeEntityInput = {
                    name: themeName,
                    slug: themeName,
                    isInstalled: true,
                };
                if (themeConfig) {
                    try {
                        input.defaultSettings = JSON.stringify(themeConfig);
                    } catch (e) {
                        console.error(e);
                    }
                }

                const themeRepo = getCustomRepository(GenericTheme.repository);
                try {
                    const entity = await themeRepo.createEntity(input);
                    if (entity) {
                        res.send(true);
                        return;
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        };
        res.status(400).send("Invalid themeName")
    });


    return themeController;

}

