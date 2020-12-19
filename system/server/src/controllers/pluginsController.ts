import {
    logLevelMoreThan,
    TFrontendBundle,
    TPluginEntity,
    TPluginEntityInput,
    TPluginInfo,
    TSciprtMetaInfo,
} from '@cromwell/core';
import {
    buildDirName,
    getMetaInfoPath,
    getPluginAdminBundlePath,
    getPluginAdminCjsPath,
    getPluginFrontendBundlePath,
    getPluginFrontendCjsPath,
} from '@cromwell/core-backend';
import decache from 'decache';
import { Router } from 'express';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';
import { getCustomRepository } from 'typeorm';

import { projectRootDir } from '../constants';
import { GenericPlugin } from '../helpers/genericEntities';

const settingsPath = resolve(projectRootDir, 'settings/plugins');
const pluginsPath = resolve(projectRootDir, 'plugins');

// < HELPERS >

/**
 * Reads files of a plugin in frontend or admin directory.
 * @param pluginName 
 * @param pathGetter 
 */
const getPluginBundle = async (pluginName: string, bundleType: 'admin' | 'frontend'): Promise<TFrontendBundle | undefined> => {
    if (logLevelMoreThan('detailed')) console.log('pluginsController::getPluginBundle');
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


/**
 * Returns a Plugin data from DB
 * @param pluginName 
 */
export const getPluginEntity = async (pluginName: string): Promise<TPluginEntity | undefined> => {
    const pluginRepo = getCustomRepository(GenericPlugin.repository);
    return pluginRepo.findOne({
        where: {
            name: pluginName
        }
    });
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
        if (logLevelMoreThan('detailed')) console.log('pluginsController::/settings/:pluginName');
        let out: Record<string, any> = {};
        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {
            const plugin = await getPluginEntity(pluginName);

            if (plugin) {
                let defaultSettings;
                let settings;
                try {
                    if (plugin.defaultSettings) defaultSettings = JSON.parse(plugin.defaultSettings);
                } catch (e) {
                    if (logLevelMoreThan('detailed')) console.error(e)
                }
                try {
                    if (plugin.settings) settings = JSON.parse(plugin.settings);
                } catch (e) {
                    if (logLevelMoreThan('detailed')) console.error(e)
                }

                const out = Object.assign({}, defaultSettings, settings);
                res.send(out);
                return;
            }
        }

        res.status(404).send("Invalid pluginName");

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
    pluginsController.post(`/settings/:pluginName`, async function (req, res) {
        if (logLevelMoreThan('detailed')) console.log('pluginsController::post /settings/:pluginName');
        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {

            const plugin = await getPluginEntity(pluginName);
            if (plugin) {
                plugin.settings = JSON.stringify(req.body, null, 2);
                const pluginRepo = getCustomRepository(GenericPlugin.repository);
                await pluginRepo.save(plugin);
                res.send(true);
                return;
            } else {
                if (logLevelMoreThan('errors-only')) console.error(`pluginsController::post: Error Plugin ${pluginName} was no found!`);
            }
        }
        res.send(false);
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
        if (logLevelMoreThan('detailed')) console.log('pluginsController::/frontend-bundle/:pluginName');
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
        if (logLevelMoreThan('detailed')) console.log('pluginsController::/admin-bundle/:pluginName');
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
        if (logLevelMoreThan('detailed')) console.log('pluginsController::/list');
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
     *         description: Name of a Plugin install.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: ok
     */
    pluginsController.get(`/install/:pluginName`, async (req, res) => {
        if (logLevelMoreThan('detailed')) console.log('pluginsController::/install/:pluginName');
        const pluginName = req.params?.pluginName;
        if (pluginName && pluginName !== "") {
            const pluginPath = resolve(pluginsPath, pluginName);
            if (await fs.pathExists(pluginPath)) {

                // @TODO Execute install script



                // Read plugin config
                let pluginConfig;
                const filePath = resolve(pluginPath, 'cromwell.config.js');
                if (await fs.pathExists(filePath)) {
                    try {
                        decache(filePath);
                        pluginConfig = require(filePath);
                    } catch (e) {
                        console.error(e);
                    }
                }
                const defaultSettings = pluginConfig?.defaultSettings;

                // Make symlink for public static content
                const pluginPublicDir = resolve(pluginPath, 'public');
                if (await fs.pathExists(pluginPublicDir)) {
                    try {
                        const publicPluginsDir = resolve(projectRootDir, 'public/plugins');
                        await fs.ensureDir(publicPluginsDir);
                        await symlinkDir(pluginPublicDir, resolve(publicPluginsDir, pluginName))
                    } catch (e) { console.log(e) }
                }

                // Create DB entity
                const input: TPluginEntityInput = {
                    name: pluginName,
                    slug: pluginName,
                    isInstalled: true,
                };
                if (defaultSettings) {
                    try {
                        input.defaultSettings = JSON.stringify(defaultSettings);
                        input.settings = JSON.stringify(defaultSettings);
                    } catch (e) {
                        console.error(e);
                    }
                }

                const pluginRepo = getCustomRepository(GenericPlugin.repository);
                try {
                    const entity = await pluginRepo.createEntity(input);
                    if (entity) {
                        res.send(true);
                        return;
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        };
        res.status(400).send("Invalid pluginName")
    });

    return pluginsController;
}
