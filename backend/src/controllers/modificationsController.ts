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


    app.get('/api/v1/modifications/theme/', function (req, res) {
        let pageMods: any[] = [];

        if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
            const pageRoute = req.query.pageRoute;

            readConfigs((themeConfig: ThemeConfigType | null, userConfig: ThemeConfigType | null) => {
                // Read theme's original modificators 
                if (themeConfig && themeConfig.pages && Array.isArray(themeConfig.pages)) {
                    for (const p of themeConfig.pages) {
                        if (p.route === pageRoute && p.modifications && Array.isArray(p.modifications)) {
                            pageMods = p.modifications;
                        }
                    }
                }
                // Read user's custom modificators and merge with theme's mods
                if (userConfig && userConfig.pages && Array.isArray(userConfig.pages)) {
                    for (const p of userConfig.pages) {
                        if (p.route === pageRoute && p.modifications && Array.isArray(p.modifications)) {
                            pageMods = [...pageMods, ...p.modifications];
                        }
                    }
                }
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


    app.get('/api/v1/modifications/pages', function (req, res) {
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



}
