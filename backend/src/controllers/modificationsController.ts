import { getStoreItem, CromwellBlockDataType } from "@cromwell/core";
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

    app.get('/api/v1/modifications/theme/:pageName', function (req, res) {
        const path = userModificationsPath + '/theme.json';
        fs.access(path, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readFile(path, (err, data) => {
                    let userModifications: Record<string, CromwellBlockDataType> | undefined;
                    try {
                        userModifications = JSON.parse(data);
                    } catch (e) {
                        console.error('Failed to read user theme modifications', e);
                    }
                    const mod = userModifications ? userModifications[req.params.pageName] : [];
                    res.send(mod ? mod : []);
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