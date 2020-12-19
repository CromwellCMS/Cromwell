import { TThemeConfig, logLevelMoreThan } from '@cromwell/core';
import async from 'async';
import { Router } from 'express';
import fs from 'fs-extra';
import { readCMSConfig } from '@cromwell/core-backend';
import { resolve } from 'path';
import decache from 'decache';

import { projectRootDir } from '../constants';

export const getCmsController = (): Router => {

    const cmsController = Router();

    // const settingsPath = `${projectRootDir}/settings/`;
    const themesDir = resolve(projectRootDir, 'themes');

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
    cmsController.get(`/config`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('cmsController/config');
        const config = await readCMSConfig(projectRootDir);
        if (!config) res.status(404).send("Failed to read CMS Config")
        else {
            res.send(config);
        }
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
    cmsController.get(`/themes`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('cmsController/themes');
        let out: (Record<string, any>)[] = [];
        let themeDirs: string[] = [];
        try {
            themeDirs = await fs.readdir(themesDir);
        } catch (e) {
            console.error("Failed to read themeDirs at: " + themesDir, e);
        }
        for (const dirName of themeDirs) {
            const configPath = resolve(themesDir, dirName, 'cromwell.config.js');
            if (await fs.pathExists(configPath)) {
                try {
                    decache(configPath);
                    const themeConfig: TThemeConfig | undefined = require(configPath);
                    if (themeConfig && themeConfig.main) {
                        out.push(themeConfig.main);
                    }
                } catch (e) {
                    console.error("Failed to read CMS Config at: " + configPath, e);
                }
            }
        }
        res.send(out);
    });

    return cmsController;
}
