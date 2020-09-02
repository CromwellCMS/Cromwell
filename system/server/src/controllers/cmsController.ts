import { apiV1BaseRoute, TThemeConfig } from "@cromwell/core";
import { Express } from 'express';
import fs from 'fs-extra';
import { resolve } from 'path';
import async from 'async';

import { projectRootDir } from '../constants';

export const applyCmsController = (app: Express): void => {

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
    app.get(`/${apiV1BaseRoute}/cms/config`, function (req, res) {
        let out: Record<string, any> = {};
        const filePath = `${projectRootDir}/system/cmsconfig.json`;
        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readFile(filePath, (err, data) => {
                    if (!err) {
                        try {
                            out = JSON.parse(data.toString());
                            res.send(out);
                            return;
                        } catch (e) {
                            console.error("Failed to read CMS Config", e);
                        }
                    }
                    res.status(404).send("Failed to read CMS Config")

                })
            } else {
                res.status(404).send("CMS Config not found")
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
    app.get(`/${apiV1BaseRoute}/cms/themes`, function (req, res) {
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
    })


}


