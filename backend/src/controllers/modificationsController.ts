import { getStoreItem, CromwellBlockDataType, ThemeConfigType, PageConfigType } from "@cromwell/core";
import { Express } from 'express';
const resolve = require('path').resolve;
const fs = require('fs-extra');

export const applyModificationsController = (app: Express): void => {
    const config = getStoreItem('cmsconfig');
    if (!config || !config.themeName) {
        console.error('applyModificationsController: failed to read cmsconfig', config);
        return;
    }
    const userModificationsPath = resolve(__dirname, '../../../modifications/', config.themeName).replace(/\\/g, '/');
    const themeDir = resolve(__dirname, '../../../themes/', config.themeName).replace(/\\/g, '/');
    const themeConfigPath = `${themeDir}/cromwell.config.json`;


    const readConfigs = (cb: (themeConfig: ThemeConfigType | null, userConfig: ThemeConfigType | null) => void) => {

        let themeConfig: ThemeConfigType | null = null,
            userConfig: ThemeConfigType | null = null;

        // Read theme's user modifivcations
        const readUserMods = () => {
            const path = userModificationsPath + '/theme.json';
            fs.access(path, fs.constants.R_OK, (err) => {
                if (!err) {
                    fs.readFile(path, (err, data) => {
                        let themeUserModifications: ThemeConfigType | undefined;
                        try {
                            themeUserModifications = JSON.parse(data);
                        } catch (e) {
                            console.error('Failed to read user theme modifications', e);
                        }

                        console.log('themeUserModifications', themeUserModifications);
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
                            themeOriginalConfig = JSON.parse(data);
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
            };
        });
    }


    const getPageMods = (pageRoute: string, cb: (pageMods: CromwellBlockDataType[]) => void) => {
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

    const mergeMods = (themeMods?: CromwellBlockDataType[], userMods?: CromwellBlockDataType[]): CromwellBlockDataType[] => {
        let mods: CromwellBlockDataType[] = (themeMods && Array.isArray(themeMods)) ? themeMods : [];
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



    app.get('/api/v1/modifications/page/', function (req, res) {
        let pageMods: any[] = [];

        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            getPageMods(pageRoute, (pageMods) => {
                res.send(pageMods);
            })
        }
        else {
            res.send(pageMods);
        }
    })

    app.get('/api/v1/modifications/plugins', function (req, res) {
        const path = userModificationsPath + '/plugins.json';
        fs.access(path, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readFile(path, (err, data) => {
                    let pluginsModifications: Record<string, any> | undefined;
                    try {
                        pluginsModifications = JSON.parse(data);
                    } catch (e) {
                        console.error('Failed to read user plugins modifications', e);
                    }
                    res.send(pluginsModifications && pluginsModifications.plugins ? pluginsModifications.plugins : {});
                });
                return;
            } else {
                res.send({});
            }
        });
    })


    app.get('/api/v1/modifications/pages/info', function (req, res) {
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


    app.get('/api/v1/modifications/pages/configs', function (req, res) {
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

            res.send(pages);

        })
    })


    app.get('/api/v1/modifications/plugins/names', function (req, res) {
        let modeNames: string[] = [];

        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;
            getPageMods(pageRoute, (pageMods) => {
                pageMods.forEach(m => {
                    if (m.type === 'plugin' && m.pluginName && !modeNames.includes(m.pluginName)) {
                        modeNames.push(m.pluginName);
                    }
                })
                res.send(modeNames);
            })
        }
        else {
            res.send(modeNames);
        }
    })
}

