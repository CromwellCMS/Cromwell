import { getStoreItem, TCromwellBlockData, TThemeConfig, TPageConfig, apiV1BaseRoute, TPageInfo, TAppConfig } from "@cromwell/core";
import { Express } from 'express';
import fs from 'fs-extra';
import { resolve } from 'path';
import { projectRootDir } from '../constants';

export const applyPluginsController = (app: Express): void => {

    const settingsPath = `${projectRootDir}/settings/`;

    // < HELPERS >
    // < HELPERS />

    // < API Methods />

    /**
     * Returns JSON settings of a plugin by pluginName.
     */
    app.get(`/${apiV1BaseRoute}/plugin/settings/:pluginName`, function (req, res) {
        let out: Record<string, any> = {};

        if (req.params.pluginName && req.params.pluginName !== "") {
            const filePath = `${settingsPath}/plugins/${req.params.pluginName}/settings.json`;
            fs.access(filePath, fs.constants.R_OK, (err) => {
                if (!err) {
                    fs.readFile(filePath, (err, data) => {
                        if (!err) {
                            try {
                                out = JSON.parse(data.toString());
                                res.send(out);
                                return;
                            } catch (e) {
                                console.error("Failed to read plugin's settings", e);
                            }
                        }
                        res.status(404).send("Failed to read plugin's settings")

                    })
                } else {
                    res.status(404).send("Plugin's data not found")
                }
            })
        } else {
            res.status(404).send("Invalid pluginName")
        }
    })


    /**
    * Sets JSON settings of a plugin by pluginName.
    */
    app.post(`/${apiV1BaseRoute}/plugin/settings/:pluginName`, function (req, res) {
        if (req.params.pluginName && req.params.pluginName !== "") {
            const filePath = `${settingsPath}/plugins/${req.params.pluginName}/settings.json`;
            fs.outputFile(filePath, JSON.stringify(req.body), (err) => {
                if (err) {
                    console.error(err);
                    res.send(false);
                }
                res.send(true);
            });
        }
        else {
            res.send(false);
        }
    })

}