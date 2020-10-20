import { Router } from 'express';
import fs, { pathExists } from 'fs-extra';
import { TPluginConfig } from '@cromwell/core';
import { projectRootDir } from '../constants';
import { resolve } from 'path';
import { getMetaInfoPath, getPluginFrontendBundlePath, getPluginFrontendCjsPath } from '@cromwell/core-backend';
import { TSciprtMetaInfo, TPluginFrontendBundle } from '@cromwell/core';

const settingsPath = resolve(projectRootDir, 'settings/plugins');
const pluginsPath = resolve(projectRootDir, 'plugins');

// < HELPERS >

/**
 * Returns original config from plugin's directory
 * @param pluginName 
 * @param cb 
 */
export const readPluginConfig = async (pluginName: string): Promise<TPluginConfig | null> => {
    const filePath = resolve(pluginsPath, pluginName, 'cromwell.config.js');
    if (await fs.pathExists(filePath)) {
        try {
            let out = require(filePath);
            if (out && typeof out === 'object') {
                return out;
            }
        } catch (e) {
            console.error(e);
        }
    }
    return null;
}

/**
 * Read default settings from plugin's folder 
 * @param pluginName name of plugin and plugin's folder
 * @param cb callback with settings
 */
const readPluginDefaultSettings = async (pluginName: string): Promise<any> => {
    const out = await readPluginConfig(pluginName);
    if (out && out.defaultSettings) {
        return out.defaultSettings;
    }
    return null;
}

/**
 * Read plugin's user settings
 * @param pluginName name of plugin and plugin's directory
 * @param cb callback with settings
 */
const readPluginSettings = async (pluginName: string): Promise<any> => {
    const filePath = resolve(settingsPath, pluginName, 'settings.json');

    if (await fs.pathExists(filePath)) {
        try {
            const data = await fs.readFile(filePath);
            let out = JSON.parse(data.toString());
            return out;
        } catch (e) {
            console.error("Failed to read plugin's settings", e);
        }
    }


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
    pluginsController.get(`/settings/:pluginName`, async (req, res) => {
        let out: Record<string, any> = {};
        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {
            const settings = await readPluginSettings(pluginName);
            const defaultSettings = await readPluginDefaultSettings(pluginName);
            const out = Object.assign({}, defaultSettings, settings);
            res.send(out);
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
    pluginsController.get(`/frontend-bundle/:pluginName`, async (req, res) => {
        let out: TPluginFrontendBundle;

        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {
            const config = await readPluginConfig(pluginName);
            if (config?.buildDir) {
                const filePath = getPluginFrontendBundlePath(resolve(pluginsPath, pluginName, config.buildDir));
                let cjsPath: string | undefined = getPluginFrontendCjsPath(resolve(pluginsPath, pluginName, config.buildDir));
                
                if (!(await fs.pathExists(cjsPath))) cjsPath = undefined;

                if (await fs.pathExists(filePath)) {
                    try {
                        const source = (await fs.readFile(filePath)).toString();

                        let meta: TSciprtMetaInfo | undefined;
                        if (await fs.pathExists(getMetaInfoPath(filePath))) {
                            try {
                                meta = JSON.parse((await fs.readFile(getMetaInfoPath(filePath))).toString());
                            } catch (e) { }
                        }

                        out = {
                            source,
                            meta,
                            cjsPath
                        }

                        if (out) res.send(out);
                        return;
                    } catch (e) {
                        console.error("Failed to read plugin's settings", e);
                    }
                }
            }
        };
        res.status(404).send("Invalid pluginName")
    })

    return pluginsController;
}
