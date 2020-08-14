import { apiV1BaseRoute } from "@cromwell/core";
import { Express } from 'express';
import fs from 'fs-extra';
import { resolve } from 'path';
import { projectRootDir } from '../constants';

export const applyPluginsController = (app: Express): void => {

    const settingsPath = `${projectRootDir}/settings/plugins`;
    const pluginsPath = `${projectRootDir}/plugins`;

    // < HELPERS >

    /** Read default settings from plugin's folder  */
    const readPluginDefaultSettings = (pluginName: string, cb: (data: any) => void) => {
        const filePath = `${pluginsPath}/${pluginName}/cromwell.config.json`;
        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readFile(filePath, (err, data) => {
                    if (!err) {
                        try {
                            let out = JSON.parse(data.toString());
                            if (out && out.defaultSettings) cb(out.defaultSettings);
                            else cb(null);
                            return;
                        } catch (e) {
                            console.error("Failed to read plugin's settings", e);
                        }
                    }
                    cb(null);
                })
            } else {
                cb(null);
            }
        })
    }

    /** Read plugin's user settings */
    const readPluginSettings = (pluginName: string, cb: (data: any) => void) => {
        const filePath = `${settingsPath}/plugins/${pluginName}/settings.json`;
        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readFile(filePath, (err, data) => {
                    if (!err) {
                        try {
                            let out = JSON.parse(data.toString());
                            cb(out);
                            return;
                        } catch (e) {
                            console.error("Failed to read plugin's settings", e);
                        }
                    }
                    cb(null);
                })
            } else {
                cb(null);
            }
        })
    }
    // < HELPERS />

    // < API Methods />

    /**
     * Returns JSON settings of a plugin by pluginName.
     */
    app.get(`/${apiV1BaseRoute}/plugin/settings/:pluginName`, function (req, res) {
        let out: Record<string, any> = {};
        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {
            readPluginSettings(pluginName, (settings) => {
                readPluginDefaultSettings(pluginName, (defaultSettings) => {
                    const out = Object.assign({}, defaultSettings, settings);
                    res.send(out);
                })
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
            const filePath = `${settingsPath}/${req.params.pluginName}/settings.json`;
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