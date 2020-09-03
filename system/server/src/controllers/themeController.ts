import { getStoreItem, TCromwellBlockData, TThemeConfig, TPageConfig, apiV1BaseRoute, TPageInfo, TAppConfig } from "@cromwell/core";
import { Express } from 'express';
import fs from 'fs-extra';
import { resolve } from 'path';
import { projectRootDir } from '../constants';

export const applyThemeController = (app: Express): void => {
    const config = getStoreItem('cmsconfig');
    if (!config || !config.themeName) {
        console.error('applyModificationsController: failed to read cmsconfig', config);
        return;
    }
    const settingsPath = `${projectRootDir}/settings/`;

    const userModificationsPath = `${settingsPath}/themes/${config.themeName}`;
    const themeDir = `${projectRootDir}/themes/${config.themeName}`;
    const themeConfigPath = `${themeDir}/cromwell.config.json`;


    // < HELPERS >

    /**
     * Asynchronously reads modifications in theme's original config from /themes 
     * and user's config from /modifications.
     * @param cb callback with both configs.
     */
    const readConfigs = (cb: (themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => void): void => {
        let themeConfig: TThemeConfig | null = null,
            userConfig: TThemeConfig | null = null;

        // Read theme's user modifications
        const readUserMods = () => {
            const path = userModificationsPath + '/theme.json';
            fs.access(path, fs.constants.R_OK, (err) => {
                if (!err) {
                    fs.readFile(path, (err, data) => {
                        let themeUserModifications: TThemeConfig | undefined;
                        try {
                            themeUserModifications = JSON.parse(data.toString());
                        } catch (e) {
                            console.error('Failed to read user theme modifications', e);
                        }

                        if (themeUserModifications && typeof themeUserModifications === 'object') {
                            userConfig = themeUserModifications;
                        }

                        cb(themeConfig, userConfig);
                    });
                    return;
                } else {
                    cb(themeConfig, userConfig);
                }
            });
        }

        // Read theme's original config
        fs.access(themeConfigPath, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readFile(themeConfigPath, (err, data) => {
                    let themeOriginalConfig: TThemeConfig | undefined;
                    if (!err) {
                        try {
                            themeOriginalConfig = JSON.parse(data.toString());
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    if (themeOriginalConfig && typeof themeOriginalConfig === 'object') {
                        themeConfig = themeOriginalConfig;
                    }

                    readUserMods();

                })
            }
            else {
                console.error('Failed to find theme config at ' + themeConfigPath);
                readUserMods();
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

    /**
     * Asynchronously configs for specified Page by pageRoute arg and merge them into one.
     * Output contains theme's original modificators overwritten and supplemented by user's modificators.
     * @param pageRoute original route of the page in theme dir
     * @param cb callback to return modifications
     */
    const getPageConfig = (pageRoute: string, cb: (pageConfig: TPageConfig) => void): void => {
        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => {
            // let themeMods: TCromwellBlockData[] | undefined = undefined, userMods: TCromwellBlockData[] | undefined = undefined;
            let themePageConfig: TPageConfig | undefined = undefined, userPageConfig: TPageConfig | undefined = undefined;
            // Read theme's original modificators 
            if (themeConfig && themeConfig.pages && Array.isArray(themeConfig.pages)) {
                for (const p of themeConfig.pages) {
                    if (p.route === pageRoute) {
                        themePageConfig = p;
                    }
                }
            }
            // Read user's custom modificators 
            if (userConfig && userConfig.pages && Array.isArray(userConfig.pages)) {
                for (const p of userConfig.pages) {
                    if (p.route === pageRoute) {
                        userPageConfig = p;
                    }
                }
            }
            // Merge users's with theme's mods
            const pageConfig = mergePages(themePageConfig, userPageConfig, themeConfig?.globalModifications, userConfig?.globalModifications);

            cb(pageConfig);
        })
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
    app.get(`/${apiV1BaseRoute}/theme/page/`, function (req, res) {
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
    app.get(`/${apiV1BaseRoute}/theme/plugins`, function (req, res) {
        const out: Record<string, any> = {};

        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            getPageConfig(pageRoute, (pageConfig) => {
                if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
                    pageConfig.modifications.forEach(mod => {
                        if (mod.type === 'plugin' && mod.plugin && mod.plugin.pluginName) {
                            out[mod.plugin.pluginName] = mod.plugin.pluginConfig ? mod.plugin.pluginConfig : {};
                        }
                    })
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
    app.get(`/${apiV1BaseRoute}/theme/plugin-names`, function (req, res) {
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
    app.get(`/${apiV1BaseRoute}/theme/pages/info`, function (req, res) {
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
    app.get(`/${apiV1BaseRoute}/theme/pages/configs`, function (req, res) {
        readAllPageConfigs((pages) => {
            res.send(pages);
        })
    })


    /**
     * @swagger
     * 
     * /theme/app/config:
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
    app.get(`/${apiV1BaseRoute}/theme/app/config`, function (req, res) {
        let out: TAppConfig = {};
        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => {
            out = Object.assign(out, themeConfig?.appConfig, userConfig?.appConfig);
            res.send(out);
        })

    })


    /**
     * @swagger
     * 
     * /theme/app/custom-config:
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
    app.get(`/${apiV1BaseRoute}/theme/app/custom-config`, function (req, res) {
        let out: Record<string, any> = {};
        readConfigs((themeConfig: TThemeConfig | null, userConfig: TThemeConfig | null) => {
            out = Object.assign(out, themeConfig?.appCustomConfig, userConfig?.appCustomConfig);
            res.send(out);
        })
    })

}

