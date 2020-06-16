import { getStoreItem, CromwellBlockDataType } from "@cromwell/core";
import { Express } from 'express';
const resolve = require('path').resolve;
const fs = require('fs-extra');

export const applyModificationsController = (app: Express): void => {
    const config = getStoreItem('cmsconfig');
    if (!config || !config.templateName) {
        console.error('applyModificationsController: failed to read cmsconfig', config);
        return;
    }
    const userModificationsPath = resolve(__dirname, '../../../modifications/', config.templateName).replace(/\\/g, '/');

    app.get('/api/v1/modifications/template/:pageName', function (req, res) {
        const path = userModificationsPath + '/template.json';
        fs.access(path, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readFile(path, (err, data) => {
                    let userModifications: Record<string, CromwellBlockDataType> | undefined;
                    try {
                        userModifications = JSON.parse(data);
                    } catch (e) {
                        console.error('Failed to read user template modifications', e);
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

    app.get('/api/v1/modifications/modules', function (req, res) {
        const path = userModificationsPath + '/modules.json';
        fs.access(path, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readFile(path, (err, data) => {
                    let modulesModifications: Record<string, any> | undefined;
                    try {
                        modulesModifications = JSON.parse(data);
                    } catch (e) {
                        console.error('Failed to read user modules modifications', e);
                    }
                    res.send(modulesModifications && modulesModifications.modules ? modulesModifications.modules : {});
                });
                return;
            } else {
                res.send({});
            }
        });
    })
}