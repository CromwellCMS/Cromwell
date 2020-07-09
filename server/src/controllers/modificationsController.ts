import { getStoreItem, CromwellBlockDataType, ThemeConfigType, PageConfigType, apiV1BaseRoute, PageInfoType } from "@cromwell/core";
import { Express } from 'express';
import fs from 'fs-extra';
import { resolve } from 'path';

export const applyModificationsController = (app: Express): void => {
    const config = getStoreItem('cmsconfig');
    if (!config || !config.themeName) {
        console.error('applyModificationsController: failed to read cmsconfig', config);
        return;
    }
    const userModificationsPath = resolve(__dirname, '../../../modifications/', config.themeName).replace(/\\/g, '/');
    const themeDir = resolve(__dirname, '../../../themes/', config.themeName).replace(/\\/g, '/');
    const themeConfigPath = `${themeDir}/cromwell.config.json`;


    // < HELPERS >

    /**
     * Asynchronously reads modifications in theme's original config from /themes 
     * and user's config from /modifications.
     * @param cb callback with both configs.
     */
    const readConfigs = (cb: (themeConfig: ThemeConfigType | null, userConfig: ThemeConfigType | null) => void): void => {
        let themeConfig: ThemeConfigType | null = null,
            userConfig: ThemeConfigType | null = null;

        // Read theme's user modifications
        const readUserMods = () => {
            const path = userModificationsPath + '/theme.json';
            fs.access(path, fs.constants.R_OK, (err) => {
                if (!err) {
                    fs.readFile(path, (err, data) => {
                        let themeUserModifications: ThemeConfigType | undefined;
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
                    let themeOriginalConfig: ThemeConfigType | undefined;
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
    const mergeMods = (themeMods?: CromwellBlockDataType[], userMods?: CromwellBlockDataType[]): CromwellBlockDataType[] => {
        const mods: CromwellBlockDataType[] = (themeMods && Array.isArray(themeMods)) ? themeMods : [];
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

    const mergePages = (themeConfig?: PageConfigType, userConfig?: PageConfigType): PageConfigType => {
        const mods = mergeMods(themeConfig?.modifications, userConfig?.modifications);
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
    const getPageConfig = (pageRoute: string, cb: (pageConfig: PageConfigType) => void): void => {
        readConfigs((themeConfig: ThemeConfigType | null, userConfig: ThemeConfigType | null) => {
            // let themeMods: CromwellBlockDataType[] | undefined = undefined, userMods: CromwellBlockDataType[] | undefined = undefined;
            let themePageConfig: PageConfigType | undefined = undefined, userPageConfig: PageConfigType | undefined = undefined;
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
            const pageConfig = mergePages(themePageConfig, userPageConfig);
            cb(pageConfig);
        })
    }

    /**
     * Asynchronously reads theme's and user's configs and merge all pages info with modifications 
     * @param cb cb to return pages info
     */
    const readAllPageConfigs = (cb: (pages: PageConfigType[]) => void) => {
        readConfigs((themeConfig: ThemeConfigType | null, userConfig: ThemeConfigType | null) => {
            let pages: PageConfigType[] = [];
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
            cb(pages);
        })
    }


    // < HELPERS />

    // < API Methods />

    /**
     * Returns merged page config for specified Page by pageRoute in query param.
     * Output contains theme's original modificators overwritten by user's modificators.
     */
    app.get(`/${apiV1BaseRoute}/modifications/page/`, function (req, res) {
        let out: PageConfigType | null = null;
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
     * Returns plagins' configs at specified Page by pageRoute in query param.
     * Output contains theme's original modificators overwritten by user's modificators.
     */
    app.get(`/${apiV1BaseRoute}/modifications/plugins`, function (req, res) {
        const out: Record<string, any> = {};

        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            getPageConfig(pageRoute, (pageConfig) => {
                if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
                    pageConfig.modifications.forEach(mod => {
                        if (mod.type === 'plugin' && mod.pluginName) {
                            out[mod.pluginName] = mod.pluginConfig ? mod.pluginConfig : {};
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
    * Returns array of plugin names at all pages
    */
    app.get(`/${apiV1BaseRoute}/modifications/pluginNames`, function (req, res) {
        const out: string[] = [];

        readAllPageConfigs((pages) => {
            pages.forEach(p => {
                p.modifications.forEach(mod => {
                    if (mod.type === 'plugin' && mod.pluginName && !out.includes(mod.pluginName)) {
                        out.push(mod.pluginName);
                    }
                })
            });
            res.send(out);
        })


    })

    /**
     * Returns all pages' metainfo without modificators
     */
    app.get(`/${apiV1BaseRoute}/modifications/pages/info`, function (req, res) {
        const out: PageInfoType[] = [];
        readConfigs((themeConfig: ThemeConfigType | null, userConfig: ThemeConfigType | null) => {
            let pages: PageConfigType[] = [];
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
                const info: PageInfoType = {
                    route: p.route,
                    name: p.name,
                    title: p.title
                }
                out.push(info);
            });

            res.send(out);

        })
    })

    /**
     * Returns all pages with merged modifications.
     */
    app.get(`/${apiV1BaseRoute}/modifications/pages/configs`, function (req, res) {
        readAllPageConfigs((pages) => {
            res.send(pages);
        })
    })

    /**
     * Returns merged custom app configs.
     */
    app.get(`/${apiV1BaseRoute}/modifications/app/custom-config`, function (req, res) {
        let out: Record<string, any> = {};
        readConfigs((themeConfig: ThemeConfigType | null, userConfig: ThemeConfigType | null) => {
            console.log('themeConfig', themeConfig);
            out = Object.assign(out, themeConfig?.appCustomConfig, userConfig?.appCustomConfig);
            res.send(out);
        })

    })


}

