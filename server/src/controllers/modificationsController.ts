import { getStoreItem, CromwellBlockDataType, ThemeConfigType, PageConfigType, apiV1BaseRoute } from "@cromwell/core";
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

    /**
     * Asynchronously reads all modifications for specified Page by pageRoute arg.
     * Output contains theme's original modificators overwritten and supplemented by user's modificators.
     * @param pageRoute original route of the page in theme dir
     * @param cb callback to return modifications
     */
    const getPageMods = (pageRoute: string, cb: (pageMods: CromwellBlockDataType[]) => void): void => {
        readConfigs((themeConfig: ThemeConfigType | null, userConfig: ThemeConfigType | null) => {
            let themeMods: CromwellBlockDataType[] | undefined = undefined, userMods: CromwellBlockDataType[] | undefined = undefined;
            // Read theme's original modificators 
            if (themeConfig && themeConfig.pages && Array.isArray(themeConfig.pages)) {
                for (const p of themeConfig.pages) {
                    if (p.route === pageRoute) {
                        themeMods = p.modifications;
                    }
                }
            }
            // Read user's custom modificators 
            if (userConfig && userConfig.pages && Array.isArray(userConfig.pages)) {
                for (const p of userConfig.pages) {
                    if (p.route === pageRoute) {
                        userMods = p.modifications;
                    }
                }
            }
            // Merge users's with theme's mods
            const pageMods = mergeMods(themeMods, userMods);
            cb(pageMods);
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
                        // const mods = [...(pages[i].modifications ? pages[i].modifications : []),
                        // ...(p.modifications ? p.modifications : [])]
                        const mods = mergeMods(pages[i].modifications, p.modifications);
                        pages[i] = Object.assign({}, pages[i], p);
                        pages[i].modifications = mods;
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
     * Returns all modifications for specified Page by pageRoute in query param.
     * Output contains theme's original modificators overwritten by user's modificators.
     */
    app.get(`/${apiV1BaseRoute}/modifications/page/`, function (req, res) {
        let out: CromwellBlockDataType[] = [];
        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            getPageMods(pageRoute, (pageMods) => {
                out = pageMods;
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
            getPageMods(pageRoute, (pageMods) => {
                pageMods.forEach(mod => {
                    if (mod.type === 'plugin' && mod.pluginName) {
                        out[mod.pluginName] = mod.pluginConfig ? mod.pluginConfig : {};
                    }
                })
                res.send(out);
            })
        }
        else {
            res.send(out);
        }
    })

    /**
    * Returns array of plugins' names at all pages
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
            pages.forEach(p => delete p.modifications);

            res.send(pages);

        })
    })

    /**
     * Returns all pages merged configs.
     */
    app.get(`/${apiV1BaseRoute}/modifications/pages/configs`, function (req, res) {
        readAllPageConfigs((pages) => {
            res.send(pages);
        })
    })


    // app.get('/api/v1/modifications/plugins/pagelist', function (req, res) {
    //     const modeNames: string[] = [];

    //     if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
    //         const pageRoute = req.query.pageRoute;
    //         getPageMods(pageRoute, (pageMods) => {
    //             pageMods.forEach(m => {
    //                 if (m.type === 'plugin' && m.pluginName && !modeNames.includes(m.pluginName)) {
    //                     modeNames.push(m.pluginName);
    //                 }
    //             })
    //             res.send(modeNames);
    //         })
    //     }
    //     else {
    //         res.send(modeNames);
    //     }
    // })



}

