import { Router } from 'express';
import fs from 'fs-extra';
import { TPluginConfig } from '@cromwell/core';
import { projectRootDir } from '../constants';
import { resolve } from 'path';

const settingsPath = resolve(projectRootDir, 'settings/plugins');
const pluginsPath = resolve(projectRootDir, 'plugins');

// < HELPERS >

/**
 * Returns original config from plugin's directory
 * @param pluginName 
 * @param cb 
 */
export const readPluginConfig = (pluginName: string, cb: (data: TPluginConfig | null) => void) => {
    const filePath = resolve(pluginsPath, pluginName, 'cromwell.config.js');
    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (!err) {
            try {
                let out = require(filePath);
                if (out && typeof out === 'object') {
                    cb(out);
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }
        console.error("Failed to read plugin's config at: " + filePath);
        cb(null);
    })
}

/**
 * Read default settings from plugin's folder 
 * @param pluginName name of plugin and plugin's folder
 * @param cb callback with settings
 */
const readPluginDefaultSettings = (pluginName: string, cb: (data: any) => void) => {
    readPluginConfig(pluginName, (out) => {
        if (out && out.defaultSettings) {
            cb(out.defaultSettings);
            return;
        }
        cb(null);
    })
}

/**
 * Read plugin's user settings
 * @param pluginName name of plugin and plugin's directory
 * @param cb callback with settings
 */
const readPluginSettings = (pluginName: string, cb: (data: any) => void) => {
    const filePath = resolve(settingsPath, pluginName, 'settings.json');
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


export const getPluginsController = (): Router => {
    const pluginsController = Router();


    // < API Methods />


    /**
     * @swagger
     * 
     * /plugin/settings/{pluginName}:
     *   get:
     *     description: Returns JSON settings of a plugin by pluginName.
     *     tags: 
     *       - Plugins
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: pluginName
     *         description: Name of a plugin to load settings for.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: settings
     */
    pluginsController.get(`/settings/:pluginName`, function (req, res) {
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
     * @swagger
     * 
     * /plugin/settings/{pluginName}:
     *   post:
     *     description: Sets JSON settings of a plugin by pluginName.
     *     tags: 
     *       - Plugins
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: pluginName
     *         description: Name of a plugin to save settings for.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: success
     */
    pluginsController.post(`/settings/:pluginName`, function (req, res) {
        if (req.params.pluginName && req.params.pluginName !== "") {
            const filePath = resolve(settingsPath, req.params.pluginName, 'settings.json');
            fs.outputFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
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
    });


    /**
     * @swagger
     * 
     * /plugin/frontend-bundle/{pluginName}:
     *   get:
     *     description: Returns plugin's JS frontend bundle as a string.
     *     tags: 
     *       - Plugins
     *     produces:
     *       - application/javascript
     *     parameters:
     *       - name: pluginName
     *         description: Name of a plugin to load bundle for.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: bundle
     */
    pluginsController.get(`/frontend-bundle/:pluginName`, function (req, res) {
        let out: Record<string, any> = {};
        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {
            readPluginConfig(pluginName, (config) => {
                if (config?.frontendBundle) {
                    const filePath = resolve(pluginsPath, pluginName, config.frontendBundle);
                    fs.access(filePath, fs.constants.R_OK, (err) => {
                        if (!err) {
                            fs.readFile(filePath, (err, data) => {
                                if (!err) {
                                    try {
                                        let out = data.toString();
                                        if (out) res.send(out);
                                        return;
                                    } catch (e) {
                                        console.error("Failed to read plugin's settings", e);
                                    }
                                }
                                res.status(404).send("Invalid plugin bundle");
                            })
                        } else {
                            res.status(404).send("Invalid plugin bundle");
                        }
                    })
                }
            })
        } else {
            res.status(404).send("Invalid pluginName")
        }
    })

    return pluginsController;
}
