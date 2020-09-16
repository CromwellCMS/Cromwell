import { readCMSConfigSync } from '@cromwell/core-backend';
import { Router } from 'express';

import managerConfig from '../config';
import { closeRenderer, rendererBuildAndStart, rendererChangeTheme } from '../managers/rendererManager';
import { ManagerState } from '../managerState';


const { projectRootDir } = managerConfig;

export const getRendererController = (): Router => {

    const rendererController = Router();


    /**
      * @swagger
      * 
      * /renderer/change-theme/{themeName}:
      *   get:
      *     description: Changes current theme and re-runs renderer with build (if no previous builds found) and start.
      *     tags: 
      *       - Renderer
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: themeName
      *         description: Name of a new theme to change
      *         in: path
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: true
      */
    rendererController.get(`/change-theme/:themeName`, function (req, res) {
        const themeName = req.params.themeName;
        if (themeName && themeName !== '') {
            const cmsconfig = readCMSConfigSync(projectRootDir);
            ManagerState.clearLog();
            rendererChangeTheme(cmsconfig.themeName, themeName, (success) => {
                res.send(success);
            }, ManagerState.getLogger('renderer', true));
        } else {
            res.send(false);
        }
    });

    /**
      * @swagger
      * 
      * /renderer/rebuild-theme:
      *   get:
      *     description: Rebulds current theme by Next.js "build" command and restarts Renderer.
      *     tags: 
      *       - Renderer
      *     produces:
      *       - application/json
      *     responses:
      *       200:
      *         description: true
      */
    rendererController.get(`/rebuild-theme`, function (req, res) {
        ManagerState.clearLog();
        rendererBuildAndStart((success) => {
            res.send(success);
        }, ManagerState.getLogger('renderer', true));
    });


    /**
      * @swagger
      * 
      * /renderer/close:
      *   get:
      *     description: Closes Renderer service
      *     tags: 
      *       - Renderer
      *     produces:
      *       - application/json
      *     responses:
      *       200:
      *         description: true
      */
    rendererController.get(`/close`, function (req, res) {
        ManagerState.clearLog();
        closeRenderer((success) => {
            res.send(success);
        }, ManagerState.getLogger('renderer', true));
    });

    return rendererController;
}