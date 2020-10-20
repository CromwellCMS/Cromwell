import {
    getStoreItem, TThemeMainConfig, TCromwellBlockData, TPageConfig, TCmsConfig,
    TPageInfo, TThemeConfig, TPluginConfig
} from '@cromwell/core';
import { Router } from 'express';
import fs from 'fs-extra';
import { readCMSConfig } from '@cromwell/core-backend';

import { projectRootDir } from '../constants';
import { readPluginConfig } from './pluginsController';
import { resolve } from 'path';

export const getThemeController = (): Router => {
    const themeController = Router();

    const settingsPath = resolve(projectRootDir, 'settings');


    // < HELPERS >

    /**
     * Asynchronously reads theme config (user's or original) by specified path
     * @param configPath 
     * @param cb 
     */
    const readThemeConfig = (configPath: string, cb: (themeConfig: TThemeConfig | null) => void) => {
        let config: TThemeConfig | undefined;
        try {
            config = require(configPath);
        } catch (e) {
            console.error(e);
        }
        if (config && typeof config === 'object') {
            cb(config);
            return;
        }
        console.error('Failed to read ThemeConfig at ' + configPath);
        cb(null);
    }

    /**
     * Asynchronously reads user's theme config by theme name from cmsConfig
     * @param cmsConfig 
     * @param cb 
     */
    const readThemeUserConfig = (cmsConfig: TCmsConfig, cb: (config: TThemeConfig | null) => void) => {
        const themeConfigPath = resolve(settingsPath, 'themes', cmsConfig.themeName, 'theme.json');
        readThemeConfig(themeConfigPath, cb);
    }

    /**
     * Asynchronously reads original theme config by theme name from cmsConfig
     * @param cmsConfig 
     * @param cb 
     */
    const readThemeOriginalConfig = (cmsConfig: TCmsConfig, cb: (config: TThemeConfig | null) => void) => {
        const themeConfigPath =  resolve(projectRootDir, 'themes', cmsConfig.themeName, 'cromwell.config.js');
        readThemeConfig(themeConfigPath, cb);
    }

    /**
     * Asynchronously saves theme config (user's or original) by specified path
     * @param configPath 
     * @param config 
     * @param cb 
     */
    const saveThemeConfig = (configPath: string, config: TThemeConfig, cb: (success: boolean) => void) => {
        fs.outputFile(configPath, JSON.stringify(config, null, 4), (err) => {
            if (err) {
                console.error(err);
                cb(false)
                return;
            }
            cb(true);
        });
    }

    /**
     * Asynchronously saves user's theme config by theme name from cmsConfig
     * @param cmsConfig 
     * @param cb 
     */
    const saveThemeUserConfig = (themeConfig: TThemeConfig, cmsConfig: TCmsConfig, cb: (success: boolean) => void) => {
        const themeConfigPath = resolve(settingsPath, 'themes', cmsConfig.themeName, 'theme.json');
        saveThemeConfig(themeConfigPath, themeConfig, cb);
    }

    // const saveThemeOriginalConfig = (themeConfig: TThemeConfig, cmsConfig: TCmsConfig, cb: (success: boolean) => void) => {
    //     const themeConfigPath = `${projectRootDir}/themes/${cmsConfig.themeName}/cromwell.config.js`;
    //     saveThemeConfig(themeConfigPath, themeConfig, cb);
    // }

    /**
     * Asynchronously reads modifications in theme's original config from /themes 
     * and user's config from /modifications.
     * @param cb callback with both configs.
     */
    const readConfigs = (cb: (themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null, cmsConfig?: TCmsConfig) => void): void => {
        let themeConfig: TThemeConfig | null = null,
            userConfig: TThemeConfig | null = null;

        // Read CMS config, because theme can be changed
        readCMSConfig(projectRootDir, (cmsConfig) => {
            if (cmsConfig) {

                // Read theme's original config
                readThemeOriginalConfig(cmsConfig, (config) => {
                    themeConfig = config;

                    // Read theme's user modifications
                    readThemeUserConfig(cmsConfig, (config) => {
                        userConfig = config;
                        cb(themeConfig, userConfig, cmsConfig);
                    })
                })
            }
        });
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
     * Asynchronously configs for specified Page by pageRoute arg and merge them into one.
     * Output contains theme's original modificators overwritten and supplemented by user's modificators.
     * @param pageRoute original route of the page in theme dir
     * @param cb callback to return modifications
     */
    const getPageConfig = (pageRoute: string, cb: (pageConfig: TPageConfig) => void): void => {
        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => {
            // let themeMods: TCromwellBlockData[] | undefined = undefined, userMods: TCromwellBlockData[] | undefined = undefined;
            // Read theme's original modificators 
            const themePageConfig: TPageConfig | undefined = getPageConfigFromThemeConfig(pageRoute, themeConfig);
            // Read user's custom modificators 
            const userPageConfig: TPageConfig | undefined = getPageConfigFromThemeConfig(pageRoute, userConfig);
            // Merge users's with theme's mods
            const pageConfig = mergePages(themePageConfig, userPageConfig, themeConfig?.globalModifications, userConfig?.globalModifications);

            cb(pageConfig);
        });
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
    const saveUserPageConfig = (userPageConfig: TPageConfig, cb: (success: boolean) => void) => {
        if (!userPageConfig) {
            console.error('Server::saveUserPageConfig: Invalid userPageConfig')
            cb(false);
            return;
        }
        if (!userPageConfig.route) {
            console.error('Server::saveUserPageConfig: Invalid userPageConfig, no route', JSON.stringify(userPageConfig));
            cb(false);
            return;
        }
        if (!userPageConfig.modifications) {
            console.error('Server::saveUserPageConfig: Invalid userPageConfig, no modifications', JSON.stringify(userPageConfig));
            cb(false);
            return;
        }

        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null, cmsConfig) => {
            // If userConfig is null, then theme is probably new and user has never saved mods. Create a new userConfig
            if (!userConfig) {
                userConfig = {
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
                saveThemeUserConfig(userConfig, cmsConfig, cb);
            } else {
                cb(false);
            }
        });
    }

    /**
     * Asynchronously reads theme's and user's configs and merge all pages info with modifications 
     * @param cb cb to return pages info
     */
    const readAllPageConfigs = (cb: (pages: TPageConfig[]) => void) => {
        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => {
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
            cb(pages);
        })
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
    themeController.get(`/page`, function (req, res) {
        let out: TPageConfig | null = null;
        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            getPageConfig(pageRoute, (pageConfig) => {
                out = pageConfig;
                res.send(out);
            })
        }
        else {
            res.send(out);
        }
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
    themeController.post(`/page`, function (req, res) {
        let input: TPageConfig | null = req.body;
        if (input && typeof input === 'object') {
            saveUserPageConfig(input, (success) => {
                res.send(success);
            })
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
    themeController.get(`/plugins`, function (req, res) {
        const out: Record<string, any> = {};

        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            getPageConfig(pageRoute, async (pageConfig) => {
                if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
                    for (const mod of pageConfig.modifications) {
                        const pluginName = mod?.plugin?.pluginName;
                        if (pluginName) {
                            const originalConf: TPluginConfig | undefined | null = await readPluginConfig(pluginName);

                            if (originalConf?.buildDir) originalConf.buildDir = resolve(
                                projectRootDir, 'plugins', pluginName, originalConf.buildDir);

                            const pluginConfig = Object.assign({}, mod?.plugin?.pluginConfig, originalConf);
                            out[pluginName] = pluginConfig;
                        }
                    };
                }
                res.send(out);

            })
        }
        else {
            res.send(out);
        }
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
    themeController.get(`/plugin-names`, function (req, res) {
        const out: string[] = [];

        readAllPageConfigs((pages) => {
            pages.forEach(p => {
                p.modifications.forEach(mod => {
                    if (mod.type === 'plugin' && mod.plugin && mod.plugin.pluginName && !out.includes(mod.plugin.pluginName)) {
                        out.push(mod.plugin.pluginName);
                    }
                })
            });
            res.send(out);
        })


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
    themeController.get(`/pages/info`, function (req, res) {
        const out: TPageInfo[] = [];
        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => {
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
    themeController.get(`/pages/configs`, function (req, res) {
        readAllPageConfigs((pages) => {
            res.send(pages);
        })
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
    themeController.get(`/main-config`, function (req, res) {
        let out: TThemeMainConfig;
        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => {
            out = Object.assign({}, themeConfig?.main, userConfig?.main);
            res.send(out);
        })

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
    themeController.get(`/custom-config`, function (req, res) {
        let out: Record<string, any> = {};
        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => {
            out = Object.assign(out, themeConfig?.themeCustomConfig, userConfig?.themeCustomConfig);
            res.send(out);
        })
    });

    return themeController;

}
