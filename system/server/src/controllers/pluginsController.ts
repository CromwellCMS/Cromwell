import { Router } from 'express';
import fs, { pathExists } from 'fs-extra';
import { TPluginConfig, TPluginInfo } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { projectRootDir } from '../constants';
import { resolve } from 'path';
import { getMetaInfoPath, getPluginAdminBundlePath, getPluginAdminCjsPath, getPluginFrontendBundlePath, getPluginFrontendCjsPath, buildDirName } from '@cromwell/core-backend';
import { TSciprtMetaInfo, TFrontendBundle, TPluginEntityInput } from '@cromwell/core';
import normalizePath from 'normalize-path';
import decache from 'decache';
import fetch from 'cross-fetch';

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
            decache(filePath);
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

/**
 * Reads files of a plugin in frontend or admin directory.
 * @param pluginName 
 * @param pathGetter 
 */
const getPluginBundle = async (pluginName: string, bundleType: 'admin' | 'frontend'): Promise<TFrontendBundle | undefined> => {
    let out: TFrontendBundle | undefined = undefined;
    let pathGetter: ((distDir: string) => string) | undefined = undefined;
    let cjsPathGetter: ((distDir: string) => string) | undefined = undefined;

    if (bundleType === 'admin') {
        pathGetter = getPluginAdminBundlePath;
        cjsPathGetter = getPluginAdminCjsPath;
    }
    if (bundleType === 'frontend') {
        pathGetter = getPluginFrontendBundlePath;
        cjsPathGetter = getPluginFrontendCjsPath;
    }
    if (!pathGetter) return;

    const filePath = pathGetter(resolve(pluginsPath, pluginName, buildDirName));

    let cjsPath: string | undefined = cjsPathGetter?.(
        resolve(pluginsPath, pluginName, buildDirName));
    if (cjsPath) cjsPath = normalizePath(cjsPath);

    if (cjsPath && !(await fs.pathExists(cjsPath))) cjsPath = undefined;
    console.log('filePath', filePath)
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
        } catch (e) {
            console.error("Failed to read plugin's settings", e);
        }
    }
    return out;
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
        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {
            const bundle = await getPluginBundle(pluginName, 'frontend');
            if (bundle) res.send(bundle);
            return;
        };
        res.status(400).send("Invalid pluginName")
    })

    /**
     * @swagger
     * 
     * /plugin/admin-bundle/{pluginName}:
     *   get:
     *     description: Returns plugin's JS admin bundle as a string.
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
    pluginsController.get(`/admin-bundle/:pluginName`, async (req, res) => {
        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {
            const bundle = await getPluginBundle(pluginName, 'admin');
            if (bundle) res.send(bundle);
            return;
        };
        res.status(400).send("Invalid pluginName")
    });

    /**
     * @swagger
     * 
     * /plugin/list:
     *   get:
     *     description: Returns list of all installed plugins.
     *     tags: 
     *       - Plugins
     *     produces:
     *       - application/javascript
     *     responses:
     *       200:
     *         description: list
     */
    pluginsController.get(`/list`, async (req, res) => {
        const out: TPluginInfo[] = [];

        const plugins: string[] = await fs.readdir(pluginsPath);
        plugins.forEach(name => {
            out.push({
                name
            });
        })

        res.send(out);
    });


    /**
     * @swagger
     * 
     * /plugin/install/{pluginName}:
     *   get:
     *     description: Installs downloaded plugin
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
     *         description: ok
     */
    pluginsController.get(`/install/:pluginName`, async (req, res) => {
        const pluginName = req.params?.pluginName;
        console.log('install/:pluginName', pluginName);
        if (pluginName && pluginName !== "") {
            const pluginPath = resolve(pluginsPath, pluginName);
            if (await fs.pathExists(pluginPath)) {

                // @TODO Execute install script


                const graphQLClient = getGraphQLClient(fetch);
                if (graphQLClient) {
                    try {
                        const data = await graphQLClient.createEntity('Plugin', 'PluginInput',
                            graphQLClient.PluginFragment, 'PluginFragment',
                            {
                                name: pluginName,
                                slug: pluginName,
                                isInstalled: true
                            } as TPluginEntityInput
                        );

                        if (data) {
                            res.send(true);
                            return;
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        };
        res.status(400).send("Invalid pluginName")
    });

    return pluginsController;
}
