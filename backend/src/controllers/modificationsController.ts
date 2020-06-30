import { getStoreItem, CromwellBlockDataType, ThemeConfigType } from "@cromwell/core";
import { Express } from 'express';
const resolve = require('path').resolve;
const fs = require('fs-extra');

export const applyModificationsController = async (app: Express): Promise<void> => {
    const config = getStoreItem('cmsconfig');
    if (!config || !config.themeName) {
        console.error('applyModificationsController: failed to read cmsconfig', config);
        return;
    }
    const userModificationsPath = resolve(__dirname, '../../../modifications/', config.themeName).replace(/\\/g, '/');
    const themeDir = resolve(__dirname, '../../../themes/', config.themeName).replace(/\\/g, '/');
    const themeConfigPath = `${themeDir}/cromwell.config.json`;

    // Read theme's original modifications
    let themeConfig: ThemeConfigType | undefined = undefined;
    if (fs.existsSync(themeConfigPath)) {
        try {
            themeConfig = JSON.parse(
                fs.readFileSync(themeConfigPath, { encoding: 'utf8', flag: 'r' }));

        } catch (e) {
            console.error(e);
        }
    }
    else {
        console.error('Failed to find theme config at ' + themeConfigPath)
    }

    app.get('/api/v1/modifications/theme/', function (req, res) {
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
                    let pageMods: any[] = [];
                    console.log('themeUserModifications', themeUserModifications);
                    if (req.query.pageRoute && typeof req.query.pageRoute === 'string') {
                        const pageRoute = req.query.pageRoute;

                        // Read theme's original modificators 
                        if (themeConfig && themeConfig.pages && Array.isArray(themeConfig.pages)) {
                            for (const p of themeConfig.pages) {
                                if (p.route === pageRoute && p.modifications && Array.isArray(p.modifications)) {
                                    pageMods = p.modifications;
                                }
                            }
                        }

                        // Read user's custom modificators and unite with theme's mods
                        if (themeUserModifications && themeUserModifications.pages && Array.isArray(themeUserModifications.pages)) {
                            for (const p of themeUserModifications.pages) {
                                if (p.route === pageRoute && p.modifications && Array.isArray(p.modifications)) {
                                    pageMods = [...pageMods, ...p.modifications];
                                }
                            }
                        }
                    }

                    res.send(pageMods);
                });
                return;
            } else {
                res.send([]);
            }
        });
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
}
