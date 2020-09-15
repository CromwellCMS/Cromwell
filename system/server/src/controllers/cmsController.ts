import { TThemeConfig } from '@cromwell/core';
import async from 'async';
import { Router } from 'express';
import fs from 'fs-extra';
import { readCMSConfig } from '@cromwell/core-backend';

import { projectRootDir } from '../constants';

export const getCmsController = (): Router => {

    const cmsController = Router();

    const settingsPath = `${projectRootDir}/settings/`;
    const themesDir = `${projectRootDir}/themes`;

    // < HELPERS >
    // < HELPERS />

    // < API Methods />

    /**
     * @swagger
     * 
     * /cms/config:
     *   get:
     *     description: Returns JSON CMS Config.
     *     tags: 
     *       - CMS
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: config
     */
    cmsController.get(`/config`, function (req, res) {
        readCMSConfig(projectRootDir, (config) => {
            if (!config) res.status(404).send("Failed to read CMS Config")
            else {
                res.send(config);
            }
        })
    })

    /**
     * @swagger
     * 
     * /cms/themes:
     *   get:
     *     description: Returns list of themes info.
     *     tags: 
     *       - CMS
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: theme infos
     */
    cmsController.get(`/themes`, function (req, res) {
        let out: (Record<string, any>)[] = [];
        fs.readdir(themesDir, (err, files) => {
            if (!err && files) {
                async.each(files, function (file, callback) {
                    const configPath = `${themesDir}/${file}/cromwell.config.json`;
                    fs.access(configPath, fs.constants.R_OK, (err) => {
                        if (!err) {
                            fs.readFile(configPath, (err, data) => {
                                if (!err) {
                                    try {
                                        const themeConfig: TThemeConfig | undefined = JSON.parse(data.toString());
                                        if (themeConfig && themeConfig.themeInfo) {
                                            out.push(themeConfig.themeInfo);
                                        }
                                    } catch (e) {
                                        console.error("Failed to read CMS Config", e);
                                    }
                                }
                                callback();
                            })
                        }
                    })
                }, function (err) {
                    res.send(out);
                });
            } else {
                res.status(404).send("Failed to read plugins");
            }
        });
    });

    return cmsController;
}
