import { apiV1BaseRoute } from "@cromwell/core";
import { Express } from 'express';
import fs from 'fs-extra';
import { resolve } from 'path';
import { projectRootDir } from '../constants';

export const applyCmsController = (app: Express): void => {

    const settingsPath = `${projectRootDir}/settings/`;

    // < HELPERS >
    // < HELPERS />

    // < API Methods />

    /**
    * Returns JSON CMS Config.
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

}